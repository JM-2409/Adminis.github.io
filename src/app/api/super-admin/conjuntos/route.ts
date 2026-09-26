import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import { dbStore } from '@/lib/db-store';

async function checkSuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'super_admin') return null;
  return payload;
}

export async function GET() {
  const admin = await checkSuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { data: supaConjuntos } = await supabase.from('conjuntos').select('*').order('created_at', { ascending: false });
  const { data: supaUsers } = await supabase.from('app_users').select('id, username, full_name, role, conjunto_id, activo, created_at').order('created_at', { ascending: false });

  const conjuntosMap = new Map();
  (supaConjuntos || []).forEach((c) => conjuntosMap.set(c.id, c));
  dbStore.getConjuntos().forEach((c) => {
    if (!conjuntosMap.has(c.id)) conjuntosMap.set(c.id, c);
  });

  const usersMap = new Map();
  (supaUsers || []).forEach((u) => usersMap.set(u.id, u));
  dbStore.getUsers().forEach((u) => {
    if (!usersMap.has(u.id)) usersMap.set(u.id, u);
  });

  return NextResponse.json({
    conjuntos: Array.from(conjuntosMap.values()),
    users: Array.from(usersMap.values()),
  });
}

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

    const { data: supaConjunto, error } = await supabase
      .from('conjuntos')
      .insert({
        nombre,
        direccion,
        ciudad: ciudad || 'Bogota',
        nit: nit || null,
        telefono: telefono || null,
        email_contacto: email_contacto || null,
        plan: plan || 'basico',
        estado_suscripcion: 'activa',
        max_unidades: max_unidades || 100,
        max_parqueaderos_visitantes: max_parqueaderos_visitantes || 20,
      })
      .select()
      .single();

    const createdConjunto = supaConjunto || {
      id: crypto.randomUUID(),
      nombre,
      direccion,
      ciudad: ciudad || 'Bogota',
      nit: nit || '',
      telefono: telefono || '',
      email_contacto: email_contacto || '',
      plan: plan || 'basico',
      estado_suscripcion: 'activa' as const,
      max_unidades: max_unidades || 100,
      max_parqueaderos_visitantes: max_parqueaderos_visitantes || 20,
      created_at: new Date().toISOString(),
    };

    dbStore.addConjunto(createdConjunto);

    return NextResponse.json({ conjunto: createdConjunto });
  } catch {
    return NextResponse.json({ error: 'Error al crear conjunto' }, { status: 500 });
  }
}

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

    const { data: supaUpdated } = await supabase
      .from('conjuntos')
      .update({ estado_suscripcion, plan, nombre, direccion, nit, telefono, email_contacto })
      .eq('id', id)
      .select()
      .single();

    const updated = supaUpdated || dbStore.updateConjunto(id, {
      estado_suscripcion,
      plan,
      nombre,
      direccion,
      nit,
      telefono,
      email_contacto,
    });

    return NextResponse.json({ conjunto: updated });
  } catch {
    return NextResponse.json({ error: 'Error al actualizar conjunto' }, { status: 500 });
  }
}
