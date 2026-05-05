"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type UserData = {
  id: number;
  header: string;
  type: string;
  status: string;
  target: string;
  limit: string;
  reviewer: string;
};

export const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "header",
    header: "Header",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "target",
    header: "Target",
  },
  {
    accessorKey: "limit",
    header: "Limit",
  },
  {
    accessorKey: "reviewer",
    header: "Reviewer",
  },
];
