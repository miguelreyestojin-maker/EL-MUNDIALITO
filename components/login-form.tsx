"use client";

import { useActionState } from "react";
import { INPUT_CLASS, PRIMARY_BUTTON_CLASS } from "@/components/styles";
import type { ActionResult } from "@/lib/types";

interface LoginFormProps {
  title: string;
  userLabel: string;
  passwordLabel: string;
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
}

export function LoginForm({ title, userLabel, passwordLabel, action }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="glass mx-auto max-w-sm space-y-4 rounded-2xl p-6">
      <h1 className="display text-3xl text-primary-neon">{title}</h1>
      <label className="block space-y-1 text-sm">
        <span className="text-white/70">{userLabel}</span>
        <input name="user" required autoComplete="username" className={INPUT_CLASS} />
      </label>
      <label className="block space-y-1 text-sm">
        <span className="text-white/70">{passwordLabel}</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={INPUT_CLASS}
        />
      </label>
      {state.error && <p className="text-sm text-live-red">{state.error}</p>}
      <button disabled={pending} className={`${PRIMARY_BUTTON_CLASS} w-full`}>
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
