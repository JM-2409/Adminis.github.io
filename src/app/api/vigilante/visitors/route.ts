import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.complex_id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { data: visitors, error } = await supabaseAdmin
      .from("visitors")
      .select("*")
      .eq("complex_id", session.complex_id)
      .order("entry_time", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ visitors });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al obtener visitantes";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.complex_id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { type, name, document, apartment_unit, license_plate, parking_spot } = body;

    const { data, error } = await supabaseAdmin
      .from("visitors")
      .insert({
        complex_id: session.complex_id,
        type,
        name,
        document,
        apartment_unit,
        license_plate,
        parking_spot,
        registered_by: session.full_name,
        status: "En sitio",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, visitor: data });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al registrar visitante";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
