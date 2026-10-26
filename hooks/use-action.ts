"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/lib/types";

/** Ejecuta una server action mostrando estado pendiente y el error devuelto. */
export function useAction() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (action: () => Promise<ActionResult>, onSuccess?: () => void) =>
    startTransition(async () => {
      try {
        const result = await action();
        setError(result.error ?? null);
        if (!result.error) onSuccess?.();
      } catch {
        setError("No se pudo completar la acción");
      }
    });

  return { run, pending, error };
}
