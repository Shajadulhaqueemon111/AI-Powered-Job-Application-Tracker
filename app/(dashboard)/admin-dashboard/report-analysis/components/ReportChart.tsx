/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

type FilterType = "7d" | "15d" | "1m";

const allData = [
  { name: "Mon", reports: 12 },
  { name: "Tue", reports: 20 },
  { name: "Wed", reports: 18 },
  { name: "Thu", reports: 25 },
  { name: "Fri", reports: 30 },
  { name: "Sat", reports: 22 },
  { name: "Sun", reports: 28 },
  { name: "Week2", reports: 35 },
  { name: "Week3", reports: 40 },
  { name: "Week4", reports: 50 },
];

const colors = ["#f87171", "#fb7185", "#f43f5e", "#ef4444", "#dc2626"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-background border rounded-lg p-2 shadow-md text-sm">
      <p className="font-medium">{label}</p>
      <p className="text-red-500">
        Reports: <span className="font-semibold">{payload[0].value}</span>
      </p>
    </div>
  );
};

export default function ReportChart() {
  const [filter, setFilter] = useState<FilterType>("7d");

  // 📊 Filter Logic
  const filteredData = useMemo(() => {
    if (filter === "7d") return allData.slice(0, 7);
    if (filter === "15d") return allData.slice(0, 9);
    return allData; // 1m
  }, [filter]);

  return (
    <div className="bg-card border rounded-2xl p-5 shadow-sm">
      {/* Header + Filters */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-lg">Reports Trend</h2>
          <span className="text-xs text-muted-foreground">
            Analytics overview
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {(["7d", "15d", "1m"] as FilterType[]).map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-3 py-1 text-xs rounded-md border transition ${
                filter === item
                  ? "bg-red-500 text-white border-red-500"
                  : "hover:bg-muted"
              }`}
            >
              {item === "7d"
                ? "7 Days"
                : item === "15d"
                  ? "15 Days"
                  : "1 Month"}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData} barSize={40}>
            <defs>
              <linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="reports"
              radius={[10, 10, 0, 0]}
              fill="url(#barColor)"
              animationDuration={800}
            >
              {filteredData.map((_, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
