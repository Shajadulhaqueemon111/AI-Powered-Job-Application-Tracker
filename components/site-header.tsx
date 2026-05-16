"use client";

import { useEffect, useState } from "react"; // 1. Add these hooks
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import NotificationPage from "@/app/(dashboard)/admin-dashboard/notification/page";
import AvatarDropdown from "@/app/components/user-avatar";
type SiteHeaderProps = {
  type?: "admin" | "user" | "hr";
  user: { name: string; email: string; profileImage: string };
};
export function SiteHeader({ type = "user", user }: SiteHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false); // 2. Add mounted state

  // 3. Set mounted to true once the component handles the first client-side render
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-(--header-height) items-center gap-2 px-4 lg:px-6">
        {/* LEFT */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <h1 className="text-base font-medium">Documents</h1>
        </div>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2 rounded-md hover:bg-muted transition"
            aria-label="Toggle Theme"
          >
            {/* 4. Only render the icon if mounted is true */}
            {mounted ? (
              isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )
            ) : (
              <div className="h-5 w-5" /> // Placeholder to prevent layout shift
            )}
          </button>

          <NotificationPage />
          <AvatarDropdown type={type} user={user} />
        </div>
      </div>
    </header>
  );
}
