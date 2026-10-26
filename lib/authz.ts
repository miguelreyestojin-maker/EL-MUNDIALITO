import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getSession } from "@/lib/session";
import type { Match } from "@/lib/types";

export async function requireAdmin(): Promise<void> {
  if ((await getSession())?.role !== "admin") throw new Error("No autorizado");
}

/** Admin o el visor asignado al partido. Devuelve el partido ya cargado. */
export async function requireMatchAccess(matchId: string): Promise<Match> {
  const session = await getSession();
  if (!session) throw new Error("No autorizado");

  const { data } = await supabaseAdmin
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .single<Match>();
  if (!data) throw new Error("Partido no encontrado");

  if (session.role === "visor" && data.visor_id !== session.visorId) {
    throw new Error("Partido no asignado a este visor");
  }
  return data;
}
