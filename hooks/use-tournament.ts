"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Match, Team, Tournament, Visor } from "@/lib/types";

const TABLES = ["teams", "visors", "matches"] as const;

async function fetchTournament(): Promise<Tournament> {
  const [teams, visors, matches] = await Promise.all([
    supabase.from("teams").select("*").order("name").overrideTypes<Team[]>(),
    supabase.from("visors").select("*").order("name").overrideTypes<Visor[]>(),
    supabase.from("matches").select("*").overrideTypes<Match[]>(),
  ]);
  const error = teams.error ?? visors.error ?? matches.error;
  if (error) throw error;
  return { teams: teams.data!, visors: visors.data!, matches: matches.data! };
}

/** Estado del torneo sincronizado en tiempo real (se recarga ante cualquier cambio). */
export function useTournament(): { tournament: Tournament | null; error: string | null } {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const refresh = () =>
      fetchTournament().then(
        (data) => {
          if (!active) return;
          setTournament(data);
          setError(null);
        },
        (e: Error) => active && setError(e.message),
      );

    refresh();
    const channel = TABLES.reduce(
      (ch, table) => ch.on("postgres_changes", { event: "*", schema: "public", table }, refresh),
      supabase.channel("tournament"),
    ).subscribe((status) => {
      // Recupera cambios ocurridos entre la carga inicial y la suscripción.
      if (status === "SUBSCRIBED") refresh();
    });

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { tournament, error };
}
