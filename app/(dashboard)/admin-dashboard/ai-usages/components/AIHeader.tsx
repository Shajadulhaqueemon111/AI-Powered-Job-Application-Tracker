"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function AIHeader() {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 shadow-lg">
      {/* glow background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 blur-2xl" />

      <div className="relative flex items-center justify-between">
        {/* Left content */}
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            🤖 AI Usage Monitor
          </h1>

          <p className="text-sm text-gray-300 mt-1">
            Track AI requests, cost, and system intelligence in real-time
          </p>
        </div>

        {/* Animated Robot Icon */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
        >
          <Bot className="w-10 h-10 text-cyan-300" />
        </motion.div>
      </div>

      {/* floating dots animation */}
      <motion.div
        className="absolute -bottom-6 right-10 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  );
}
