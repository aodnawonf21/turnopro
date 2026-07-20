import { createClient } from '@/lib/supabase/server'
import { getDevServices } from '@/lib/dev-services'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if Supabase is configured AND user is authenticated
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !session?.user?.id) {
    // Development mode or no session - return dev services
    const devServices = getDevServices()
    return NextResponse.json({
      data: devServices,
      hasServices: devServices.length > 0,
      isDevelopment: true,
    })
  }

  try {
    // Get user's business
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', session.user.id)
      .single()

    if (businessError || !business) {
      return NextResponse.json(
        { data: [], hasServices: false },
        { status: 200 }
      )
    }

    // Get services from Supabase
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })

    if (servicesError) {
      console.error('[v0] Error fetching services:', servicesError)
      return NextResponse.json(
        { 
          data: [],
          hasServices: false,
          error: 'Error al obtener servicios: ' + servicesError.message 
        },
        { status: 200 }
      )
    }

    return NextResponse.json({
      data: services || [],
      hasServices: (services?.length ?? 0) > 0,
    })
  } catch (error) {
    console.error('[v0] Error in services API:', error)
    return NextResponse.json(
      { 
        data: [],
        hasServices: false,
        error: 'Error interno del servidor' 
      },
      { status: 200 }
    )
  }
}
