import type { Metadata } from "next";
import AuditLogTable from "./audit-logs";

export const metadata: Metadata = {
  title: "Audit Logs | Admin Dashboard",
  description:
    "Track all user activities, login attempts, and system actions in real time.",
};
export default function AuditLogPage() {
  return (
    <div className="p-6 space-y-4">
      <AuditLogTable />
    </div>
  );
}
