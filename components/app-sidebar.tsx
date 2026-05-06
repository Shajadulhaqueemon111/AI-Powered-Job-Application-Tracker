"use client";

import * as React from "react";
import Link from "next/link";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  LayoutDashboardIcon,
  ListIcon,
  ChartBarIcon,
  UsersIcon,
  FileTextIcon,
  Settings2Icon,
  CircleHelpIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  CommandIcon,
} from "lucide-react";

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/admin-dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Users",
      url: "/admin-dashboard/users",
      icon: <UsersIcon />,
    },
    {
      title: "Jobs Monitor",
      url: "/admin-dashboard/jobs",
      icon: <ListIcon />,
    },
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
    {
      title: "Help",
      url: "/admin-dashboard/help",
      icon: <CircleHelpIcon />,
    },
  ],

  documents: [
    {
      name: "Reports",
      url: "/admin-dashboard/report-analysis",
      icon: <FileChartColumnIcon />,
    },
    {
      name: "System Logs",
      url: "/admin-dashboard/logs",
      icon: <FileIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              {/* ✅ FIX: <a> → <Link> */}
              <Link href="/admin-dashboard">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Admin Panel</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
