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
import { hrSidebar } from "@/app/(dashboard)/hr-dashboard/lib/hr-sidebar-config";

type UserProps = {
  name: string;
  email: string;
  profileImage: string;
};

export function AppSidebar({
  type = "admin",
  user = { name: "User", email: "user@gmail.com", profileImage: "/avatar.jpg" }, // ✅ default
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  type?: "admin" | "hr" | "user";
  user: UserProps;
}) {
  const data =
    type === "admin" ? adminSidebar : type === "hr" ? hrSidebar : userSidebar;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} type={type} />
      </SidebarFooter>
    </Sidebar>
  );
}
