/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Input } from "@/components/ui/input";

import { useGetJobsQuery } from "@/app/redux/features/jobs/jobs-api";

export default function JobTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const jobsPerPage = 5;

  const { data, isLoading } = useGetJobsQuery(undefined);
  const jobs = data?.data || [];

  // ✅ SEARCH FILTER
  const filteredJobs = jobs.filter((job: any) =>
    job.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  if (isLoading) {
    return (
      <Card>
        {" "}
        <CardHeader>
          {" "}
          <CardTitle>Job Listings</CardTitle> <div className="mt-4"></div>{" "}
        </CardHeader>{" "}
        <CardContent>
          {" "}
          {/* Table Skeleton */}{" "}
          <div className="space-y-3">
            {" "}
            {/* Header skeleton */}{" "}
            <div className="grid grid-cols-7 gap-4">
              {" "}
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted animate-pulse rounded" />
              ))}{" "}
            </div>{" "}
            {/* Rows skeleton */}{" "}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-7 gap-4 py-3">
                {" "}
                {Array.from({ length: 7 }).map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className="h-4 bg-muted animate-pulse rounded"
                  />
                ))}{" "}
              </div>
            ))}{" "}
          </div>{" "}
          {/* Pagination skeleton */}{" "}
          <div className="flex justify-center mt-6 gap-2">
            {" "}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-8 bg-muted animate-pulse rounded" />
            ))}{" "}
          </div>{" "}
        </CardContent>{" "}
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Listings</CardTitle>

        {/* ✅ SEARCH INPUT */}
        <div className="mt-4">
          <Input
            placeholder="Search by job title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset page on search
            }}
          />
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applicants</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentJobs.map((job: any) => (
              <TableRow key={job._id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.company?.name}</TableCell>
                <TableCell>{job.employmentType}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  <Badge
                    variant={job.status === "active" ? "default" : "secondary"}
                  >
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>{job.totalApplicants}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                  <Button size="sm" variant="destructive">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === index + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(index + 1);
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
}
