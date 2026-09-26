import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

async function checkSuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'super_admin') return null;
  return payload;
}

// GET all conjuntos & global metrics
export async function GET() {
  const admin = await checkSuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { data: conjuntos, error: conjuntosErr } = await supabase
    .from('conjuntos')
    .select('*')
    .order('created_at', { ascending: false });

  if (conjuntosErr) {
    return NextResponse.json({ error: conjuntosErr.message }, { status: 500 });
  }

  const { data: users, error: usersErr } = await supabase
    .from('app_users')
    .select('id, username, full_name, role, conjunto_id, activo, created_at')
    .order('created_at', { ascending: false });

  return NextResponse.json({ conjuntos: conjuntos || [], users: users || [] });
}

// POST create new conjunto
export async function POST(request: Request) {
  const admin = await checkSuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { nombre, direccion, ciudad, nit, telefono, email_contacto, plan, max_unidades, max_parqueaderos_visitantes } = body;

    if (!nombre || !direccion) {
      return NextResponse.json({ error: 'Nombre y dirección son requeridos' }, { status: 400 });
    }

    const { data: newConjunto, error } = await supabase
      .from('conjuntos')
      .insert({
        nombre,
        direccion,
        ciudad: ciudad || 'Bogota',
        nit,
        telefono,
        email_contacto,
        plan: plan || 'basico',
        estado_suscripcion: 'activa',
        max_unidades: max_unidades || 100,
        max_parqueaderos_visitantes: max_parqueaderos_visitantes || 20,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Insert default tariffs and visitor parkings
    await supabase.from('tariffs').insert({
      conjunto_id: newConjunto.id,
      carro_hora: 5000,
      moto_hora: 3000,
      carro_dia: 35000,
      moto_dia: 20000,
    });

    const visitorParkings = Array.from({ length: newConjunto.max_parqueaderos_visitantes || 20 }, (_, i) => ({
      conjunto_id: newConjunto.id,
      codigo: `V-${String(i + 1).padStart(2, '0')}`,
      estado: 'libre',
    }));

    await supabase.from('visitor_parkings').insert(visitorParkings);

    // Audit log
    await supabase.from('audit_logs').insert({
      usuario: admin.username,
      accion: 'Crear Conjunto',
      detalle: `Conjunto creado: ${nombre} (${newConjunto.id})`,
    });

    return NextResponse.json({ conjunto: newConjunto });
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Error al crear conjunto' }, { status: 500 });
  }
}

// PATCH update conjunto
export async function PATCH(request: Request) {
  const admin = await checkSuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, estado_suscripcion, plan, nombre, direccion, nit, telefono, email_contacto } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID de conjunto requerido' }, { status: 400 });
    }

    const { data: updatedConjunto, error } = await supabase
      .from('conjuntos')
      .update({
        estado_suscripcion,
        plan,
        nombre,
        direccion,
        nit,
        telefono,
        email_contacto,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from('audit_logs').insert({
      usuario: admin.username,
      accion: 'Actualizar Conjunto',
      detalle: `Conjunto ${id} actualizado: estado=${estado_suscripcion}, plan=${plan}`,
    });

    return NextResponse.json({ conjunto: updatedConjunto });
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Error al actualizar conjunto' }, { status: 500 });
  }
}
