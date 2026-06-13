/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "fullName",
    header: "Candidate",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "experience",
    header: "Experience",
  },
  {
    header: "Job",
    cell: ({ row }) => row.original.jobId?.title,
  },
  {
    header: "Resume",
    cell: ({ row }) => (
      <a href={row.original.resumeUrl} target="_blank" rel="noreferrer">
        <Button size="sm">Resume</Button>
      </a>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: () => <Badge>Interviewed</Badge>,
  },
  {
    header: "Applied Date",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm">View Details</Button>

        <Button size="sm" variant="outline">
          Schedule Interview
        </Button>
      </div>
    ),
  },
];
