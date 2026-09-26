import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { signToken } from '@/lib/jwt';
import { dbStore } from '@/lib/db-store';

const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 5;

  const record = loginAttempts.get(ip);
  if (!record) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return true;
  }

  if (now - record.firstAttempt > windowMs) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return true;
  }

  if (record.count >= maxAttempts) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Demasiados intentos de inicio de sesión. Por favor intente de nuevo en 15 minutos.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Usuario y contraseña son requeridos' }, { status: 400 });
    }

    const cleanUsername = username.trim();

    // 1. Check in dbStore first
    let user = dbStore.findUserByUsername(cleanUsername);

    // 2. If not found in dbStore, check in Supabase
    if (!user) {
      const { data: supaUser } = await supabase
        .from('app_users')
        .select('*')
        .eq('username', cleanUsername)
        .single();

      if (supaUser) {
        user = supaUser as any;
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    if (!user.activo) {
      return NextResponse.json({ error: 'El usuario se encuentra inactivo' }, { status: 403 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // Generate JWT
    const token = await signToken({
      id: user.id,
      username: user.username,
      role: user.role,
      conjunto_id: user.conjunto_id,
      unidad_id: user.unidad_id,
      full_name: user.full_name,
    });

    loginAttempts.delete(ip);

    const response = NextResponse.json({
      message: 'Inicio de sesión exitoso',
      role: user.role,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
        conjunto_id: user.conjunto_id,
      },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: user.role === 'super_admin' || user.role === 'administracion' ? 2 * 3600 : 8 * 3600,
      path: '/',
    });

    return response;
  } catch (err: unknown) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
