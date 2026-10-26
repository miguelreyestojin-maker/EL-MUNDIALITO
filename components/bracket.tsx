import { MatchCard } from "@/components/match-card";
import {
  DoodleBall,
  DoodleHeart,
  DoodleScribble,
  DoodleStar,
  DoodleWhistle,
  type DoodleProps,
} from "@/components/doodles";
import { CATEGORIES, matchesOfRound, matchesPerRound, ROUND_LABELS } from "@/lib/tournament";
import type { CategoryId, Match, Round, Team } from "@/lib/types";

/** Alto reservado por partido de la primera ronda; cada ronda siguiente lo duplica. */
const SLOT_HEIGHT_PX = 150;
/** Ancho de la columna de conectores entre dos rondas. */
const CONNECTOR_WIDTH_PX = 28;

interface BracketProps {
  category: CategoryId;
  matches: Match[];
  teamsById: Map<string, Team>;
}

/**
 * Llave de un lado del árbol. `mirrored` invierte el orden de las rondas y la
 * dirección de los conectores para que ambos lados converjan en el centro.
 */
function BracketHalf({
  rounds,
  matches,
  teamsById,
  slotCount,
  mirrored,
}: {
  rounds: readonly Round[];
  matches: Match[];
  teamsById: Map<string, Team>;
  slotCount: number;
  mirrored: boolean;
}) {
  const height = slotCount * SLOT_HEIGHT_PX;

  return (
    <div className={`flex min-w-0 flex-1 max-lg:flex-col ${mirrored ? "lg:flex-row-reverse" : ""}`}>
      {rounds.map((round, index) => (
        <div
          key={round}
          className={`flex min-w-0 flex-1 max-lg:flex-col ${mirrored ? "lg:flex-row-reverse" : ""}`}
        >
          {index > 0 && slotCount / 2 ** (index - 1) > 1 && (
            <Connectors count={slotCount / 2 ** index} height={height} mirrored={mirrored} />
          )}
          <section className="flex min-w-0 flex-1 flex-col gap-3">
            <h3 className="display text-center text-xl text-primary-blue">
              {ROUND_LABELS[round]}
            </h3>
            <div className="flex flex-col" style={{ height }}>
              {matchesOfRound(matches, round).map((match) => (
                <div key={match.id} className="flex flex-1 items-center">
                  <MatchCard match={match} teamsById={teamsById} />
                </div>
              ))}
            </div>
          </section>
        </div>
      ))}
    </div>
  );
}

/**
 * Une cada pareja de partidos con el partido de la ronda siguiente mediante una
 * horquilla. El trazo parte del centro de cada tarjeta y converge a la mitad.
 */
function Connectors({
  count,
  height,
  mirrored,
}: {
  count: number;
  height: number;
  mirrored: boolean;
}) {
  const span = height / count;
  const mid = CONNECTOR_WIDTH_PX / 2;

  return (
    <svg
      aria-hidden="true"
      width={CONNECTOR_WIDTH_PX}
      height={height}
      className="mt-10 shrink-0 text-primary-blue/50 max-lg:hidden"
    >
      {Array.from({ length: count }, (_, index) => {
        const top = span * index + span / 4;
        const bottom = span * index + (span * 3) / 4;
        const join = span * index + span / 2;
        const [from, to] = mirrored ? [CONNECTOR_WIDTH_PX, 0] : [0, CONNECTOR_WIDTH_PX];
        return (
          <path
            key={index}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinejoin="round"
            d={`M${from} ${top}H${mid}V${bottom}H${from}M${mid} ${join}H${to}`}
          />
        );
      })}
    </svg>
  );
}

/** Trofeo de trazo manual que corona la final. */
function DoodleTrophy({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 10h24v16a12 12 0 0 1-24 0Zm-8 2h8v8a8 8 0 0 1-8-8Zm40 0h-8v8a8 8 0 0 0 8-8ZM32 38v8M22 54h20M26 46h12v8H26Z"
      />
    </svg>
  );
}

export function Bracket({ category, matches, teamsById }: BracketProps) {
  const { rounds } = CATEGORIES[category];
  const sideRounds = rounds.slice(0, -1);
  const half = matchesPerRound(category, sideRounds[0]) / 2;

  /** Mitad superior (posiciones bajas) o inferior de cada ronda previa a la final. */
  const halfMatches = (lower: boolean) =>
    matches.filter((match) => {
      const index = sideRounds.indexOf(match.round);
      if (index === -1) return false;
      const perHalf = matchesPerRound(category, match.round) / 2;
      return lower ? match.position >= perHalf : match.position < perHalf;
    });

  return (
    <div className="relative pb-4">
      <DoodleStar className="pointer-events-none absolute top-1 left-2 h-9 w-9 -rotate-12 text-card-yellow" />
      <DoodleWhistle className="pointer-events-none absolute top-2 right-6 h-9 w-9 rotate-12 text-accent-coral/80" />
      <DoodleHeart className="pointer-events-none absolute bottom-2 left-10 h-8 w-8 rotate-6 text-accent-coral/70" />
      <DoodleBall className="pointer-events-none absolute right-8 bottom-1 h-9 w-9 -rotate-6 text-success-green/80" />

      <div className="flex items-stretch gap-2 px-6 pt-6 max-lg:flex-col max-lg:px-2">
        <BracketHalf
          rounds={sideRounds}
          matches={halfMatches(false)}
          teamsById={teamsById}
          slotCount={half}
          mirrored={false}
        />

        <div className="flex w-56 max-w-full shrink-0 flex-col items-center justify-between gap-3 self-stretch px-2 max-lg:w-full">
          <h3 className="display relative text-center text-xl text-primary-blue">
            <DoodleTrophy className="mx-auto mb-1 h-8 w-8 text-card-yellow" />
            {ROUND_LABELS.final}
            <DoodleScribble className="absolute -bottom-1 left-0 h-3 w-full text-accent-coral" />
          </h3>
          <div className="flex items-center" style={{ height: half * SLOT_HEIGHT_PX }}>
            {matchesOfRound(matches, "final").map((match) => (
              <MatchCard key={match.id} match={match} teamsById={teamsById} />
            ))}
          </div>
          <div className="flex flex-col items-center gap-2">
            <h3 className="display text-xl text-ink/60">{ROUND_LABELS.third}</h3>
            {matchesOfRound(matches, "third").map((match) => (
              <MatchCard key={match.id} match={match} teamsById={teamsById} />
            ))}
          </div>
        </div>

        <BracketHalf
          rounds={sideRounds}
          matches={halfMatches(true)}
          teamsById={teamsById}
          slotCount={half}
          mirrored
        />
      </div>
    </div>
  );
}
