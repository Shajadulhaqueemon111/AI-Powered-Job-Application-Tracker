import type { Metadata } from "next";
import AllJobsClient from "./all-jobs/page";

export const metadata: Metadata = {
  title: "Find Jobs - AI Job Tracker",
  description:
    "Search and apply for jobs based on your skills, salary and location",
};

export default function Page() {
  return <AllJobsClient />;
}
