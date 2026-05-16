import { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/app-sidebar";
import { getUser } from "@/app/lib/get-user";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "HR Dashboard",
  description:
    "HR dashboard for managing job posts, applicants, interviews, and AI-powered hiring insights",
  keywords: [
    "HR",
    "recruitment",
    "job management",
    "applicants",
    "hiring",
    "AI matcher",
    "dashboard",
  ],
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
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
            {/*  HR SIDEBAR (AdminSidebar না) */}
            <AppSidebar type="hr" user={user} />

            <SidebarInset className="flex-1">
              <SiteHeader type="hr" user={user} />
              {children}
            </SidebarInset>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
