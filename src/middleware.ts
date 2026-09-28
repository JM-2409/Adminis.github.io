import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-jwt-key-parkcontrol-2025"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir activos estáticos, API de login y setup
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/seed") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("park_auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const user = verified.payload as {
      role: string;
      complex_id?: string;
    };

    // Control de rutas por Rol
    if (pathname.startsWith("/super-admin")) {
      if (user.role !== "super_admin") {
        return NextResponse.redirect(new URL(getHomeForRole(user.role), request.url));
      }
    } else if (pathname.startsWith("/admin")) {
      if (user.role !== "administrador" && user.role !== "super_admin") {
        return NextResponse.redirect(new URL(getHomeForRole(user.role), request.url));
      }
    } else if (pathname.startsWith("/vigilante")) {
      if (user.role !== "vigilante" && user.role !== "administrador" && user.role !== "super_admin") {
        return NextResponse.redirect(new URL(getHomeForRole(user.role), request.url));
      }
    } else if (pathname.startsWith("/residente")) {
      if (user.role !== "residente" && user.role !== "administrador" && user.role !== "super_admin") {
        return NextResponse.redirect(new URL(getHomeForRole(user.role), request.url));
      }
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("park_auth_token");
    return response;
  }
}

function getHomeForRole(role: string): string {
  switch (role) {
    case "super_admin":
      return "/super-admin";
    case "administrador":
      return "/admin";
    case "vigilante":
      return "/vigilante";
    case "residente":
      return "/residente";
    default:
      return "/login";
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
