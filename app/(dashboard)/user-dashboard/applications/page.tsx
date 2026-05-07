import type { Metadata } from "next";

import ApplicationsPage from "./new/page";

export const metadata: Metadata = {
  title: "My Applications - Job Tracker",
  description: "Track, manage and analyze your job applications",
};

export default function Page() {
  return <ApplicationsPage />;
}
