'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function signUp(formData: {
  businessName: string
  email: string
  password: string
  businessType: string
}) {
  // Validate input
  if (!formData.email || !formData.password || !formData.businessName) {
    return { error: 'Faltan campos requeridos' }
  }

  // Generate ID for user
  const userId = 'user_' + Math.random().toString(36).substr(2, 9)

  // Generate slug from business name
  const slug = formData.businessName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  // Create user object
  const user = {
    id: userId,
    email: formData.email,
    businessName: formData.businessName,
    businessType: formData.businessType,
    slug: slug,
    createdAt: new Date().toISOString(),
  }

  // Store in cookie
  const cookieStore = await cookies()
  cookieStore.set('user', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signIn(email: string, password: string) {
  // For demo purposes, we'll accept any email/password combination
  // In production, you would validate against your database
  
  if (!email || !password) {
    return { error: 'Email y contraseña requeridos' }
  }

  // Create user object
  const user = {
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    email: email,
    businessName: 'Negocio Demo',
    businessType: 'restaurant',
    slug: 'negocio-demo',
    createdAt: new Date().toISOString(),
  }

  // Store in cookie
  const cookieStore = await cookies()
  cookieStore.set('user', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('user')

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getSession() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('user')

  if (!userCookie) {
    return null
  }

  try {
    return JSON.parse(userCookie.value)
  } catch {
    return null
  }
}
