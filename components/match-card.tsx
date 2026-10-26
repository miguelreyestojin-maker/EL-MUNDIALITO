"use client";

import { useState } from "react";
import { Modal } from "@/components/modal";
import { isTied, ROUND_LABELS, sideKey, STATUS_LABELS } from "@/lib/tournament";
import type { Match, MatchStatus, Side, Team } from "@/lib/types";

const STATUS_STYLES: Record<MatchStatus, string> = {
  scheduled: "bg-accent-coral/10 text-accent-coral",
  in_progress: "animate-live bg-accent-coral text-white",
  completed: "bg-black/5 text-ink/60",
};

interface MatchCardProps {
  match: Match;
  teamsById: Map<string, Team>;
}

function CardCount({ count, className }: { count: number; className: string }) {
  if (count === 0) return null;
  return (
    <span
      className={`inline-flex h-4 min-w-3 items-center justify-center rounded-[3px] px-0.5 text-[10px] font-bold tabular-nums ${className}`}
    >
      {count}
    </span>
  );
}

function TeamRow({
  match,
  side,
  team,
  full,
}: {
  match: Match;
  side: Side;
  team?: Team;
  /** En el detalle el nombre ocupa las líneas que necesite. */
  full?: boolean;
}) {
  const won = !!team && match.winner_id === team.id;
  const lost = match.status === "completed" && !!team && !won;
  const showPens = match.status === "completed" && isTied(match);

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 ${lost ? "opacity-50" : ""}`}>
      <div className="min-w-0 flex-1">
        <p
          className={`font-semibold break-words ${
            full ? "text-base" : "line-clamp-2 text-sm leading-tight"
          } ${team ? "" : "text-ink/40 italic"}`}
        >
          {team?.name ?? "Por definir"}
        </p>
        <div className="flex gap-1">
          <CardCount count={match[sideKey(side, "yellow")]} className="bg-card-yellow text-ink" />
          <CardCount count={match[sideKey(side, "red")]} className="bg-accent-coral text-white" />
        </div>
      </div>
      {showPens && (
        <span className="text-xs tabular-nums text-ink/60">({match[sideKey(side, "pens")]})</span>
      )}
      <span
        className={`display w-7 shrink-0 text-right text-3xl tabular-nums ${won ? "text-success-green" : ""}`}
      >
        {team && match.status !== "scheduled" ? match[sideKey(side, "score")] : "–"}
      </span>
    </div>
  );
}

export function MatchCard({ match, teamsById }: MatchCardProps) {
  const [open, setOpen] = useState(false);
  const home = match.home_team_id ? teamsById.get(match.home_team_id) : undefined;
  const away = match.away_team_id ? teamsById.get(match.away_team_id) : undefined;
  const title = `${home?.name ?? "Por definir"} contra ${away?.name ?? "Por definir"}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={title}
        className={`card w-full cursor-pointer overflow-hidden rounded-xl text-left ${
          match.status === "in_progress" ? "border-accent-coral shadow-live" : ""
        }`}
      >
        <header className="flex items-center justify-between gap-2 border-b border-border-card px-3 py-1.5">
          <span className="truncate text-xs font-medium text-ink/60">
            {match.court ?? "Cancha por asignar"}
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[match.status]}`}
          >
            {STATUS_LABELS[match.status]}
          </span>
        </header>
        <TeamRow match={match} side="home" team={home} />
        <div className="mx-3 border-t border-border-card" />
        <TeamRow match={match} side="away" team={away} />
      </button>

      {open && (
        <Modal title={ROUND_LABELS[match.round]} onClose={() => setOpen(false)}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium break-words text-ink/70">
              {match.court ?? "Cancha por asignar"}
            </span>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[match.status]}`}
            >
              {STATUS_LABELS[match.status]}
            </span>
          </div>
          <div className="overflow-hidden rounded-xl border border-border-card">
            <TeamRow match={match} side="home" team={home} full />
            <div className="mx-3 border-t border-border-card" />
            <TeamRow match={match} side="away" team={away} full />
          </div>
        </Modal>
      )}
    </>
  );
}
