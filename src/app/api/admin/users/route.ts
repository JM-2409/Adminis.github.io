import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { dbStore, StoredUser } from '@/lib/db-store';

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

  // Query Supabase app_users table directly
  const { data: supaUsers } = await supabase
    .from('app_users')
    .select('id, username, full_name, role, unidad_id, activo, created_at, conjunto_id, units(torre_bloque, numero_unidad)')
    .eq('conjunto_id', user.conjunto_id)
    .order('created_at', { ascending: false });

  const { data: units } = await supabase
    .from('units')
    .select('*')
    .eq('conjunto_id', user.conjunto_id);

  const usersMap = new Map();
  (supaUsers || []).forEach((u) => usersMap.set(u.id, u));
  dbStore.getUsers().filter((u) => u.conjunto_id === user.conjunto_id).forEach((u) => {
    if (!usersMap.has(u.id)) usersMap.set(u.id, u);
  });

  return NextResponse.json({ users: Array.from(usersMap.values()), units: units || [] });
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

    const cleanUsername = username.trim();

    // Check existing in Supabase or dbStore
    const { data: existingUser } = await supabase
      .from('app_users')
      .select('id')
      .eq('username', cleanUsername)
      .single();

    if (existingUser || dbStore.findUserByUsername(cleanUsername)) {
      return NextResponse.json({ error: 'El nombre de usuario ya existe' }, { status: 400 });
    }

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
    const assignedRole = role as StoredUser['role'];

    // Insert into Supabase PostgreSQL
    const { data: supaUser } = await supabase
      .from('app_users')
      .insert({
        full_name,
        username: cleanUsername,
        password_hash,
        role: assignedRole,
        conjunto_id: admin.conjunto_id,
        unidad_id: assignedUnidadId || null,
        activo: true,
      })
      .select('id, username, full_name, role, conjunto_id, created_at')
      .single();

    const newUser: StoredUser = {
      id: supaUser?.id || crypto.randomUUID(),
      username: cleanUsername,
      password_hash,
      full_name,
      role: assignedRole,
      conjunto_id: admin.conjunto_id,
      unidad_id: assignedUnidadId || null,
      activo: true,
      created_at: supaUser?.created_at || new Date().toISOString(),
    };

    dbStore.addUser(newUser);

    return NextResponse.json({ user: newUser, message: 'Usuario creado con éxito' });
  } catch {
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}
