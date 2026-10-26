"use client";

import { useState } from "react";
import { addVisor, deleteVisor } from "@/app/actions/admin";
import { GHOST_BUTTON_CLASS, INPUT_CLASS, PRIMARY_BUTTON_CLASS } from "@/components/styles";
import { useAction } from "@/hooks/use-action";
import type { Visor } from "@/lib/types";

export function VisorsPanel({ visors }: { visors: Visor[] }) {
  const { run, pending, error } = useAction();
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");

  return (
    <section className="glass space-y-4 rounded-2xl p-4">
      <h2 className="display text-2xl text-primary-neon">Visores de cancha</h2>
      <form
        className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          run(
            () => addVisor(name, pin),
            () => {
              setName("");
              setPin("");
            },
          );
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          autoComplete="off"
          className={INPUT_CLASS}
        />
        <input
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="PIN"
          autoComplete="off"
          className={INPUT_CLASS}
        />
        <button disabled={pending} className={PRIMARY_BUTTON_CLASS}>
          Agregar
        </button>
      </form>
      {error && <p className="text-sm text-live-red">{error}</p>}
      <ul className="divide-y divide-border-glass">
        {visors.map((visor) => (
          <li key={visor.id} className="flex items-center justify-between py-2">
            <span className="font-semibold">{visor.name}</span>
            <button
              className={`${GHOST_BUTTON_CLASS} text-live-red`}
              disabled={pending}
              onClick={() => run(() => deleteVisor(visor.id))}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
