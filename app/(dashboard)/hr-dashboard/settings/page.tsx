import type { Metadata } from "next";
// import ProfileProfile from "./profile/userProfile";

import { getUser } from "@/app/lib/get-user";
import HRProfile from "./profile/hr-profile";

export const metadata: Metadata = {
  title: "Settings | HR Dashboard",
  description:
    "Manage your account settings, preferences, security, and system configuration.",
};

export default async function SettingsPage() {
  const user = await getUser();
  return (
    <div>
      <HRProfile user={user} />
    </div>
  );
}
