import AnalyticsHeader from "./components/AnalyticsHeader";
import AnalyticsTabs from "./components/AnalyticsTabs";
import StatsCards from "./components/StatsCards";

export const metadata = {
  title: "Admin Analytics",
  description: "Analytics dashboard for admin panel",
};

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* 🔹 Header */}
      <AnalyticsHeader />

      {/* 🔹 Stats */}
      <StatsCards />

      {/* 🔹 Tabs Section */}
      <AnalyticsTabs />
    </div>
  );
}
