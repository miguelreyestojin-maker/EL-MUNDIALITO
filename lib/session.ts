import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "torneo_session";
const SESSION_HOURS = 12;

export const ADMIN_USER = process.env.ADMIN_USER ?? "JTOJIN";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Glasswing_fut26";

export type Session = { role: "admin" } | { role: "visor"; visorId: string };

type Payload = Session & { exp: number };

function sign(data: string): string {
  return createHmac("sha256", process.env.SESSION_SECRET!).update(data).digest("base64url");
}

export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function hashPin(pin: string): string {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(pin, salt, 32).toString("hex")}`;
}

export function verifyPin(pin: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  return safeEqual(scryptSync(pin, salt, 32).toString("hex"), hash);
}

export async function createSession(session: Session): Promise<void> {
  const payload: Payload = { ...session, exp: Date.now() + SESSION_HOURS * 3_600_000 };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  (await cookies()).set(COOKIE_NAME, `${body}.${sign(body)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_HOURS * 3600,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

export async function getSession(): Promise<Session | null> {
  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (!cookie) return null;
  const [body, signature] = cookie.split(".");
  if (!body || !signature || !safeEqual(signature, sign(body))) return null;
  const { exp, ...session }: Payload = JSON.parse(Buffer.from(body, "base64url").toString());
  return exp > Date.now() ? session : null;
}
