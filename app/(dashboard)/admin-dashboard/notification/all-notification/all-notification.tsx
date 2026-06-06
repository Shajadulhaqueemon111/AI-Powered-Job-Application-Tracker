/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from "@/app/redux/features/notification/notification";

import { playNotificationSound } from "@/app/(dashboard)/user-dashboard/lib/sound";
import { useGetMeQuery } from "@/app/redux/features/auth/authApi";

export default function NotificationDropdown() {
  const [open, setOpen] = React.useState(false);
  const { data: getme } = useGetMeQuery();
  const userId = getme?.data?.user?._id;
  // GET notifications
  const { data, isLoading } = useGetNotificationsQuery(userId, {
    pollingInterval: 10000,
  });

  const notifications = (data?.data || []).filter(
    (notification: any) => !notification.read,
  );

  // MARK AS READ
  const [markAsRead] = useMarkAsReadMutation();

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  // refs for detecting new notifications
  const prevIdsRef = React.useRef<string[]>([]);
  const prevCountRef = React.useRef(0);

  // 🔊 SOUND EFFECT (FIXED)
  React.useEffect(() => {
    const currentIds = notifications.map((n: any) => n._id);

    const hasNewById = currentIds.length > prevIdsRef.current.length;

    const hasNewByCount = notifications.length > prevCountRef.current;

    if (hasNewById || hasNewByCount) {
      playNotificationSound(); // 🔊 PLAY SOUND
    }

    prevIdsRef.current = currentIds;
    prevCountRef.current = notifications.length;
  }, [notifications]);

  // mark single notification as read
  const handleRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative">
      {/* BELL BUTTON */}
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setOpen(!open)}
      >
        <Bell className="w-5 h-5" />

        {/* BADGE */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* DROPDOWN */}
      {open && (
        <Card className="absolute right-0 mt-2 w-80 p-3 shadow-lg z-50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Notifications</h2>
            <span className="text-xs text-muted-foreground">
              {unreadCount} unread
            </span>
          </div>

          {/* LOADING */}
          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading...</p>
          )}

          {/* LIST */}
          <div className="space-y-2 max-h-64 overflow-auto">
            {notifications.map((n: any) => (
              <div
                key={n._id}
                onClick={() => handleRead(n._id)}
                className={`p-2 rounded-lg border flex items-start justify-between gap-2 cursor-pointer ${
                  n.read ? "bg-muted/30" : "bg-primary/10"
                }`}
              >
                <div>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                <Badge
                  className={
                    n.read
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }
                >
                  {n.read ? "Read" : "Unread"}
                </Badge>
              </div>
            ))}
          </div>

          {/* MARK ALL */}
          <Button
            variant="outline"
            className="w-full mt-3"
            onClick={() => {
              notifications.forEach((n: any) => {
                if (!n.read) {
                  handleRead(n._id);
                }
              });
            }}
          >
            Mark all as read
          </Button>
        </Card>
      )}
    </div>
  );
}
