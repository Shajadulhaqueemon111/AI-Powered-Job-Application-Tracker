/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";

import { Search, MapPin, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  skills: string[];
  salary: string;
  type: "Remote" | "Onsite" | "Hybrid";
  experience: string;
  applicants: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
};

const jobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "Google",
    location: "USA",
    skills: ["React", "Next.js", "TypeScript"],
    salary: "$100k - $150k",
    type: "Remote",
    experience: "2+ Years Experience",
    applicants: 12,
    description:
      "Build modern scalable frontend applications for millions of users.",
    responsibilities: [
      "Develop UI with React",
      "Work with APIs",
      "Optimize performance",
      "Collaborate with designers",
    ],
    requirements: ["React.js", "TypeScript", "REST APIs", "Git"],
  },

  {
    id: "2",
    title: "Backend Engineer",
    company: "Amazon",
    location: "Canada",
    skills: ["Node.js", "Express", "MongoDB"],
    salary: "$120k - $170k",
    type: "Hybrid",
    experience: "3+ Years Experience",
    applicants: 18,
    description: "Design high-performance backend systems and scalable APIs.",
    responsibilities: [
      "Build APIs",
      "Database optimization",
      "Server security",
      "Microservices development",
    ],
    requirements: ["Node.js", "MongoDB", "JWT", "Docker"],
  },

  {
    id: "3",
    title: "UI/UX Designer",
    company: "Meta",
    location: "UK",
    skills: ["Figma", "Adobe XD", "Wireframing"],
    salary: "$90k - $130k",
    type: "Remote",
    experience: "2+ Years Experience",
    applicants: 9,
    description: "Create beautiful user experiences for mobile and web apps.",
    responsibilities: [
      "Create wireframes",
      "Design prototypes",
      "User research",
      "Improve UX flows",
    ],
    requirements: ["Figma", "UI Design", "UX Research", "Creativity"],
  },

  {
    id: "4",
    title: "DevOps Engineer",
    company: "Netflix",
    location: "Germany",
    skills: ["AWS", "Docker", "Kubernetes"],
    salary: "$130k - $180k",
    type: "Onsite",
    experience: "Senior Level",
    applicants: 15,
    description: "Manage cloud infrastructure and CI/CD pipelines.",
    responsibilities: [
      "Deploy cloud services",
      "Monitor servers",
      "Automate pipelines",
      "Infrastructure scaling",
    ],
    requirements: ["AWS", "Linux", "CI/CD", "Kubernetes"],
  },

  {
    id: "5",
    title: "Business Analyst",
    company: "Microsoft",
    location: "Singapore",
    skills: ["Excel", "Power BI", "Analytics"],
    salary: "$80k - $120k",
    type: "Hybrid",
    experience: "2+ Years Experience",
    applicants: 22,
    description: "Analyze business processes and provide growth strategies.",
    responsibilities: [
      "Data analysis",
      "Client meetings",
      "Business reporting",
      "Strategy planning",
    ],
    requirements: [
      "Communication",
      "Excel",
      "Analytics",
      "Presentation skills",
    ],
  },

  {
    id: "6",
    title: "Cyber Security Specialist",
    company: "IBM",
    location: "Australia",
    skills: ["Security", "Penetration Testing", "Networking"],
    salary: "$140k - $190k",
    type: "Remote",
    experience: "Senior Level",
    applicants: 11,
    description: "Protect enterprise systems against cyber threats.",
    responsibilities: [
      "Threat analysis",
      "Security audits",
      "Monitor attacks",
      "Implement security protocols",
    ],
    requirements: ["Cyber Security", "Networking", "Linux", "Ethical Hacking"],
  },

  {
    id: "7",
    title: "AI Engineer",
    company: "OpenAI",
    location: "USA",
    skills: ["Python", "Machine Learning", "TensorFlow"],
    salary: "$180k - $250k",
    type: "Hybrid",
    experience: "Senior Level",
    applicants: 30,
    description: "Develop AI-powered products and machine learning systems.",
    responsibilities: [
      "Train ML models",
      "AI research",
      "Deploy AI systems",
      "Data processing",
    ],
    requirements: ["Python", "Deep Learning", "TensorFlow", "Mathematics"],
  },

  {
    id: "8",
    title: "Mobile App Developer",
    company: "Spotify",
    location: "Sweden",
    skills: ["Flutter", "Dart", "Firebase"],
    salary: "$95k - $140k",
    type: "Remote",
    experience: "2+ Years Experience",
    applicants: 14,
    description: "Build cross-platform mobile applications.",
    responsibilities: [
      "Develop mobile apps",
      "Fix bugs",
      "Optimize app speed",
      "Integrate APIs",
    ],
    requirements: ["Flutter", "Firebase", "REST APIs", "Git"],
  },

  {
    id: "9",
    title: "Data Scientist",
    company: "Tesla",
    location: "USA",
    skills: ["Python", "SQL", "Data Analysis"],
    salary: "$150k - $210k",
    type: "Onsite",
    experience: "Senior Level",
    applicants: 19,
    description: "Analyze large datasets to support business decisions.",
    responsibilities: [
      "Analyze data",
      "Create reports",
      "Build predictive models",
      "Data visualization",
    ],
    requirements: ["Python", "SQL", "Statistics", "Machine Learning"],
  },

  {
    id: "10",
    title: "Digital Marketing Manager",
    company: "Shopify",
    location: "Canada",
    skills: ["SEO", "Facebook Ads", "Google Ads"],
    salary: "$85k - $125k",
    type: "Hybrid",
    experience: "3+ Years Experience",
    applicants: 17,
    description: "Lead online marketing campaigns and growth strategies.",
    responsibilities: [
      "Run ad campaigns",
      "SEO optimization",
      "Social media growth",
      "Marketing analytics",
    ],
    requirements: ["SEO", "Google Ads", "Marketing Strategy", "Communication"],
  },
];

