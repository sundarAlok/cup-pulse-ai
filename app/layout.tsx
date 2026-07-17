import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CupPulse AI",
  description:
    "Real-time World Cup insights, predictions, and fan rewards powered by Injective.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}