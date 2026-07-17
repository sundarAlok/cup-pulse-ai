"use client";

import Link from "next/link";
import { Trophy } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Predictions", href: "/predictions" },
  { name: "Rewards", href: "/rewards" },
  { name: "Injective", href: "/injective" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-18 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <Trophy
              size={20}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="font-bold text-slate-900 text-lg">
              CupPulse AI
            </h1>

            <p className="text-xs text-slate-500">
              World Cup Intelligence
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}