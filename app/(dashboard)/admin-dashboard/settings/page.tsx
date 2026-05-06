import type { Metadata } from "next";
import ProfileProfile from "./profile/userProfile";

export const metadata: Metadata = {
  title: "Settings | Admin Dashboard",
  description:
    "Manage your account settings, preferences, security, and system configuration.",
};

export default function SettingsPage() {
  return (
    <div>
      <ProfileProfile />
    </div>
  );
}
