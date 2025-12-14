import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  try {
    // First, update the session
    const response = await updateSession(request)
    
    // Check if user is authenticated for protected routes
    // We already updated the session, so we can check cookies directly or create a lightweight client
    // For simplicity and robustness, we'll let updateSession handle the heavy lifting.
    // Ideally, we shouldn't create a second client here just to check user. 
    // We can infer auth state from the session update logic, OR we trust the page-level checks for deep verification.
    // However, to keep existing logic:

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
             // Middleware cant set cookies on request, only response
             // but Supabase client needs this method signature
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    
    // Define public routes that don't require authentication
    const publicRoutes = ['/login', '/signup', '/forgot-password', '/auth', '/test-db']
    const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))
    
    // Redirect to login if accessing protected route without auth
    if (!user && !isPublicRoute && request.nextUrl.pathname !== '/') {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    // Redirect to home if accessing auth pages while logged in
    if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return response
  } catch (e) {
    console.error('Middleware Error:', e)
    // On error, passthrough instead of crashing, letting the page handle the error
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to fit your needs.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
