"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function HrJobCardSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="h-10 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border p-4 bg-white dark:bg-zinc-900"
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-2">
              <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-5 w-10 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <Card className="bg-white dark:bg-zinc-900 border">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="h-10 flex-1 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-10 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-10 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>

          <div className="flex justify-between">
            <div className="h-3 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        </CardContent>
      </Card>

      {/* Job Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card
            key={i}
            className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden"
          >
            {/* Top line */}
            <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800" />

            <CardHeader className="space-y-3">
              <div className="flex justify-between">
                <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>

              <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-3 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </CardHeader>

            <Separator />

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>

              <div className="flex gap-2">
                <div className="h-5 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-5 w-10 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>

              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />

              <div className="flex gap-2 pt-2">
                <div className="h-9 flex-1 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-9 w-10 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center pt-4">
        <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
