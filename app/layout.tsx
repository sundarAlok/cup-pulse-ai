import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CupPulse AI",
  description:
    "Real-time World Cup insights, AI-powered predictions, fan rewards, and Injective integrations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col text-slate-900 antialiased">
        {/* Global Background Effects */}
        {/* <div className="fixed inset-0 -z-50 overflow-hidden">
          <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-3xl animate-pulse" />

          <div className="absolute top-40 right-0 h-[500px] w-[500px] rounded-full bg-violet-200/30 blur-3xl animate-pulse" />

          <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-cyan-200/20 blur-3xl" />
        </div> */}

        <Navbar />

        <main className="relative w-full flex-1">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-white px-6 py-8 text-slate-700 sm:px-12">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1 text-sm text-slate-600">
              <p>© {new Date().getFullYear()} CupPulse AI</p>
              <p className="text-xs text-slate-500">
                World Cup companion for predictions, rewards, and Injective insights.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
              <Link href="/" className="hover:text-slate-900">
                Home
              </Link>
              <Link href="/premium" className="hover:text-slate-900">
                Premium
              </Link>
              <Link href="/dashboard" className="hover:text-slate-900">
                Dashboard
              </Link>
              <Link href="/predictions" className="hover:text-slate-900">
                Predictions
              </Link>
              <Link href="/rewards" className="hover:text-slate-900">
                Rewards
              </Link>
              <Link href="/leaderboard" className="hover:text-slate-900">
                Leaderboard
              </Link>
              <Link href="/injective" className="hover:text-slate-900">
                Injective
              </Link>
              <Link href="/simulator" className="hover:text-slate-900">
                Simulator
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
              <Link href="/about" className="hover:text-slate-900">
                About
              </Link>
              <Link href="/privacy" className="hover:text-slate-900">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-slate-900">
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}