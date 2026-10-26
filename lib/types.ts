export type CategoryId = "f1" | "f2" | "f3";

export type Round = "round16" | "quarter" | "semi" | "third" | "final";

export type MatchStatus = "scheduled" | "in_progress" | "completed";

export type Side = "home" | "away";

export type StatField = "score" | "yellow" | "red" | "pens";

export interface Team {
  id: string;
  category: CategoryId;
  name: string;
}

export interface Visor {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  category: CategoryId;
  round: Round;
  position: number;
  home_team_id: string | null;
  away_team_id: string | null;
  home_score: number;
  away_score: number;
  home_yellow: number;
  away_yellow: number;
  home_red: number;
  away_red: number;
  home_pens: number;
  away_pens: number;
  status: MatchStatus;
  winner_id: string | null;
  court: string | null;
  visor_id: string | null;
}

export interface Tournament {
  teams: Team[];
  visors: Visor[];
  matches: Match[];
}

export type ActionResult = { error?: string };
