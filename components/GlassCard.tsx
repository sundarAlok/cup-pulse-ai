"use client";
import React from "react";
import { motion } from "framer-motion";

type GlassCardProps = React.PropsWithChildren<{
  className?: string;
}>;

export default function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`glass glass-border-frost shadow-premium p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
