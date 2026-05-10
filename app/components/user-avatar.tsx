"use client";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { User, Bell, CreditCard, LogOut, Settings } from "lucide-react";

import avatarImage from "../.././public/avatar.jpg";
import { useRouter } from "next/navigation";

type AvatarDropdownProps = {
  type?: "admin" | "user";
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
};

export default function AvatarDropdown({ type = "user", user }: AvatarDropdownProps) {
  /* ---------------- ROUTES ---------------- */

  const baseRoute = type === "admin" ? "/admin-dashboard" : "/user-dashboard";
const router = useRouter();

const handleLogout = () => {
  // remove token cookie
  document.cookie =
    "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

  // redirect
  router.push("/login");
};
  return (
    <DropdownMenu>
      {/* TRIGGER */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="
            relative
            h-10
            w-10
            rounded-full
            hover:bg-muted
          "
        >
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={user?.avatar || "/avatar.jpg"} alt="User Avatar" />

            <AvatarFallback className="bg-primary text-primary-foreground">
              EM
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      {/* CONTENT */}
      <DropdownMenuContent
        align="end"
        className="
          w-64
          rounded-2xl
          border
          bg-background/95
          backdrop-blur-xl
          shadow-2xl
          p-2
        "
      >
        {/* USER INFO */}
        <div className="flex items-center gap-3 px-3 py-3">
          <Avatar className="h-11 w-11">
            <AvatarImage src={user?.avatar || "/avatar.jpg"} alt="User Avatar" />

            <AvatarFallback>EM</AvatarFallback>
          </Avatar>

          <div>
            <h4 className="text-sm font-semibold">{user?.name || "User"}</h4>

            <p className="text-xs text-muted-foreground">{user?.email || "user@gmail.com"}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* MENU */}
        <DropdownMenuGroup className="space-y-1">
          {/* PROFILE */}
          <DropdownMenuItem asChild>
            <Link
              href={`${baseRoute}/settings`}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                cursor-pointer
              "
            >
              <User className="h-4 w-4" />
              Profile Settings
            </Link>
          </DropdownMenuItem>

          {/* BILLING */}
          <DropdownMenuItem asChild>
            <Link
              href={`${baseRoute}/billing`}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                cursor-pointer
              "
            >
              <CreditCard className="h-4 w-4" />
              Billing
            </Link>
          </DropdownMenuItem>

          {/* NOTIFICATIONS */}
          <DropdownMenuItem asChild>
            <Link
              href={`${baseRoute}/notifications`}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                cursor-pointer
              "
            >
              <Bell className="h-4 w-4" />
              Notifications
            </Link>
          </DropdownMenuItem>

          {/* SETTINGS */}
          <DropdownMenuItem asChild>
            <Link
              href={`${baseRoute}/settings`}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                cursor-pointer
              "
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* LOGOUT */}
        <DropdownMenuItem
          className="
            flex
            items-center
            gap-2
            rounded-xl
            cursor-pointer
            text-red-500
            focus:text-red-500
          "
        >
          <LogOut className="h-4 w-4" />
          <button onClick={handleLogout}>Log out</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
