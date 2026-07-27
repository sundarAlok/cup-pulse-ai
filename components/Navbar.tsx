"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { IoExitOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import UserAvatar from "@/components/UserAvatar";

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
  photoURL?: string | null;
};

export default function Navbar() {
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) {
          return;
        }

        const text = await res.text();
        if (!text) {
          return;
        }

        const data = JSON.parse(text);
        if (data?.authenticated) {
          setUser(data.user);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadUser();
  }, []);

  async function handleLogout() {
    if (!confirmLogout) {
      setConfirmLogout(true);
      return;
    }

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
          overflow-visible
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
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    bg-gradient-to-br
                    from-cyan-500
                    via-blue-600
                    to-violet-600
                    text-white
                    transition-all
                    duration-300
                    hover:scale-110
                  "
                  title="Profile"
                >
                  {user?.photoURL ? (
                    <UserAvatar
                      src={user.photoURL}
                      alt={user.username || "Profile"}
                      className="h-full w-full object-cover"
                      fallbackClassName="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 text-white"
                      fallbackText={user.username || "P"}
                    />
                  ) : (
                    <CgProfile className="h-5 w-5" />
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-red-100
                    text-red-600
                    transition-all
                    duration-300
                    hover:scale-110
                  "
                  title="Logout"
                >
                  <IoExitOutline className="h-5 w-5" />
                </button>
              </div>
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

        {confirmLogout && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 px-4 mt-30">
            <div className="w-full max-w-sm rounded-[24px] border border-slate-200 bg-white p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-900">
                Are you sure you want to sign out?
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                This will end your current session.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="rounded-2xl border border-slate-300 px-4 py-2 font-medium text-slate-700"
                >
                  No
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-2xl bg-red-600 px-4 py-2 font-semibold text-white"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

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
                  {confirmLogout ? "Confirm logout" : "Logout"}
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