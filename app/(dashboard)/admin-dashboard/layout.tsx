import { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { getUser } from "@/app/lib/get-user";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for managing the application",
  keywords: ["admin", "dashboard", "management"],
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const user = await getUser();
  return (
 
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
            <AppSidebar type="admin"  user={user ?? { name: "User", email: "user@gmail.com", avatar: "/avatar.jpg" }} />
            <SidebarInset className="flex-1">
              <SiteHeader />
              {children}
            </SidebarInset>
          </div>
        </SidebarProvider>
      </TooltipProvider>
   
  );
}
