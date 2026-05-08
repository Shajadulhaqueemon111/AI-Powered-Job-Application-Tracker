import { Metadata } from "next";
import AIResumeMatcherPage from "./matcher/page";

export const metadata: Metadata = {
  title: "AI Resume Matcher",
  description:
    "Analyze resumes with AI, ATS optimization, missing skills detection, and recruiter insights.",
};

export default function Page() {
  return <AIResumeMatcherPage />;
}
