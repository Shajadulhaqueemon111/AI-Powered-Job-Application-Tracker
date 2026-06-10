/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Mail,
  Phone,
  Globe,
  Briefcase,
  FileText,
  Calendar,
  ExternalLink,
  Download,
  AlertCircle,
  ChevronRight,
  Library,
  Edit,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useGetMeQuery } from "@/app/redux/features/auth/authApi";
import {
  useGetApplicationsQuery,
  useUpdateApplicationMutation,
} from "@/app/redux/features/application/application-api";
import toast from "react-hot-toast";
import { HrApplicantsSkeleton } from "./skeliton";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type ApplicationStatus =
  | "pending"
  | "in_review"
  | "shortlisted"
  | "interviewed"
  | "offered"
  | "hired"
  | "rejected";

interface Applicant {
  _id: string;
  jobId: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  linkedin?: string;
  portfolio?: string;
  experience?: string;
  coverLetter?: string;
  resumeUrl?: string;
  agreement: boolean;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "in_review", label: "In Review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interviewed", label: "Interviewed" },
  { value: "offered", label: "Offered" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

// All statuses available for the HR to set
const STATUS_UPDATE_OPTIONS: {
  value: ApplicationStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "pending",
    label: "Pending",
    description: "Application received, not yet reviewed",
  },
  {
    value: "in_review",
    label: "In Review",
    description: "Currently being evaluated by the team",
  },
  {
    value: "shortlisted",
    label: "Shortlisted",
    description: "Candidate moved to shortlist",
  },
  {
    value: "interviewed",
    label: "Interviewed",
    description: "Interview has been conducted",
  },
  {
    value: "offered",
    label: "Offered",
    description: "Job offer has been extended",
  },
  { value: "hired", label: "Hired", description: "Candidate has been hired" },
  {
    value: "rejected",
    label: "Rejected",
    description: "Application has been declined",
  },
];

const ITEMS_PER_PAGE = 10;

// ─── Status Config ────────────────────────────────────────────────────────────

