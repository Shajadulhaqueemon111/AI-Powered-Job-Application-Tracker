/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  MapPin,
  Briefcase,
  Clock,
  Building2,
  Globe,
  DollarSign,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Layers,
  Zap,
  Gift,
  ListChecks,
  ShieldCheck,
  ExternalLink,
  CalendarDays,
  Timer,
} from "lucide-react";

import Image from "next/image";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Job {
  _id: string;
  title: string;
  company?: {
    name?: string;
    logo?: string;
    website?: string;
  };
  location?: string;
  workType?: string;
  employmentType?: string;
  experienceLevel?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  skills?: string[];
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  applicationDeadline?: string;
  totalApplicants?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface JobDetailDrawerProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getStatusConfig(status?: string) {
  switch (status?.toLowerCase()) {
    case "active":
      return {
        label: "Active",
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
        icon: <CheckCircle2 className="w-3 h-3" />,
      };
    case "closed":
      return {
        label: "Closed",
        className:
          "bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
        icon: <XCircle className="w-3 h-3" />,
      };
    default:
      return {
        label: "Draft",
        className:
          "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
        icon: <Clock className="w-3 h-3" />,
      };
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatSalary(salary?: Job["salary"]) {
  if (!salary) return null;

  const currency = salary.currency ?? "USD";
  const symbol = currency === "USD" ? "$" : currency === "BDT" ? "৳" : currency;

  if (salary.min && salary.max) {
    return `${symbol}${salary.min.toLocaleString()} – ${symbol}${salary.max.toLocaleString()} / mo`;
  }

  if (salary.min) return `${symbol}${salary.min.toLocaleString()} / mo`;

  return null;
}

// ─── Section ───────────────────────────────────────────────────────────────

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
        <h4 className="text-sm font-semibold uppercase">{title}</h4>
      </div>
      {children}
    </div>
  );
}

// ─── Bullet List ───────────────────────────────────────────────────────────

function BulletList({ items }: { items?: string[] }) {
  if (!items?.length) return <p className="text-sm text-muted-foreground">—</p>;

  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────

export function JobDetailDrawer({ job, open, onClose }: JobDetailDrawerProps) {
  if (!job) return null;

  const status = getStatusConfig(job.status);
  const salaryText = formatSalary(job.salary);

  const initials =
    job.company?.name
      ?.split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() ?? "??";

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[520px] p-0 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col"
      >
        {/* HEADER (UNCHANGED) */}
        <div className="shrink-0 px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <SheetHeader>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center">
                {job.company?.logo ? (
                  <Image
                    src={job.company.logo}
                    alt=""
                    width={40}
                    height={40}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  initials
                )}
              </div>

              <div>
                <SheetTitle>{job.title}</SheetTitle>
                <SheetDescription>{job.company?.name}</SheetDescription>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <Badge>{status.label}</Badge>
              {job.employmentType && <Badge>{job.employmentType}</Badge>}
              {job.workType && <Badge>{job.workType}</Badge>}
            </div>
          </SheetHeader>
        </div>

        {/* ✅ ONLY SCROLL FIX HERE */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="px-6 py-5 space-y-6">
              {/* Quick Info */}
              {/* ── Quick Info Grid ── */}
              <div className="grid grid-cols-2 gap-3">
                {job.location && (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700">
                    <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                        Location
                      </p>
                      <p className="text-xs font-semibold text-foreground mt-0.5 leading-tight">
                        {job.location}
                      </p>
                    </div>
                  </div>
                )}
                {salaryText && (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-900">
                    <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-emerald-600 dark:text-emerald-400 font-medium">
                        Salary
                      </p>
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mt-0.5 leading-tight">
                        {salaryText}
                      </p>
                    </div>
                  </div>
                )}
                {job.applicationDeadline && (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900">
                    <Timer className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-amber-600 dark:text-amber-400 font-medium">
                        Deadline
                      </p>
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mt-0.5 leading-tight">
                        {formatDate(job.applicationDeadline)}
                      </p>
                    </div>
                  </div>
                )}
                {job.totalApplicants !== undefined && (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-violet-50 dark:bg-violet-950 border border-violet-100 dark:border-violet-900">
                    <Users className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-violet-600 dark:text-violet-400 font-medium">
                        Applicants
                      </p>
                      <p className="text-xs font-semibold text-violet-700 dark:text-violet-300 mt-0.5 leading-tight">
                        {job.totalApplicants} applied
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {job.description && (
                <Section icon={<Briefcase />} title="About">
                  <p>{job.description}</p>
                </Section>
              )}

              {job.skills?.length ? (
                <Section icon={<Zap />} title="Skills">
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>
                </Section>
              ) : null}

              {job.responsibilities?.length ? (
                <Section icon={<ListChecks />} title="Responsibilities">
                  <BulletList items={job.responsibilities} />
                </Section>
              ) : null}

              {job.requirements?.length ? (
                <Section icon={<ShieldCheck />} title="Requirements">
                  <BulletList items={job.requirements} />
                </Section>
              ) : null}

              {job.benefits?.length ? (
                <Section icon={<Gift />} title="Benefits">
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.map((b) => (
                      <Badge key={b}>{b}</Badge>
                    ))}
                  </div>
                </Section>
              ) : null}

              <Separator />

              <Section icon={<CalendarDays />} title="Info">
                <p>Posted: {formatDate(job.createdAt)}</p>
                <p>Updated: {formatDate(job.updatedAt)}</p>
              </Section>
            </div>

            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>

        {/* FOOTER (UNCHANGED) */}
        <div className="shrink-0 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Close
            </Button>
            <Button className="flex-1">View Applicants</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
