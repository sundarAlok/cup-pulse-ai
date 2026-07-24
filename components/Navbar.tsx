"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { name: "Home", href: "/" },
  { name: "Premium", href: "/premium" },
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

  const [user, setUser] = useState<User | null>(null);

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
    <header className="sticky top-4 z-50 px-4 md:px-4">
      <div
        className="
          mx-auto
          max-w-7xl
          rounded-4xl
          border
          border-white/20
          bg-white/75
          backdrop-blur-2xl
          shadow-[0_15px_60px_rgba(15,23,42,0.08)]
          ring-1
          ring-black/5
        "
      >
        <div className="flex h-17 items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center transition-transform duration-300 hover:scale-[1.02]"
          >
            <Image
              src="/horizontalTransparentLogo.png" 
              alt="CupPulse AI"
              width={200}
              height={72}
              priority
              className="h-12 w-auto object-contain rounded-xl"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-2 p-2">
            {links.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative
                    rounded-full
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    transition-all
                    duration-300
                    ${
                      active
                        ? "bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white shadow-lg"
                        : "text-slate-600 hover:bg-white hover:text-violet-600 hover:border-slate-900"
                    }
                  `}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="
                  rounded-full
                  bg-gradient-to-r
                  from-red-500
                  to-rose-600
                  px-6
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:shadow-lg
                "
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="
                    rounded-full
                    border
                    border-slate-300
                    bg-white/70
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-700
                    transition-all
                    hover:bg-white
                  "
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="
                    rounded-full
                    bg-gradient-to-r
                    from-cyan-500
                    via-blue-600
                    to-violet-600
                    px-6
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    transition-all
                    duration-300
                    hover:scale-105
                  "
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}