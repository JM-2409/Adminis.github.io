import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-jwt-key-parkcontrol-2025"
);

export type Role = "super_admin" | "administrador" | "vigilante" | "residente";

export interface UserSession {
  id: string;
  username: string;
  full_name: string;
  role: Role;
  complex_id?: string | null;
  unit_number?: string | null;
}

export async function signToken(payload: UserSession): Promise<string> {
  const expiresIn =
    payload.role === "super_admin" || payload.role === "administrador"
      ? "2h"
      : "8h";

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as UserSession;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("park_auth_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
