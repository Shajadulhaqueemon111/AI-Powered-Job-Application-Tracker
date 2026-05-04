"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { AvatarDropdown } from "@/app/(dashboard)/admin-dashboard/user-avatar/page";

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background ">
      <div className="flex h-(--header-height) items-center gap-2 px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <h1 className="text-base font-medium">Documents</h1>
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="p-2 rounded-md hover:bg-muted transition"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div>
          <AvatarDropdown />
        </div>
      </div>
    </header>
  );
}
