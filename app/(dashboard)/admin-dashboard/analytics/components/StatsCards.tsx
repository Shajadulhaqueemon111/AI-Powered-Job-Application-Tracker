/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { statsData } from "../data/analytics.data";
import { Users, Briefcase, TrendingUp, Bot } from "lucide-react";

const iconMap: Record<string, any> = {
  "Total Applications": Briefcase,
  "Success Rate": TrendingUp,
  "Active Users": Users,
  "AI Usage": Bot,
};

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {statsData.map((item, i) => {
        const Icon = iconMap[item.title];

        return (
          <Card
            key={i}
            className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white hover:scale-[1.02] transition-all duration-300"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-blue-500 to-purple-500 blur-2xl" />

            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-gray-300">
                {item.title}
              </CardTitle>

              {Icon && (
                <div className="p-2 rounded-lg bg-white/10 animate-pulse">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              )}
            </CardHeader>

            <CardContent className="relative">
              <div className="text-3xl font-bold">{item.value}</div>

              <Badge className="mt-3 bg-green-500/20 text-green-300 border border-green-400/30">
                {item.change}
              </Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
