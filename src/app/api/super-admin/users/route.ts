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

// POST create admin user for a specific conjunto
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

    // Check if username exists
    const { data: existing } = await supabase
      .from('app_users')
      .select('id')
      .eq('username', username.trim())
      .single();

    if (existing) {
      return NextResponse.json({ error: 'El nombre de usuario ya existe' }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const assignedRole = role || 'administracion';

    const { data: newUser, error } = await supabase
      .from('app_users')
      .insert({
        full_name,
        username: username.trim(),
        password_hash,
        role: assignedRole,
        conjunto_id,
        activo: true,
      })
      .select('id, username, full_name, role, conjunto_id, created_at')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase.from('audit_logs').insert({
      usuario: admin.username,
      accion: 'Crear Usuario Admin',
      detalle: `Usuario ${username} (${assignedRole}) creado para conjunto ${conjunto_id}`,
    });

    return NextResponse.json({ user: newUser });
  } catch {
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}
