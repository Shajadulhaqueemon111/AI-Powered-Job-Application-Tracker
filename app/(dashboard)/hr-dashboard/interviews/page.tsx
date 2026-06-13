import type { Metadata } from "next";
import InterviewedApplicantsPage from "./interview";

export const metadata: Metadata = {
  title: "Interview Candidates",
  description: "Manage interviewed candidates for your jobs",
};

export default function InterviewsPage() {
  return <InterviewedApplicantsPage />;
}
