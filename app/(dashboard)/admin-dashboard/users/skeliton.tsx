"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableSkeletonProps {
  columnsCount?: number;
  rowsCount?: number;
}

export function DataTableSkeleton({
  columnsCount = 5,
  rowsCount = 8,
}: DataTableSkeletonProps) {
  return (
    <div className="p-6">
      {/* FILTER SKELETON */}
      <div className="flex items-center py-4 gap-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-24 ml-auto" />
      </div>

      {/* TABLE */}
      <div className="rounded-md border">
        <Table>
          {/* HEADER */}
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnsCount }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {Array.from({ length: rowsCount }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columnsCount }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
}
