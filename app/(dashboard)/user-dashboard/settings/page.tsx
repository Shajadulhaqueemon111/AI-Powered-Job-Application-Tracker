import type { Metadata } from "next";

import ProfileSettings from "./profile/page";

export const metadata: Metadata = {
  title: "Settings | User Dashboard",
  description:
    "Manage your profile, resume, security, notifications and job preferences",
  keywords: [
    "settings",
    "profile",
    "resume upload",
    "job dashboard",
    "user profile",
  ],
  openGraph: {
    title: "User Settings Dashboard",
    description: "Control your job profile and preferences",
    type: "website",
  },
};

export default function Page() {
  return <ProfileSettings />;
}
