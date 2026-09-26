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

export async function GET() {
  const user = await getAdminUser();
  if (!user || !user.conjunto_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { data: commonAreas } = await supabase
    .from('common_areas')
    .select('*')
    .eq('conjunto_id', user.conjunto_id);

  const { data: reservations } = await supabase
    .from('reservations')
    .select('*, common_areas(nombre)')
    .eq('conjunto_id', user.conjunto_id)
    .order('fecha_reserva', { ascending: false });

  return NextResponse.json({ commonAreas: commonAreas || [], reservations: reservations || [] });
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user || !user.conjunto_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { common_area_id, solicitante_nombre, fecha_reserva, hora_inicio, hora_fin, valor } = body;

    const { data: reservation, error } = await supabase
      .from('reservations')
      .insert({
        conjunto_id: user.conjunto_id,
        common_area_id,
        solicitante_nombre,
        fecha_reserva,
        hora_inicio,
        hora_fin,
        valor: Number(valor || 0),
        estado: 'confirmada',
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ reservation, message: 'Reserva guardada correctamente' });
  } catch {
    return NextResponse.json({ error: 'Error guardando reserva' }, { status: 500 });
  }
}
