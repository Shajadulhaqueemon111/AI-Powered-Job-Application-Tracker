import type { Metadata } from "next";

import ApplicationClient from "./get-applicationdata";

// import ApplicationsPage from "./new/new-application";

export const metadata: Metadata = {
  title: "My Applications - Job Tracker",
  description: "Track, manage and analyze your job applications",
};

export default function Page() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>
      <ApplicationClient />
    </div>
  );
}
