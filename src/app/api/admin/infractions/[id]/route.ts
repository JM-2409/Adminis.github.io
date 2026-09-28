import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || !session.complex_id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { status, sanction_amount, admin_notes } = await request.json();

    const { data, error } = await supabaseAdmin
      .from("infractions")
      .update({
        status,
        sanction_amount,
        admin_notes,
      })
      .eq("id", id)
      .eq("complex_id", session.complex_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, infraction: data });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al actualizar infracción";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
