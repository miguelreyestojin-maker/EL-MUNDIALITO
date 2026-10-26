import type { Match, Round, Side, Team } from "./types";

export interface RankingRow {
  team: Team;
  gf: number;
  gc: number;
  dg: number;
  yellow: number;
  red: number;
  /** Amarilla = 1, roja = 3. Menor es mejor. */
  fairPlay: number;
}

/** Instancia más lejana alcanzada; mayor es mejor. */
const ROUND_REACHED: Record<Round, number> = {
  round16: 1,
  quarter: 2,
  semi: 3,
  third: 4,
  final: 6,
};

/** Puntaje de posición una vez jugados el tercer lugar y la final. */
const PLACEMENT = {
  final: { win: 8, lose: 7 },
  third: { win: 5, lose: 4 },
} as const;

const SIDES: readonly Side[] = ["home", "away"];

function stageReached(teamId: string, matches: Match[]): number {
  let stage = 0;
  for (const m of matches) {
    if (m.home_team_id !== teamId && m.away_team_id !== teamId) continue;
    stage = Math.max(stage, ROUND_REACHED[m.round]);
    if (m.status === "completed" && (m.round === "final" || m.round === "third")) {
      const placement = PLACEMENT[m.round];
      stage = Math.max(stage, m.winner_id === teamId ? placement.win : placement.lose);
    }
  }
  return stage;
}

function statsOf(team: Team, matches: Match[]): RankingRow {
  const row: RankingRow = { team, gf: 0, gc: 0, dg: 0, yellow: 0, red: 0, fairPlay: 0 };
  for (const m of matches) {
    if (m.status === "scheduled") continue;
    for (const side of SIDES) {
      if (m[`${side}_team_id`] !== team.id) continue;
      const other: Side = side === "home" ? "away" : "home";
      row.gf += m[`${side}_score`];
      row.gc += m[`${other}_score`];
      row.yellow += m[`${side}_yellow`];
      row.red += m[`${side}_red`];
    }
  }
  row.dg = row.gf - row.gc;
  row.fairPlay = row.yellow + row.red * 3;
  return row;
}

/**
 * Orden: instancia alcanzada en el torneo y, a igualdad, DG → GF → Fair Play → GC.
 */
export function computeRanking(teams: Team[], matches: Match[]): RankingRow[] {
  return teams
    .map((team) => ({
      row: statsOf(team, matches),
      stage: stageReached(team.id, matches),
    }))
    .sort(
      (a, b) =>
        b.stage - a.stage ||
        b.row.dg - a.row.dg ||
        b.row.gf - a.row.gf ||
        a.row.fairPlay - b.row.fairPlay ||
        a.row.gc - b.row.gc,
    )
    .map(({ row }) => row);
}
