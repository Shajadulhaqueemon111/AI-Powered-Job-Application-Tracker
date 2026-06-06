import type { Metadata } from "next";
import HrApplicants from "./all-applicants";

// import ApplicationsPage from "./new/new-application";

export const metadata: Metadata = {
  title: "HR Applications - Job Tracker",
  description: "Track, manage and analyze your job applications",
};

export default function Page() {
  return (
    <div className="p-4">
      {/* <h1 className="text-2xl font-bold mb-4">My Applications</h1> */}
      <HrApplicants />
    </div>
  );
}
