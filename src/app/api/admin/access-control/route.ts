import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || !payload.conjunto_id) return null;
  return payload;
}

// GET all access logs for current conjunto
export async function GET() {
  const user = await getAdminUser();
  if (!user || !user.conjunto_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { data: logs, error } = await supabase
    .from('access_logs')
    .select('*')
    .eq('conjunto_id', user.conjunto_id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ logs });
}

// POST register access entry or pre-registration
export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user || !user.conjunto_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { tipo, cedula, nombre, placa, unidad_destino, motivo, es_pre_registro } = body;

    if (!nombre || !unidad_destino) {
      return NextResponse.json({ error: 'Nombre y unidad de destino son requeridos' }, { status: 400 });
    }

    const { data: log, error } = await supabase
      .from('access_logs')
      .insert({
        conjunto_id: user.conjunto_id,
        tipo: tipo || 'peatonal',
        cedula,
        nombre,
        placa: placa?.toUpperCase(),
        unidad_destino,
        motivo,
        estado: es_pre_registro ? 'pre_registro' : 'adentro',
        es_pre_registro: !!es_pre_registro,
        hora_entrada: es_pre_registro ? null : new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ log, message: 'Registro de acceso guardado' });
  } catch {
    return NextResponse.json({ error: 'Error registrando acceso' }, { status: 500 });
  }
}

// PATCH register exit time
export async function PATCH(request: Request) {
  const user = await getAdminUser();
  if (!user || !user.conjunto_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { log_id } = body;

    const { data: log, error } = await supabase
      .from('access_logs')
      .update({
        estado: 'afuera',
        hora_salida: new Date().toISOString(),
      })
      .eq('id', log_id)
      .eq('conjunto_id', user.conjunto_id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ log, message: 'Salida registrada correctamente' });
  } catch {
    return NextResponse.json({ error: 'Error registrando salida' }, { status: 500 });
  }
}
