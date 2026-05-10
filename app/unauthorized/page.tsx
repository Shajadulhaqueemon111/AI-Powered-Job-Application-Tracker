"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-red-500/10">
            <ShieldAlert size={50} className="text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>

        {/* Subtitle */}
        <p className="text-gray-400 mb-6">
          You don’t have permission to access this page. Please contact admin if
          you think this is a mistake.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition"
          >
            Go Home
          </Link>

          <Link
            href="/login"
            className="w-full py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
          >
            Login Again
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