function getStatusConfig(status: string) {
  switch (status?.toLowerCase()) {
    case "hired":
      return {
        label: "Hired",
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
        icon: <CheckCircle2 className="w-3 h-3" />,
      };
    case "offered":
      return {
        label: "Offered",
        className:
          "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
        icon: <FileText className="w-3 h-3" />,
      };
    case "shortlisted":
      return {
        label: "Shortlisted",
        className:
          "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800",
        icon: <ChevronRight className="w-3 h-3" />,
      };
    case "interviewed":
      return {
        label: "Interviewed",
        className:
          "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800",
        icon: <Users className="w-3 h-3" />,
      };
    case "in_review":
      return {
        label: "In Review",
        className:
          "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
        icon: <Eye className="w-3 h-3" />,
      };
    case "rejected":
      return {
        label: "Rejected",
        className:
          "bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
        icon: <XCircle className="w-3 h-3" />,
      };
    default:
      return {
        label: "Pending",
        className:
          "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
        icon: <Clock className="w-3 h-3" />,
      };
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
];

function avatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

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
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white dark:bg-zinc-800 shadow-sm shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className="text-xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

// ─── Detail Row ───────────────────────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  value,
  link,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  link?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-muted-foreground shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">
          {label}
        </p>
        {link ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 truncate mt-0.5"
          >
            <span className="truncate">{value}</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        ) : (
          <p className="text-sm text-foreground font-medium mt-0.5 break-words">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Status Update Dialog ─────────────────────────────────────────────────────

function StatusUpdateDialog({
  applicant,
  open,
  onClose,
  onSuccess,
}: {
  applicant: Applicant | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "">(
    "",
  );
  const [updateApplication, { isLoading }] = useUpdateApplicationMutation();

  // Reset selection when a new applicant is loaded
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && applicant) {
      setSelectedStatus(applicant.status);
    } else {
      setSelectedStatus("");
      onClose();
    }
  };

  const handleSave = async () => {
    if (!applicant || !selectedStatus) return;
    try {
      await updateApplication({
        id: applicant._id,
        status: selectedStatus,
      }).unwrap();
      toast.success(
        `Status updated to "${getStatusConfig(selectedStatus).label}" for ${applicant.fullName}`,
      );
      onClose();
      onSuccess();
    } catch {
      toast.error("Failed to update status. Please try again.");
    }
  };

  if (!applicant) return null;

  const initials = getInitials(applicant.fullName);
  const color = avatarColor(applicant.fullName);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 gap-0 overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold shrink-0 ${color}`}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold text-foreground leading-tight">
                Update Application Status
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 truncate">
                {applicant.fullName} · {applicant.email}
              </DialogDescription>
            </div>
          </div>

          {/* Current status */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Current status:</span>
            <Badge
              variant="outline"
              className={`flex items-center gap-1 text-xs font-medium ${getStatusConfig(applicant.status).className}`}
            >
              {getStatusConfig(applicant.status).icon}
              {getStatusConfig(applicant.status).label}
            </Badge>
          </div>
        </DialogHeader>

        {/* Status Options */}
        <div className="px-6 py-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Select New Status
          </p>
          <div className="space-y-2">
            {STATUS_UPDATE_OPTIONS.map((option) => {
              const config = getStatusConfig(option.value);
              const isSelected = selectedStatus === option.value;
              const isCurrent = applicant.status === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150
                    ${
                      isSelected
                        ? "border-indigo-300 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-950/60 ring-1 ring-indigo-200 dark:ring-indigo-800"
                        : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    }`}
                >
                  {/* Status badge */}
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1 text-xs font-medium shrink-0 ${config.className}`}
                  >
                    {config.icon}
                    {config.label}
                  </Badge>

                  {/* Description */}
                  <span className="text-xs text-muted-foreground flex-1 min-w-0 truncate">
                    {option.description}
                  </span>

                  {/* Indicators */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isCurrent && (
                      <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">
                        Current
                      </span>
                    )}
                    {isSelected && !isCurrent && (
                      <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                    {isSelected && isCurrent && (
                      <div className="w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-600 flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl border-zinc-200 dark:border-zinc-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              isLoading ||
              !selectedStatus ||
              selectedStatus === applicant.status
            }
            className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Save Status
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Applicant Detail Drawer ──────────────────────────────────────────────────

export function ApplicantDrawer({
  applicant,
  open,
  onClose,
}: {
  applicant: Applicant | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!applicant) return null;

  const status = getStatusConfig(applicant.status);
  const initials = getInitials(applicant.fullName);
  const color = avatarColor(applicant.fullName);
  const handleDownloadResume = async () => {
    try {
      const response = await fetch(applicant.resumeUrl!, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${applicant.fullName}-resume.pdf`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };
  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-[500px] h-full p-0 flex flex-col bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800"
      >
        {/* Header */}
        <div className="shrink-0 px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <SheetHeader className="space-y-0">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-2xl text-lg font-bold shrink-0 ${color}`}
              >
                {initials}
              </div>

              <div className="flex-1 min-w-0">
                <SheetTitle className="text-lg font-bold text-foreground">
                  {applicant.fullName}
                </SheetTitle>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                  {applicant.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge
                variant="outline"
                className={`flex items-center gap-1 text-xs font-medium ${status.className}`}
              >
                {status.icon}
                {status.label}
              </Badge>

              {applicant.experience && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
                >
                  {applicant.experience}
                </Badge>
              )}

              <Badge
                variant="secondary"
                className="text-xs bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border-0"
              >
                Applied {formatDate(applicant.createdAt)}
              </Badge>
            </div>
          </SheetHeader>
        </div>

        {/* Scrollable body */}
        <ScrollArea className="flex-1 h-0">
          <div className="px-6 py-4 space-y-4">
            {/* Contact Info */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Contact Information
              </p>

              <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800 px-3">
                <DetailRow
                  icon={<Mail className="w-3.5 h-3.5" />}
                  label="Email"
                  value={applicant.email}
                  link
                />
                <DetailRow
                  icon={<Phone className="w-3.5 h-3.5" />}
                  label="Phone"
                  value={applicant.phone}
                />
                <DetailRow
                  icon={<Library className="w-3.5 h-3.5" />}
                  label="LinkedIn"
                  value={applicant.linkedin}
                  link
                />
                <DetailRow
                  icon={<Globe className="w-3.5 h-3.5" />}
                  label="Portfolio"
                  value={applicant.portfolio}
                  link
                />
              </div>
            </div>

            <Separator className="bg-zinc-100 dark:bg-zinc-800" />

            {/* Experience */}
            {applicant.experience && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Experience
                </p>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900">
                  <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                    {applicant.experience}
                  </span>
                </div>
              </div>
            )}

            {/* Cover Letter */}
            {applicant.coverLetter && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Cover Letter
                </p>

                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {applicant.coverLetter}
                  </p>
                </div>
              </div>
            )}

            {/* Resume */}
            {applicant.resumeUrl && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Resume
                </p>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950 shrink-0">
                    <FileText className="w-5 h-5 text-red-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      Resume — {applicant.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF Document
                    </p>
                  </div>

                  <a
                    href={applicant.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-xs rounded-lg border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 hover:text-indigo-600"
                    >
                      <Download className="w-3.5 h-3.5" />
                      View
                    </Button>
                  </a>
                </div>
              </div>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadResume}
              className="gap-1.5 text-xs rounded-lg cursor-pointer border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 hover:text-indigo-600"
            >
              <Download className="w-3.5 h-3.5" />
              Resume Download
            </Button>
            {/* Meta */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Application Info
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Applied on
                  </span>
                  <span className="font-medium text-foreground">
                    {formatDate(applicant.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> Agreement
                  </span>

                  <Badge
                    variant="outline"
                    className={
                      applicant.agreement
                        ? "text-xs bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                        : "text-xs bg-red-50 text-red-600 border-red-200"
                    }
                  >
                    {applicant.agreement ? "Agreed" : "Not agreed"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground text-xs font-mono">
                    App ID
                  </span>
                  <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-muted-foreground">
                    {applicant._id?.slice(-8) ?? "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <Button
            variant="outline"
            className="w-full rounded-xl border-zinc-200 dark:border-zinc-700"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse"
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HrApplicants() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  // View drawer state
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Status update dialog state
  const [editApplicant, setEditApplicant] = useState<Applicant | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const debouncedSearch = search;
  const router = useRouter(); // import { useRouter } from "next/navigation"

  const handleMessage = (applicant: Applicant) => {
    router.push(`/hr-dashboard/chat-message?applicationId=${applicant._id}`);
  };
  const { data: me } = useGetMeQuery();
  const hrId = me?.data?.user?._id;

  const { data, isLoading, isFetching, refetch } = useGetApplicationsQuery(
    {
      hrId,
      search: debouncedSearch || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      page,
    },
    { skip: !hrId },
  );

  const applicants: Applicant[] = Array.isArray(data?.data?.data)
    ? data.data.data
    : [];

  const totalPages: number =
    data?.data?.meta?.totalPages ??
    Math.ceil((data?.data?.meta?.total ?? applicants.length) / ITEMS_PER_PAGE);

  const total: number = data?.data?.meta?.total ?? applicants.length;

  const pending = applicants.filter((a) => a.status === "pending").length;
  const hired = applicants.filter((a) => a.status === "hired").length;
  const inReview = applicants.filter((a) => a.status === "in_review").length;
  const offered = applicants.filter((a) => a.status === "offered").length;
  const rejected = applicants.filter((a) => a.status === "rejected").length;
  const interviewed = applicants.filter(
    (a) => a.status === "interviewed",
  ).length;
  const shortlisted = applicants.filter(
    (a) => a.status === "shortlisted",
  ).length;

  const handleReset = useCallback(() => {
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  }, []);

  const handleView = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setDrawerOpen(true);
  };

  // ✅ Opens the status update dialog
  const handleEdit = (applicant: Applicant) => {
    setEditApplicant(applicant);

    setStatusDialogOpen(true);
  };

  const hasFilters = search || statusFilter !== "all";
  if (isLoading || isFetching) {
    return <HrApplicantsSkeleton />;
  }
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Applicants
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          All candidates who applied to your job listings
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Users className="w-4.5 h-4.5 text-indigo-600" />}
          label="Total"
          value={total}
          color="border-indigo-100 dark:border-indigo-900"
        />
        <StatCard
          icon={<Clock className="w-4.5 h-4.5 text-amber-500" />}
          label="Pending"
          value={pending}
          color="border-amber-100 dark:border-amber-900"
        />
        <StatCard
          icon={<ChevronRight className="w-4.5 h-4.5 text-sky-500" />}
          label="Shortlisted"
          value={shortlisted}
          color="border-sky-100 dark:border-sky-900"
        />
        <StatCard
          icon={<ChevronRight className="w-4.5 h-4.5 text-sky-500" />}
          label="interviewed"
          value={interviewed}
          color="border-sky-100 dark:border-sky-900"
        />
        <StatCard
          icon={<ChevronRight className="w-4.5 h-4.5 text-sky-500" />}
          label="rejected"
          value={rejected}
          color="border-sky-100 dark:border-sky-900"
        />
        <StatCard
          icon={<ChevronRight className="w-4.5 h-4.5 text-sky-500" />}
          label="in review"
          value={inReview}
          color="border-sky-100 dark:border-sky-900"
        />
        <StatCard
          icon={<ChevronRight className="w-4.5 h-4.5 text-sky-500" />}
          label="offered"
          value={offered}
          color="border-sky-100 dark:border-sky-900"
        />
        <StatCard
          icon={<CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />}
          label="Hired"
          value={hired}
          color="border-emerald-100 dark:border-emerald-900"
        />
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl focus-visible:ring-indigo-400"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2 min-w-[170px]">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTER_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reset */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              title="Reset filters"
              className="text-muted-foreground hover:text-foreground shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Result info */}
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {applicants.length}
            </span>{" "}
            {total > applicants.length && (
              <>
                of <span className="font-medium text-foreground">{total}</span>
              </>
            )}{" "}
            applicants
          </p>
          {hasFilters && (
            <Badge
              variant="secondary"
              className="text-xs bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
            >
              Filters active
            </Badge>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {isLoading || isFetching ? (
          <div className="p-6">
            <TableSkeleton />
          </div>
        ) : applicants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
              <Users className="w-7 h-7 text-zinc-400" />
            </div>
            <p className="text-base font-semibold text-foreground">
              No applicants found
            </p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              {hasFilters
                ? "Try adjusting your search or filters."
                : "No one has applied to your jobs yet."}
            </p>
            {hasFilters && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="mt-4 gap-2 rounded-xl"
              >
                <RotateCcw className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground pl-6">
                  Applicant
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">
                  Contact
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden lg:table-cell">
                  Experience
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">
                  Applied
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right pr-6">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {applicants.map((applicant) => {
                const status = getStatusConfig(applicant.status);
                const initials = getInitials(applicant.fullName);
                const color = avatarColor(applicant.fullName);

                return (
                  <TableRow
                    key={applicant._id}
                    className="group hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors cursor-pointer border-zinc-100 dark:border-zinc-800"
                    onClick={() => handleView(applicant)}
                  >
                    {/* Applicant */}
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold shrink-0 ${color}`}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate group-hover:text-indigo-600 transition-colors">
                            {applicant.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate md:hidden">
                            {applicant.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell className="hidden md:table-cell py-4">
                      <div className="space-y-0.5">
                        <p className="text-sm text-foreground">
                          {applicant.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {applicant.phone}
                        </p>
                      </div>
                    </TableCell>

                    {/* Experience */}
                    <TableCell className="hidden lg:table-cell py-4">
                      {applicant.experience ? (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border-0"
                        >
                          {applicant.experience}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Applied date */}
                    <TableCell className="hidden sm:table-cell py-4">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(applicant.createdAt)}
                      </p>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 text-xs font-medium w-fit ${status.className}`}
                      >
                        {status.icon}
                        <span>{status.label}</span>
                      </Badge>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right pr-6 py-4">
                      {/* ✅ Edit opens Status Update Dialog */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(applicant);
                        }}
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline cursor-pointer">
                          Edit
                        </span>
                      </Button>

                      {/* View opens the detail drawer */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(applicant);
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline cursor-pointer">
                          View
                        </span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMessage(applicant);
                        }}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline cursor-pointer">
                          Message
                        </span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground order-2 sm:order-1">
            Page <span className="font-medium text-foreground">{page}</span> of{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </p>

          <Pagination className="order-1 sm:order-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage((p) => p - 1);
                  }}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-40"
                      : "hover:text-indigo-600"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                )
                .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && (arr[idx - 1] as number) + 1 < p) {
                    acc.push("ellipsis");
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "ellipsis" ? (
                    <PaginationItem key={`e-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href="#"
                        isActive={page === item}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(item as number);
                        }}
                        className={
                          page === item
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
                    if (page < totalPages) setPage((p) => p + 1);
                  }}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-40"
                      : "hover:text-indigo-600"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* ── Detail Drawer ── */}
      <ApplicantDrawer
        applicant={selectedApplicant}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedApplicant(null);
        }}
      />

      {/* ── Status Update Dialog ── */}
      <StatusUpdateDialog
        applicant={editApplicant}
        open={statusDialogOpen}
        onClose={() => {
          setStatusDialogOpen(false);
          setEditApplicant(null);
        }}
        onSuccess={refetch}
      />
    </div>
  );
}
