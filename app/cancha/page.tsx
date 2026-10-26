import { Suspense } from "react";
import { loginVisor } from "@/app/actions/auth";
import { LoginForm } from "@/components/login-form";
import { LogoutButton } from "@/components/logout-button";
import { VisorPanel } from "@/components/visor-panel";
import { getSession } from "@/lib/session";

export default function CanchaPage() {
  return (
    <Suspense>
      <VisorGate />
    </Suspense>
  );
}

async function VisorGate() {
  const session = await getSession();
  if (!session) {
    return (
      <LoginForm
        title="Visor de cancha"
        userLabel="Nombre de visor"
        passwordLabel="PIN"
        action={loginVisor}
      />
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="display text-4xl">Cancha</h1>
        <LogoutButton />
      </div>
      <VisorPanel visorId={session.role === "visor" ? session.visorId : null} />
    </div>
  );
}
