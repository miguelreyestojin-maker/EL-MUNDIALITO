"use client";

import { useState } from "react";
import { addTeam, deleteTeam, renameTeam } from "@/app/actions/admin";
import { GHOST_BUTTON_CLASS, INPUT_CLASS, PRIMARY_BUTTON_CLASS } from "@/components/styles";
import { useAction } from "@/hooks/use-action";
import { CATEGORIES } from "@/lib/tournament";
import type { CategoryId, Match, Team } from "@/lib/types";

interface TeamsPanelProps {
  category: CategoryId;
  teams: Team[];
  matches: Match[];
}

function TeamItem({ team, assigned }: { team: Team; assigned: boolean }) {
  const { run, pending, error } = useAction();
  const [name, setName] = useState<string | null>(null);

  return (
    <li className="space-y-1 py-2">
      <div className="flex items-center gap-2">
        {name === null ? (
          <span className="min-w-0 flex-1 truncate font-semibold">{team.name}</span>
        ) : (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${INPUT_CLASS} flex-1`}
            aria-label="Nombre del equipo"
          />
        )}
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            assigned ? "bg-primary-neon/15 text-primary-neon" : "bg-white/10 text-white/60"
          }`}
        >
          {assigned ? "asignado" : "pendiente"}
        </span>
        {name === null ? (
          <button className={GHOST_BUTTON_CLASS} onClick={() => setName(team.name)}>
            Editar
          </button>
        ) : (
          <button
            className={GHOST_BUTTON_CLASS}
            disabled={pending}
            onClick={() => run(() => renameTeam(team.id, name), () => setName(null))}
          >
            Guardar
          </button>
        )}
        <button
          className={`${GHOST_BUTTON_CLASS} text-live-red`}
          disabled={pending}
          onClick={() => run(() => deleteTeam(team.id))}
        >
          Eliminar
        </button>
      </div>
      {error && <p className="text-xs text-live-red">{error}</p>}
    </li>
  );
}

export function TeamsPanel({ category, teams, matches }: TeamsPanelProps) {
  const { run, pending, error } = useAction();
  const [name, setName] = useState("");
  const { teamCount } = CATEGORIES[category];
  const assignedIds = new Set(matches.flatMap((m) => [m.home_team_id, m.away_team_id]));

  return (
    <section className="glass space-y-4 rounded-2xl p-4">
      <h2 className="display text-2xl text-primary-neon">
        Equipos ({teams.length}/{teamCount})
      </h2>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          run(() => addTeam(category, name), () => setName(""));
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del equipo"
          className={INPUT_CLASS}
        />
        <button disabled={pending} className={PRIMARY_BUTTON_CLASS}>
          Agregar
        </button>
      </form>
      {error && <p className="text-sm text-live-red">{error}</p>}
      <ul className="divide-y divide-border-glass">
        {teams.map((team) => (
          <TeamItem key={team.id} team={team} assigned={assignedIds.has(team.id)} />
        ))}
      </ul>
    </section>
  );
}
