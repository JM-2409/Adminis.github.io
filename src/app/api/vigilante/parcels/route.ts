import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.complex_id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { data: parcels, error } = await supabaseAdmin
      .from("parcels")
      .select("*")
      .eq("complex_id", session.complex_id)
      .order("received_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ parcels });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al obtener paquetes";
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
    const { apartment_unit, recipient_name, courier_company, description } = body;

    const { data, error } = await supabaseAdmin
      .from("parcels")
      .insert({
        complex_id: session.complex_id,
        apartment_unit,
        recipient_name,
        courier_company,
        description,
        received_by: session.full_name,
        status: "Pendiente",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, parcel: data });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al registrar paquete";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
