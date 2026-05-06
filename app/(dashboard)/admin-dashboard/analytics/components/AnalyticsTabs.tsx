"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import RolesChart from "./RolesChart";
import SkillsCloud from "./SkillsCloud";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const chartData = [
  { name: "Mon", applications: 120 },
  { name: "Tue", applications: 210 },
  { name: "Wed", applications: 180 },
  { name: "Thu", applications: 260 },
  { name: "Fri", applications: 300 },
  { name: "Sat", applications: 240 },
  { name: "Sun", applications: 320 },
];

export default function AnalyticsTabs() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="roles">Roles</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
      </TabsList>

      {/* 🔥 OVERVIEW */}
      <TabsContent value="overview">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>📈 Applications Growth</CardTitle>
          </CardHeader>

          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>

      {/* 🔥 ROLES */}
      <TabsContent value="roles">
        <Card>
          <CardHeader>
            <CardTitle>Top Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <RolesChart />
          </CardContent>
        </Card>
      </TabsContent>

      {/* 🔥 SKILLS */}
      <TabsContent value="skills">
        <Card>
          <CardHeader>
            <CardTitle>Top Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillsCloud />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
