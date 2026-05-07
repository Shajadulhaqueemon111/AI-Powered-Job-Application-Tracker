import { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for managing the application",
  keywords: ["admin", "dashboard", "management"],
};

export default function AdminLayout({
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
            <AppSidebar type="admin" />
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
