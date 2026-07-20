'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getSession } from './auth'
import { addDevService, getDevServices, getDevService, updateDevService, deleteDevService } from '@/lib/dev-services'

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
  
  // Check if Supabase is configured AND user is authenticated
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !session?.id) {
    // Development mode or no session - return services from memory
    return { data: getDevServices() }
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

  // Check if Supabase is configured AND user is authenticated
  const session = await getSession()
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !session?.id) {
    // Development mode or no session - use in-memory storage
    console.error('[v0] Using dev storage: Supabase configured:', !!process.env.NEXT_PUBLIC_SUPABASE_URL, 'Session exists:', !!session?.id)
    
    const newService: Service = {
      id: 'service-' + Date.now(),
      business_id: 'dev-business-1',
      name: formData.name,
      description: formData.description,
      duration: formData.duration,
      price: formData.price,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    addDevService(newService)
    revalidatePath('/dashboard/services')
    
    return { 
      data: newService,
      message: 'Servicio creado exitosamente',
      isDevelopment: true,
      debugInfo: !session?.id ? 'Sin sesión de Supabase' : undefined
    }
  }

  // Supabase is configured and user is authenticated - use real database
  const supabase = await createClient()
  console.error('[v0] Creating service in Supabase for user:', session.id)

  // Get user's business
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', session.id)
    .single()

  if (businessError) {
    console.error('[v0] Business query error:', businessError)
    return { error: `Error al obtener negocio: ${businessError.message}` }
  }

  if (!business) {
    console.error('[v0] No business found for owner:', session.id)
    return { error: 'No se encontró el negocio del usuario' }
  }

  console.error('[v0] Attempting insert with:', {
    business_id: business.id,
    name: formData.name,
    duration: formData.duration,
    price: formData.price
  })

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
    const fullErrorInfo = {
      message: error.message,
      code: error.code,
      hint: error.hint,
      details: error.details,
      status: error.status
    }
    console.error('[v0] Supabase insert failed:', fullErrorInfo)
    return { error: `Error en Supabase: ${error.message}` }
  }

  console.error('[v0] Service created successfully in Supabase:', data)
  revalidatePath('/dashboard/services')
  return { data: data as Service, message: 'Servicio creado exitosamente en Supabase' }
}

// Update service
export async function updateService(id: string, formData: {
  name: string
  description: string
  duration: number
  price: number
  is_active: boolean
}) {
  // Validation
  if (!formData.name || !formData.description || !formData.duration || formData.price === undefined) {
    return { error: 'Todos los campos son requeridos' }
  }

  if (formData.price < 0) {
    return { error: 'El precio no puede ser negativo' }
  }

  const session = await getSession()

  // Check if Supabase is configured AND user is authenticated
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !session?.id) {
    // Development mode or no session - update in memory
    const updated = updateDevService(id, formData)
    if (!updated) {
      return { error: 'Servicio no encontrado' }
    }
    revalidatePath('/dashboard/services')
    return { data: updated, message: 'Servicio actualizado exitosamente' }
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

  // Check if Supabase is configured AND user is authenticated
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !session?.id) {
    // Development mode or no session - update in memory
    const updated = updateDevService(id, { is_active: isActive })
    if (!updated) {
      return { error: 'Servicio no encontrado' }
    }
    revalidatePath('/dashboard/services')
    return { data: updated, message: isActive ? 'Servicio activado' : 'Servicio desactivado' }
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

  // Check if Supabase is configured AND user is authenticated
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !session?.id) {
    // Development mode or no session - delete from memory
    const deleted = deleteDevService(id)
    if (!deleted) {
      return { error: 'Servicio no encontrado' }
    }
    revalidatePath('/dashboard/services')
    return { message: 'Servicio eliminado exitosamente' }
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
