import type { Metadata } from "next";
import JobHeader from "./components/JobHeader";
import JobFilters from "./components/JobFilters";
import JobStats from "./components/JobStats";
import JobTable from "./components/JobTable";

export const metadata: Metadata = {
  title: "Jobs Management",
  description: "Manage job postings and applicants",
};

export default function JobsPage() {
  return (
    <div className="p-6 space-y-6">
      <JobHeader />
      <JobFilters />
      <JobStats />
      <JobTable />
    </div>
  );
}
