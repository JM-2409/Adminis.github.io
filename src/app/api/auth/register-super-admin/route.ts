import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { full_name, username, password, email, phone } = await request.json();

    if (!full_name || !username || !password) {
      return NextResponse.json(
        { error: "Nombre completo, usuario y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("username", username.trim())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "El nombre de usuario ya está registrado" },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabaseAdmin
      .from("users")
      .insert({
        username: username.trim(),
        password_hash,
        full_name: full_name.trim(),
        email: email || `${username}@parkcontrol.com`,
        phone: phone || "+57 300 0000000",
        role: "super_admin",
        status: "Activo",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "¡Súper Administrador registrado con éxito! Ahora puede iniciar sesión.",
      user: newUser,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al registrar súper administrador";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
