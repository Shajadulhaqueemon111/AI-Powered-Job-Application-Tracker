import type { Metadata } from "next";

import ApplicationsPage from "./new/new-application";

export const metadata: Metadata = {
  title: "My Applications - Job Tracker",
  description: "Track, manage and analyze your job applications",
};

export default function Page() {
  return <ApplicationsPage />;
}
