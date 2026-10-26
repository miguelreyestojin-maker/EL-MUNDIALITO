"use server";

import { requireAdmin } from "@/lib/authz";
import { hashPin } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase/server";
import { CATEGORIES, firstRound } from "@/lib/tournament";
import type { ActionResult, CategoryId, Match } from "@/lib/types";

const OK: ActionResult = {};
const MIN_PIN_LENGTH = 4;

const fail = (message: string): ActionResult => ({ error: message });
const fromDb = (error: { message: string } | null): ActionResult =>
  error ? fail(error.message) : OK;

export async function addTeam(category: CategoryId, name: string): Promise<ActionResult> {
  await requireAdmin();
  const trimmed = name.trim();
  if (!trimmed) return fail("Escribe el nombre del equipo");

  const { count } = await supabaseAdmin
    .from("teams")
    .select("id", { count: "exact", head: true })
    .eq("category", category);
  const { name: categoryName, teamCount } = CATEGORIES[category];
  if ((count ?? 0) >= teamCount) {
    return fail(`${categoryName} ya tiene sus ${teamCount} equipos`);
  }

  const { error } = await supabaseAdmin.from("teams").insert({ category, name: trimmed });
  return error?.code === "23505" ? fail("Ya existe un equipo con ese nombre") : fromDb(error);
}

export async function renameTeam(id: string, name: string): Promise<ActionResult> {
  await requireAdmin();
  const trimmed = name.trim();
  if (!trimmed) return fail("Escribe el nombre del equipo");

  const { error } = await supabaseAdmin.from("teams").update({ name: trimmed }).eq("id", id);
  return error?.code === "23505" ? fail("Ya existe un equipo con ese nombre") : fromDb(error);
}

export async function deleteTeam(id: string): Promise<ActionResult> {
  await requireAdmin();
  const { count } = await supabaseAdmin
    .from("matches")
    .select("id", { count: "exact", head: true })
    .or(`home_team_id.eq.${id},away_team_id.eq.${id}`);
  if (count) return fail("El equipo ya está en un cruce; libéralo antes de eliminarlo");

  return fromDb((await supabaseAdmin.from("teams").delete().eq("id", id)).error);
}

export async function setPairing(
  matchId: string,
  homeTeamId: string | null,
  awayTeamId: string | null,
): Promise<ActionResult> {
  await requireAdmin();
  const { data: match } = await supabaseAdmin
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .single<Match>();
  if (!match) return fail("Partido no encontrado");
  if (match.round !== firstRound(match.category)) {
    return fail("Solo se asignan manualmente los cruces de la primera ronda");
  }
  if (match.status !== "scheduled") return fail("El partido ya inició");
  if (homeTeamId && homeTeamId === awayTeamId) return fail("Un equipo no puede jugar contra sí mismo");

  const chosen = [homeTeamId, awayTeamId].filter((id): id is string => id !== null);
  if (chosen.length) {
    const { data: taken } = await supabaseAdmin
      .from("matches")
      .select("id")
      .eq("category", match.category)
      .eq("round", match.round)
      .neq("id", matchId)
      .or(chosen.map((id) => `home_team_id.eq.${id},away_team_id.eq.${id}`).join(","));
    if (taken?.length) return fail("Un equipo ya está asignado a otro cruce");

    const { count } = await supabaseAdmin
      .from("teams")
      .select("id", { count: "exact", head: true })
      .eq("category", match.category)
      .in("id", chosen);
    if (count !== chosen.length) return fail("Equipo inválido para esta categoría");
  }

  return fromDb(
    (
      await supabaseAdmin
        .from("matches")
        .update({ home_team_id: homeTeamId, away_team_id: awayTeamId })
        .eq("id", matchId)
    ).error,
  );
}

export async function assignMatch(
  matchId: string,
  court: string,
  visorId: string | null,
): Promise<ActionResult> {
  await requireAdmin();
  return fromDb(
    (
      await supabaseAdmin
        .from("matches")
        .update({ court: court.trim() || null, visor_id: visorId })
        .eq("id", matchId)
    ).error,
  );
}

export async function addVisor(name: string, pin: string): Promise<ActionResult> {
  await requireAdmin();
  const trimmed = name.trim();
  if (!trimmed) return fail("Escribe el nombre del visor");
  if (pin.length < MIN_PIN_LENGTH) return fail(`El PIN debe tener al menos ${MIN_PIN_LENGTH} caracteres`);

  const { data: visor, error } = await supabaseAdmin
    .from("visors")
    .insert({ name: trimmed })
    .select("id")
    .single();
  if (error) {
    return error.code === "23505" ? fail("Ya existe un visor con ese nombre") : fail(error.message);
  }

  const { error: pinError } = await supabaseAdmin
    .from("visor_pins")
    .insert({ visor_id: visor.id, pin_hash: hashPin(pin) });
  if (pinError) await supabaseAdmin.from("visors").delete().eq("id", visor.id);
  return fromDb(pinError);
}

export async function deleteVisor(id: string): Promise<ActionResult> {
  await requireAdmin();
  return fromDb((await supabaseAdmin.from("visors").delete().eq("id", id)).error);
}
