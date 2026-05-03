"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full text-white border-b border-white/10 bg-gradient-to-r from-[#0f172a] via-[#1e1b4b] to-[#0f172a]">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
        >
          ApplyAI
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-sm">
          <Link className="hover:text-cyan-400 transition" href="/">
            Home
          </Link>
          <Link className="hover:text-purple-400 transition" href="/#features">
            Features
          </Link>
          <Link className="hover:text-pink-400 transition" href="/#pricing">
            Pricing
          </Link>
        </div>

        {/* Buttons */}
        <div className="hidden md:flex gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg border border-cyan-400 text-cyan-300 hover:bg-cyan-500/10 transition"
          >
            Login
          </Link>

          <Link
            href="/auth/register"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-cyan-500 font-semibold hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Button */}
        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden flex flex-col gap-3 p-4 border-t border-white/10 bg-[#0b1020]">
          <Link className="hover:text-cyan-400" href="/">
            Home
          </Link>
          <Link className="hover:text-purple-400" href="/#features">
            Features
          </Link>
          <Link className="hover:text-pink-400" href="/#pricing">
            Pricing
          </Link>

          <Link
            href="/login"
            className="mt-2 border border-cyan-400 text-cyan-300 px-3 py-2 rounded-lg text-center"
          >
            Login
          </Link>

          <Link
            href="/auth/register"
            className="bg-gradient-to-r from-pink-500 to-cyan-500 px-3 py-2 rounded-lg text-center font-semibold"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
