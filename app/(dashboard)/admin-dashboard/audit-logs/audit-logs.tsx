"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useGetAuditLogsQuery } from "@/app/redux/features/auth/authApi";
import { AuditLog } from "./type";
import { AuditLogTableSkeleton } from "./skeliton";

export default function AuditLogTable() {
  const { data, isLoading } = useGetAuditLogsQuery();

  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  const limit = 10;

  // ⚡ FRONTEND FILTER
  const filteredData = React.useMemo(() => {
    const logs = data?.data ?? [];

    if (!search) return logs;

    return logs.filter((item: AuditLog) => {
      const q = search.toLowerCase();

      return (
        item.email?.toLowerCase().includes(q) ||
        item.action?.toLowerCase().includes(q) ||
        item.ip?.toLowerCase().includes(q)
      );
    });
  }, [data, search]);

  // ⚡ PAGINATION LOGIC (FRONTEND)
  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredData.slice(start, end);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / limit);

  // ⚡ COLUMNS
  const columns = React.useMemo<ColumnDef<AuditLog>[]>(
    () => [
      { accessorKey: "email", header: "User" },
      { accessorKey: "action", header: "Action" },
      { accessorKey: "ip", header: "IP Address" },
      { accessorKey: "device", header: "Device" },
      { accessorKey: "browser", header: "Browser" },
      { accessorKey: "os", header: "OS" },
      {
        accessorKey: "createdAt",
        header: "Time",
        cell: ({ row }) => (
          <span className="text-xs text-gray-500">
            {new Date(row.original.createdAt).toLocaleString()}
          </span>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Audit Logs</h2>

        <Input
          placeholder="Search by email, action, IP address, device..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-[300px]"
        />
      </div>

      {/* 📊 TABLE */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <AuditLogTableSkeleton />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🔁 PAGINATION */}
      <div className="flex justify-end gap-2 items-center">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>

        <span className="text-sm">
          Page {page} - {totalPages || 1}
        </span>

        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
