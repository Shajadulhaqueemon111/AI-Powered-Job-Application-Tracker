"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { adminSidebar } from "@/app/(dashboard)/admin-dashboard/lib/admin-sidebar-config";
import { userSidebar } from "@/app/(dashboard)/user-dashboard/lib/user-sidebar-config";

export function AppSidebar({
  type = "admin",
  ...props
}: React.ComponentProps<typeof Sidebar> & { type?: "admin" | "user" }) {
  const data = type === "admin" ? adminSidebar : userSidebar;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: "User",
            email: "user@gmail.com",
            avatar: "/avatar.jpg", // ✅ ADD THIS
          }}
          type={type}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
