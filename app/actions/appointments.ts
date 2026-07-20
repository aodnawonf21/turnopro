'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getSession } from './auth'

export interface Appointment {
  id: string
  business_id: string
  service_id: string
  client_name: string
  client_phone?: string
  client_email?: string
  scheduled_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
}

// Helper: Get business ID for authenticated user
async function getBusinessId() {
  const session = await getSession()
  if (!session?.user?.id) {
    return { error: 'No autenticado' }
  }

  const supabase = await createClient()
  const { data: business, error } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', session.user.id)
    .single()

  if (error || !business) {
    return { error: 'Negocio no encontrado' }
  }

  return { businessId: business.id }
}

// Get all appointments for a date
export async function getAppointmentsByDate(date: string) {
  const businessResult = await getBusinessId()
  if ('error' in businessResult) {
    return businessResult
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      service:service_id(name, duration, price)
    `)
    .eq('business_id', businessResult.businessId)
    .eq('scheduled_date', date)
    .order('start_time', { ascending: true })

  if (error) {
    return { error: error.message }
  }

  return { data: data || [] }
}

// Get appointments for a date range (month view)
export async function getAppointmentsByDateRange(startDate: string, endDate: string) {
  const businessResult = await getBusinessId()
  if ('error' in businessResult) {
    return businessResult
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      service:service_id(name, duration, price)
    `)
    .eq('business_id', businessResult.businessId)
    .gte('scheduled_date', startDate)
    .lte('scheduled_date', endDate)
    .order('scheduled_date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    return { error: error.message }
  }

  return { data: data || [] }
}

// Check if time slot is available
async function isTimeSlotAvailable(
  businessId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeId?: string
) {
  const supabase = await createClient()

  let query = supabase
    .from('appointments')
    .select('id')
    .eq('business_id', businessId)
    .eq('scheduled_date', date)
    .eq('status', 'pending')
    .or(`and(start_time.gte.${startTime},start_time.lt.${endTime}),and(end_time.gt.${startTime},end_time.lte.${endTime})`)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data } = await query

  return !data || data.length === 0
}

// Check if time is within business hours
async function isWithinBusinessHours(businessId: string, date: string, startTime: string, endTime: string) {
  const supabase = await createClient()

  const dayOfWeek = new Date(date + 'T00:00:00').getDay()

  const { data, error } = await supabase
    .from('business_hours')
    .select('opening_time, closing_time')
    .eq('business_id', businessId)
    .eq('day_of_week', dayOfWeek)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return false
  }

  return startTime >= data.opening_time && endTime <= data.closing_time
}

