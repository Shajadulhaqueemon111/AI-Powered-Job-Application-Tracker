import type { Metadata } from "next";
import JobCreateForm from "./create-job-forms/page";

/* ---------------- METADATA ---------------- */
export const metadata: Metadata = {
  title: "Create Job | HR Dashboard",
  description: "HR can create and manage job posts from this page",
  keywords: ["job", "hr", "create job", "job portal"],
};

/* ---------------- PAGE ---------------- */
export default function Page() {
  return <JobCreateForm />;
}
