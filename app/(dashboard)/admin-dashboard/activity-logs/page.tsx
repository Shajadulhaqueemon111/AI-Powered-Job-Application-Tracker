import ActivityHeader from "./components/ActivityHeader";
import ActivityFilters from "./components/ActivityFilters";
import ActivityTable from "./components/ActivityTable";

export const metadata = {
  title: "Activity Logs",
  description: "System-wide activity tracking",
};

export default function ActivityPage() {
  return (
    <div className="p-6 space-y-6">
      <ActivityHeader />
      <ActivityFilters />
      <ActivityTable />
    </div>
  );
}
