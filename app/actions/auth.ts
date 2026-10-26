"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import {
  ADMIN_PASSWORD,
  ADMIN_USER,
  createSession,
  destroySession,
  safeEqual,
  verifyPin,
} from "@/lib/session";
import type { ActionResult } from "@/lib/types";

const INVALID: ActionResult = { error: "Credenciales incorrectas" };

export async function loginAdmin(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const user = String(formData.get("user") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!safeEqual(user, ADMIN_USER) || !safeEqual(password, ADMIN_PASSWORD)) return INVALID;

  await createSession({ role: "admin" });
  redirect("/admin");
}

export async function loginVisor(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("user") ?? "").trim();
  const pin = String(formData.get("password") ?? "");

  const { data: visor } = await supabaseAdmin
    .from("visors")
    .select("id, visor_pins(pin_hash)")
    .eq("name", name)
    .maybeSingle<{ id: string; visor_pins: { pin_hash: string } | null }>();
  const pinHash = visor?.visor_pins?.pin_hash;
  if (!visor || !pinHash || !verifyPin(pin, pinHash)) return INVALID;

  await createSession({ role: "visor", visorId: visor.id });
  redirect("/cancha");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/");
}
