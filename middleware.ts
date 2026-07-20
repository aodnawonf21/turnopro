import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  console.log("[v0] Middleware: processing request to", request.nextUrl.pathname);
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Only process Supabase auth if env vars are configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log("[v0] Middleware: creating Supabase client");
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            console.log("[v0] Middleware: setting cookies");
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    console.log("[v0] Middleware: calling getSession");
    await supabase.auth.getSession()
    console.log("[v0] Middleware: getSession completed");
  }

  console.log("[v0] Middleware: returning response");
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
