import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const middleware = (request: NextRequest)=> {
  // 1. Intentamos obtener la cookie que el backend ya guardó

  const token = request.cookies.get('access_token')?.value

  const { pathname } = request.nextUrl

  // 2. Rutas protegidas
  if (pathname.startsWith('/chat') && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 3. Evitar login si ya está autenticado
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/chat/:path*', '/login', '/register'],
}