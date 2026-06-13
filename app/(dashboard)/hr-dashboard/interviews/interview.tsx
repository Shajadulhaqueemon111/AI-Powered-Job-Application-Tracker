/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BriefcaseIcon,
  UsersIcon,
  ClipboardListIcon,
  EyeIcon,
} from "lucide-react";
import { useGetMeQuery } from "@/app/redux/features/auth/authApi";
import { useGetApplicationsQuery } from "@/app/redux/features/application/application-api";
// ✅ নিজের Applicant interface সরিয়ে all-applicants থেকে import করছি
import { ApplicantDrawer, type Applicant } from "../applicants/all-applicants";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return (name ?? "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getJobTitle(
  app: Applicant & {
    job?: { _id: string; title: string; hr: string };
    jobTitle?: string;
  },
): string {
  return (app as any).job?.title ?? (app as any).jobTitle ?? "—";
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <TableRow>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-4 w-full rounded" />
        </TableCell>
      ))}
    </TableRow>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InterviewedApplicantsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: meData, isLoading: meLoading } = useGetMeQuery();
  const hrId: string | undefined = meData?.data?.user?._id;

  const { data: applicationsData, isLoading: appsLoading } =
    useGetApplicationsQuery({ hrId, status: "interviewed" }, { skip: !hrId });

  const rawData = applicationsData?.data;
  // ✅ as Applicant[] cast — API data টা imported type এ convert করছি
  const allApplications: Applicant[] = (
    Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.applications)
        ? rawData.applications
        : Array.isArray(rawData?.data)
          ? rawData.data
          : Array.isArray(applicationsData)
            ? applicationsData
            : []
  ) as Applicant[];

  const filteredApplications = useMemo(() => {
    return allApplications.filter((app) => app.status === "interviewed");
  }, [allApplications]);

  const totalCount = filteredApplications.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredApplications.slice(start, start + PAGE_SIZE);
  }, [filteredApplications, currentPage]);

  const isLoading = meLoading || appsLoading;

  const uniqueJobs = new Set(filteredApplications.map((a) => a.jobId)).size;

  function handleView(app: Applicant) {
    setSelectedApplicant(app);
    setDrawerOpen(true);
  }

  return (
    <div className="p-6 max-w-7xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <UsersIcon className="w-6 h-6" />
          Interviewed Applicants
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Candidates who applied to your posted jobs and have been interviewed
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<UsersIcon className="w-5 h-5 text-emerald-600" />}
          label="Total interviewed"
          value={isLoading ? "…" : String(totalCount)}
          bg="bg-emerald-50 dark:bg-emerald-950/30"
        />
        <StatCard
          icon={<BriefcaseIcon className="w-5 h-5 text-violet-600" />}
          label="Jobs with interviews"
          value={isLoading ? "…" : String(uniqueJobs)}
          bg="bg-violet-50 dark:bg-violet-950/30"
        />
        <StatCard
          icon={<ClipboardListIcon className="w-5 h-5 text-amber-600" />}
          label="Total pages"
          value={isLoading ? "…" : String(totalPages)}
          bg="bg-amber-50 dark:bg-amber-950/30"
        />
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border border-border/60">
        <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-border/50">
          <CardTitle className="text-base font-medium">
            All interviewed candidates
          </CardTitle>
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs px-3"
          >
            interviewed
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[24%] pl-6">Applicant</TableHead>
                <TableHead className="w-[20%]">Job title</TableHead>
                <TableHead className="w-[14%]">Experience</TableHead>
                <TableHead className="w-[18%]">Applied</TableHead>
                <TableHead className="w-[12%]">Status</TableHead>
                <TableHead className="w-[12%] text-right pr-6">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : paginatedApplications.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-16 text-muted-foreground text-sm"
                  >
                    No interviewed applicants found for your posted jobs.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedApplications.map((app) => (
                  <TableRow
                    key={app._id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => handleView(app)}
                  >
                    {/* Applicant */}
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                            {getInitials(app.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none text-foreground">
                            {app.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-35">
                            {app.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Job Title */}
                    <TableCell>
                      <span className="text-sm text-foreground font-medium">
                        {getJobTitle(app)}
                      </span>
                    </TableCell>

                    {/* Experience */}
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {app.experience ? `${app.experience} years` : "—"}
                      </span>
                    </TableCell>

                    {/* Applied date */}
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(app.createdAt)}
                      </span>
                    </TableCell>

                    {/* Status badge */}
                    <TableCell>
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-0 text-xs font-medium capitalize">
                        {app.status}
                      </Badge>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-3 text-xs gap-1.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(app);
                        }}
                      >
                        <EyeIcon className="w-3.5 h-3.5" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {!isLoading && totalCount > 0 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, totalCount)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {totalCount}
                </span>{" "}
                applicants
              </p>

              <Pagination>
                <PaginationContent className="gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((p) => Math.max(1, p - 1));
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-40"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {buildPageRange(currentPage, totalPages).map((item, idx) =>
                    item === "ellipsis" ? (
                      <PaginationItem key={`e-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          href="#"
                          isActive={item === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(item as number);
                          }}
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
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-40"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ✅ same ApplicantDrawer — সব details দেখাবে */}
      <ApplicantDrawer
        applicant={selectedApplicant}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setTimeout(() => setSelectedApplicant(null), 300);
        }}
      />
    </div>
  );
}

// ─── StatCard ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
}) {
  return (
    <div className={`rounded-xl p-4 ${bg}`}>
      <div className="flex items-center gap-2 mb-2">{icon}</div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
    </div>
  );
}

// ─── Pagination range builder ─────────────────────────────────────────────────

function buildPageRange(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);

  return pages;
}
