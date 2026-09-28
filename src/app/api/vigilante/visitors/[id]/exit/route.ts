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

    const { data, error } = await supabaseAdmin
      .from("visitors")
      .update({
        status: "Finalizado",
        exit_time: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("complex_id", session.complex_id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, visitor: data });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al registrar salida";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
