import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-32-chars-minimum-length!!';
const secretKey = new TextEncoder().encode(JWT_SECRET);

const ROLE_ROUTES: Record<string, string> = {
  super_admin: '/super-admin',
  administracion: '/admin',
  vigilante: '/vigilante',
  residente: '/residente',
  presidente: '/presidente',
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/super-admin', '/admin', '/vigilante', '/residente', '/presidente'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!token) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);
    const userRole = payload.role as string;

    if (pathname === '/') {
      const redirectUrl = ROLE_ROUTES[userRole] || '/admin';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    if (pathname.startsWith('/super-admin') && userRole !== 'super_admin') {
      return NextResponse.redirect(new URL(ROLE_ROUTES[userRole] || '/', request.url));
    }

    if (pathname.startsWith('/admin') && userRole !== 'administracion') {
      return NextResponse.redirect(new URL(ROLE_ROUTES[userRole] || '/', request.url));
    }

    if (pathname.startsWith('/vigilante') && userRole !== 'vigilante') {
      return NextResponse.redirect(new URL(ROLE_ROUTES[userRole] || '/', request.url));
    }

    if (pathname.startsWith('/residente') && userRole !== 'residente') {
      return NextResponse.redirect(new URL(ROLE_ROUTES[userRole] || '/', request.url));
    }

    if (pathname.startsWith('/presidente') && userRole !== 'presidente') {
      return NextResponse.redirect(new URL(ROLE_ROUTES[userRole] || '/', request.url));
    }

    return NextResponse.next();
  } catch {
    if (isProtectedRoute) {
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
