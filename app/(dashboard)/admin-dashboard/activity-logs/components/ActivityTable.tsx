import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

const logs = [
  {
    id: 1,
    user: "Emon",
    action: "Created Job",
    target: "Frontend Developer",
    status: "success",
    createdAt: "2 min ago",
  },
  {
    id: 2,
    user: "Admin",
    action: "Deleted User",
    target: "John Doe",
    status: "danger",
    createdAt: "10 min ago",
  },
  {
    id: 3,
    user: "AI System",
    action: "AI Generated Resume",
    target: "User ID #123",
    status: "warning",
    createdAt: "1 hour ago",
  },
];

export default function ActivityTable() {
  return (
    <div className="rounded-xl border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="hover:bg-muted/50 transition">
              <TableCell className="font-medium">{log.user}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.target}</TableCell>

              <TableCell>
                <Badge
                  className={
                    log.status === "success"
                      ? "bg-green-500/20 text-green-400"
                      : log.status === "danger"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                  }
                >
                  {log.status}
                </Badge>
              </TableCell>

              <TableCell className="text-muted-foreground">
                {log.createdAt}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
