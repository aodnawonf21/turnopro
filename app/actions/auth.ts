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
