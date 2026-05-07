/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";

import {
  Search,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Trash2,
  Eye,
  Filter,
  Sparkles,
  Building2,
  Globe,
  Clock3,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type Status = "Applied" | "Interview" | "Offer" | "Rejected";

type Application = {
  id: string;
  company: string;
  role: string;
  status: Status;
  location: string;
  appliedDate: string;
  salary: string;
  type: string;
  employees: string;
  website: string;
  about: string;
  requirements: string[];
};

const mockData: Application[] = [
  {
    id: "1",
    company: "Google",
    role: "Frontend Developer",
    status: "Interview",
    location: "Remote",
    appliedDate: "2026-05-01",
    salary: "$120k",
    type: "Full Time",
    employees: "180k+",
    website: "google.com",
    about:
      "Google is hiring talented frontend developers to build scalable products used by billions worldwide.",
    requirements: ["React.js", "Next.js", "TypeScript", "REST APIs"],
  },

  {
    id: "2",
    company: "Meta",
    role: "React Developer",
    status: "Applied",
    location: "USA",
    appliedDate: "2026-04-28",
    salary: "$110k",
    type: "Remote",
    employees: "90k+",
    website: "meta.com",
    about:
      "Meta focuses on building social technologies and immersive digital experiences.",
    requirements: ["React", "JavaScript", "Tailwind CSS", "Git"],
  },

  {
    id: "3",
    company: "Amazon",
    role: "Full Stack Engineer",
    status: "Rejected",
    location: "Canada",
    appliedDate: "2026-04-20",
    salary: "$100k",
    type: "Hybrid",
    employees: "1.5M+",
    website: "amazon.com",
    about:
      "Amazon builds customer-centric technologies with scalable cloud infrastructure.",
    requirements: ["Node.js", "MongoDB", "Express", "AWS"],
  },

  {
    id: "4",
    company: "Netflix",
    role: "UI/UX Designer",
    status: "Offer",
    location: "Germany",
    appliedDate: "2026-04-15",
    salary: "$135k",
    type: "Onsite",
    employees: "12k+",
    website: "netflix.com",
    about:
      "Netflix creates premium streaming experiences and innovative entertainment platforms.",
    requirements: ["Figma", "Adobe XD", "UI Design", "UX Research"],
  },

  {
    id: "5",
    company: "Spotify",
    role: "Backend Engineer",
    status: "Applied",
    location: "Sweden",
    appliedDate: "2026-04-10",
    salary: "$125k",
    type: "Remote",
    employees: "8k+",
    website: "spotify.com",
    about:
      "Spotify powers music experiences for millions of listeners globally.",
    requirements: ["Node.js", "PostgreSQL", "Docker", "Redis"],
  },

  {
    id: "6",
    company: "Microsoft",
    role: "Cloud Engineer",
    status: "Interview",
    location: "UK",
    appliedDate: "2026-04-01",
    salary: "$140k",
    type: "Hybrid",
    employees: "220k+",
    website: "microsoft.com",
    about:
      "Microsoft builds cloud-first enterprise-grade solutions and developer platforms.",
    requirements: ["Azure", "Docker", "Kubernetes", "CI/CD"],
  },
];

const statusStyle = (status: Status) => {
  switch (status) {
    case "Applied":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";

    case "Interview":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

    case "Offer":
      return "bg-green-500/10 text-green-400 border-green-500/20";

    case "Rejected":
      return "bg-red-500/10 text-red-400 border-red-500/20";
  }
};

export default function ApplicationsPage() {
  const [data, setData] = React.useState<Application[]>(mockData);

  const [filter, setFilter] = React.useState<string>("All");

  const [search, setSearch] = React.useState("");

  const [page, setPage] = React.useState(1);

  const perPage = 4;

  const filteredData = data.filter((item) => {
    const matchStatus = filter === "All" || item.status === filter;

    const matchSearch =
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filteredData.length / perPage);

  const paginatedData = filteredData.slice(
    (page - 1) * perPage,
    page * perPage,
  );

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* HEADER */}

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              My Applications
            </h1>

            <p className="text-gray-400 mt-1">
              Track all your applied jobs & companies.
            </p>
          </div>
        </div>
      </div>

      {/* FILTER */}

      <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#071028] to-[#091733] p-5 mb-10">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-lg">
            <Search className="absolute left-4 top-4 h-4 w-4 text-gray-500" />

            <Input
              placeholder="Search company or role..."
              className="h-14 rounded-2xl border-white/10 bg-white/5 pl-11 text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Filter className="h-4 w-4" />
              Filter
            </div>

            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[190px] h-12 rounded-2xl border-white/10 bg-white/5">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="All">All Applications</SelectItem>

                <SelectItem value="Applied">Applied</SelectItem>

                <SelectItem value="Interview">Interview</SelectItem>

                <SelectItem value="Offer">Offer</SelectItem>

                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* LIST */}

      <div className="space-y-5">
        {paginatedData.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#071028] to-[#091733]"
          >
            <CardContent className="p-6">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                {/* LEFT */}

                <div className="flex gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-xl font-bold">
                    {item.company.charAt(0)}
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">{item.role}</h2>

                    <div className="flex items-center gap-2 text-gray-400 mt-1">
                      <Briefcase className="h-4 w-4" />

                      <span>{item.company}</span>
                    </div>

                    <div className="flex flex-wrap gap-5 mt-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {item.appliedDate}
                      </div>

                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        {item.salary}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}

                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    className={`rounded-full border px-4 py-1.5 ${statusStyle(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </Badge>

                  {/* DETAILS DRAWER */}

                  <Drawer direction="right">
                    <DrawerTrigger asChild>
                      <Button
                        variant="outline"
                        className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                    </DrawerTrigger>

                    <DrawerContent className="bg-[#071028] border-l border-white/10 text-white w-full sm:max-w-xl ml-auto">
                      <DrawerHeader>
                        <DrawerTitle className="text-2xl">
                          {item.role}
                        </DrawerTitle>
                      </DrawerHeader>

                      <div className="px-6 pb-6 overflow-y-auto">
                        {/* COMPANY */}

                        <div className="flex items-center gap-4 mb-8">
                          <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-2xl font-bold">
                            {item.company.charAt(0)}
                          </div>

                          <div>
                            <h2 className="text-xl font-bold">
                              {item.company}
                            </h2>

                            <p className="text-gray-400">{item.location}</p>
                          </div>
                        </div>

                        {/* INFO */}

                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                              <Clock3 className="h-4 w-4" />
                              Job Type
                            </div>

                            <p className="font-semibold">{item.type}</p>
                          </div>

                          <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                              <Users className="h-4 w-4" />
                              Employees
                            </div>

                            <p className="font-semibold">{item.employees}</p>
                          </div>

                          <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                              <Globe className="h-4 w-4" />
                              Website
                            </div>

                            <p className="font-semibold">{item.website}</p>
                          </div>

                          <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                              <DollarSign className="h-4 w-4" />
                              Salary
                            </div>

                            <p className="font-semibold">{item.salary}</p>
                          </div>
                        </div>

                        {/* ABOUT */}

                        <div className="mb-8">
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-emerald-400" />
                            About Company
                          </h3>

                          <p className="text-gray-400 leading-7">
                            {item.about}
                          </p>
                        </div>

                        {/* REQUIREMENTS */}

                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Requirements
                          </h3>

                          <div className="flex flex-wrap gap-3">
                            {item.requirements.map((skill, i) => (
                              <Badge
                                key={i}
                                className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <DrawerFooter>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl h-12">
                          Visit Company
                        </Button>

                        <DrawerClose asChild>
                          <Button
                            variant="outline"
                            className="rounded-2xl border-white/10 bg-white/5"
                          >
                            Close
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>

                  {/* DELETE */}

                  <Button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PAGINATION */}

      <div className="flex items-center justify-center gap-3 mt-10">
        <Button
          variant="outline"
          className="rounded-2xl border-white/10 bg-white/5"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </Button>

        <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm">
          Page {page} of {totalPages}
        </div>

        <Button
          variant="outline"
          className="rounded-2xl border-white/10 bg-white/5"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>

      {/* EMPTY */}

      {filteredData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-24 w-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <Briefcase className="h-10 w-10 text-gray-500" />
          </div>

          <h2 className="text-2xl font-bold">No Applications Found</h2>

          <p className="mt-2 max-w-md text-gray-400">
            Try changing your search or filter.
          </p>
        </div>
      )}
    </div>
  );
}
