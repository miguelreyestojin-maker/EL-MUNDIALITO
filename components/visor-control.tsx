"use client";

import { useState } from "react";
import { adjustStat, finalizeMatch, startMatch } from "@/app/actions/match";
import { Modal } from "@/components/modal";
import { useAction } from "@/hooks/use-action";
import { decideWinner, isTied, sideKey } from "@/lib/tournament";
import type { Match, Side, StatField, Team } from "@/lib/types";

const SIDES: readonly Side[] = ["home", "away"];

interface CounterProps {
  label: string;
  value: number;
  className?: string;
  /** Color de la tarjeta (amarilla / roja) que acompaña a la etiqueta. */
  swatch?: string;
  disabled: boolean;
  onAdjust: (delta: 1 | -1) => void;
}

function Counter({ label, value, className, swatch, disabled, onAdjust }: CounterProps) {
  const buttonClass =
    "h-12 w-12 rounded-lg bg-black/5 text-2xl font-bold disabled:opacity-30 active:bg-black/15";
  return (
    <div className="flex items-center justify-between gap-1">
      <button
        aria-label={`Quitar ${label}`}
        disabled={disabled || value === 0}
        onClick={() => onAdjust(-1)}
        className={buttonClass}
      >
        −
      </button>
      <span className="text-center">
        <span className={`display block text-3xl leading-none tabular-nums ${className ?? ""}`}>
          {value}
        </span>
        <span className="flex items-center justify-center gap-1 text-[10px] text-ink/60 uppercase">
          {swatch && <span className={`h-2.5 w-2 rounded-[2px] ${swatch}`} />}
          {label}
        </span>
      </span>
      <button
        aria-label={`Agregar ${label}`}
        disabled={disabled}
        onClick={() => onAdjust(1)}
        className={buttonClass}
      >
        +
      </button>
    </div>
  );
}

interface VisorControlProps {
  match: Match;
  teamsById: Map<string, Team>;
}

export function VisorControl({ match, teamsById }: VisorControlProps) {
  const { run, pending, error } = useAction();
  const [confirming, setConfirming] = useState(false);
  const [penaltiesOpen, setPenaltiesOpen] = useState(false);

  const live = match.status === "in_progress";
  const tied = isTied(match);
  const showPenalties = live && tied && (penaltiesOpen || match.home_pens + match.away_pens > 0);
  const winnerId = decideWinner(match);
  const adjust = (side: Side, field: StatField) => (delta: 1 | -1) =>
    run(() => adjustStat(match.id, side, field, delta));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {SIDES.map((side) => {
          const teamId = match[sideKey(side, "team_id")];
          return (
            <section key={side} className="card space-y-3 rounded-2xl p-3">
              <h3 className="display truncate text-center text-xl">
                {(teamId && teamsById.get(teamId)?.name) ?? "Por definir"}
              </h3>
              <p className="display text-center text-[8rem] leading-none text-primary-blue tabular-nums">
                {match[sideKey(side, "score")]}
              </p>
              <button
                disabled={!live}
                onClick={() => adjust(side, "score")(1)}
                className="display h-16 w-full rounded-xl bg-accent-coral text-2xl text-white shadow-card disabled:opacity-30 active:brightness-90"
              >
                + GOL
              </button>
              <button
                disabled={!live || match[sideKey(side, "score")] === 0}
                onClick={() => adjust(side, "score")(-1)}
                className="h-10 w-full rounded-lg bg-black/5 text-sm disabled:opacity-30"
              >
                − Corregir gol
              </button>
              <Counter
                label="Amarillas"
                value={match[sideKey(side, "yellow")]}
                swatch="bg-card-yellow"
                disabled={!live}
                onAdjust={adjust(side, "yellow")}
              />
              <Counter
                label="Rojas"
                value={match[sideKey(side, "red")]}
                swatch="bg-accent-coral"
                disabled={!live}
                onAdjust={adjust(side, "red")}
              />
            </section>
          );
        })}
      </div>

      {live && tied && !showPenalties && (
        <button
          onClick={() => setPenaltiesOpen(true)}
          className="display h-14 w-full rounded-xl border-2 border-accent-coral text-xl text-accent-coral"
        >
          Activar tanda de penales
        </button>
      )}

      {showPenalties && (
        <section className="card space-y-3 rounded-2xl p-3">
          <h3 className="display text-center text-2xl text-primary-blue">Tanda de penales</h3>
          <div className="grid grid-cols-2 gap-3">
            {SIDES.map((side) => (
              <Counter
                key={side}
                label="Penales"
                value={match[sideKey(side, "pens")]}
                className="text-primary-blue"
                disabled={false}
                onAdjust={adjust(side, "pens")}
              />
            ))}
          </div>
        </section>
      )}

      {error && <p className="text-center text-sm text-accent-coral">{error}</p>}

      {match.status === "scheduled" && (
        <button
          disabled={pending}
          onClick={() => run(() => startMatch(match.id))}
          className="display h-16 w-full rounded-xl bg-success-green text-2xl text-white shadow-card disabled:opacity-50"
        >
          Iniciar partido
        </button>
      )}

      {live && (
        <button
          onClick={() => setConfirming(true)}
          className="display h-16 w-full rounded-xl bg-accent-coral text-2xl text-white shadow-card"
        >
          Finalizar partido
        </button>
      )}

      {match.status === "completed" && (
        <p className="text-center text-ink/60">Partido finalizado · datos bloqueados</p>
      )}

      {confirming && (
        <Modal title="¿Finalizar partido?" onClose={() => setConfirming(false)}>
          <p className="display text-center text-4xl tabular-nums">
            {match.home_score} – {match.away_score}
            {tied && (
              <span className="block text-xl text-ink/60">
                Penales {match.home_pens} – {match.away_pens}
              </span>
            )}
          </p>
          {!winnerId && (
            <p className="text-sm text-accent-coral">
              El marcador está empatado: registra el ganador en la tanda de penales.
            </p>
          )}
          <p className="text-sm text-ink/60">
            Los datos quedarán bloqueados y el ganador avanzará en la llave.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setConfirming(false)}
              className="h-12 rounded-lg bg-black/5 font-semibold"
            >
              Cancelar
            </button>
            <button
              disabled={!winnerId || pending}
              onClick={() =>
                run(() => finalizeMatch(match.id), () => setConfirming(false))
              }
              className="display h-12 rounded-lg bg-accent-coral text-xl text-white disabled:opacity-40"
            >
              Confirmar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
