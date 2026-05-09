import type { Metadata } from "next";
import MyCareerAnalyticsPage from "./all-analytics/allAnalytics";

export const metadata: Metadata = {
  title: "Analytics Dashboard | AI Resume System",
  description:
    "Track job applications, AI score, and hiring performance in real time",
  openGraph: {
    title: "Analytics Dashboard",
    description: "AI-powered job tracking system",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="p-6">
      <MyCareerAnalyticsPage />
    </div>
  );
}
