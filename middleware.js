import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const ADMIN_EMAIL = 'alamlaptopsellers@gmail.com'

export async function middleware(request) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => cookies.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        ),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Not logged in — block /admin and /dashboard
  if (!user && (pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin email — always allow /admin, redirect away from /dashboard
  if (user?.email === ADMIN_EMAIL) {
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return response
  }

  // Logged in but not admin — block /admin
  if (user && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}