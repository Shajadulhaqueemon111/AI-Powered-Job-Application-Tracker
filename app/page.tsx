"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070A12] text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-pink-500/20 blur-[120px] -top-40 -left-40" />
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] -bottom-40 -right-40" />
      </div>

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        {/* Badge */}
        <div className="px-4 py-1 rounded-full border border-white/10 bg-white/5 text-sm text-cyan-300 mb-6">
          ⚡ AI Powered Job Tracker
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Track Jobs Smarter <br />
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Get Hired Faster
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-white/60 max-w-xl text-sm md:text-base">
          One dashboard for all your job applications. AI helps you match,
          track, and improve your chances instantly.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          <Link
            href="/auth/register"
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:opacity-90 transition"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="px-6 py-3 rounded-xl border border-white/15 hover:border-cyan-400/50 transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-5">
        {[
          {
            title: "AI Resume Match",
            desc: "Instant AI scoring for job fit.",
            color: "from-pink-500 to-purple-500",
          },
          {
            title: "Smart Tracking",
            desc: "Track all applications in one place.",
            color: "from-cyan-500 to-blue-500",
          },
          {
            title: "Job Insights",
            desc: "Analytics to improve success rate.",
            color: "from-purple-500 to-indigo-500",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition"
          >
            <div
              className={`w-10 h-10 rounded-lg mb-3 bg-gradient-to-r ${item.color}`}
            />
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-white/60 mt-1">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="text-center text-white/40 text-sm pb-10">
        © {new Date().getFullYear()} ApplyAI — Built for developers
      </footer>
    </main>
  );
}
