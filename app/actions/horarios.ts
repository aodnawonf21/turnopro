'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getSession } from './auth'

export interface BusinessHour {
  id?: string
  business_id: string
  day_of_week: number // 0 = Sunday, 1 = Monday, etc.
  is_active: boolean
  opening_time: string // HH:MM format
  closing_time: string // HH:MM format
}

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export async function getBusinessHours() {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return { error: 'No autenticado' }
    }

    const supabase = await createClient()

    // Get business for this user
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', session.user.id)
      .single()

    if (businessError || !business) {
      return { error: 'Negocio no encontrado' }
    }

    // Get business hours
    const { data, error } = await supabase
      .from('business_hours')
      .select('*')
      .eq('business_id', business.id)
      .order('day_of_week')

    if (error) {
      return { error: error.message }
    }

    return { data: data || [] }
  } catch (error) {
    return { error: String(error) }
  }
}

export async function saveBusinessHours(hours: BusinessHour[]) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return { error: 'No autenticado' }
    }

    // Validate hours
    for (const hour of hours) {
      if (hour.is_active) {
        if (!hour.opening_time || !hour.closing_time) {
          return { error: 'Hora de apertura y cierre requeridas' }
        }

        // Validate opening time < closing time
        if (hour.opening_time >= hour.closing_time) {
          const dayName = DAYS[hour.day_of_week]
          return { error: `${dayName}: La apertura debe ser menor al cierre` }
        }
      }
    }

    const supabase = await createClient()

    // Get business for this user
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', session.user.id)
      .single()

    if (businessError || !business) {
      return { error: 'Negocio no encontrado' }
    }

    // Delete existing hours for this business
    const { error: deleteError } = await supabase
      .from('business_hours')
      .delete()
      .eq('business_id', business.id)

    if (deleteError) {
      return { error: 'Error al actualizar horarios: ' + deleteError.message }
    }

    // Insert new hours
    const hoursToInsert = hours.map(h => ({
      business_id: business.id,
      day_of_week: h.day_of_week,
      is_active: h.is_active,
      opening_time: h.opening_time,
      closing_time: h.closing_time,
    }))

    const { error: insertError } = await supabase
      .from('business_hours')
      .insert(hoursToInsert)

    if (insertError) {
      return { error: 'Error al guardar horarios: ' + insertError.message }
    }

    revalidatePath('/dashboard/horarios')
    return { success: true }
  } catch (error) {
    return { error: String(error) }
  }
}

export async function updateBusinessHour(dayOfWeek: number, data: Partial<BusinessHour>) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return { error: 'No autenticado' }
    }

    const supabase = await createClient()

    // Get business for this user
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', session.user.id)
      .single()

    if (businessError || !business) {
      return { error: 'Negocio no encontrado' }
    }

    // Validate if active and times provided
    if (data.is_active && data.opening_time && data.closing_time) {
      if (data.opening_time >= data.closing_time) {
        return { error: 'La apertura debe ser menor al cierre' }
      }
    }

    // Update or insert
    const { data: existing } = await supabase
      .from('business_hours')
      .select('id')
      .eq('business_id', business.id)
      .eq('day_of_week', dayOfWeek)
      .single()

    if (existing) {
      // Update
      const { error } = await supabase
        .from('business_hours')
        .update({
          is_active: data.is_active,
          opening_time: data.opening_time,
          closing_time: data.closing_time,
        })
        .eq('id', existing.id)

      if (error) {
        return { error: error.message }
      }
    } else {
      // Insert
      const { error } = await supabase
        .from('business_hours')
        .insert({
          business_id: business.id,
          day_of_week: dayOfWeek,
          is_active: data.is_active ?? false,
          opening_time: data.opening_time || '09:00',
          closing_time: data.closing_time || '18:00',
        })

      if (error) {
        return { error: error.message }
      }
    }

    revalidatePath('/dashboard/horarios')
    return { success: true }
  } catch (error) {
    return { error: String(error) }
  }
}
