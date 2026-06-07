/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Search,
  SlidersHorizontal,
  Trash2,
  Eye,
  Plus,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

import {
  useDeleteJobMutation,
  useGetHrJobsQuery,
  useGetJobsQuery,
} from "@/app/redux/features/jobs/jobs-api";
import { HrJobCardSkeleton } from "./skeliton";
import { useGetMeQuery } from "@/app/redux/features/auth/authApi";
import { JobDetailDrawer } from "./job-details-drawer";
import toast from "react-hot-toast";

// ─── Constants ────────────────────────────────────────────────────────────────

const JOBS_PER_PAGE = 6;

const EMPLOYMENT_TYPES = [
  "All Types",
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Remote",
];

const STATUS_OPTIONS = ["All Status", "Active", "Closed", "Draft"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusConfig(status?: string) {
  switch (status?.toLowerCase()) {
    case "active":
      return {
        label: "Active",
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
        icon: <CheckCircle2 className="w-3 h-3" />,
      };
    case "closed":
      return {
        label: "Closed",
        className:
          "bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-300",
        icon: <XCircle className="w-3 h-3" />,
      };
    default:
      return {
        label: "Draft",
        className:
          "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
        icon: <Clock className="w-3 h-3" />,
      };
  }
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-4 bg-white dark:bg-zinc-900 shadow-sm ${color}`}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HrMyJobs() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  // ── API ────────────────────────────────────────────────────────────────────
  const { data: me, isLoading: userLoading } = useGetMeQuery();
  const hrId = me?.data?.user?._id;

  const { data, isLoading: jobsLoading } = useGetHrJobsQuery(hrId);
  const [deleteJob] = useDeleteJobMutation();

  // ── Derived data ───────────────────────────────────────────────────────────
  const jobsArray: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  const myJobs: any[] = jobsArray.filter(
    (job) => job.createdBy?.toString() === hrId?.toString(),
  );

  // ── Filtered & paginated ───────────────────────────────────────────────────
  const filteredJobs = useMemo(() => {
    return myJobs.filter((job) => {
      const matchesSearch =
        !searchQuery ||
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === "All Types" || job.employmentType === selectedType;

      const matchesStatus =
        selectedStatus === "All Status" ||
        (job.status?.toLowerCase() ?? "draft") === selectedStatus.toLowerCase();

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [myJobs, searchQuery, selectedType, selectedStatus]);

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE,
  );

  // Stats
  const activeCount = myJobs.filter(
    (j) => j.status?.toLowerCase() === "active",
  ).length;
  const closedCount = myJobs.filter(
    (j) => j.status?.toLowerCase() === "closed",
  ).length;
  const totalApplications = myJobs.reduce(
    (sum, j) => sum + (j.totalApplicants ?? j.applicantsCount ?? 0),
    0,
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    try {
      await deleteJob(id).unwrap();
      toast.success("Job deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete job");
    }
  };

  const handleViewJob = (job: any) => {
    setSelectedJob(job);
    setDrawerOpen(true);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedType("All Types");
    setSelectedStatus("All Status");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (jobsLoading || userLoading) return <HrJobCardSkeleton />;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Job Postings
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and track all your job listings
          </p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
          <Plus className="w-4 h-4" />
          Post New Job
        </Button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Briefcase className="w-5 h-5 text-indigo-600" />}
          label="Total Jobs"
          value={myJobs.length}
          color="border-indigo-100 dark:border-indigo-900"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          label="Active"
          value={activeCount}
          color="border-emerald-100 dark:border-emerald-900"
        />
        <StatCard
          icon={<XCircle className="w-5 h-5 text-red-500" />}
          label="Closed"
          value={closedCount}
          color="border-red-100 dark:border-red-900"
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-violet-600" />}
          label="Applications"
          value={totalApplications}
          color="border-violet-100 dark:border-violet-900"
        />
      </div>

      {/* ── Filters ── */}
      <Card className="border shadow-sm bg-white dark:bg-zinc-900">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, company, or location…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus-visible:ring-indigo-500"
              />
            </div>

            {/* Employment Type */}
            <div className="flex items-center gap-2 min-w-[170px]">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
              <Select
                value={selectedType}
                onValueChange={(v) => {
                  setSelectedType(v);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                  <SelectValue placeholder="Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="min-w-[150px]">
              <Select
                value={selectedStatus}
                onValueChange={(v) => {
                  setSelectedStatus(v);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset */}
            {(searchQuery ||
              selectedType !== "All Types" ||
              selectedStatus !== "All Status") && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="shrink-0 text-muted-foreground hover:text-foreground"
                title="Reset filters"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Result count */}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {filteredJobs.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {myJobs.length}
              </span>{" "}
              jobs
            </p>
            {filteredJobs.length !== myJobs.length && (
              <Badge
                variant="secondary"
                className="text-xs bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
              >
                Filters active
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Job Grid ── */}
      {paginatedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No jobs found
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            {myJobs.length === 0
              ? "You haven't posted any jobs yet."
              : "No jobs match your current filters."}
          </p>
          {myJobs.length > 0 && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="mt-4 gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedJobs.map((job: any) => {
            const status = getStatusConfig(job.status);
            return (
              <Card
                key={job._id}
                className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200 rounded-2xl overflow-hidden"
              >
                {/* Top accent line */}
                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                <CardHeader className="pb-3 pt-5 px-5">
                  {/* Status + Type row */}
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 ${status.className}`}
                    >
                      {status.icon}
                      {status.label}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-900"
                    >
                      {job.employmentType ?? "N/A"}
                    </Badge>
                  </div>

                  {/* Job title */}
                  <h3 className="text-base font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {job.title}
                  </h3>

                  {/* Company */}
                  <div className="flex items-center gap-1.5 mt-1.5 text-sm text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{job.company?.name ?? "—"}</span>
                  </div>
                </CardHeader>

                <Separator className="mx-5 w-auto" />

                <CardContent className="flex flex-col flex-1 px-5 pt-4 pb-5 gap-4">
                  {/* Meta info */}
                  <div className="space-y-1.5">
                    {job.location && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                        <span className="truncate">{job.location}</span>
                      </div>
                    )}
                    {job.applicationDeadline && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                        <span>
                          Deadline:{" "}
                          {new Date(job.applicationDeadline).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    )}
                    {job.totalApplicants !== undefined && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                        <span>{job.totalApplicants} applicants</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {job.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  )}

                  {/* Skills preview */}
                  {job.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {job.skills.slice(0, 3).map((skill: string) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-[10px] px-2 py-0.5 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border-0"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {job.skills.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-2 py-0.5 bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border-0"
                        >
                          +{job.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Salary */}
                  {job.salary && (
                    <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      <span>
                        {job.salary.currency === "USD" ? "$" : "৳"}
                        {job.salary.min?.toLocaleString()}
                        {job.salary.max
                          ? ` – ${job.salary.currency === "USD" ? "$" : "৳"}${job.salary.max?.toLocaleString()}`
                          : ""}
                      </span>
                      <span className="text-xs font-normal text-muted-foreground">
                        / mo
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-1">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2 text-sm font-medium border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 transition-colors"
                      onClick={() => handleViewJob(job)}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0 border-zinc-200 dark:border-zinc-700 text-red-400 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950 dark:hover:border-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete Job Posting?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove{" "}
                            <span className="font-semibold text-foreground">
                              {job.title}
                            </span>{" "}
                            from your listings. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => handleDelete(job._id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-muted-foreground order-2 sm:order-1">
            Page{" "}
            <span className="font-medium text-foreground">{currentPage}</span>{" "}
            of <span className="font-medium text-foreground">{totalPages}</span>{" "}
            · {filteredJobs.length} results
          </p>

          <Pagination className="order-1 sm:order-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-40"
                      : "hover:text-indigo-600"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1,
                )
                .reduce<(number | "ellipsis")[]>((acc, page, idx, arr) => {
                  if (idx > 0 && (arr[idx - 1] as number) + 1 < page) {
                    acc.push("ellipsis");
                  }
                  acc.push(page);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === item}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(item as number);
                        }}
                        className={
                          currentPage === item
                            ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                            : "hover:text-indigo-600"
                        }
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-40"
                      : "hover:text-indigo-600"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* ── Job Detail Drawer ── */}
      <JobDetailDrawer
        job={selectedJob}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedJob(null);
        }}
      />
    </div>
  );
}
