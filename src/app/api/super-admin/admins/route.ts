import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const { data: admins, error } = await supabaseAdmin
      .from("users")
      .select("id, username, full_name, email, phone, status, complex_id, complexes(name)")
      .eq("role", "administrador")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ admins });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al obtener administradores";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, full_name, email, phone, complex_id } = body;

    if (!username || !password || !full_name || !complex_id) {
      return NextResponse.json(
        { error: "Usuario, contraseña, nombre y conjunto son obligatorios" },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({
        username,
        password_hash,
        full_name,
        email,
        phone,
        complex_id,
        role: "administrador",
        status: "Activo",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, admin: data });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al crear administrador";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
