"use client";

import { useState } from "react";
import { LoadingState } from "@/components/loading-state";
import { VisorControl } from "@/components/visor-control";
import { useTournament } from "@/hooks/use-tournament";
import { CATEGORIES, indexTeams, ROUND_LABELS } from "@/lib/tournament";
import type { Match, Team } from "@/lib/types";

const NO_COURT = "Sin cancha";

const courtOf = (match: Match) => match.court ?? NO_COURT;

function matchTitle(match: Match, teamsById: Map<string, Team>): string {
  const name = (id: string | null) => (id && teamsById.get(id)?.name) || "Por definir";
  return `${name(match.home_team_id)} vs ${name(match.away_team_id)}`;
}

/** `visorId` null = administrador, que puede operar cualquier partido. */
export function VisorPanel({ visorId }: { visorId: string | null }) {
  const { tournament, error } = useTournament();
  const [courtChoice, setCourtChoice] = useState<string | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);

  if (!tournament) return <LoadingState error={error} />;

  const teamsById = indexTeams(tournament.teams);
  const assigned = tournament.matches.filter(
    (m) => m.home_team_id && m.away_team_id && (visorId === null || m.visor_id === visorId),
  );
  if (assigned.length === 0) {
    return <p className="py-20 text-center text-white/60">No tienes partidos asignados todavía.</p>;
  }

  const courts = [...new Set(assigned.map(courtOf))].sort();
  const court = courtChoice && courts.includes(courtChoice) ? courtChoice : courts[0];
  const courtMatches = assigned.filter((m) => courtOf(m) === court);
  const selected = courtMatches.find((m) => m.id === matchId);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {courts.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCourtChoice(c);
              setMatchId(null);
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              c === court ? "bg-primary-neon text-dark-pitch shadow-neon" : "glass"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {courtMatches.map((m) => (
          <li key={m.id}>
            <button
              onClick={() => setMatchId(m.id)}
              className={`glass w-full rounded-xl px-4 py-3 text-left ${
                m.id === selected?.id ? "border-primary-neon shadow-neon" : ""
              }`}
            >
              <span className="block text-xs text-white/50">
                {CATEGORIES[m.category].name} · {ROUND_LABELS[m.round]}
                {m.status === "in_progress" && <span className="animate-live ml-2 text-live-red">● EN VIVO</span>}
                {m.status === "completed" && " · Finalizado"}
              </span>
              <span className="font-semibold">{matchTitle(m, teamsById)}</span>
            </button>
          </li>
        ))}
      </ul>

      {selected && <VisorControl key={selected.id} match={selected} teamsById={teamsById} />}
    </div>
  );
}
