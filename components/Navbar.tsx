"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="fixed top-4 left-0 right-0 z-[100] px-4 md:px-6 lg:mx-13.5">
      <div
        className="
          mx-auto
          max-w-7xl
          rounded-full
          border
          border-white/20
          bg-white/80
          backdrop-blur-2xl
          ring-1
          ring-black/5
          overflow-hidden
        "
      >
        <div className="flex h-15 items-center justify-between px-5">
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
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 p-2">
            {links.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative
                    rounded-full
                    px-3.5
                    py-2
                    text-base
                    font-semibold
                    transition-all
                    duration-300
                    ${
                      active
                        ? "text-violet-700 after:absolute after:left-4 after:right-4 after:bottom-1 after:h-[3px] after:rounded-full after:bg-gradient-to-r after:from-violet-500 after:to-violet-700"
                        : "text-slate-600 hover:text-violet-600"
                    }
                  `}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-3">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden items-center justify-center rounded-xl p-2 text-slate-700"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/90 backdrop-blur-xl">
            <nav className="flex flex-col p-3">
              {links.map((link) => {
                const active = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      active
                        ? "bg-violet-50 text-violet-700"
                        : "text-slate-600 hover:bg-white hover:text-violet-600 hover:border-slate-900"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-col gap-2 p-3 pt-0">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="
                    rounded-xl
                    bg-gradient-to-r
                    from-red-500
                    to-rose-600
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-white
                  "
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="
                      rounded-xl
                      border
                      border-slate-300
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-semibold
                      text-slate-700
                    "
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="
                      rounded-xl
                      bg-gradient-to-r
                      from-cyan-500
                      via-blue-600
                      to-violet-600
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-semibold
                      text-white
                    "
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}