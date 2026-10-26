"use client";

import { useState } from "react";
import { Bracket } from "@/components/bracket";
import { CategoryTabs } from "@/components/category-tabs";
import { LoadingState } from "@/components/loading-state";
import { RankingTable } from "@/components/ranking-table";
import { useTournament } from "@/hooks/use-tournament";
import { computeRanking } from "@/lib/ranking";
import { indexTeams } from "@/lib/tournament";
import type { CategoryId } from "@/lib/types";

export function PublicView() {
  const [category, setCategory] = useState<CategoryId>("f1");
  const { tournament, error } = useTournament();

  if (!tournament) return <LoadingState error={error} />;

  const teams = tournament.teams.filter((t) => t.category === category);
  const matches = tournament.matches.filter((m) => m.category === category);

  return (
    <div className="space-y-8">
      <CategoryTabs value={category} onChange={setCategory} />
      <section className="space-y-3">
        <h2 className="display text-3xl text-primary-neon">Llaves</h2>
        <Bracket category={category} matches={matches} teamsById={indexTeams(teams)} />
      </section>
      <section className="space-y-3">
        <h2 className="display text-3xl text-primary-neon">Posiciones</h2>
        <RankingTable rows={computeRanking(teams, matches)} />
      </section>
    </div>
  );
}
