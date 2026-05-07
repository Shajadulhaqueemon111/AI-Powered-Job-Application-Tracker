"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import avatarImage from "../../../../public/avatar.jpg";
export function AvatarDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src={avatarImage.src} alt="shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="
    w-44
    rounded-xl
    border
    bg-popover             /* popover ভ্যারিয়েবল ব্যবহার করুন */
    text-popover-foreground  /* টেক্সট কালার ও ঠিক থাকবে */
    shadow-lg
    z-50
  "
      >
        <DropdownMenuGroup>
          <Link href="/admin-dashboard/settings">
            <DropdownMenuItem className="cursor-pointer hover:bg-muted focus:bg-muted">
              Profile
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem className="cursor-pointer hover:bg-muted focus:bg-muted">
            Billing
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer hover:bg-muted focus:bg-muted">
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer text-red-500 hover:bg-red-500/10 focus:bg-red-500/10">
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
