import { MatchCard } from "@/components/match-card";
import { CATEGORIES, matchesOfRound, matchesPerRound, ROUND_LABELS } from "@/lib/tournament";
import type { CategoryId, Match, Round, Team } from "@/lib/types";

/** Alto reservado por partido de la primera ronda; las siguientes rondas lo duplican. */
const SLOT_HEIGHT_PX = 150;

interface BracketProps {
  category: CategoryId;
  matches: Match[];
  teamsById: Map<string, Team>;
}

export function Bracket({ category, matches, teamsById }: BracketProps) {
  const { rounds } = CATEGORIES[category];
  const height = matchesPerRound(category, rounds[0]) * SLOT_HEIGHT_PX;

  const cardsOf = (round: Round) =>
    matchesOfRound(matches, round).map((match) => (
      <MatchCard key={match.id} match={match} teamsById={teamsById} />
    ));

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex w-max gap-8">
        {rounds.map((round) => (
          <section key={round} className="flex flex-col gap-3">
            <h3 className="display text-center text-xl text-white/80">{ROUND_LABELS[round]}</h3>
            {round === "final" ? (
              <div className="flex flex-col items-center justify-center gap-10" style={{ height }}>
                {cardsOf("final")}
                <div className="flex flex-col items-center gap-2">
                  <h3 className="display text-xl text-white/80">{ROUND_LABELS.third}</h3>
                  {cardsOf("third")}
                </div>
              </div>
            ) : (
              <div className="flex flex-col" style={{ height }}>
                {matchesOfRound(matches, round).map((match) => (
                  <div key={match.id} className="flex flex-1 items-center">
                    <MatchCard match={match} teamsById={teamsById} />
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
