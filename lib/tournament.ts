import type { CategoryId, Match, MatchStatus, Round, Side, Team } from "./types";

interface CategoryConfig {
  name: string;
  description: string;
  teamCount: number;
  /** Rondas de la llave principal, de la primera a la final (el tercer lugar se maneja aparte). */
  rounds: readonly Round[];
}

const FULL_BRACKET = ["round16", "quarter", "semi", "final"] as const;

export const CATEGORIES: Record<CategoryId, CategoryConfig> = {
  f1: {
    name: "Fútbol 1",
    description: "Mini fútbol · Infantil",
    teamCount: 16,
    rounds: FULL_BRACKET,
  },
  f2: {
    name: "Fútbol 2",
    description: "Fútbol normal",
    teamCount: 16,
    rounds: FULL_BRACKET,
  },
  f3: {
    name: "Fútbol 3",
    description: "Fútbol grande",
    teamCount: 4,
    rounds: ["semi", "final"],
  },
};

export const CATEGORY_IDS = Object.keys(CATEGORIES) as CategoryId[];

export const ROUND_LABELS: Record<Round, string> = {
  round16: "Octavos",
  quarter: "Cuartos",
  semi: "Semifinal",
  third: "Tercer lugar",
  final: "Final",
};

export const STATUS_LABELS: Record<MatchStatus, string> = {
  scheduled: "Programado",
  in_progress: "EN VIVO",
  completed: "Finalizado",
};

export const sideKey = <S extends Side, F extends string>(
  side: S,
  field: F,
): `${S}_${F}` => `${side}_${field}`;

export function firstRound(category: CategoryId): Round {
  return CATEGORIES[category].rounds[0];
}

export function matchesPerRound(category: CategoryId, round: Round): number {
  if (round === "third" || round === "final") return 1;
  const { rounds, teamCount } = CATEGORIES[category];
  return teamCount / 2 ** (rounds.indexOf(round) + 1);
}

export function matchesOfRound(matches: Match[], round: Round): Match[] {
  return matches
    .filter((m) => m.round === round)
    .sort((a, b) => a.position - b.position);
}

interface Destination {
  round: Round;
  position: number;
  side: Side;
}

/** A dónde van el ganador y (solo en semifinales) el perdedor de un partido. */
export function advancement(match: Pick<Match, "category" | "round" | "position">): {
  winner: Destination;
  loser?: Destination;
} | null {
  if (match.round === "third" || match.round === "final") return null;
  const { rounds } = CATEGORIES[match.category];
  const nextRound = rounds[rounds.indexOf(match.round) + 1];
  const to = (round: Round): Destination => ({
    round,
    position: Math.floor(match.position / 2),
    side: match.position % 2 === 0 ? "home" : "away",
  });
  return {
    winner: to(nextRound),
    loser: nextRound === "final" ? to("third") : undefined,
  };
}

export function isTied(match: Pick<Match, "home_score" | "away_score">): boolean {
  return match.home_score === match.away_score;
}

/** Ganador según marcador; en empate decide la tanda de penales. `null` si no hay desempate. */
export function decideWinner(match: Match): string | null {
  const { home_team_id: home, away_team_id: away } = match;
  if (isTied(match)) {
    if (match.home_pens === match.away_pens) return null;
    return match.home_pens > match.away_pens ? home : away;
  }
  return match.home_score > match.away_score ? home : away;
}

export function indexTeams(teams: Team[]): Map<string, Team> {
  return new Map(teams.map((team) => [team.id, team]));
}
