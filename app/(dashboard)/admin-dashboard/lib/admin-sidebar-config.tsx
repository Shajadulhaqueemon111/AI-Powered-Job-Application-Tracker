"use client";

import {
  LayoutDashboardIcon,
  ListIcon,
  ChartBarIcon,
  FileTextIcon,
  Settings2Icon,
  CircleHelpIcon,
  DatabaseIcon,
} from "lucide-react";

// ADMIN
export const adminSidebar = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin-dashboard",
      icon: <LayoutDashboardIcon />,
    },
    { title: "Users", url: "/admin-dashboard/users", icon: <ListIcon /> },
    { title: "Jobs Monitor", url: "/admin-dashboard/jobs", icon: <ListIcon /> },
    {
      title: "Analytics",
      url: "/admin-dashboard/analytics",
      icon: <ChartBarIcon />,
    },
    {
      title: "Activity Logs",
      url: "/admin-dashboard/activity-logs",
      icon: <FileTextIcon />,
    },
    {
      title: "AI Usage",
      url: "/admin-dashboard/ai-usages",
      icon: <DatabaseIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin-dashboard/settings",
      icon: <Settings2Icon />,
    },
    { title: "Help", url: "/admin-dashboard/help", icon: <CircleHelpIcon /> },
  ],
};
