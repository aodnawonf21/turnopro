'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getSession } from './auth'

export interface Service {
  id: string
  business_id: string
  name: string
  description: string
  duration: number
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Get all services for a business
export async function getServices() {
  const session = await getSession()
  if (!session?.id) {
    return { error: 'No autenticado' }
  }

  const supabase = await createClient()

  // Get user's business
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', session.id)
    .single()

  if (businessError || !business) {
    return { error: 'No se encontró el negocio' }
  }

  // Get services
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })

  if (servicesError) {
    return { error: 'Error al obtener servicios: ' + servicesError.message }
  }

  return { data: services as Service[] }
}

// Create service
export async function createService(formData: {
  name: string
  description: string
  duration: number
  price: number
}) {
  // Validation first (before session check)
  if (!formData.name || !formData.description || !formData.duration || formData.price === undefined) {
    return { error: 'Todos los campos son requeridos' }
  }

  if (formData.price < 0) {
    return { error: 'El precio no puede ser negativo' }
  }

  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Development mode - return success without actual database operation
    return { 
      data: {
        id: 'mock-' + Date.now(),
        business_id: 'mock-business',
        name: formData.name,
        description: formData.description,
        duration: formData.duration,
        price: formData.price,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Service,
      message: 'Servicio creado exitosamente (modo desarrollo)',
      isDevelopment: true
    }
  }

  const session = await getSession()
  if (!session?.id) {
    return { error: 'No autenticado' }
  }

  const supabase = await createClient()

  // Get user's business
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', session.id)
    .single()

  if (businessError || !business) {
    return { error: 'No se encontró el negocio' }
  }

  // Create service
  const { data, error } = await supabase
    .from('services')
    .insert({
      business_id: business.id,
      name: formData.name,
      description: formData.description,
      duration: formData.duration,
      price: formData.price,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    return { error: 'Error al crear servicio: ' + error.message }
  }

  revalidatePath('/dashboard/services')
  return { data: data as Service, message: 'Servicio creado exitosamente' }
}

// Update service
export async function updateService(id: string, formData: {
  name: string
  description: string
  duration: number
  price: number
  is_active: boolean
}) {
  const session = await getSession()
  if (!session?.id) {
    return { error: 'No autenticado' }
  }

  // Validation
  if (!formData.name || !formData.description || !formData.duration || formData.price === undefined) {
    return { error: 'Todos los campos son requeridos' }
  }

  if (formData.price < 0) {
    return { error: 'El precio no puede ser negativo' }
  }

  const supabase = await createClient()

  // Verify ownership
  const { data: service, error: getError } = await supabase
    .from('services')
    .select('business_id')
    .eq('id', id)
    .single()

  if (getError || !service) {
    return { error: 'Servicio no encontrado' }
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', session.id)
    .single()

  if (!business || service.business_id !== business.id) {
    return { error: 'No autorizado' }
  }

  // Update service
  const { data, error } = await supabase
    .from('services')
    .update({
      name: formData.name,
      description: formData.description,
      duration: formData.duration,
      price: formData.price,
      is_active: formData.is_active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { error: 'Error al actualizar servicio: ' + error.message }
  }

  revalidatePath('/dashboard/services')
  return { data: data as Service, message: 'Servicio actualizado exitosamente' }
}

// Toggle service status
export async function toggleService(id: string, isActive: boolean) {
  const session = await getSession()
  if (!session?.id) {
    return { error: 'No autenticado' }
  }

  const supabase = await createClient()

  // Verify ownership
  const { data: service, error: getError } = await supabase
    .from('services')
    .select('business_id')
    .eq('id', id)
    .single()

  if (getError || !service) {
    return { error: 'Servicio no encontrado' }
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', session.id)
    .single()

  if (!business || service.business_id !== business.id) {
    return { error: 'No autorizado' }
  }

  // Update status
  const { data, error } = await supabase
    .from('services')
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { error: 'Error al actualizar estado: ' + error.message }
  }

  revalidatePath('/dashboard/services')
  return { data: data as Service, message: isActive ? 'Servicio activado' : 'Servicio desactivado' }
}

// Delete service
export async function deleteService(id: string) {
  const session = await getSession()
  if (!session?.id) {
    return { error: 'No autenticado' }
  }

  const supabase = await createClient()

  // Verify ownership
  const { data: service, error: getError } = await supabase
    .from('services')
    .select('business_id')
    .eq('id', id)
    .single()

  if (getError || !service) {
    return { error: 'Servicio no encontrado' }
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', session.id)
    .single()

  if (!business || service.business_id !== business.id) {
    return { error: 'No autorizado' }
  }

  // Delete service
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: 'Error al eliminar servicio: ' + error.message }
  }

  revalidatePath('/dashboard/services')
  return { message: 'Servicio eliminado exitosamente' }
}
