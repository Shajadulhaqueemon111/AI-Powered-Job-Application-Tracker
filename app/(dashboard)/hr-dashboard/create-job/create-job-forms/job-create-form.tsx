/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useForm,
  useFieldArray,
  UseFieldArrayReturn,
  UseFormRegister,
  Controller,
  Control,
  FieldErrors,
} from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  Plus,
  Trash2,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  FileText,
  CheckSquare,
  Star,
  Gift,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { useCreateJobMutation } from "@/app/redux/features/jobs/jobs-api";

/* =========================================================
   ZOD SCHEMA  (unchanged)
========================================================= */
const jobSchema = z.object({
  title: z.string().min(2, "Job title is required"),
  company: z.object({
    name: z.string().min(2, "Company name is required"),
    logo: z.instanceof(File).optional(),
    website: z.string().optional(),
  }),
  location: z.string().min(2, "Location is required"),
  workType: z.enum(["Remote", "Hybrid", "Onsite"]),
  employmentType: z.enum(["Full-time", "Part-time", "Internship", "Contract"]),
  experienceLevel: z.enum(["Junior", "Mid", "Senior"]),
  salary: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.string(),
  }),
  skills: z.array(z.object({ value: z.string() })),
  description: z.string().min(10, "Description must be at least 10 characters"),
  responsibilities: z.array(z.object({ value: z.string() })),
  requirements: z.array(z.object({ value: z.string() })),
  benefits: z.array(z.object({ value: z.string() })),
  applicationDeadline: z.string().min(1, "Deadline is required"),
  status: z.enum(["active", "closed"]),
});

export type JobForm = z.infer<typeof jobSchema>;

/* =========================================================
   HELPERS
========================================================= */
type ArrayFieldKey =
  | "skills"
  | "responsibilities"
  | "requirements"
  | "benefits";

type ArrayInputProps = {
  label: string;
  name: ArrayFieldKey;
  field: UseFieldArrayReturn<JobForm, ArrayFieldKey, "id">;
  register: UseFormRegister<JobForm>;
  placeholder?: string;
  errors?: any;
};

// Error message component
const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
      <p className="text-xs text-red-500 font-medium">{message}</p>
    </div>
  );
};

// Section header
const SectionHeader = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  </div>
);

