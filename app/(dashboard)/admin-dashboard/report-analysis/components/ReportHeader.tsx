import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

export default function ReportHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left Content */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">
            Reports Dashboard
          </h1>

          <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20">
            System Monitoring
          </Badge>
        </div>

        <p className="text-muted-foreground mt-1">
          Track user reports, system issues, and security events in real-time
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>

        <Button className="bg-black text-white hover:bg-gray-800">
          View Logs
        </Button>
      </div>
    </div>
  );
}
