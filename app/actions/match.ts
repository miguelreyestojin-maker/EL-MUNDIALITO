"use server";

import { requireMatchAccess } from "@/lib/authz";
import { supabaseAdmin } from "@/lib/supabase/server";
import { advancement, decideWinner, isTied, sideKey } from "@/lib/tournament";
import type { ActionResult, Match, Side, StatField } from "@/lib/types";

const OK: ActionResult = {};

export async function startMatch(matchId: string): Promise<ActionResult> {
  const match = await requireMatchAccess(matchId);
  if (match.status !== "scheduled") return { error: "El partido ya inició" };
  if (!match.home_team_id || !match.away_team_id) {
    return { error: "El partido aún no tiene los dos equipos" };
  }

  const { error } = await supabaseAdmin
    .from("matches")
    .update({ status: "in_progress" })
    .eq("id", matchId);
  return error ? { error: error.message } : OK;
}

export async function adjustStat(
  matchId: string,
  side: Side,
  field: StatField,
  delta: 1 | -1,
): Promise<ActionResult> {
  await requireMatchAccess(matchId);
  const { error } = await supabaseAdmin.rpc("adjust_match_stat", {
    p_match: matchId,
    p_field: sideKey(side, field),
    p_delta: delta,
  });
  return error ? { error: error.message } : OK;
}

async function placeTeam(
  match: Match,
  destination: { round: Match["round"]; position: number; side: Side },
  teamId: string,
): Promise<string | null> {
  const { error } = await supabaseAdmin
    .from("matches")
    .update({ [sideKey(destination.side, "team_id")]: teamId })
    .eq("category", match.category)
    .eq("round", destination.round)
    .eq("position", destination.position);
  return error?.message ?? null;
}

export async function finalizeMatch(matchId: string): Promise<ActionResult> {
  const match = await requireMatchAccess(matchId);
  if (match.status !== "in_progress") return { error: "El partido no está en vivo" };

  const winnerId = decideWinner(match);
  if (!winnerId) return { error: "Empate: registra un ganador en la tanda de penales" };
  const loserId = winnerId === match.home_team_id ? match.away_team_id : match.home_team_id;

  const next = advancement(match);
  if (next) {
    const failures = await Promise.all([
      placeTeam(match, next.winner, winnerId),
      next.loser && loserId ? placeTeam(match, next.loser, loserId) : null,
    ]);
    const failure = failures.find(Boolean);
    if (failure) return { error: failure };
  }

  const { error } = await supabaseAdmin
    .from("matches")
    .update({
      status: "completed",
      winner_id: winnerId,
      ...(isTied(match) ? {} : { home_pens: 0, away_pens: 0 }),
    })
    .eq("id", matchId);
  return error ? { error: error.message } : OK;
}
