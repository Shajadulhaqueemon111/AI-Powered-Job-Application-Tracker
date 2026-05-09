/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

import { motion } from "framer-motion";

import { Briefcase, Users, CheckCircle2, Target } from "lucide-react";

/* ---------------- DATA ---------------- */

const myApplications = [
  { name: "Applied", value: 120 },
  { name: "Shortlisted", value: 70 },
  { name: "Interview", value: 40 },
  { name: "Offer", value: 12 },
  { name: "Rejected", value: 50 },
];

const monthlyProgress = [
  { month: "Jan", apps: 20 },
  { month: "Feb", apps: 35 },
  { month: "Mar", apps: 55 },
  { month: "Apr", apps: 80 },
  { month: "May", apps: 95 },
];

const COLORS = ["#3b82f6", "#22c55e", "#facc15", "#a855f7", "#ef4444"];

/* ---------------- PAGE ---------------- */

export default function MyCareerAnalyticsPage() {
  const applied = myApplications[0].value;
  const interview = myApplications[2].value;
  const offer = myApplications[3].value;

  const successRate = Math.round((offer / applied) * 100);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors">
      <div className="mx-auto max-w-7xl p-6 md:p-10 space-y-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 bg-clip-text text-transparent">
            My Career Analytics
          </h1>

          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 mt-2">
            Personal job journey insights — applications to offer tracking
          </p>
        </motion.div>

        {/* STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Applications" value={applied} icon={Briefcase} />
          <StatCard title="Interviews" value={interview} icon={Users} />
          <StatCard title="Offers" value={offer} icon={CheckCircle2} />
          <StatCard
            title="Success Rate"
            value={`${successRate}%`}
            icon={Target}
          />
        </div>

        {/* CHARTS */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* PIE */}
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle>Application Breakdown</CardTitle>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Total journey overview
              </p>
            </CardHeader>

            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={myApplications}
                    dataKey="value"
                    outerRadius={120}
                    label
                  >
                    {myApplications.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* BAR */}
          <Card className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle>Monthly Growth</CardTitle>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Your application activity trend
              </p>
            </CardHeader>

            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyProgress}>
                  <XAxis dataKey="month" stroke="#888" />
                  <Tooltip />
                  <Bar
                    dataKey="apps"
                    radius={[10, 10, 0, 0]}
                    fill="url(#grad)"
                  />
                  <defs>
                    <linearGradient id="grad">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* FUNNEL */}
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <CardHeader>
            <CardTitle>Career Funnel</CardTitle>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Application → Offer journey
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            <FunnelStep label="Applied" value={120} total={120} />
            <FunnelStep label="Shortlisted" value={70} total={120} />
            <FunnelStep label="Interview" value={40} total={120} />
            <FunnelStep label="Offer" value={12} total={120} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <motion.div whileHover={{ scale: 1.04 }}>
      <Card className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
        <CardContent className="p-5">
          <Icon className="text-blue-500 mb-2" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FunnelStep({ label, value, total }: any) {
  const percent = Math.round((value / total) * 100);

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-zinc-700 dark:text-zinc-300">{label}</span>
        <span className="text-zinc-500 dark:text-zinc-400">
          {value} / {total} ({percent}%)
        </span>
      </div>

      <Progress
        value={percent}
        className="h-3 bg-zinc-200 dark:bg-zinc-800 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:via-cyan-400 [&>div]:to-purple-500"
      />
    </div>
  );
}
