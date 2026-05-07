import { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/app-sidebar";

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "Job seeker dashboard for tracking applications and AI insights",
  keywords: ["jobs", "dashboard", "ai matcher", "career"],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "18rem",
              "--header-height": "3rem",
            } as React.CSSProperties
          }
        >
          <div className="flex w-full min-h-screen bg-background text-foreground">
            {/* 👇 USER SIDEBAR (AdminSidebar না) */}
            <AppSidebar type="user" />

            <SidebarInset className="flex-1">
              <SiteHeader />
              {children}
            </SidebarInset>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
