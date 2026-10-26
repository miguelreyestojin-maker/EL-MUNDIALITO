import { logout } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button className="rounded-full border border-black/15 px-4 py-1.5 text-sm text-ink/70 hover:bg-black/5">
        Cerrar sesión
      </button>
    </form>
  );
}
