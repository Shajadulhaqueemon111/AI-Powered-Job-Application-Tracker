import type { Metadata } from "next";
// import ProfileProfile from "./profile/userProfile";
import UserProfile from "./profile/userProfile";
import { getUser } from "@/app/lib/get-user";

export const metadata: Metadata = {
  title: "Settings | Admin Dashboard",
  description:
    "Manage your account settings, preferences, security, and system configuration.",
};

export default async function SettingsPage() {
  const user = await getUser();
  return (
    <div>
      <UserProfile user={user} />
    </div>
  );
}
