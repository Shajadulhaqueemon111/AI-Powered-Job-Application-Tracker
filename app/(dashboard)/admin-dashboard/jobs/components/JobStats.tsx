/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetJobsQuery } from "@/app/redux/features/jobs/jobs-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JobStats() {
  const { data, isLoading } = useGetJobsQuery(undefined);

  const jobs = data?.data || [];

  // 🔥 calculations
  const totalJobs = jobs.length;

  const activeJobs = jobs.filter((job: any) => job.status === "active").length;

  const totalApplicants = jobs.reduce(
    (sum: number, job: any) => sum + (job.totalApplicants || 0),
    0,
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-6 w-16 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Total Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalJobs}</p>
        </CardContent>
      </Card>

      {/* Active Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Active Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{activeJobs}</p>
        </CardContent>
      </Card>

      {/* Applicants */}
      <Card>
        <CardHeader>
          <CardTitle>Total Applicants</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-blue-600">{totalApplicants}</p>
        </CardContent>
      </Card>
    </div>
  );
}
