import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const passwordHashAdmin = await bcrypt.hash("admin123", 10);
    const passwordHashVigi = await bcrypt.hash("vigi123", 10);
    const passwordHashResi = await bcrypt.hash("resi123", 10);

    // 1. Limpiar/Crear Conjunto Demo
    const { data: existingComplex } = await supabaseAdmin
      .from("complexes")
      .select("id")
      .eq("nip", "901234567-1")
      .single();

    let complexId = existingComplex?.id;

    if (!complexId) {
      const { data: newComplex, error: complexError } = await supabaseAdmin
        .from("complexes")
        .insert({
          name: "Conjunto Residencial El Mirador",
          nip: "901234567-1",
          address: "Calle 100 # 15-20, Bogotá",
          email: "contacto@elmirador.com",
          phone: "+57 300 1234567",
          subscription_status: "Al día",
        })
        .select()
        .single();

      if (complexError) throw complexError;
      complexId = newComplex.id;
    }

    // 2. Crear Usuarios Demo
    const usersToInsert: Array<{
      complex_id: string | null;
      username: string;
      password_hash: string;
      full_name: string;
      role: string;
      email: string;
      phone: string;
      unit_number: string | null;
      status: string;
    }> = [
      {
        complex_id: null,
        username: "admin_master",
        password_hash: passwordHashAdmin,
        full_name: "Súper Administrador Global",
        role: "super_admin",
        email: "super@parkcontrol.com",
        phone: "+57 300 0000000",
        unit_number: null,
        status: "Activo",
      },
      {
        complex_id: complexId,
        username: "admin_mirador",
        password_hash: passwordHashAdmin,
        full_name: "Carlos Gómez (Administrador)",
        role: "administrador",
        email: "admin@elmirador.com",
        phone: "+57 311 2223344",
        unit_number: null,
        status: "Activo",
      },
      {
        complex_id: complexId,
        username: "vigilante_porteria",
        password_hash: passwordHashVigi,
        full_name: "Pedro Morales (Vigilante)",
        role: "vigilante",
        email: "porteria@elmirador.com",
        phone: "+57 315 8889900",
        unit_number: null,
        status: "Activo",
      },
      {
        complex_id: complexId,
        username: "residente_201",
        password_hash: passwordHashResi,
        full_name: "Ana María Rodríguez",
        role: "residente",
        email: "ana.rodriguez@email.com",
        phone: "+57 320 5556677",
        unit_number: "Torre 1 - Apto 201",
        status: "Activo",
      },
    ];

    for (const user of usersToInsert) {
      const { data: existingUser } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("username", user.username)
        .single();

      if (!existingUser) {
        await supabaseAdmin.from("users").insert(user);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Base de datos inicializada correctamente con usuarios de prueba",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al sembrar datos";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
