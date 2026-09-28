import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { signToken, Role } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Buscar usuario en Supabase
    const { data: rawUser, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("username", username.trim())
      .single();

    if (error || !rawUser) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const user = rawUser as Record<string, unknown>;

    if (user.status === "Inactivo" || user.status === "Suspendido") {
      return NextResponse.json(
        { error: "La cuenta de usuario se encuentra suspendida o inactiva" },
        { status: 403 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash as string);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const token = await signToken({
      id: user.id as string,
      username: user.username as string,
      full_name: user.full_name as string,
      role: user.role as Role,
      complex_id: (user.complex_id as string) || null,
      unit_number: (user.unit_number as string) || null,
    });

    let redirectUrl = "/login";
    switch (user.role) {
      case "super_admin":
        redirectUrl = "/super-admin";
        break;
      case "administrador":
        redirectUrl = "/admin";
        break;
      case "vigilante":
        redirectUrl = "/vigilante";
        break;
      case "residente":
        redirectUrl = "/residente";
        break;
    }

    const response = NextResponse.json({
      success: true,
      redirectUrl,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
      },
    });

    response.cookies.set("park_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: user.role === "super_admin" || user.role === "administrador" ? 7200 : 28800,
    });

    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
