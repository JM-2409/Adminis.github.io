import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.complex_id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { data: reservations, error } = await supabaseAdmin
      .from("reservations")
      .select("*")
      .eq("complex_id", session.complex_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ reservations });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al obtener reservas";
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
    const { facility_name, event_date, time_slot } = body;

    const { data, error } = await supabaseAdmin
      .from("reservations")
      .insert({
        complex_id: session.complex_id,
        apartment_unit: session.unit_number || "Torre 1 - Apto 201",
        resident_name: session.full_name,
        facility_name,
        event_date,
        time_slot,
        status: "Pendiente",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, reservation: data });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al solicitar reserva";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
