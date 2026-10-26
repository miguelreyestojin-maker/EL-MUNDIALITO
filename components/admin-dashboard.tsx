"use client";

import { useState } from "react";
import { MatchesPanel } from "@/components/admin/matches-panel";
import { TeamsPanel } from "@/components/admin/teams-panel";
import { VisorsPanel } from "@/components/admin/visors-panel";
import { CategoryTabs } from "@/components/category-tabs";
import { LoadingState } from "@/components/loading-state";
import { useTournament } from "@/hooks/use-tournament";
import { indexTeams } from "@/lib/tournament";
import type { CategoryId } from "@/lib/types";

export function AdminDashboard() {
  const [category, setCategory] = useState<CategoryId>("f1");
  const { tournament, error } = useTournament();

  if (!tournament) return <LoadingState error={error} />;

  const teams = tournament.teams.filter((t) => t.category === category);
  const matches = tournament.matches.filter((m) => m.category === category);

  return (
    <div className="space-y-6">
      <VisorsPanel visors={tournament.visors} />
      <CategoryTabs value={category} onChange={setCategory} />
      <div className="grid items-start gap-6 lg:grid-cols-[2fr_3fr]">
        <TeamsPanel category={category} teams={teams} matches={matches} />
        <MatchesPanel
          category={category}
          teams={teams}
          matches={matches}
          visors={tournament.visors}
          teamsById={indexTeams(teams)}
        />
      </div>
    </div>
  );
}
