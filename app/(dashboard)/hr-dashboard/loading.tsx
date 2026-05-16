/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";

import { Search, MapPin, Building2, Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AllJobsWithDrawerSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white p-6 space-y-8 animate-pulse">
      {/* HEADER */}

      <div className="space-y-3">
        <Skeleton className="h-10 w-[320px] rounded-xl" />

        <Skeleton className="h-5 w-[260px] rounded-lg" />
      </div>

      {/* SEARCH */}

      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />

        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-[110px] rounded-full" />
        ))}
      </div>

      {/* JOB GRID */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card
            key={index}
            className="rounded-3xl border-0 bg-white dark:bg-gray-900 shadow-md"
          >
            <CardContent className="p-6 space-y-5">
              {/* TOP */}

              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-[180px] rounded-lg" />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-300" />

                      <Skeleton className="h-4 w-[100px] rounded-md" />
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-300" />

                      <Skeleton className="h-4 w-[80px] rounded-md" />
                    </div>
                  </div>
                </div>

                <Skeleton className="h-6 w-[70px] rounded-full" />
              </div>

              {/* SKILLS */}

              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-[85px] rounded-full" />
                ))}
              </div>

              {/* INFO */}

              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-[80px]" />

                    <Skeleton className="h-4 w-[110px]" />
                  </div>
                ))}
              </div>

              {/* ACTIONS */}

              <div className="flex gap-3 pt-2">
                <Skeleton className="h-11 flex-1 rounded-xl" />

                <Skeleton className="h-11 flex-1 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PAGINATION */}

      <div className="flex items-center justify-center gap-4 pt-4">
        <Skeleton className="h-10 w-[90px] rounded-xl" />

        <Skeleton className="h-5 w-[120px]" />

        <Skeleton className="h-10 w-[90px] rounded-xl" />
      </div>

      {/* RIGHT DRAWER SKELETON */}

      <div className="hidden xl:flex fixed right-0 top-0 h-screen w-[520px] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl z-50">
        <div className="w-full p-6 space-y-6 overflow-hidden">
          {/* HEADER */}

          <div className="space-y-3">
            <Skeleton className="h-8 w-[240px]" />

            <Skeleton className="h-4 w-[180px]" />
          </div>

          {/* BADGES */}

          <div className="flex gap-3">
            <Skeleton className="h-7 w-[80px] rounded-full" />

            <Skeleton className="h-7 w-[100px] rounded-full" />

            <Skeleton className="h-7 w-[120px] rounded-full" />
          </div>

          {/* CONTENT */}

          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-5 w-[160px]" />

                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full rounded-md" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* FORM SECTION */}

          <div className="space-y-4 pt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[140px]" />

                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ))}

            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />

              <Skeleton className="h-[120px] w-full rounded-2xl" />
            </div>

            <div className="flex items-start gap-3 rounded-2xl border p-4 border-zinc-200 dark:border-zinc-800">
              <Skeleton className="h-5 w-5 rounded-md" />

              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />

                <Skeleton className="h-4 w-[80%]" />
              </div>
            </div>
          </div>

          {/* FOOTER */}

          <div className="flex gap-3 pt-4">
            <Skeleton className="h-11 flex-1 rounded-xl" />

            <Skeleton className="h-11 flex-1 rounded-xl" />
          </div>

          {/* LOADING */}

          <div className="flex items-center justify-center pt-6 text-gray-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}
