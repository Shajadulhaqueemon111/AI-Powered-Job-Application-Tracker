import ReportHeader from "./components/ReportHeader";
import ReportCards from "./components/ReportCards";
import ReportChart from "./components/ReportChart";
import ReportTable from "./components/ReportTable";

export const metadata = {
  title: "Admin Reports",
  description: "System report & abuse tracking dashboard",
};

export default function ReportPage() {
  return (
    <div className="p-6 space-y-6">
      <ReportHeader />

      <ReportCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportChart />
        <ReportTable />
      </div>
    </div>
  );
}
