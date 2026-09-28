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

    const { delivered_to } = await request.json();

    const { data, error } = await supabaseAdmin
      .from("parcels")
      .update({
        status: "Entregado",
        delivered_by: session.full_name,
        delivered_to,
        delivered_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("complex_id", session.complex_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, parcel: data });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al entregar paquete";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
