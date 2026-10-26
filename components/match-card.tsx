import { isTied, sideKey, STATUS_LABELS } from "@/lib/tournament";
import type { Match, MatchStatus, Side, Team } from "@/lib/types";

const STATUS_STYLES: Record<MatchStatus, string> = {
  scheduled: "bg-white/10 text-white/70",
  in_progress: "animate-live bg-live-red text-white",
  completed: "bg-primary-neon/15 text-primary-neon",
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

function TeamRow({ match, side, team }: { match: Match; side: Side; team?: Team }) {
  const won = !!team && match.winner_id === team.id;
  const lost = match.status === "completed" && !!team && !won;
  const showPens = match.status === "completed" && isTied(match);

  return (
    <div className={`flex items-center gap-2 px-3 py-2 ${lost ? "opacity-50" : ""}`}>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold ${team ? "" : "text-white/40 italic"}`}>
          {team?.name ?? "Por definir"}
        </p>
        <div className="flex gap-1">
          <CardCount count={match[sideKey(side, "yellow")]} className="bg-card-yellow text-black" />
          <CardCount count={match[sideKey(side, "red")]} className="bg-card-red text-white" />
        </div>
      </div>
      {showPens && (
        <span className="text-xs tabular-nums text-white/60">
          ({match[sideKey(side, "pens")]})
        </span>
      )}
      <span
        className={`display w-7 text-right text-3xl tabular-nums ${won ? "text-primary-neon" : ""}`}
      >
        {team && match.status !== "scheduled" ? match[sideKey(side, "score")] : "–"}
      </span>
    </div>
  );
}

export function MatchCard({ match, teamsById }: MatchCardProps) {
  const home = match.home_team_id ? teamsById.get(match.home_team_id) : undefined;
  const away = match.away_team_id ? teamsById.get(match.away_team_id) : undefined;

  return (
    <article
      className={`glass w-56 shrink-0 overflow-hidden rounded-xl ${
        match.status === "in_progress" ? "shadow-live" : ""
      }`}
    >
      <header className="flex items-center justify-between gap-2 border-b border-border-glass px-3 py-1.5">
        <span className="truncate text-xs font-medium text-white/60">
          {match.court ?? "Cancha por asignar"}
        </span>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[match.status]}`}
        >
          {STATUS_LABELS[match.status]}
        </span>
      </header>
      <TeamRow match={match} side="home" team={home} />
      <div className="mx-3 border-t border-border-glass" />
      <TeamRow match={match} side="away" team={away} />
    </article>
  );
}
