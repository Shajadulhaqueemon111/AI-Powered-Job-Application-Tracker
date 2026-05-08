/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Bell,
  Briefcase,
  Calendar,
  CheckCircle2,
  Brain,
  X,
} from "lucide-react";
import { playNotificationSound } from "../../lib/sound";

/* ---------------- MOCK DATA ---------------- */

const initialNotifications = [
  {
    id: 1,
    type: "job",
    title: "New Job Posted",
    message: "Frontend Developer role at Google is now open",
    time: "Just now",
    read: false,
  },
  {
    id: 2,
    type: "interview",
    title: "Interview Scheduled",
    message: "Interview tomorrow at 10:00 AM",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "application",
    title: "Application Update",
    message: "You are shortlisted for React Developer role",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "ai",
    title: "AI Suggestion",
    message: "Improve resume with more real-world projects",
    time: "1 day ago",
    read: true,
  },
];

/* ---------------- PAGE ---------------- */

export default function NotificationsClient() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* ---------- MARK AS READ ---------- */
  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

    playNotificationSound(); // 🔊 SOUND
  };

  /* ---------- ADD NEW NOTIFICATION (REAL-LIFE SIMULATION) ---------- */
  const addFakeNotification = () => {
    const newNotif = {
      id: Date.now(),
      type: "job",
      title: "New Job Alert 🚀",
      message: "New Full Stack Developer job just posted",
      time: "Just now",
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    playNotificationSound(); // ✅ RIGHT PLACE
  };

  const clearAll = () => setNotifications([]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Bell className="text-blue-500" />
                Notifications
              </h1>
              <p className="text-sm text-zinc-500">
                Real-time career updates & alerts
              </p>
            </div>

            <Badge className="bg-blue-500/10 text-blue-500">
              {unreadCount} Unread
            </Badge>
          </div>
        </motion.div>

        {/* ACTIONS */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={addFakeNotification}>
            + Test Notification
          </Button>

          <Button variant="outline" onClick={clearAll}>
            Clear All
          </Button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {notifications.length === 0 && (
            <div className="text-center text-zinc-500 py-20">
              No notifications found
            </div>
          )}

          {notifications.map((n) => (
            <NotificationCard
              key={n.id}
              data={n}
              onRead={() => markAsRead(n.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- CARD ---------------- */

function NotificationCard({ data, onRead }: any) {
  const iconMap: any = {
    job: Briefcase,
    interview: Calendar,
    application: CheckCircle2,
    ai: Brain,
  };

  const Icon = iconMap[data.type] || Bell;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`rounded-2xl border p-5 transition-all
        ${
          data.read
            ? "bg-white/60 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800"
            : "bg-blue-500/5 border-blue-500/30"
        }`}
    >
      <div className="flex justify-between items-start gap-4">
        {/* LEFT */}
        <div className="flex gap-3">
          <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <Icon className="text-blue-500 w-5 h-5" />
          </div>

          <div>
            <h3 className="font-semibold">{data.title}</h3>
            <p className="text-sm text-zinc-500">{data.message}</p>
            <p className="text-xs text-zinc-400 mt-1">{data.time}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex gap-2">
          {!data.read && (
            <Button size="sm" onClick={onRead}>
              Mark read
            </Button>
          )}

          <button className="text-zinc-400 hover:text-red-500">
            <X size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
