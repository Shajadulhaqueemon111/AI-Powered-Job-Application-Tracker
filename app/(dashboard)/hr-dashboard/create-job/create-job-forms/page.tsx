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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { JobForm } from "../../lib/types/job-create-type";
import { Calendar } from "@/components/ui/calendar";

/* ---------------- ZOD SCHEMA ---------------- */
const jobSchema = z.object({
  title: z.string().min(2),
  company: z.object({
    name: z.string().min(2),
    logo: z.string().url().optional().or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
  }),
  location: z.string().min(2),
  workType: z.string(),
  employmentType: z.string(),
  experienceLevel: z.string(),
  salary: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.string(),
  }),
  description: z.string(),
  responsibilities: z.array(z.object({ value: z.string() })),
  requirements: z.array(z.object({ value: z.string() })),
  benefits: z.array(z.object({ value: z.string() })),
  skills: z.array(z.object({ value: z.string() })),
  applicationDeadline: z.string(),
  status: z.string(),
  createdBy: z.string(),
});

/* ---------------- ARRAY INPUT COMPONENT ---------------- */
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
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">{label}</h3>
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
            {...register(`${name}.${index}.value`)}
            placeholder={`${label} ${index + 1}`}
          />
          <Button
            type="button"
            variant="destructive"
            onClick={() => field.remove(index)}
          >
            X
          </Button>
        </div>
      ))}
    </div>
  );
};

/* ---------------- DATE PICKER COMPONENT ---------------- */
type DatePickerProps = {
  control: Control<JobForm>;
};

const DatePicker = ({ control }: DatePickerProps) => {
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
                  : "Pick application deadline"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date: any) =>
                  field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                }
                disabled={(date: any) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
};

/* ---------------- MAIN COMPONENT ---------------- */
export default function JobCreateForm() {
  const form = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      company: { name: "", logo: "", website: "" },
      location: "",
      workType: "Remote",
      employmentType: "Full-time",
      experienceLevel: "Mid",
      salary: { min: 0, max: 0, currency: "BDT" },
      description: "",
      skills: [{ value: "" }],
      responsibilities: [{ value: "" }],
      requirements: [{ value: "" }],
      benefits: [{ value: "" }],
      applicationDeadline: "",
      status: "active",
      createdBy: "",
    },
  });

  const { register, handleSubmit, control } = form;

  /* ---------------- FIELD ARRAYS ---------------- */
  const skills = useFieldArray({ control, name: "skills" });
  const responsibilities = useFieldArray({ control, name: "responsibilities" });
  const requirements = useFieldArray({ control, name: "requirements" });
  const benefits = useFieldArray({ control, name: "benefits" });

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = (data: JobForm) => {
    const payload = {
      ...data,
      skills: data.skills.map((s) => s.value),
      responsibilities: data.responsibilities.map((r) => r.value),
      requirements: data.requirements.map((r) => r.value),
      benefits: data.benefits.map((b) => b.value),
    };
    console.log("JOB DATA:", payload);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle>Create Job Post</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <Input placeholder="Job Title" {...register("title")} />

            {/* Company */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Company Name" {...register("company.name")} />
              <Input placeholder="Logo URL" {...register("company.logo")} />
              <Input placeholder="Website" {...register("company.website")} />
            </div>

            {/* Location */}
            <Input placeholder="Location" {...register("location")} />

            {/* Work / Employment / Experience */}
            <div className="grid grid-cols-3 gap-3">
              <Input placeholder="Work Type" {...register("workType")} />
              <Input
                placeholder="Employment Type"
                {...register("employmentType")}
              />
              <Input
                placeholder="Experience Level"
                {...register("experienceLevel")}
              />
            </div>

            {/* Salary */}
            <div className="grid grid-cols-3 gap-3">
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

            {/* Description */}
            <Textarea
              placeholder="Job Description"
              {...register("description")}
            />

            {/* Arrays */}
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

            {/* Date Picker */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Application Deadline
              </label>
              <DatePicker control={control} />
            </div>

            {/* Status / Created By */}
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Status" {...register("status")} />
              <Input placeholder="Created By" {...register("createdBy")} />
            </div>

            <Button className="w-full" type="submit">
              Create Job
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
