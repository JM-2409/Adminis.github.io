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

  const { data: fines } = await supabase
    .from('fines')
    .select('*')
    .eq('conjunto_id', user.conjunto_id)
    .order('created_at', { ascending: false });

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('conjunto_id', user.conjunto_id)
    .order('created_at', { ascending: false });

  return NextResponse.json({ fines: fines || [], payments: payments || [] });
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user || !user.conjunto_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { tipo_objetivo, visitante_nombre, motivo, valor } = body;

    if (!motivo || !valor) {
      return NextResponse.json({ error: 'Motivo y valor son requeridos' }, { status: 400 });
    }

    const { data: fine, error } = await supabase
      .from('fines')
      .insert({
        conjunto_id: user.conjunto_id,
        tipo_objetivo: tipo_objetivo || 'visitante',
        visitante_nombre,
        motivo,
        valor: Number(valor),
        estado: 'pendiente',
        impuesto_por: user.username,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ fine, message: 'Multa registrada exitosamente' });
  } catch {
    return NextResponse.json({ error: 'Error al registrar multa' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getAdminUser();
  if (!user || !user.conjunto_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { fine_id, metodo_pago } = body;

    const { data: fine } = await supabase
      .from('fines')
      .select('*')
      .eq('id', fine_id)
      .eq('conjunto_id', user.conjunto_id)
      .single();

    if (!fine) return NextResponse.json({ error: 'Multa no encontrada' }, { status: 404 });

    // Mark paid
    await supabase
      .from('fines')
      .update({ estado: 'pagada' })
      .eq('id', fine_id);

    // Record payment
    await supabase.from('payments').insert({
      conjunto_id: user.conjunto_id,
      concepto: 'multa',
      referencia_id: fine.id,
      valor: fine.valor,
      metodo: metodo_pago || 'efectivo',
      registrado_por: user.username,
    });

    return NextResponse.json({ message: 'Multa marcada como pagada' });
  } catch {
    return NextResponse.json({ error: 'Error procesando pago' }, { status: 500 });
  }
}
