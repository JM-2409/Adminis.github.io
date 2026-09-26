import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { dbStore, StoredUser } from '@/lib/db-store';

async function checkSuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== 'super_admin') return null;
  return payload;
}

export async function POST(request: Request) {
  const admin = await checkSuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { full_name, username, password, conjunto_id, role } = body;

    if (!full_name || !username || !password || !conjunto_id) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    const cleanUsername = username.trim();
    const password_hash = await bcrypt.hash(password, 10);
    const assignedRole = (role || 'administracion') as StoredUser['role'];

    const { data: supaUser } = await supabase
      .from('app_users')
      .insert({
        full_name,
        username: cleanUsername,
        password_hash,
        role: assignedRole,
        conjunto_id,
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
      conjunto_id,
      activo: true,
      created_at: supaUser?.created_at || new Date().toISOString(),
    };

    dbStore.addUser(newUser);

    return NextResponse.json({ user: newUser });
  } catch {
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}
