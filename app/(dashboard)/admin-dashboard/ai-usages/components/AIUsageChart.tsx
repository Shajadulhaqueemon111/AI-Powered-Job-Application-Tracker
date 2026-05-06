"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const chartData = [
  { day: "Mon", usage: 1200 },
  { day: "Tue", usage: 1900 },
  { day: "Wed", usage: 1400 },
  { day: "Thu", usage: 2200 },
  { day: "Fri", usage: 3000 },
  { day: "Sat", usage: 2500 },
  { day: "Sun", usage: 3200 },
];

export default function AIUsageChart() {
  return (
    <div className="bg-card rounded-xl p-4 border shadow-sm">
      <h2 className="font-semibold mb-4">AI Requests Over Time</h2>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="usage"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
