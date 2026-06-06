/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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

import Image from "next/image";
import toast from "react-hot-toast";

type Company = {
  name: string;
  logo: string;
  website: string;
};

type Job = {
  _id: string;
  title: string;
  location?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  company: Company;
};

type Application = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  status:
    | "pending"
    | "in_review"
    | "shortlisted"
    | "interviewed"
    | "offered"
    | "hired"
    | "rejected";
  createdAt: string;
  resumeUrl: string;
  jobId?: Job;
};

export default function MyApplicationsTable({
  data = [],
}: {
  data: Application[];
}) {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Website copied!");
    } catch {
      toast.error("Copy failed!");
    }
  };

  // ✅ CUSTOM GLOBAL SEARCH LOGIC (IMPORTANT FIX)
  const globalFilterFn = React.useCallback(
    (row: any, _columnId: string, filterValue: string) => {
      const search = filterValue.toLowerCase();

      const job = row.original.jobId;

      return (
        row.original.fullName?.toLowerCase().includes(search) ||
        row.original.email?.toLowerCase().includes(search) ||
        row.original.phone?.toLowerCase().includes(search) ||
        job?.title?.toLowerCase().includes(search) ||
        job?.company?.name?.toLowerCase().includes(search)
      );
    },
    [],
  );

  const table = useReactTable({
    data,
    columns: [
      {
        header: "Job",
        cell: ({ row }) => {
          const job = row.original.jobId;
          const company = job?.company;

          if (!job || !company) {
            return <span className="text-muted-foreground">N/A</span>;
          }

          return (
            <div className="flex items-center gap-3">
              <Image
                src={company.logo}
                alt={company.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />

              <div>
                <p className="font-semibold">{job.title}</p>
                <p className="text-xs text-muted-foreground">{company.name}</p>

                <button
                  onClick={() => setSelectedJob(job)}
                  className="text-xs text-blue-600 underline mt-1 cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        },
      },

      {
        header: "Applicant",
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.fullName}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.email}
            </p>
          </div>
        ),
      },

      {
        accessorKey: "phone",
        header: "Phone",
      },

      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;

          return (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                status === "pending"
                  ? "bg-blue-100 text-blue-600"
                  : status === "in_review"
                    ? "bg-purple-100 text-purple-600"
                    : status === "shortlisted"
                      ? "bg-indigo-100 text-indigo-600"
                      : status === "interviewed"
                        ? "bg-cyan-100 text-cyan-600"
                        : status === "offered"
                          ? "bg-green-100 text-green-600"
                          : status === "hired"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-red-100 text-red-600"
              }`}
            >
              {status}
            </span>
          );
        },
      },

      {
        accessorKey: "createdAt",
        header: "Applied",
        cell: ({ row }) =>
          new Date(row.getValue("createdAt")).toLocaleDateString(),
      },

      {
        header: "Resume",
        cell: ({ row }) => {
          const handleDownload = async (url: string) => {
            try {
              const res = await fetch(url);
              const blob = await res.blob();

              const link = document.createElement("a");
              const objectUrl = URL.createObjectURL(blob);

              link.href = objectUrl;
              link.download = "resume.pdf";
              link.click();

              URL.revokeObjectURL(objectUrl);

              toast.success("Downloading...");
            } catch {
              toast.error("Download failed!");
            }
          };

          return (
            <button
              onClick={() => handleDownload(row.original.resumeUrl)}
              className="text-blue-600 underline text-sm"
            >
              View / Download
            </button>
          );
        },
      },
    ],

    state: {
      globalFilter,
    },

    onGlobalFilterChange: setGlobalFilter,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    globalFilterFn, // ✅ IMPORTANT FIX

    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* 🔍 SEARCH INPUT (FIXED PLACEHOLDER) */}
      <Input
        placeholder="Search by name, email, phone, job title, company..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />

      {/* TABLE */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
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
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  No applications found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>

        <span className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1}
        </span>

        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* MODAL */}
      {/* 🧾 JOB FULL DETAILS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-md text-black w-[520px] rounded-2xl p-6 shadow-2xl border border-gray-200 relative">
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-5">
              <Image
                src={selectedJob.company.logo}
                alt={selectedJob.company.name}
                width={60}
                height={60}
                className="rounded-full object-cover shadow"
              />

              <div>
                <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                <p className="text-sm text-gray-500">
                  {selectedJob.company.name}
                </p>
              </div>
            </div>

            {/* WEBSITE + COPY BUTTON */}
            <div className="mb-4 p-3 rounded-lg bg-gray-50 flex items-center justify-between gap-3">
              <div className="text-sm truncate">
                🌐 {selectedJob.company.website}
              </div>

              <button
                onClick={() => handleCopy(selectedJob.company.website)}
                className="text-xs px-3 py-1 rounded-md bg-black text-white hover:bg-gray-800 transition"
              >
                Copy
              </button>
            </div>

            {/* DETAILS */}
            <div className="space-y-2 text-sm">
              <p>
                📍 Location:{" "}
                <span className="font-medium">
                  {selectedJob.location || "N/A"}
                </span>
              </p>

              <p>
                💰 Salary:{" "}
                <span className="font-medium">
                  {selectedJob.salary
                    ? `${selectedJob.salary.min} - ${selectedJob.salary.max} ${selectedJob.salary.currency}`
                    : "Not disclosed"}
                </span>
              </p>

              <p>🏢 Company: {selectedJob.company.name}</p>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex gap-2">
              <Button
                className="w-full rounded-xl"
                onClick={() => setSelectedJob(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
