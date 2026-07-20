"use client";

import Link from "next/link";
import { Trophy } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Predictions", href: "/predictions" },
  { name: "Rewards", href: "/rewards" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Injective", href: "/injective" },
];

type User = {
  id: number;
  username: string;
  points: number;
};

export default function Navbar() {
  const pathname = usePathname();

  const [user, setUser] =
    useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/me");

        const data = await res.json();

        if (data.authenticated) {
          setUser(data.user);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadUser();
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 shadow-lg">
            <Trophy
              size={20}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="text-lg font-extrabold text-slate-900">
              CupPulse AI
            </h1>

            <p className="text-xs text-slate-500">
              World Cup Intelligence
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {links.map((link) => {
            const active =
              pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>


              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}