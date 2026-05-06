import AIHeader from "./components/AIHeader";
import AIMetricsCards from "./components/AIMetricsCards";
import AIUsageChart from "./components/AIUsageChart";
import AIFeatureBreakdown from "./components/AIFeatureBreakdown";

export const metadata = {
  title: "AI Usage Monitor",
  description: "Track AI usage, cost and performance",
};

export default function AIUsagePage() {
  return (
    <div className="p-6 space-y-6">
      <AIHeader />

      {/* Top metrics */}
      <AIMetricsCards />

      {/* Chart + breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIUsageChart />
        <AIFeatureBreakdown />
      </div>
    </div>
  );
}
