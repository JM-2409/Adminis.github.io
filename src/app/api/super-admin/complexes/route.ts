import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: complexes, error } = await supabaseAdmin
      .from("complexes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ complexes });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al obtener conjuntos";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, nip, address, email, phone, subscription_status } = body;

    if (!name || !nip || !address || !email || !phone) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("complexes")
      .insert({
        name,
        nip,
        address,
        email,
        phone,
        subscription_status: subscription_status || "Al día",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, complex: data });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error al crear conjunto";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
