/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Bell, Briefcase, Calendar, CheckCircle2, Brain } from "lucide-react";

import { useState } from "react";
import { useGetNotificationsQuery } from "@/app/redux/features/notification/notification";

/* ---------------- PAGE ---------------- */

export default function HrNotificationsClient() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetNotificationsQuery(
    { page, limit },
    {
      pollingInterval: 10000,
    },
  );

  const notifications = data?.data || [];

  // 🔥 ONLY READ (UNREAD HIDDEN COMPLETELY)
  const readNotifications = notifications.filter((n: any) => n.read === true);

  // 🔥 SPLIT GLOBAL / PRIVATE
  const globalNotifications = readNotifications.filter(
    (n: any) => n.userId === null,
  );

  const privateNotifications = readNotifications.filter(
    (n: any) => n.userId !== null,
  );

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Bell className="text-blue-500" />
                Notifications
              </h1>

              <p className="text-sm text-zinc-500">
                Only read notifications are shown
              </p>
            </div>

            <Badge className="bg-blue-500/10 text-blue-500">
              {unreadCount} Unread (Hidden)
            </Badge>
          </div>
        </motion.div>

        {/* GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section title="🌍 Global Notifications" data={globalNotifications} />

          <Section
            title="🔒 Private Notifications"
            data={privateNotifications}
          />
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-3 pt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          <Button variant="outline">{page}</Button>

          <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SECTION ---------------- */

function Section({ title, data }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
        {title}
      </h2>

      {data.length === 0 ? (
        <p className="text-sm text-zinc-500">No read notifications</p>
      ) : (
        <div className="space-y-3">
          {data.map((n: any) => (
            <NotificationCard key={n._id} data={n} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- CARD ---------------- */

function NotificationCard({ data }: any) {
  const iconMap: any = {
    NEW_JOB: Briefcase,
    INTERVIEW: Calendar,
    APPLICATION_UPDATE: CheckCircle2,
    AI_SUGGESTION: Brain,
    SYSTEM: Bell,
  };

  const Icon = iconMap[data.type] || Bell;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="rounded-2xl border p-4 bg-white/60 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800"
    >
      <div className="flex items-start gap-3">
        {/* ICON */}
        <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <Icon className="text-blue-500 w-5 h-5" />
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <h3 className="font-semibold">{data.title}</h3>
          <p className="text-sm text-zinc-500">{data.message}</p>
          <p className="text-xs text-zinc-400 mt-1">
            {new Date(data.createdAt).toLocaleString()}
          </p>
        </div>

        {/* BADGE */}
        <Badge className="bg-green-500/20 text-green-500">Read</Badge>
      </div>
    </motion.div>
  );
}
