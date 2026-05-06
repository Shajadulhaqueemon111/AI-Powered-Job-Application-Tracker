"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const auditLogs = [
  {
    id: 1,
    createdBy: "The Silent Man",
    type: "DELETE",
    details: "Logged out",
    createdAt: "04 May 2026, 05:51 PM",
  },
  {
    id: 2,
    createdBy: "The Silent Man",
    type: "DELETE",
    details: "Logged out",
    createdAt: "03 May 2026, 06:07 PM",
  },
  {
    id: 3,
    createdBy: "The Silent Man",
    type: "CREATE",
    details: "Created booking",
    createdAt: "30 Apr 2026, 06:22 PM",
  },
  {
    id: 4,
    createdBy: "Emon",
    type: "UPDATE",
    details: "Profile updated",
    createdAt: "30 Apr 2026, 09:58 AM",
  },
  {
    id: 5,
    createdBy: "Admin",
    type: "DELETE",
    details: "Removed user",
    createdAt: "29 Apr 2026, 04:57 PM",
  },
  {
    id: 6,
    createdBy: "System",
    type: "ERROR",
    details: "DB connection issue",
    createdAt: "28 Apr 2026, 03:38 PM",
  },
];

function getTypeStyle(type: string) {
  switch (type) {
    case "CREATE":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "UPDATE":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "DELETE":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  }
}

export default function SystemLogs() {
  const [page, setPage] = React.useState(1);
  const [typeFilter, setTypeFilter] = React.useState("");
  const [userFilter, setUserFilter] = React.useState("");

  const perPage = 3;

  // 🔍 FILTER LOGIC
  const filtered = auditLogs.filter((log) => {
    const userMatch =
      userFilter === ""
        ? true
        : log.createdBy.toLowerCase().includes(userFilter.toLowerCase());

    const typeMatch =
      typeFilter === ""
        ? true
        : log.type.toLowerCase().includes(typeFilter.toLowerCase());

    return userMatch && typeMatch;
  });

  // 📄 PAGINATION LOGIC
  const totalPages = Math.ceil(filtered.length / perPage);

  const paginatedLogs = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="bg-card border rounded-2xl p-6 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Audit Trail</h2>
        <p className="text-xs text-muted-foreground">
          System activity logs with filters & pagination
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Input
          placeholder="Filter by user..."
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        />

        <Input
          placeholder="Filter by type (CREATE/UPDATE/DELETE)"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.createdBy}</TableCell>

                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs border rounded-md ${getTypeStyle(log.type)}`}
                  >
                    {log.type}
                  </span>
                </TableCell>

                <TableCell>{log.details}</TableCell>

                <TableCell className="text-muted-foreground">
                  {log.createdAt}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 📄 Pagination Controls */}
      <div className="flex items-center justify-between">
        <button
          className="px-3 py-1 border rounded-md"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          className="px-3 py-1 border rounded-md"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
