import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Development mode without Supabase - return empty services
    return NextResponse.json({
      data: [],
      hasServices: false,
      isDevelopment: true,
    })
  }

  const supabase = await createClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user?.id) {
    return NextResponse.json(
      { 
        data: [],
        hasServices: false,
        error: 'No autenticado' 
      },
      { status: 200 }
    )
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

    // Get services
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })

    if (servicesError) {
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
