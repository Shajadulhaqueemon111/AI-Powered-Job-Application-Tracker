"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Notification = {
  id: number;
  title: string;
  time: string;
  isRead: boolean;
};

const notifications: Notification[] = [
  {
    id: 1,
    title: "New user registered",
    time: "2 min ago",
    isRead: false,
  },
  {
    id: 2,
    title: "Server backup completed",
    time: "10 min ago",
    isRead: true,
  },
  {
    id: 3,
    title: "New report submitted",
    time: "1 hour ago",
    isRead: false,
  },
];

export default function NotificationDropdown() {
  const [open, setOpen] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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

        {/* RED BADGE */}
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

          <div className="space-y-2 max-h-64 overflow-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-2 rounded-lg border flex items-start justify-between gap-2 ${
                  n.isRead ? "bg-muted/30" : "bg-primary/10"
                }`}
              >
                <div>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.time}</p>
                </div>

                <Badge
                  className={
                    n.isRead
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }
                >
                  {n.isRead ? "Read" : "Unread"}
                </Badge>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <Button variant="outline" className="w-full mt-3">
            Mark all as read
          </Button>
        </Card>
      )}
    </div>
  );
}
