import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { dbStore } from '@/lib/db-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, username, password, role, secret_code } = body;

    if (!full_name || !username || !password || !role) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    const validRoles = ['super_admin', 'administracion', 'vigilante', 'residente'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Rol no válido' }, { status: 400 });
    }

    if (role === 'super_admin') {
      const expectedCode = process.env.SUPER_ADMIN_SECRET_CODE || '768';
      if (secret_code !== expectedCode) {
        return NextResponse.json(
          { error: 'Código secreto de Super Admin incorrecto' },
          { status: 403 }
        );
      }
    }

    const cleanUsername = username.trim();

    // Check if username exists in Supabase or dbStore
    const { data: existingUser } = await supabase
      .from('app_users')
      .select('id')
      .eq('username', cleanUsername)
      .single();

    if (existingUser || dbStore.findUserByUsername(cleanUsername)) {
      return NextResponse.json({ error: 'El nombre de usuario ya está registrado' }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    let conjunto_id = null;
    if (role !== 'super_admin') {
      const { data: conjunto } = await supabase.from('conjuntos').select('id').limit(1).single();
      if (conjunto) {
        conjunto_id = conjunto.id;
      } else {
        const conjuntos = dbStore.getConjuntos();
        if (conjuntos.length > 0) conjunto_id = conjuntos[0].id;
      }
    }

    const newUser = {
      id: crypto.randomUUID(),
      username: cleanUsername,
      password_hash,
      full_name,
      role: role as any,
      conjunto_id,
      activo: true,
      created_at: new Date().toISOString(),
    };

    // Store in Supabase PostgreSQL
    const { data: insertedUser, error: supaErr } = await supabase
      .from('app_users')
      .insert({
        id: newUser.id,
        username: newUser.username,
        password_hash: newUser.password_hash,
        full_name: newUser.full_name,
        role: newUser.role,
        conjunto_id: newUser.conjunto_id,
        activo: true,
      })
      .select('id, username, role, full_name, conjunto_id')
      .single();

    // Also sync in dbStore for memory fallback
    dbStore.addUser(newUser);

    const resultUser = insertedUser || {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
      full_name: newUser.full_name,
      conjunto_id: newUser.conjunto_id,
    };

    return NextResponse.json({
      message: 'Usuario de prueba creado con éxito',
      user: resultUser,
    });
  } catch (err: unknown) {
    console.error('Registration route error:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
