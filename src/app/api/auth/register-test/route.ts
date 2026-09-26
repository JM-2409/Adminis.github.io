import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

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

    // Protect super_admin with SUPER_ADMIN_SECRET_CODE (768)
    if (role === 'super_admin') {
      const expectedCode = process.env.SUPER_ADMIN_SECRET_CODE || '768';
      if (secret_code !== expectedCode) {
        return NextResponse.json(
          { error: 'Código secreto de Super Admin incorrecto' },
          { status: 403 }
        );
      }
    }

    // Check if username exists
    const { data: existingUser } = await supabase
      .from('app_users')
      .select('id')
      .eq('username', username.trim())
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'El nombre de usuario ya está registrado' }, { status: 400 });
    }

    // Hash password with 10 rounds
    const password_hash = await bcrypt.hash(password, 10);

    // Get default test conjunto for non-superadmin users if available
    let conjunto_id = null;
    if (role !== 'super_admin') {
      const { data: conjunto } = await supabase
        .from('conjuntos')
        .select('id')
        .limit(1)
        .single();
      if (conjunto) {
        conjunto_id = conjunto.id;
      }
    }

    const { data: newUser, error: insertError } = await supabase
      .from('app_users')
      .insert({
        full_name,
        username: username.trim(),
        password_hash,
        role,
        conjunto_id,
        activo: true,
      })
      .select('id, username, role, full_name, conjunto_id')
      .single();

    if (insertError) {
      console.error('Registration insert error:', insertError);
      return NextResponse.json({ error: 'Error al registrar usuario: ' + insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Usuario de prueba creado con éxito',
      user: newUser,
    });
  } catch (err: unknown) {
    console.error('Registration route error:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
