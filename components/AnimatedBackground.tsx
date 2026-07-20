"use client";
import React from "react";

export default function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute left-[-10%] top-[-20%] h-[520px] w-[520px] rounded-full bg-gradient-to-br from-[rgba(124,58,237,0.28)] to-[rgba(0,212,255,0.18)] bg-animate-blob blur-3xl opacity-80" />
      <div className="absolute right-[-5%] bottom-[-15%] h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-[rgba(0,212,255,0.12)] to-[rgba(124,58,237,0.12)] bg-animate-blob blur-3xl opacity-70" />
      <svg className="absolute inset-0 h-full w-full mix-blend-overlay opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="grain"><feTurbulence baseFrequency="0.8" numOctaves="1" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}
