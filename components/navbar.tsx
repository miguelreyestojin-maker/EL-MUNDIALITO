"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Público" },
  { href: "/cancha", label: "Cancha" },
  { href: "/admin", label: "Admin" },
] as const;

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="glass fixed inset-x-0 top-0 z-40 border-x-0 border-t-0">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="display text-2xl text-primary-neon">
          Torneo Relámpago
        </Link>
        <ul className="flex gap-1">
          {LINKS.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    active
                      ? "bg-primary-neon text-dark-pitch shadow-neon"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
