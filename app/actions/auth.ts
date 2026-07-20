'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function waitForProfile(userId: string, maxRetries: number = 5): Promise<boolean> {
  const supabase = await createClient()
  
  for (let i = 0; i < maxRetries; i++) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()
    
    if (data && data.id === userId) {
      return true
    }
    
    if (i < maxRetries - 1) {
      // Wait 200ms before retrying
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }
  
  return false
}

export async function signUp(formData: {
  businessName: string
  email: string
  password: string
  businessType: string
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: 'Supabase no está configurado' }
  }

  const supabase = await createClient()

  const { data, error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  })

  if (signUpError) {
    return { error: signUpError.message }
  }

  if (!data.user) {
    return { error: 'No se pudo crear el usuario' }
  }

  // Check if email verification is required
  if (data.user.user_metadata?.email_verified === false && !data.session) {
    // Save business data to user metadata for onboarding after email verification
    const businessData = {
      businessName: formData.businessName,
      businessType: formData.businessType,
    }

    await supabase.auth.updateUser({
      data: { businessData },
    })

    // Email verification required - stop here and show success message
    return {
      success: true,
      message: 'Tus datos fueron registrados correctamente. Te enviamos un correo de verificación a tu email.\n\n📧 Revisá tu bandeja de entrada (y la carpeta de spam si no lo encontrás).\n\nUna vez que confirmes tu correo, podrás iniciar sesión.'
    }
  }

  // Generate slug from business name
  const slug = formData.businessName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  // Profile is created automatically by Supabase trigger on auth.users insert
  // Wait for the profile to be created (with retries)
  const profileExists = await waitForProfile(data.user.id)
  
  if (!profileExists) {
    return { error: 'No se pudo completar el registro. Por favor intenta nuevamente.' }
  }

  // Create business
  const { error: businessError } = await supabase
    .from('businesses')
    .insert({
      name: formData.businessName,
      slug: slug,
      business_type: formData.businessType,
      owner_id: data.user.id,
    })

  if (businessError) {
    return { error: 'Error al crear el negocio: ' + businessError.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signIn(email: string, password: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: 'Supabase no está configurado' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect('/login')
  }

  const supabase = await createClient()

  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getSession() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }

  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session
}

export async function ensureBusiness() {
  'use server'
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: 'Supabase no está configurado' }
  }

  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user?.id) {
    return { error: 'No hay sesión activa' }
  }

  const userId = session.user.id

  try {
    // Check if business exists for this user
    const { data: existingBusiness, error: checkError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', userId)
      .maybeSingle()

    if (checkError && checkError.code !== 'PGRST116') {
      return { error: 'Error al verificar el negocio' }
    }

    // Business already exists
    if (existingBusiness) {
      return { success: true, businessId: existingBusiness.id }
    }

    // Business doesn't exist - create one
    const { data: newBusiness, error: createError } = await supabase
      .from('businesses')
      .insert({
        name: 'Mi Negocio',
        slug: `negocio-${userId.slice(0, 8)}`,
        business_type: 'servicios',
        owner_id: userId,
      })
      .select()
      .single()

    if (createError) {
      return { error: 'Error al crear el negocio: ' + createError.message }
    }

    return { success: true, businessId: newBusiness.id }
  } catch (error) {
    return { error: 'Error inesperado' }
  }
}

export async function completeOnboarding() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: 'Supabase no está configurado' }
  }

  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: 'No hay sesión activa' }
  }

  const userId = session.user.id

  try {
    // 1. Check if profile exists
    const { data: profileData, error: profileCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      return { error: 'Error al verificar el perfil' }
    }

    // Create profile if it doesn't exist
    if (!profileData) {
      const { error: profileCreateError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: session.user.email,
        })

      if (profileCreateError) {
        return { error: 'Error al crear el perfil' }
      }
    }

    // 2. Check if business exists
    const { data: businessData, error: businessCheckError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', userId)
      .maybeSingle()

    if (businessCheckError && businessCheckError.code !== 'PGRST116') {
      return { error: 'Error al verificar el negocio' }
    }

    // Create business if it doesn't exist
    if (!businessData) {
      const businessMetadata = session.user.user_metadata?.businessData as {
        businessName?: string
        businessType?: string
      } | undefined

      // Only create business if we have the required data
      if (businessMetadata?.businessName && businessMetadata?.businessType) {
        const slug = businessMetadata.businessName
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')

        const { error: businessCreateError } = await supabase
          .from('businesses')
          .insert({
            name: businessMetadata.businessName,
            slug: slug,
            business_type: businessMetadata.businessType,
            owner_id: userId,
          })

        if (businessCreateError) {
          return { error: 'Error al crear el negocio' }
        }
      }
    }

    return { success: true }
  } catch (error) {
    return { error: 'Error inesperado en el onboarding' }
  }
}
