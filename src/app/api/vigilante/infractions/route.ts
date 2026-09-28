import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.complex_id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { apartment_unit, resident_name, infraction_type, description } = body;

    const { data, error } = await supabaseAdmin
      .from("infractions")
      .insert({
        complex_id: session.complex_id,
        apartment_unit,
        resident_name,
        reported_by: `${session.full_name} (Vigilante)`,
        infraction_type,
        description,
        status: "Pendiente",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, infraction: data });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al reportar infracción";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
