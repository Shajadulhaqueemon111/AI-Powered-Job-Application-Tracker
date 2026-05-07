import {
  LayoutDashboardIcon,
  FileTextIcon,
  SparklesIcon,
  BellIcon,
  Settings2Icon,
  ChartBarIcon,
} from "lucide-react";

export const userSidebar = {
  navMain: [
    {
      title: "Dashboard",
      url: "/user-dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "All Jobs",
      url: "/user-dashboard/jobs",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Applications",
      url: "/user-dashboard/applications",
      icon: <FileTextIcon />,
    },
    {
      title: "AI Matcher",
      url: "/user-dashboard/ai-matcher",
      icon: <SparklesIcon />,
    },
    { title: "Analytics", url: "/dashboard/analytics", icon: <ChartBarIcon /> },
    {
      title: "Notifications",
      url: "/user-dashboard/notifications",
      icon: <BellIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/user-dashboard/settings",
      icon: <Settings2Icon />,
    },
  ],
};
