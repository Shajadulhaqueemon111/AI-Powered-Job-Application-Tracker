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
  const itemsPerPage = 8;

  const { data, isLoading } = useGetNotificationsQuery(
    { page: 1, limit: 100 },
    {
      pollingInterval: 10000,
    },
  );

  const notifications = data?.data || [];

  const readNotifications = notifications.filter((n: any) => n.read === true);

  const totalItems = readNotifications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReadNotifications = readNotifications.slice(
    startIndex,
    endIndex,
  );

  const globalNotifications = paginatedReadNotifications.filter(
    (n: any) => n.userId === null,
  );

  const privateNotifications = paginatedReadNotifications.filter(
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

            {isLoading ? (
              // Header Badge Skeleton
              <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-full" />
            ) : (
              <Badge className="bg-blue-500/10 text-blue-500">
                {unreadCount} Unread (Hidden)
              </Badge>
            )}
          </div>
        </motion.div>

        {/* GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              <SectionSkeleton title="🌍 Global Notifications" />
              <SectionSkeleton title="🔒 Private Notifications" />
            </>
          ) : (
            <>
              <Section
                title="🌍 Global Notifications"
                data={globalNotifications}
              />
              <Section
                title="🔒 Private Notifications"
                data={privateNotifications}
              />
            </>
          )}
        </div>

        {/* PAGINATION SECTION */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 pt-6">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Prev
            </Button>

            <span className="text-sm text-zinc-500 px-2">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        )}
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
        <p className="text-sm text-zinc-500">
          No read notifications on this page
        </p>
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

/* ---------------- SKELETON COMPONENTS (SAME TO SAME) ---------------- */

function SectionSkeleton({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
        {title}
      </h2>
      <div className="space-y-3">
        {/* লুপ চালিয়ে ৪টি স্কেলিটন কার্ড জেনারেট করা হচ্ছে */}
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border p-4 bg-white/60 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 animate-pulse">
      <div className="flex items-start gap-3">
        {/* ICON SKELETON */}
        <div className="p-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 w-9 h-9 shrink-0" />

        {/* CONTENT SKELETON */}
        <div className="flex-1 space-y-2 mt-1">
          {/* Title Line */}
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
          {/* Message Line */}
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
          {/* Date Line */}
          <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800/60 rounded w-1/4 mt-2" />
        </div>

        {/* BADGE SKELETON */}
        <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full w-12 shrink-0" />
      </div>
    </div>
  );
}
