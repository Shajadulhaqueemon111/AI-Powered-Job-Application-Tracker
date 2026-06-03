/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";

import { Search, MapPin, Building2, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useGetJobsQuery } from "@/app/redux/features/jobs/jobs-api";
import {
  useCreateApplicationMutation,
  useGetMyApplicationsQuery,
} from "@/app/redux/features/application/application-api";
import { useAppSelector } from "@/app/redux/hooks";
import { useGetMeQuery } from "@/app/redux/features/auth/authApi";

// ─── API Response Types ──────────────────────────────────────────────
type ApiJob = {
  _id: string;
  title: string;
  company: {
    name: string;
    logo: string;
    website: string;
    _id: string;
  };
  location: string;
  workType: "Remote" | "Onsite" | "Hybrid";
  employmentType: string;
  experienceLevel: string;
  salary: {
    min: number;
    max: number;
    currency: string;
    _id: string;
  };
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  applicationDeadline: string;
  totalApplicants: number;
  createdBy: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────
const formatSalary = (salary: ApiJob["salary"]) => {
  const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`);
  return `${salary.currency} ${fmt(salary.min)} - ${fmt(salary.max)}`;
};

const formatExperience = (level: string) => {
  const map: Record<string, string> = {
    Junior: "Junior Level",
    Mid: "2+ Years Experience",
    Senior: "Senior Level",
  };
  return map[level] ?? level;
};

// ─── Constants ───────────────────────────────────────────────────────
const filters = [
  "All Jobs",
  "Remote",
  "Hybrid",
  "Onsite",
  "Easy Apply",
  "Under 10 applicants",
];

const PER_PAGE = 6;

// ─── Component ───────────────────────────────────────────────────────
export default function AllJobsWithDrawer() {
  const {
    data,
    isLoading,
    isError,
    refetch: refetchJobs,
  } = useGetJobsQuery(undefined);

  const jobs: ApiJob[] = data?.data ?? [];
  console.log("Fetched Jobs:", jobs);
  const [selectedJob, setSelectedJob] = React.useState<ApiJob | null>(null);
  const [openJobDrawer, setOpenJobDrawer] = React.useState(false);
  const [openApplyDrawer, setOpenApplyDrawer] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState("All Jobs");
  const [page, setPage] = React.useState(1);
  const [phone, setPhone] = React.useState("");
  // ─── Add mutation hook (inside the component, near other hooks) ───────
  const [createApplication, { isLoading: isSubmitting }] =
    useCreateApplicationMutation();

  // ─── Add form state ───────────────────────────────────────────────────
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    linkedIn: "",
    portfolio: "",
    yearsOfExperience: "",
    coverLetter: "",
    resumeUrl: "",
  });
  const [resume, setResume] = React.useState<File | null>(null);
  const [agreed, setAgreed] = React.useState(false);

  const { data: meData } = useGetMeQuery();
  const userEmail = meData?.data?.user?.email ?? "";

  const { data: applications } = useGetMyApplicationsQuery(userEmail, {
    skip: !userEmail,
  });

  console.log("My Applications:", applications);

  const appliedJobs = React.useMemo(() => {
    return applications?.data?.map((a: any) => a.jobId) ?? [];
  }, [applications]);
  // ─── Add submit handler ───────────────────────────────────────────────
  const handleApplySubmit = async () => {
    if (!agreed) return toast.error("Please agree to the terms.");
    if (!selectedJob) return;

    const data = new FormData();

    data.append("jobId", selectedJob._id);
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("phone", phone);
    data.append("experience", formData.yearsOfExperience);
    data.append("coverLetter", formData.coverLetter);
    data.append("agreement", agreed ? "true" : "false");

    if (formData.linkedIn) {
      data.append("linkedin", formData.linkedIn);
    }

    if (formData.portfolio) {
      data.append("portfolio", formData.portfolio);
    }

    // 🔥 THIS IS MOST IMPORTANT
    if (resume) {
      data.append("resume", resume);
    }

    try {
      await createApplication(data).unwrap();
      await refetchJobs();

      setOpenApplyDrawer(false);

      setFormData({
        fullName: "",
        email: "",
        linkedIn: "",
        portfolio: "",
        yearsOfExperience: "",
        coverLetter: "",
        resumeUrl: "",
      });

      setResume(null);
      setPhone("");
      setAgreed(false);

      toast.success("Application submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit application");
    }
  };
  // ── Filter ──────────────────────────────────────────────────────────
  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.name.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      activeFilter === "All Jobs"
        ? true
        : activeFilter === "Under 10 applicants"
          ? job.totalApplicants < 10
          : activeFilter === "Easy Apply"
            ? true
            : job.workType === activeFilter;

    return matchSearch && matchFilter;
  });

  // ── Pagination ──────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PER_PAGE));
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );

  // ── Loading / Error States ──────────────────────────────────────────
  const renderState = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <p className="text-sm"> jobs…</p>
        </div>
      );
    }
    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-red-400">
          <AlertCircle className="h-10 w-10" />
          <p className="text-sm font-medium">
            Failed to load jobs. Please try again later.
          </p>
        </div>
      );
    }
    if (filteredJobs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
          <Search className="h-10 w-10" />
          <p className="text-sm">No jobs found for your search.</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white p-6 space-y-8">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Find Your Dream Job 🚀
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Discover top tech jobs with AI-powered matching
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search jobs, companies..."
          className="pl-10 h-12 rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setActiveFilter(filter);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm border transition-all
              ${
                activeFilter === filter
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* JOB GRID */}
      {renderState() ?? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedJobs.map((job) => (
            <Card
              key={job._id}
              className="rounded-3xl border-0 bg-white dark:bg-gray-900 shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <CardContent className="p-6 space-y-5">
                {/* TOP */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{job.title}</h2>
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Building2 className="h-4 w-4" />
                        {job.company.name}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    {job.workType}
                  </Badge>
                </div>

                {/* SKILLS */}
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="rounded-full"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* INFO */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Salary</span>
                    <span className="font-semibold">
                      {formatSalary(job.salary)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Experience</span>
                    <span>{formatExperience(job.experienceLevel)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Applicants</span>
                    <span>{job.totalApplicants} Applied</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span>{job.employmentType}</span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                    disabled={appliedJobs.includes(job._id)}
                    onClick={() => {
                      if (appliedJobs.includes(job._id)) return;

                      setSelectedJob(job);
                      setOpenApplyDrawer(true);
                    }}
                  >
                    {appliedJobs.includes(job._id) ? "Applied" : "Apply Now"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl"
                    onClick={() => {
                      setSelectedJob(job);
                      setOpenJobDrawer(true);
                    }}
                  >
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {!isLoading && !isError && filteredJobs.length > 0 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Prev
          </Button>
          <div className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      )}

      {/* ── JOB DETAILS DRAWER ─────────────────────────────────────── */}
      <Drawer
        direction="right"
        open={openJobDrawer}
        onOpenChange={setOpenJobDrawer}
      >
        <DrawerContent className="w-full sm:max-w-[550px] ml-auto bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800">
          {selectedJob && (
            <>
              <DrawerHeader>
                <DrawerTitle className="text-2xl">
                  {selectedJob.title}
                </DrawerTitle>
                <DrawerDescription className="pt-2">
                  {selectedJob.company.name} • {selectedJob.location}
                </DrawerDescription>
              </DrawerHeader>

              <div className="px-6 pb-6 overflow-y-auto max-h-[80vh] space-y-6">
                {/* TOP INFO */}
                <div className="flex flex-wrap gap-3">
                  <Badge>{selectedJob.workType}</Badge>
                  <Badge variant="secondary">
                    {formatSalary(selectedJob.salary)}
                  </Badge>
                  <Badge variant="outline">
                    {formatExperience(selectedJob.experienceLevel)}
                  </Badge>
                  <Badge variant="outline">{selectedJob.employmentType}</Badge>
                </div>

                {/* DEADLINE */}
                <p className="text-xs text-gray-400">
                  Deadline:{" "}
                  {new Date(selectedJob.applicationDeadline).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>

                {/* DESCRIPTION */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">About the Role</h3>
                  <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">
                    {selectedJob.description}
                  </p>
                </div>

                {/* RESPONSIBILITIES */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    Responsibilities
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {selectedJob.responsibilities.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* REQUIREMENTS */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Requirements</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {selectedJob.requirements.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* BENEFITS */}
                {selectedJob.benefits?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Benefits</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      {selectedJob.benefits.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* SKILLS */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <DrawerFooter>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={
                    selectedJob ? appliedJobs.includes(selectedJob._id) : false
                  }
                  onClick={() => {
                    if (!selectedJob) return;

                    if (appliedJobs.includes(selectedJob._id)) {
                      toast.error("Already Applied");
                      return;
                    }

                    setOpenJobDrawer(false);
                    setOpenApplyDrawer(true);
                  }}
                >
                  {selectedJob && appliedJobs.includes(selectedJob._id)
                    ? "Already Applied"
                    : "Apply This Job"}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* ── APPLY FORM DRAWER ──────────────────────────────────────── */}
      <Drawer
        direction="right"
        open={openApplyDrawer}
        onOpenChange={setOpenApplyDrawer}
      >
        <DrawerContent className="w-full sm:max-w-[600px] ml-auto bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800">
          {selectedJob && (
            <>
              <DrawerHeader>
                <DrawerTitle className="text-2xl">
                  Apply for {selectedJob.title}
                </DrawerTitle>
                <DrawerDescription>
                  {selectedJob.company.name} • {selectedJob.location}
                </DrawerDescription>
              </DrawerHeader>

              <div className="overflow-y-auto max-h-[80vh] px-6 pb-6 space-y-5">
                {/* FULL NAME */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>

                {/* EMAIL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                {/* PHONE */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <PhoneInput
                    country={"bd"}
                    value={phone}
                    onChange={(value) => setPhone(value)}
                    enableSearch
                    searchPlaceholder="Search country..."
                    placeholder="Enter phone number"
                    containerClass="w-full"
                    inputClass="!w-full !h-12 !rounded-xl 
                !bg-white dark:!bg-zinc-900 
                !text-black dark:!text-white
                !border !border-zinc-300 dark:!border-zinc-700
                focus:!ring-2 focus:!ring-emerald-500
                !pl-14"
                    buttonClass="!bg-white dark:!bg-zinc-900
                !border !border-zinc-300 dark:!border-zinc-700
                !rounded-l-xl hover:!bg-zinc-100 dark:hover:!bg-zinc-800"
                    dropdownClass="!bg-white dark:!bg-zinc-900 
                !text-black dark:!text-white
                !border !border-zinc-300 dark:!border-zinc-700"
                    searchClass="!bg-zinc-100 dark:!bg-zinc-800
                !text-black dark:!text-white
                !border !border-zinc-300 dark:!border-zinc-700
                !rounded-lg"
                  />
                </div>

                {/* LINKEDIN */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    LinkedIn Profile
                  </label>
                  <Input
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedIn}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedIn: e.target.value })
                    }
                  />
                </div>

                {/* PORTFOLIO */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Portfolio Website
                  </label>
                  <Input
                    placeholder="https://yourportfolio.com"
                    value={formData.portfolio}
                    onChange={(e) =>
                      setFormData({ ...formData, portfolio: e.target.value })
                    }
                  />
                </div>

                {/* EXPERIENCE */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Years of Experience
                  </label>
                  <Input
                    placeholder="3 Years"
                    value={formData.yearsOfExperience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        yearsOfExperience: e.target.value,
                      })
                    }
                  />
                </div>

                {/* COVER LETTER */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cover Letter</label>
                  <Textarea
                    placeholder="Write why you are a perfect fit..."
                    className="min-h-[140px]"
                    value={formData.coverLetter}
                    onChange={(e) =>
                      setFormData({ ...formData, coverLetter: e.target.value })
                    }
                  />
                </div>

                {/* RESUME */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Resume</label>
                  <Input
                    type="file"
                    onChange={(e) => setResume(e.target.files?.[0] ?? null)}
                  />
                </div>

                {/* AGREEMENT */}
                <div className="flex items-start gap-3 rounded-xl border p-4">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <p className="text-sm text-gray-500">
                    I confirm that all information provided is accurate and
                    agree to the processing of my application.
                  </p>
                </div>
              </div>

              <DrawerFooter>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleApplySubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
