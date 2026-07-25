"use client";

import React from "react";
import Link from "next/link";
import { Trophy, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden mb-20">
      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/worldcup-hero-light.png')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0" />

      {/* Extra Glow Effects */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[150px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full justify-start items-center px-18">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl text-left"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 backdrop-blur-xl mt-14">
            <Trophy className="h-4 w-4 text-violet-700" />
            <span className="text-sm font-medium text-violet-700">
              FIFA World Cup 2026 Intelligence Platform
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-5xl font-black leading-tight text-black md:text-5xl lg:text-6xl">
            The Future of
            <span className="grid lg:grid-cols-[1fr_1fr]">
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-700 to-violet-900 bg-clip-text text-transparent">
                World Cup
              </span>
              <span className="block bg-gradient-to-r from-purple-900 via-violet-700 to-violet-500 bg-clip-text text-transparent">
                Intelligence
              </span>
            </span>
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-500 md:text-base">
            AI-powered predictions, real-time match intelligence,
            tournament simulations, and fan rewards powered by
            Injective infrastructure.
          </p>

          {/* CTA Buttons */}
          <div className="mt-14 flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-gradient-to-r
                from-violet-600
                via-blue-600
                to-cyan-500
                px-8
                py-4
                text-white
                font-semibold
                shadow-[0_10px_40px_rgba(99,102,241,0.4)]
                transition-all
                duration-300
                hover:scale-105
              "
            >
              Explore Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/predictions"
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-black/10
                bg-white/80
                px-8
                py-4
                text-black
                font-semibold
                backdrop-blur-xl
                transition-all
                duration-300
                hover:bg-white/10
              "
            >
              AI Predictions
            </Link>
          </div>

          {/* Small Trust Metrics */}
          <div className="mt-10 flex flex-wrap gap-8 text-base">
            <div>
              <div className="text-3xl font-black text-black">48</div>
              <div className="text-slate-800">Teams</div>
            </div>

            <div>
              <div className="text-3xl font-black text-black">104</div>
              <div className="text-slate-800">Matches</div>
            </div>

            <div>
              <div className="text-3xl font-black text-black">2.4M+</div>
              <div className="text-slate-800">Predictions</div>
            </div>

            <div>
              <div className="text-3xl font-black text-black">98%</div>
              <div className="text-slate-800">Accuracy</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}