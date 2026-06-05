/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Briefcase,
  Users,
  CheckCircle2,
  Target,
  ChevronRight,
} from "lucide-react";
import { useGetMyApplicationsQuery } from "@/app/redux/features/application/application-api";
import { useGetMeQuery } from "@/app/redux/features/auth/authApi";
import MyCareerAnalyticsSkeleton from "./skeliton";

/* ─── PALETTE ─── */
const STATUS_PALETTE = [
  { key: "pending", label: "Pending", color: "#4f7ef8" },
  { key: "in_review", label: "In Review", color: "#8b5cf6" },
  { key: "shortlisted", label: "Shortlisted", color: "#06b6d4" },
  { key: "interviewed", label: "Interviewed", color: "#f59e0b" },
  { key: "offered", label: "Offered", color: "#10b981" },
  { key: "rejected", label: "Rejected", color: "#ef4444" },
];

/* ─── PAGE ─── */
export default function MyCareerAnalyticsPage() {
  const { data: getme } = useGetMeQuery();
  const userId = getme?.data?.user?._id;
  const { data, isLoading } = useGetMyApplicationsQuery(userId, {
    skip: !userId,
  });

  const applications: any[] = data?.data || [];

  /* STATUS COUNT */
  const statusCount = React.useMemo(
    () =>
      applications.reduce(
        (acc: any, app: any) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          acc.total += 1;
          return acc;
        },
        {
          pending: 0,
          in_review: 0,
          shortlisted: 0,
          interviewed: 0,
          offered: 0,
          rejected: 0,
          total: 0,
        },
      ),
    [applications],
  );

  /* KPI */
  const applied = statusCount.total;
  const interview = statusCount.interviewed + statusCount.shortlisted;
  const offer = statusCount.offered;
  const successRate = applied > 0 ? Math.round((offer / applied) * 100) : 0;

  /* PIE DATA */
  const pieData = STATUS_PALETTE.map((s) => ({
    name: s.label,
    value: statusCount[s.key],
    color: s.color,
  }));

  /* MONTHLY DATA */
  const monthlyData = React.useMemo(() => {
    const map: Record<string, number> = {};
    applications.forEach((app: any) => {
      const month = new Date(app.createdAt).toLocaleString("en-US", {
        month: "short",
      });
      map[month] = (map[month] || 0) + 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, count }));
  }, [applications]);

  /* FUNNEL STEPS */
  const funnelSteps = [
    { label: "Applied", value: applied, color: "#4f7ef8" },
    { label: "Shortlisted", value: statusCount.shortlisted, color: "#8b5cf6" },
    { label: "Interviewed", value: statusCount.interviewed, color: "#06b6d4" },
    { label: "Offered", value: offer, color: "#10b981" },
  ];

  if (isLoading) {
    return <MyCareerAnalyticsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* <p className="text-[11px] font-semibold tracking-widest uppercase text-zinc-400 mb-1">
            
          </p> */}
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            My Career <span className="text-blue-500">Analytics</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Real-time insights from your job applications
          </p>
        </motion.div>

        {/* ── KPI CARDS ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <KpiCard
            title="Applications"
            value={applied}
            accent="#4f7ef8"
            icon={<Briefcase size={18} />}
            sub="total submitted"
          />
          <KpiCard
            title="Interviews"
            value={interview}
            accent="#8b5cf6"
            icon={<Users size={18} />}
            sub="shortlisted + interviewed"
          />
          <KpiCard
            title="Offers"
            value={offer}
            accent="#10b981"
            icon={<CheckCircle2 size={18} />}
            sub="received so far"
          />
          <KpiCard
            title="Success Rate"
            value={`${successRate}%`}
            accent="#f59e0b"
            icon={<Target size={18} />}
            sub="offers / applications"
          />
        </motion.div>

        {/* ── CHARTS ROW ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="grid lg:grid-cols-2 gap-4"
        >
          {/* PIE */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <CardHeader title="Application breakdown" badge="STATUS" />
            <div className="p-5">
              {/* legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
                {pieData.map((d) => (
                  <span
                    key={d.name}
                    className="flex items-center gap-1.5 text-[11px] text-zinc-500"
                  >
                    <span
                      className="w-2 h-2 rounded-[2px] flex-shrink-0"
                      style={{ background: d.color }}
                    />
                    {d.name} {d.value}
                  </span>
                ))}
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={2}
                    >
                      {pieData.map((d, i) => (
                        <Cell key={i} fill={d.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--tooltip-bg, #fff)",
                        border: "0.5px solid #e4e4e7",
                        borderRadius: 10,
                        fontSize: 12,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* BAR */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <CardHeader title="Monthly growth" badge="TREND" />
            <div className="p-5">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} barSize={20}>
                    <CartesianGrid
                      vertical={false}
                      stroke="#f0f0f0"
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#888" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#888" }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "0.5px solid #e4e4e7",
                        borderRadius: 10,
                        fontSize: 12,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      name="Applications"
                      fill="#4f7ef8"
                      fillOpacity={0.15}
                      stroke="#4f7ef8"
                      strokeWidth={1.5}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* status mini-bars */}
              <div className="mt-4 space-y-2">
                {STATUS_PALETTE.map((s) => {
                  const max = Math.max(
                    ...STATUS_PALETTE.map((x) => statusCount[x.key]),
                    1,
                  );
                  const pct = Math.round((statusCount[s.key] / max) * 100);
                  return (
                    <div key={s.key} className="flex items-center gap-3">
                      <span
                        className="text-[11px] text-zinc-400 w-18 flex-shrink-0"
                        style={{ width: 72 }}
                      >
                        {s.label}
                      </span>
                      <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: s.color }}
                        />
                      </div>
                      <span className="text-[11px] font-medium tabular-nums text-zinc-600 dark:text-zinc-300 w-4 text-right">
                        {statusCount[s.key]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── FUNNEL ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden"
        >
          <CardHeader title="Career funnel" badge="PIPELINE" />
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-100 dark:divide-zinc-800">
            {funnelSteps.map((step, i) => {
              const pct =
                applied > 0 ? Math.round((step.value / applied) * 100) : 0;
              return (
                <div key={step.label} className="p-5 relative">
                  <p
                    className="text-[11px] font-semibold tracking-widest uppercase mb-2"
                    style={{ color: step.color }}
                  >
                    {step.label}
                  </p>
                  <p className="text-3xl font-semibold tabular-nums text-zinc-900 dark:text-white mb-3">
                    {step.value}
                  </p>
                  <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: step.color }}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1.5 tabular-nums">
                    {pct}% of total
                  </p>
                  {i < funnelSteps.length - 1 && (
                    <span className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-5 h-5 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <ChevronRight size={11} className="text-zinc-400" />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── KPI CARD ─── */
function KpiCard({
  title,
  value,
  accent,
  icon,
  sub,
}: {
  title: string;
  value: string | number;
  accent: string;
  icon: React.ReactNode;
  sub: string;
}) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
          style={{ background: accent }}
        />
        <div className="mb-3" style={{ color: accent }}>
          {icon}
        </div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-zinc-400 mb-1">
          {title}
        </p>
        <p className="text-3xl font-semibold tabular-nums text-zinc-900 dark:text-white">
          {value}
        </p>
        <p className="text-[11px] text-zinc-400 mt-1">{sub}</p>
      </div>
    </motion.div>
  );
}

/* ─── CARD HEADER ─── */
function CardHeader({ title, badge }: { title: string; badge: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800">
      <h2 className="text-[13px] font-semibold text-zinc-900 dark:text-white">
        {title}
      </h2>
      <span className="text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
        {badge}
      </span>
    </div>
  );
}
