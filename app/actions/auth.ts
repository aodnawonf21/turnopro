'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signUp(formData: {
  businessName: string
  email: string
  password: string
  businessType: string
}) {
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

  // Generate slug from business name
  const slug = formData.businessName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: data.user.id,
      email: formData.email,
    })

  if (profileError) {
    return { error: 'Error al crear el perfil: ' + profileError.message }
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
  const supabase = await createClient()

  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getSession() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session
}
