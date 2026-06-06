import type { Metadata } from "next";
import HrMyJobs from "./all-jobs";

export const metadata: Metadata = {
  title: "HR Find Jobs - AI Job Tracker",
  description:
    "Search and apply for jobs based on your skills, salary and location",
};

export default function Page() {
  return <HrMyJobs />;
}
