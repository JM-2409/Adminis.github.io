import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.complex_id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { data: requests, error } = await supabaseAdmin
      .from("moving_requests")
      .select("*")
      .eq("complex_id", session.complex_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ requests });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al obtener trasteos";
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
    const {
      request_type,
      resident_name,
      document,
      moving_company,
      vehicle_plate,
      scheduled_date,
      scheduled_time,
      notes,
    } = body;

    const { data, error } = await supabaseAdmin
      .from("moving_requests")
      .insert({
        complex_id: session.complex_id,
        apartment_unit: session.unit_number || "Torre 1 - Apto 201",
        request_type,
        resident_name,
        document,
        moving_company,
        vehicle_plate,
        scheduled_date,
        scheduled_time,
        notes,
        status: "Pendiente",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, request: data });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al solicitar trasteo";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
