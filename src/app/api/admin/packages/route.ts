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

  const { data: packages, error } = await supabase
    .from('packages')
    .select('*')
    .eq('conjunto_id', user.conjunto_id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ packages: packages || [] });
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user || !user.conjunto_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { unidad_texto, remitente, empresa_mensajeria, descripcion } = body;

    if (!unidad_texto) {
      return NextResponse.json({ error: 'Unidad de destino es requerida' }, { status: 400 });
    }

    const { data: packageData, error } = await supabase
      .from('packages')
      .insert({
        conjunto_id: user.conjunto_id,
        unidad_texto,
        remitente,
        empresa_mensajeria,
        descripcion,
        estado: 'pendiente',
        recibido_por: user.username,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ package: packageData, message: 'Paquete registrado' });
  } catch {
    return NextResponse.json({ error: 'Error registrando paquete' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getAdminUser();
  if (!user || !user.conjunto_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { package_id, entregado_a } = body;

    const { data: packageData, error } = await supabase
      .from('packages')
      .update({
        estado: 'entregado',
        fecha_entrega: new Date().toISOString(),
        entregado_a: entregado_a || 'Residente',
      })
      .eq('id', package_id)
      .eq('conjunto_id', user.conjunto_id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ package: packageData, message: 'Paquete marcado como entregado' });
  } catch {
    return NextResponse.json({ error: 'Error actualizando paquete' }, { status: 500 });
  }
}