// Styled input wrapper
const Field = ({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <div
      className={cn(
        error &&
          "[&>input]:border-red-400 [&>input]:focus-visible:ring-red-300 [&>textarea]:border-red-400 [&>button]:border-red-400",
      )}
    >
      {children}
    </div>
    {error && <FieldError message={error} />}
  </div>
);

/* =========================================================
   ARRAY INPUT  (function unchanged, design upgraded)
========================================================= */
const ArrayInput = ({
  label,
  name,
  field,
  register,
  placeholder,
  errors,
}: ArrayInputProps) => (
  <div className="space-y-2.5">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <button
        type="button"
        onClick={() => field.append({ value: "" })}
        className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950"
      >
        <Plus className="w-3.5 h-3.5" />
        Add
      </button>
    </div>
    {field.fields.map((item, index) => (
      <div key={item.id} className="flex gap-2 items-start">
        <div className="flex-1">
          <div
            className={cn(
              "flex items-center rounded-xl border bg-white dark:bg-zinc-800/50 overflow-hidden transition-all",
              errors?.[name]?.[index]?.value
                ? "border-red-400"
                : "border-zinc-200 dark:border-zinc-700 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-200 dark:focus-within:ring-indigo-900",
            )}
          >
            <span className="pl-3 text-xs text-muted-foreground font-mono shrink-0">
              {String(index + 1).padStart(2, "0")}
            </span>
            <input
              className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground/60"
              placeholder={placeholder ?? `${label} ${index + 1}`}
              {...register(`${name}.${index}.value`)}
            />
          </div>
          {errors?.[name]?.[index]?.value && (
            <FieldError message={errors[name][index].value?.message} />
          )}
        </div>
        <button
          type="button"
          onClick={() => field.remove(index)}
          className="mt-0.5 p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ))}
    {field.fields.length === 0 && (
      <div className="flex items-center justify-center py-6 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 text-xs text-muted-foreground">
        No items yet — click Add to start
      </div>
    )}
  </div>
);

/* =========================================================
   DATE PICKER  (function unchanged)
========================================================= */
const DatePicker = ({
  control,
  error,
}: {
  control: Control<JobForm>;
  error?: string;
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
      Application Deadline <span className="text-red-500">*</span>
    </label>
    <Controller
      control={control}
      name="applicationDeadline"
      render={({ field }) => {
        const dateValue = field.value ? new Date(field.value) : undefined;
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-10 rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800",
                  !field.value && "text-muted-foreground",
                  error && "border-red-400",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                {field.value
                  ? format(new Date(field.value), "PPP")
                  : "Pick a deadline date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date: any) =>
                  field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                }
              />
            </PopoverContent>
          </Popover>
        );
      }}
    />
    {error && <FieldError message={error} />}
  </div>
);

/* =========================================================
   STYLED INPUT / SELECT helpers
========================================================= */
const StyledInput = ({
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) => (
  <input
    className={cn(
      "w-full h-10 px-3.5 rounded-xl border text-sm bg-white dark:bg-zinc-800/50 text-foreground placeholder:text-muted-foreground/60 outline-none transition-all",
      "focus:ring-1 focus:ring-indigo-300 dark:focus:ring-indigo-800",
      error
        ? "border-red-400 focus:ring-red-300"
        : "border-zinc-200 dark:border-zinc-700 focus:border-indigo-400",
      className,
    )}
    {...props}
  />
);

const StyledTextarea = ({
  error,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) => (
  <textarea
    className={cn(
      "w-full min-h-[120px] px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-zinc-800/50 text-foreground placeholder:text-muted-foreground/60 outline-none transition-all resize-none leading-relaxed",
      "focus:ring-1 focus:ring-indigo-300 dark:focus:ring-indigo-800",
      error
        ? "border-red-400 focus:ring-red-300"
        : "border-zinc-200 dark:border-zinc-700 focus:border-indigo-400",
      className,
    )}
    {...props}
  />
);

/* =========================================================
   MAIN FORM
========================================================= */
export default function JobCreateForm() {
  const [successOpen, setSuccessOpen] = useState(false);
  const [createJob, { isLoading }] = useCreateJobMutation();

  const form = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      company: { name: "", logo: undefined, website: "" },
      location: "",
      workType: "Remote",
      employmentType: "Full-time",
      experienceLevel: "Mid",
      salary: { min: 0, max: 0, currency: "USD" },
      skills: [{ value: "" }],
      description: "",
      responsibilities: [{ value: "" }],
      requirements: [{ value: "" }],
      benefits: [{ value: "" }],
      applicationDeadline: "",
      status: "active",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const skills = useFieldArray({ control, name: "skills" });
  const responsibilities = useFieldArray({ control, name: "responsibilities" });
  const requirements = useFieldArray({ control, name: "requirements" });
  const benefits = useFieldArray({ control, name: "benefits" });

  /* ── Submit (unchanged logic) ── */
  const onSubmit = async (data: JobForm) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("location", data.location);
      formData.append("workType", data.workType);
      formData.append("employmentType", data.employmentType);
      formData.append("experienceLevel", data.experienceLevel);
      formData.append("description", data.description);
      formData.append("applicationDeadline", data.applicationDeadline);
      formData.append("status", data.status);
      formData.append("company[name]", data.company.name);
      if (data.company.website)
        formData.append("company[website]", data.company.website);
      if (data.company.logo) formData.append("logo", data.company.logo);
      formData.append("salary[min]", String(data.salary.min));
      formData.append("salary[max]", String(data.salary.max));
      formData.append("salary[currency]", data.salary.currency);
      data.skills.forEach((item) => formData.append("skills[]", item.value));
      data.responsibilities.forEach((item) =>
        formData.append("responsibilities[]", item.value),
      );
      data.requirements.forEach((item) =>
        formData.append("requirements[]", item.value),
      );
      data.benefits.forEach((item) =>
        formData.append("benefits[]", item.value),
      );
      await createJob(formData).unwrap();
      setSuccessOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  /* ── Error summary count ── */
  const errorCount = Object.keys(errors).length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* ── Page Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-600 text-white shadow-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Create Job Post
              </h1>
              <p className="text-sm text-muted-foreground">
                Fill in the details to publish a new job listing
              </p>
            </div>
          </div>
        </div>

        {/* ── Error Banner ── */}
        {errorCount > 0 && (
          <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900 shrink-0">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                {errorCount} field{errorCount > 1 ? "s" : ""} need
                {errorCount === 1 ? "s" : ""} attention
              </p>
              <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">
                Please fill in all required fields before submitting.
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {/* ── Section 1: Basic Info ── */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <SectionHeader
              icon={<Briefcase className="w-4.5 h-4.5" />}
              title="Basic Information"
              subtitle="Core details about the position"
            />
            <div className="space-y-4">
              <Field label="Job Title" required error={errors.title?.message}>
                <StyledInput
                  placeholder="e.g. Senior Frontend Developer"
                  error={!!errors.title}
                  {...register("title")}
                />
              </Field>
              <Field label="Location" required error={errors.location?.message}>
                <StyledInput
                  placeholder="e.g. Dhaka, Bangladesh"
                  error={!!errors.location}
                  {...register("location")}
                />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Work Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Work Type
                  </label>
                  <Controller
                    control={control}
                    name="workType"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 h-10 focus:ring-indigo-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Remote">Remote</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                          <SelectItem value="Onsite">Onsite</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {/* Employment Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Employment
                  </label>
                  <Controller
                    control={control}
                    name="employmentType"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 h-10 focus:ring-indigo-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {/* Experience */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Experience
                  </label>
                  <Controller
                    control={control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 h-10 focus:ring-indigo-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Junior">Junior</SelectItem>
                          <SelectItem value="Mid">Mid</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 2: Company ── */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <SectionHeader
              icon={<Building2 className="w-4.5 h-4.5" />}
              title="Company Details"
              subtitle="Information about the hiring company"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field
                label="Company Name"
                required
                error={errors.company?.name?.message}
              >
                <StyledInput
                  placeholder="e.g. Tech Solutions Ltd"
                  error={!!errors.company?.name}
                  {...register("company.name")}
                />
              </Field>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Company Logo
                </label>
                <Controller
                  control={control}
                  name="company.logo"
                  render={({ field }) => (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 text-sm text-muted-foreground outline-none file:mr-3 file:border-0 file:bg-indigo-50 file:text-indigo-600 file:text-xs file:font-medium file:px-3 file:py-1 file:rounded-lg cursor-pointer transition-colors hover:border-indigo-300"
                    />
                  )}
                />
              </div>
              <Field label="Website" error={errors.company?.website?.message}>
                <StyledInput
                  placeholder="https://company.com"
                  {...register("company.website")}
                />
              </Field>
            </div>
          </div>

          {/* ── Section 3: Salary ── */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <SectionHeader
              icon={<DollarSign className="w-4.5 h-4.5" />}
              title="Salary & Compensation"
              subtitle="Define the pay range for this role"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Min Salary">
                <StyledInput
                  type="number"
                  placeholder="e.g. 50000"
                  {...register("salary.min", { valueAsNumber: true })}
                />
              </Field>
              <Field label="Max Salary">
                <StyledInput
                  type="number"
                  placeholder="e.g. 120000"
                  {...register("salary.max", { valueAsNumber: true })}
                />
              </Field>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Currency
                </label>
                <Controller
                  control={control}
                  name="salary.currency"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD — US Dollar</SelectItem>
                        <SelectItem value="BDT">
                          BDT — Bangladeshi Taka
                        </SelectItem>
                        <SelectItem value="EUR">EUR — Euro</SelectItem>
                        <SelectItem value="GBP">GBP — British Pound</SelectItem>
                        <SelectItem value="INR">INR — Indian Rupee</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          {/* ── Section 4: Description ── */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <SectionHeader
              icon={<FileText className="w-4.5 h-4.5" />}
              title="Job Description"
              subtitle="Describe the role and what candidates can expect"
            />
            <Field
              label="Description"
              required
              error={errors.description?.message}
            >
              <StyledTextarea
                placeholder="Write a detailed job description…"
                error={!!errors.description}
                {...register("description")}
              />
            </Field>
          </div>

          {/* ── Section 5: Skills & Lists ── */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <SectionHeader
              icon={<Star className="w-4.5 h-4.5" />}
              title="Skills & Requirements"
              subtitle="Specify what you're looking for in candidates"
            />
            <div className="space-y-6">
              <ArrayInput
                label="Skills"
                name="skills"
                field={skills}
                register={register}
                placeholder="e.g. React.js"
                errors={errors}
              />
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5">
                <ArrayInput
                  label="Responsibilities"
                  name="responsibilities"
                  field={responsibilities}
                  register={register}
                  placeholder="e.g. Build reusable UI components"
                  errors={errors}
                />
              </div>
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5">
                <ArrayInput
                  label="Requirements"
                  name="requirements"
                  field={requirements}
                  register={register}
                  placeholder="e.g. 2+ years experience in React"
                  errors={errors}
                />
              </div>
            </div>
          </div>

          {/* ── Section 6: Benefits ── */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <SectionHeader
              icon={<Gift className="w-4.5 h-4.5" />}
              title="Benefits & Perks"
              subtitle="What does your company offer?"
            />
            <ArrayInput
              label="Benefits"
              name="benefits"
              field={benefits}
              register={register}
              placeholder="e.g. Remote work, Health insurance"
              errors={errors}
            />
          </div>

          {/* ── Section 7: Deadline & Status ── */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <SectionHeader
              icon={<CalendarIcon className="w-4.5 h-4.5" />}
              title="Timeline & Status"
              subtitle="Set the application deadline and job visibility"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DatePicker
                control={control}
                error={errors.applicationDeadline?.message}
              />
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Job Status
                </label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                            Active — Visible to applicants
                          </span>
                        </SelectItem>
                        <SelectItem value="closed">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                            Closed — Hidden from applicants
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="pb-4">
            <Button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full h-12 text-sm font-semibold rounded-2xl transition-all shadow-sm",
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white",
              )}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Publishing Job…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Publish Job Post
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* ── Success Dialog ── */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-sm text-center rounded-2xl">
          <DialogHeader className="items-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950 mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">
              Job Published!
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mt-1">
            Your job post is now live and visible to applicants.
          </p>
          <Button
            className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10"
            onClick={() => setSuccessOpen(false)}
          >
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
