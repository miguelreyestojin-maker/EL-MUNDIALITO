import { logout } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button className="rounded-full border border-border-glass px-4 py-1.5 text-sm text-white/70 hover:bg-white/10">
        Cerrar sesión
      </button>
    </form>
  );
}
