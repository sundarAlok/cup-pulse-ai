import type { Metadata } from "next";
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
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900 antialiased">
        {/* Global Background Effects */}
        <div className="fixed inset-0 -z-50 overflow-hidden">
          <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-3xl animate-pulse" />

          <div className="absolute top-40 right-0 h-[500px] w-[500px] rounded-full bg-violet-200/30 blur-3xl animate-pulse" />

          <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-cyan-200/20 blur-3xl" />
        </div>

        <Navbar />

        <main className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}