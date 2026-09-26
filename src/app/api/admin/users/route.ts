import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

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

  const { data: users, error } = await supabase
    .from('app_users')
    .select('id, username, full_name, role, unidad_id, activo, created_at, units(torre_bloque, numero_unidad)')
    .eq('conjunto_id', user.conjunto_id)
    .order('created_at', { ascending: false });

  const { data: units } = await supabase
    .from('units')
    .select('*')
    .eq('conjunto_id', user.conjunto_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: users || [], units: units || [] });
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin || !admin.conjunto_id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { full_name, username, password, role, unidad_id, torre_bloque, numero_unidad } = body;

    if (!full_name || !username || !password || !role) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    if (!['vigilante', 'residente', 'presidente'].includes(role)) {
      return NextResponse.json({ error: 'Rol no permitido' }, { status: 400 });
    }

    // If resident and unit specified, create unit if needed
    let assignedUnidadId = unidad_id;
    if (role === 'residente' && torre_bloque && numero_unidad) {
      const { data: existingUnit } = await supabase
        .from('units')
        .select('id')
        .eq('conjunto_id', admin.conjunto_id)
        .eq('torre_bloque', torre_bloque)
        .eq('numero_unidad', numero_unidad)
        .single();

      if (existingUnit) {
        assignedUnidadId = existingUnit.id;
      } else {
        const { data: newUnit } = await supabase
          .from('units')
          .insert({
            conjunto_id: admin.conjunto_id,
            torre_bloque,
            numero_unidad,
            propietario_nombre: full_name,
          })
          .select('id')
          .single();

        if (newUnit) assignedUnidadId = newUnit.id;
      }
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabase
      .from('app_users')
      .insert({
        full_name,
        username: username.trim(),
        password_hash,
        role,
        conjunto_id: admin.conjunto_id,
        unidad_id: assignedUnidadId || null,
        activo: true,
      })
      .select('id, username, full_name, role, conjunto_id, created_at')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ user: newUser, message: 'Usuario creado con éxito' });
  } catch {
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}