const filters = [
  "All Jobs",
  "Remote",
  "Hybrid",
  "Onsite",
  "Easy Apply",
  "Under 10 applicants",
];

export default function AllJobsWithDrawer() {
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);

  const [openJobDrawer, setOpenJobDrawer] = React.useState(false);

  const [openApplyDrawer, setOpenApplyDrawer] = React.useState(false);

  const [search, setSearch] = React.useState("");

  const [activeFilter, setActiveFilter] = React.useState("All Jobs");

  const [page, setPage] = React.useState(1);

  const perPage = 6;

  // ================= FILTER =================

  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      activeFilter === "All Jobs"
        ? true
        : activeFilter === "Under 10 applicants"
          ? job.applicants < 10
          : activeFilter === "Easy Apply"
            ? true
            : job.type === activeFilter;

    return matchSearch && matchFilter;
  });

  // ================= PAGINATION =================

  const totalPages = Math.ceil(filteredJobs.length / perPage);

  const paginatedJobs = filteredJobs.slice(
    (page - 1) * perPage,
    page * perPage,
  );

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
              }
              
              `}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* JOB GRID */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedJobs.map((job) => (
          <Card
            key={job.id}
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
                      {job.company}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                  </div>
                </div>

                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                  {job.type}
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

                  <span className="font-semibold">{job.salary}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Experience</span>

                  <span>{job.experience}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Applicants</span>

                  <span>{job.applicants} Applied</span>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                  onClick={() => {
                    setSelectedJob(job);
                    setOpenApplyDrawer(true);
                  }}
                >
                  Apply Now
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

      {/* PAGINATION */}

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

      {/* ================= JOB DETAILS DRAWER ================= */}

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
                  {selectedJob.company} • {selectedJob.location}
                </DrawerDescription>
              </DrawerHeader>

              <div className="px-6 pb-6 overflow-y-auto max-h-[80vh] space-y-6">
                {/* TOP INFO */}

                <div className="flex flex-wrap gap-3">
                  <Badge>{selectedJob.type}</Badge>

                  <Badge variant="secondary">{selectedJob.salary}</Badge>

                  <Badge variant="outline">{selectedJob.experience}</Badge>
                </div>

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
                  onClick={() => {
                    setOpenJobDrawer(false);
                    setOpenApplyDrawer(true);
                  }}
                >
                  Apply This Job
                </Button>

                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* ================= APPLY FORM DRAWER ================= */}

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
                  {selectedJob.company} • {selectedJob.location}
                </DrawerDescription>
              </DrawerHeader>

              <div className="overflow-y-auto max-h-[80vh] px-6 pb-6 space-y-5">
                {/* FULL NAME */}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>

                  <Input placeholder="John Doe" />
                </div>

                {/* EMAIL */}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>

                  <Input type="email" placeholder="john@example.com" />
                </div>

                {/* PHONE */}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>

                  <Input placeholder="+1 234 567 890" />
                </div>

                {/* LINKEDIN */}

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    LinkedIn Profile
                  </label>

                  <Input placeholder="https://linkedin.com/in/username" />
                </div>

                {/* PORTFOLIO */}

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Portfolio Website
                  </label>

                  <Input placeholder="https://yourportfolio.com" />
                </div>

                {/* EXPERIENCE */}

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Years of Experience
                  </label>

                  <Input placeholder="3 Years" />
                </div>

                {/* COVER LETTER */}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Cover Letter</label>

                  <Textarea
                    placeholder="Write why you are a perfect fit..."
                    className="min-h-[140px]"
                  />
                </div>

                {/* RESUME */}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Resume</label>

                  <Input type="file" />
                </div>

                {/* AGREEMENT */}

                <div className="flex items-start gap-3 rounded-xl border p-4">
                  <input type="checkbox" className="mt-1" />

                  <p className="text-sm text-gray-500">
                    I confirm that all information provided is accurate and
                    agree to the processing of my application.
                  </p>
                </div>
              </div>

              <DrawerFooter>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Submit Application
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
