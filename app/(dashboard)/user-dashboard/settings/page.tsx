import type { Metadata } from "next";

import ProfileSettings from "./profile/page";
import { getUser } from "@/app/lib/get-user";

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

export default async function Page() {
  const user = await getUser();

  return <ProfileSettings user={user} />;
}
