"use client";

import { useState } from "react";
import { assignMatch, setPairing } from "@/app/actions/admin";
import { GHOST_BUTTON_CLASS, INPUT_CLASS } from "@/components/styles";
import { useAction } from "@/hooks/use-action";
import {
  CATEGORIES,
  firstRound,
  matchesOfRound,
  ROUND_LABELS,
  STATUS_LABELS,
} from "@/lib/tournament";
import type { CategoryId, Match, Team, Visor } from "@/lib/types";

interface MatchEditorProps {
  match: Match;
  /** Equipos elegibles para este cruce; `null` si los equipos llegan por avance en la llave. */
  availableTeams: Team[] | null;
  teamsById: Map<string, Team>;
  visors: Visor[];
}

function TeamSelect({
  label,
  value,
  teams,
  onChange,
}: {
  label: string;
  value: string;
  teams: Team[];
  onChange: (id: string) => void;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={INPUT_CLASS}
    >
      <option value="">{label}</option>
      {teams.map((team) => (
        <option key={team.id} value={team.id}>
          {team.name}
        </option>
      ))}
    </select>
  );
}

function MatchEditor({ match, availableTeams, teamsById, visors }: MatchEditorProps) {
  const { run, pending, error } = useAction();
  const [home, setHome] = useState(match.home_team_id ?? "");
  const [away, setAway] = useState(match.away_team_id ?? "");
  const [court, setCourt] = useState(match.court ?? "");
  const [visorId, setVisorId] = useState(match.visor_id ?? "");

  const editablePairing = availableTeams !== null && match.status === "scheduled";
  const teamName = (id: string | null) => (id && teamsById.get(id)?.name) || "Por definir";

  const save = () =>
    run(async () => {
      if (editablePairing) {
        const pairing = await setPairing(match.id, home || null, away || null);
        if (pairing.error) return pairing;
      }
      return assignMatch(match.id, court, visorId || null);
    });

  return (
    <li className="space-y-2 py-3">
      <div className="flex items-center justify-between text-xs text-ink/50">
        <span>Partido {match.position + 1}</span>
        <span>{STATUS_LABELS[match.status]}</span>
      </div>
      {editablePairing ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <TeamSelect label="Local" value={home} teams={availableTeams.filter((t) => t.id !== away)} onChange={setHome} />
          <TeamSelect label="Visitante" value={away} teams={availableTeams.filter((t) => t.id !== home)} onChange={setAway} />
        </div>
      ) : (
        <p className="font-semibold">
          {teamName(match.home_team_id)} <span className="text-ink/40">vs</span>{" "}
          {teamName(match.away_team_id)}
        </p>
      )}
      <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <input
          value={court}
          onChange={(e) => setCourt(e.target.value)}
          placeholder="Cancha"
          aria-label="Cancha"
          className={INPUT_CLASS}
        />
        <select
          aria-label="Visor"
          value={visorId}
          onChange={(e) => setVisorId(e.target.value)}
          className={INPUT_CLASS}
        >
          <option value="">Sin visor</option>
          {visors.map((visor) => (
            <option key={visor.id} value={visor.id}>
              {visor.name}
            </option>
          ))}
        </select>
        <button className={GHOST_BUTTON_CLASS} disabled={pending} onClick={save}>
          Guardar
        </button>
      </div>
      {error && <p className="text-xs text-accent-coral">{error}</p>}
    </li>
  );
}

interface MatchesPanelProps {
  category: CategoryId;
  teams: Team[];
  matches: Match[];
  visors: Visor[];
  teamsById: Map<string, Team>;
}

export function MatchesPanel({ category, teams, matches, visors, teamsById }: MatchesPanelProps) {
  const opening = firstRound(category);
  const pairedIds = new Set(
    matchesOfRound(matches, opening).flatMap((m) => [m.home_team_id, m.away_team_id]),
  );

  return (
    <section className="card space-y-4 rounded-2xl p-4">
      <h2 className="display text-2xl text-primary-blue">Cruces y asignación</h2>
      {CATEGORIES[category].rounds
        .flatMap((round) => (round === "final" ? (["third", "final"] as const) : [round]))
        .map((round) => (
          <div key={round}>
            <h3 className="display text-xl text-primary-blue">{ROUND_LABELS[round]}</h3>
            <ul className="divide-y divide-border-card">
              {matchesOfRound(matches, round).map((match) => (
                <MatchEditor
                  key={match.id}
                  match={match}
                  availableTeams={
                    round === opening
                      ? teams.filter(
                          (t) =>
                            !pairedIds.has(t.id) ||
                            t.id === match.home_team_id ||
                            t.id === match.away_team_id,
                        )
                      : null
                  }
                  teamsById={teamsById}
                  visors={visors}
                />
              ))}
            </ul>
          </div>
        ))}
    </section>
  );
}
