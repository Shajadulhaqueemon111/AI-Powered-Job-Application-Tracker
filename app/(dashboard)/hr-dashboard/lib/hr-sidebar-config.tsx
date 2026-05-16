import {
  LayoutDashboardIcon,
  BriefcaseIcon,
  UsersIcon,
  FileTextIcon,
  SparklesIcon,
  CalendarIcon,
  BellIcon,
  Settings2Icon,
  BarChart3Icon,
  MessageCircleIcon,
} from "lucide-react";

export const hrSidebar = {
  navMain: [
    {
      title: "Dashboard",
      url: "/hr-dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Job Posts",
      url: "/hr-dashboard/jobs",
      icon: <BriefcaseIcon />,
    },
    {
      title: "Create Job",
      url: "/hr-dashboard/create-job",
      icon: <FileTextIcon />,
    },
    {
      title: "Applicants",
      url: "/hr-dashboard/applicants",
      icon: <UsersIcon />,
    },
    {
      title: "AI Matcher",
      url: "/hr-dashboard/ai-matcher",
      icon: <SparklesIcon />,
    },
    {
      title: "Interviews",
      url: "/hr-dashboard/interviews",
      icon: <CalendarIcon />,
    },
    {
      title: "Analytics",
      url: "/hr-dashboard/analytics",
      icon: <BarChart3Icon />,
    },
    {
      title: "Messages",
      url: "/hr-dashboard/chat",
      icon: <MessageCircleIcon />,
    },
    {
      title: "Notifications",
      url: "/hr-dashboard/notifications",
      icon: <BellIcon />,
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "/hr-dashboard/settings",
      icon: <Settings2Icon />,
    },
  ],
};
