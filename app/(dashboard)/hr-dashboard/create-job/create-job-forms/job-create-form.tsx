/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useForm,
  useFieldArray,
  UseFieldArrayReturn,
  UseFormRegister,
  Controller,
  Control,
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
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
import { useCreateJobMutation } from "../api/create-job-api";
import { useState } from "react";

/* ================= RTK QUERY ================= */

/* =========================================================
   ZOD SCHEMA
========================================================= */

const jobSchema = z.object({
  title: z.string().min(2, "Title is required"),

  company: z.object({
    name: z.string().min(2, "Company name required"),
    logo: z.instanceof(File).optional(),
    website: z.string().optional(),
  }),

  location: z.string().min(2, "Location required"),

  workType: z.enum(["Remote", "Hybrid", "Onsite"]),

  employmentType: z.enum(["Full-time", "Part-time", "Internship", "Contract"]),

  experienceLevel: z.enum(["Junior", "Mid", "Senior"]),

  salary: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.string(),
  }),

  skills: z.array(z.object({ value: z.string() })),

  description: z.string().min(10),

  responsibilities: z.array(z.object({ value: z.string() })),

  requirements: z.array(z.object({ value: z.string() })),

  benefits: z.array(z.object({ value: z.string() })),

  applicationDeadline: z.string(),

  status: z.enum(["active", "closed"]),

  // createdBy: z.string(),
});

export type JobForm = z.infer<typeof jobSchema>;

/* =========================================================
   ARRAY INPUT COMPONENT
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
};

const ArrayInput = ({ label, name, field, register }: ArrayInputProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{label}</h3>

        <Button
          type="button"
          size="sm"
          onClick={() => field.append({ value: "" })}
        >
          + Add
        </Button>
      </div>

      {field.fields.map((item, index) => (
        <div key={item.id} className="flex gap-2">
          <Input
            placeholder={`${label} ${index + 1}`}
            {...register(`${name}.${index}.value`)}
          />

          <Button
            type="button"
            variant="destructive"
            onClick={() => field.remove(index)}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
};

/* =========================================================
   DATE PICKER
========================================================= */

const DatePicker = ({ control }: { control: Control<JobForm> }) => {
  return (
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
                  "w-full justify-start text-left font-normal",
                  !field.value && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value
                  ? format(new Date(field.value), "PPP")
                  : "Select Deadline"}
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
  );
};

export default function JobCreateForm() {
  /* ================= RTK MUTATION ================= */
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
      // createdBy: "",
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  /* ================= FIELD ARRAYS ================= */
  const skills = useFieldArray({ control, name: "skills" });
  const responsibilities = useFieldArray({ control, name: "responsibilities" });
  const requirements = useFieldArray({ control, name: "requirements" });
  const benefits = useFieldArray({ control, name: "benefits" });

  /* ================= SUBMIT (RTK) ================= */
  const onSubmit = async (data: JobForm) => {
    try {
      const formData = new FormData();

      // 🔥 Basic fields
      formData.append("title", data.title);
      formData.append("location", data.location);
      formData.append("workType", data.workType);
      formData.append("employmentType", data.employmentType);
      formData.append("experienceLevel", data.experienceLevel);
      formData.append("description", data.description);
      formData.append("applicationDeadline", data.applicationDeadline);
      formData.append("status", data.status);

      // 🔥 Company
      formData.append("company[name]", data.company.name);

      if (data.company.website) {
        formData.append("company[website]", data.company.website);
      }

      // 🔥 LOGO FILE
      if (data.company.logo) {
        formData.append("logo", data.company.logo);
      }

      // 🔥 Salary
      formData.append("salary[min]", String(data.salary.min));
      formData.append("salary[max]", String(data.salary.max));
      formData.append("salary[currency]", data.salary.currency);

      // 🔥 Arrays
      data.skills.forEach((item) => {
        formData.append("skills[]", item.value);
      });

      data.responsibilities.forEach((item) => {
        formData.append("responsibilities[]", item.value);
      });

      data.requirements.forEach((item) => {
        formData.append("requirements[]", item.value);
      });

      data.benefits.forEach((item) => {
        formData.append("benefits[]", item.value);
      });

      // 🔥 SEND
      await createJob(formData).unwrap();
      setSuccessOpen(true);
      console.log("Job Created Successfully 🚀");
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================================================
     UI (NO DESIGN CHANGE)
  ========================================================= */

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card className="rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle>Create Job Post</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* TITLE */}
            <Input placeholder="Job Title" {...register("title")} />

            {/* COMPANY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="Company Name" {...register("company.name")} />

              <Controller
                control={control}
                name="company.logo"
                render={({ field }) => (
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                )}
              />

              <Input
                placeholder="Company Website"
                {...register("company.website")}
              />
            </div>

            {/* LOCATION */}
            <Input placeholder="Location" {...register("location")} />

            {/* SELECTS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Controller
                control={control}
                name="workType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Work Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Onsite">Onsite</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              <Controller
                control={control}
                name="employmentType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Employment Type" />
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

              <Controller
                control={control}
                name="experienceLevel"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Experience Level" />
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

            {/* SALARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="number"
                placeholder="Min Salary"
                {...register("salary.min", { valueAsNumber: true })}
              />
              <Input
                type="number"
                placeholder="Max Salary"
                {...register("salary.max", { valueAsNumber: true })}
              />
              <Input placeholder="Currency" {...register("salary.currency")} />
            </div>

            {/* DESCRIPTION */}
            <Textarea
              placeholder="Job Description"
              {...register("description")}
            />

            {/* ARRAY FIELDS */}
            <ArrayInput
              label="Skills"
              name="skills"
              field={skills}
              register={register}
            />
            <ArrayInput
              label="Responsibilities"
              name="responsibilities"
              field={responsibilities}
              register={register}
            />
            <ArrayInput
              label="Requirements"
              name="requirements"
              field={requirements}
              register={register}
            />
            <ArrayInput
              label="Benefits"
              name="benefits"
              field={benefits}
              register={register}
            />

            {/* DATE */}
            <DatePicker control={control} />

            {/* STATUS */}
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            {/* SUBMIT */}
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Job"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-green-600 text-xl">
              🎉 Job Created Successfully!
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Your job post has been published successfully.
          </p>

          <Button className="mt-4 w-full" onClick={() => setSuccessOpen(false)}>
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
