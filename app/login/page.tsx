"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, KeyRound, Fingerprint, ArrowRight } from "lucide-react";
import { signInWithEmail, signInWithGoogle } from "@/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretWords, setSecretWords] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInWithEmail(email, password);
      const user = result.user;

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email ?? email,
          username: user.displayName ?? email.split("@")[0],
          displayName: user.displayName ?? email.split("@")[0],
          photoURL: user.photoURL ?? "",
          secretWords,
        }),
      });

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        window.location.href = "/";
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      const user = result.user;

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email ?? "",
          username:
            user.displayName ?? user.email?.split("@")[0] ?? "Google User",
          displayName:
            user.displayName ?? user.email?.split("@")[0] ?? "Google User",
          photoURL: user.photoURL ?? "",
          secretWords: secretWords || "google sign in",
        }),
      });

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        window.location.href = "/";
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/worldcup-login-bg.png')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-950/40" />

      {/* Glow Effects */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[150px]" />
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[150px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen w-full items-center px-4 sm:px-6 lg:px-30">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left Side */}
          <div className="max-w-2xl text-center lg:text-left">
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              CupPulse AI
            </h1>

            <p className="mt-4 text-lg text-slate-200 sm:text-xl">
              World Cup Intelligence Platform
            </p>

            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Real-time football intelligence, AI-powered predictions, premium
              scouting insights, and fan rewards in one platform.
            </p>
          </div>

          {/* Right Side Login Card */}
          <div className="mt-10 flex justify-center lg:mt-14 lg:justify-end">
            <div
              className="
                w-full
                max-w-md
                rounded-[32px]
                border
                border-white/10
                bg-white/10
                px-6
                py-5
                backdrop-blur-2xl
                shadow-[0_25px_80px_rgba(0,0,0,0.35)]
                sm:px-8
                sm:py-7
              "
            >
              <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                <p className="mt-2 text-sm text-slate-300">
                  Sign in to access premium football intelligence
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="mb-2 pl-4 block text-sm font-medium text-slate-200">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="
                        w-full
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/10
                        py-2
                        pl-12
                        pr-4
                        text-white
                        placeholder:text-slate-400
                        outline-none
                        transition
                        focus:border-cyan-400
                        focus:bg-white/15
                      "
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 pl-4 block text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="
                        w-full
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/10
                        py-2
                        pl-12
                        pr-4
                        text-white
                        placeholder:text-slate-400
                        outline-none
                        transition
                        focus:border-cyan-400
                        focus:bg-white/15
                      "
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Secret Words */}
                <div>
                  <label className="mb-2 pl-4 block text-sm font-medium text-slate-200">
                    Security Phrase
                  </label>

                  <div className="relative">
                    <Fingerprint className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      placeholder="Enter your 3 secret words"
                      className="
                        w-full
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/10
                        py-2
                        pl-12
                        pr-4
                        text-white
                        placeholder:text-slate-400
                        outline-none
                        transition
                        focus:border-cyan-400
                        focus:bg-white/15
                      "
                      value={secretWords}
                      onChange={(e) => setSecretWords(e.target.value)}
                    />
                  </div>
                </div>

                {/* Buttons Row */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      group
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-3xl
                      bg-gradient-to-r
                      from-cyan-500
                      via-blue-600
                      to-violet-600
                      py-2.5
                      font-semibold
                      text-white
                      shadow-[0_10px_30px_rgba(59,130,246,0.35)]
                      transition-all
                      duration-300
                      hover:scale-[1.02]
                      disabled:cursor-not-allowed
                      disabled:opacity-70
                    "
                  >
                    {loading ? "Signing in..." : "Login"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="
                      flex
                      items-center
                      justify-center
                      rounded-3xl
                      border
                      border-white/20
                      bg-white/10
                      py-2.5
                      font-semibold
                      text-white
                      transition
                      hover:bg-white/20
                      disabled:cursor-not-allowed
                      disabled:opacity-70
                    "
                  >
                    With Google
                  </button>
                </div>
              </form>

              {/* Footer */}
              <div className="mt-4 border-t border-white/10 pt-4 text-center">
                <p className="text-sm text-slate-300">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}