// Create appointment
export async function createAppointment(input: {
  service_id: string
  client_name: string
  client_phone?: string
  client_email?: string
  scheduled_date: string
  start_time: string
  notes?: string
}) {
  const businessResult = await getBusinessId()
  if ('error' in businessResult) {
    return businessResult
  }

  const supabase = await createClient()
  const businessId = businessResult.businessId

  // Validate date is not in the past
  const appointmentDateTime = new Date(input.scheduled_date + 'T' + input.start_time)
  if (appointmentDateTime < new Date()) {
    return { error: 'No se pueden crear reservas en el pasado' }
  }

  // Get service details
  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('duration, is_active')
    .eq('id', input.service_id)
    .eq('business_id', businessId)
    .single()

  if (serviceError || !service) {
    return { error: 'Servicio no encontrado' }
  }

  if (!service.is_active) {
    return { error: 'El servicio no está activo' }
  }

  // Calculate end time
  const [hours, minutes] = input.start_time.split(':').map(Number)
  const startDate = new Date()
  startDate.setHours(hours, minutes, 0, 0)
  const endDate = new Date(startDate.getTime() + service.duration * 60000)
  const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`

  // Check if within business hours
  const withinHours = await isWithinBusinessHours(businessId, input.scheduled_date, input.start_time, endTime)
  if (!withinHours) {
    return { error: 'El horario está fuera de las horas de atención' }
  }

  // Check if time slot is available
  const available = await isTimeSlotAvailable(businessId, input.scheduled_date, input.start_time, endTime)
  if (!available) {
    return { error: 'Este horario ya está ocupado' }
  }

  // Create appointment
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      business_id: businessId,
      service_id: input.service_id,
      client_name: input.client_name,
      client_phone: input.client_phone,
      client_email: input.client_email,
      scheduled_date: input.scheduled_date,
      start_time: input.start_time,
      end_time: endTime,
      status: 'pending',
      notes: input.notes,
    })
    .select()
    .single()

  if (error) {
    return { error: 'Error al crear el turno: ' + error.message }
  }

  revalidatePath('/dashboard/appointments')
  return { data }
}

// Update appointment
export async function updateAppointment(id: string, input: {
  client_name?: string
  client_phone?: string
  client_email?: string
  scheduled_date?: string
  start_time?: string
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
}) {
  const businessResult = await getBusinessId()
  if ('error' in businessResult) {
    return businessResult
  }

  const supabase = await createClient()
  const businessId = businessResult.businessId

  // Get current appointment
  const { data: appointment, error: getError } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .eq('business_id', businessId)
    .single()

  if (getError || !appointment) {
    return { error: 'Turno no encontrado' }
  }

  // If rescheduling, validate
  if (input.scheduled_date || input.start_time) {
    const newDate = input.scheduled_date || appointment.scheduled_date
    const newStartTime = input.start_time || appointment.start_time

    // Validate date is not in the past
    const appointmentDateTime = new Date(newDate + 'T' + newStartTime)
    if (appointmentDateTime < new Date()) {
      return { error: 'No se pueden agendar reservas en el pasado' }
    }

    // Get service for duration
    const { data: service } = await supabase
      .from('services')
      .select('duration')
      .eq('id', appointment.service_id)
      .single()

    if (service) {
      const [hours, minutes] = newStartTime.split(':').map(Number)
      const startDate = new Date()
      startDate.setHours(hours, minutes, 0, 0)
      const endDate = new Date(startDate.getTime() + service.duration * 60000)
      const newEndTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`

      // Check within business hours
      const withinHours = await isWithinBusinessHours(businessId, newDate, newStartTime, newEndTime)
      if (!withinHours) {
        return { error: 'El horario está fuera de las horas de atención' }
      }

      // Check availability
      const available = await isTimeSlotAvailable(businessId, newDate, newStartTime, newEndTime, id)
      if (!available) {
        return { error: 'Este horario ya está ocupado' }
      }

      input.start_time = newStartTime
      // Will update end_time below
    }
  }

  // Update appointment
  const { data, error } = await supabase
    .from('appointments')
    .update({
      client_name: input.client_name,
      client_phone: input.client_phone,
      client_email: input.client_email,
      scheduled_date: input.scheduled_date,
      start_time: input.start_time,
      status: input.status,
      notes: input.notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('business_id', businessId)
    .select()
    .single()

  if (error) {
    return { error: 'Error al actualizar el turno: ' + error.message }
  }

  revalidatePath('/dashboard/appointments')
  return { data }
}

// Cancel appointment
export async function cancelAppointment(id: string) {
  const businessResult = await getBusinessId()
  if ('error' in businessResult) {
    return businessResult
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('appointments')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('business_id', businessResult.businessId)
    .select()
    .single()

  if (error) {
    return { error: 'Error al cancelar el turno' }
  }

  revalidatePath('/dashboard/appointments')
  return { data }
}

// Mark appointment as completed
export async function completeAppointment(id: string) {
  const businessResult = await getBusinessId()
  if ('error' in businessResult) {
    return businessResult
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('appointments')
    .update({
      status: 'completed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('business_id', businessResult.businessId)
    .select()
    .single()

  if (error) {
    return { error: 'Error al completar el turno' }
  }

  revalidatePath('/dashboard/appointments')
  return { data }
}
