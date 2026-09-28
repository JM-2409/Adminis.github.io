import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.complex_id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { data: infractions, error } = await supabaseAdmin
      .from("infractions")
      .select("*")
      .eq("complex_id", session.complex_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ infractions });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al obtener infracciones";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
