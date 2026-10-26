import { Suspense } from "react";
import { loginAdmin } from "@/app/actions/auth";
import { AdminDashboard } from "@/components/admin-dashboard";
import { LoginForm } from "@/components/login-form";
import { LogoutButton } from "@/components/logout-button";
import { getSession } from "@/lib/session";

export default function AdminPage() {
  return (
    <Suspense>
      <AdminGate />
    </Suspense>
  );
}

async function AdminGate() {
  const session = await getSession();
  if (session?.role !== "admin") {
    return (
      <LoginForm
        title="Administración"
        userLabel="Usuario"
        passwordLabel="Contraseña"
        action={loginAdmin}
      />
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="display text-4xl">Panel de administración</h1>
        <LogoutButton />
      </div>
      <AdminDashboard />
    </div>
  );
}
