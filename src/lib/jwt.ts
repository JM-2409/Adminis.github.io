import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-32-chars-minimum-length!!';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface JWTPayload {
  id: string;
  username: string;
  role: 'super_admin' | 'administracion' | 'presidente' | 'vigilante' | 'residente';
  conjunto_id?: string | null;
  unidad_id?: string | null;
  full_name?: string;
  [key: string]: unknown;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  const isShortExpiry = payload.role === 'administracion' || payload.role === 'super_admin';
  const expirationTime = isShortExpiry ? '2h' : '8h';

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(secretKey);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}
