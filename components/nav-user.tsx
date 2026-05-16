"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  EllipsisVerticalIcon,
  CircleUserRoundIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authApi, useLogOutMutation } from "@/app/redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { logout } from "@/app/redux/features/auth/authSlice";
import { logOut } from "@/app/(auth)/login/logOut";

type NavUserProps = {
  user: {
    name: string;
    email: string;
    profileImage: string;
  };
  type: "admin" | "user" | "hr";
};

export function NavUser({ user, type }: NavUserProps) {
  const { isMobile } = useSidebar();

  // ✅ SAFE ROLE (no default admin bug)
  const role = type ?? "user";

  // ✅ dynamic base route
  const base =
    role === "admin"
      ? "/admin-dashboard"
      : role === "hr"
        ? "/hr-dashboard"
        : "/user-dashboard";
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logOut(); //

      // dispatch(logout());

      // dispatch(authApi.util.resetApiState());

      router.push("/login");
    } catch (err) {
      console.log("Logout failed:", err);
    }
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.profileImage} alt={user.name} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>

                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>

              <EllipsisVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl shadow-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={6}
          >
            {/* PROFILE HEADER */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-2">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium">{user.name}</span>

                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* MENU */}
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href={`${base}/settings`}
                  className="flex items-center gap-2 w-full"
                >
                  <CircleUserRoundIcon className="size-4" />
                  Account Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`${base}/billing`}
                  className="flex items-center gap-2 w-full"
                >
                  <CreditCardIcon className="size-4" />
                  Billing
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link
                  href={`${base}/notifications`}
                  className="flex items-center gap-2 w-full"
                >
                  <BellIcon className="size-4" />
                  Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* LOGOUT */}
            <DropdownMenuItem
              className="flex items-center gap-2 text-red-500 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOutIcon className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
