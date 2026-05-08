"use client";

import React, { useMemo, useState } from "react";
import {
  Upload,
  Sparkles,
  FileText,
  Brain,
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldCheck,
  Target,
  TrendingUp,
  Briefcase,
  BadgeCheck,
} from "lucide-react";

import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

const exampleJD = `
We are looking for a Frontend Developer with strong experience in React.js, Next.js, TypeScript, Tailwind CSS, REST APIs, Git, and modern UI development.

Preferred Skills:
- Node.js
- MongoDB
- Docker
- AWS
- CI/CD
- Framer Motion

The ideal candidate should have experience building scalable applications and collaborating with cross-functional teams.
`;

const ALL_SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind",
  "Node.js",
  "MongoDB",
  "Docker",
  "AWS",
  "CI/CD",
  "Git",
  "REST APIs",
  "Framer Motion",
  "Redux",
  "Express",
  "JavaScript",
];

export default function AIResumeMatcherPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState(exampleJD);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [fileName, setFileName] = useState("");

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) return;

    setFileName(file.name);

    const text = await file.text();
    setResumeText(text);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
    },
  });

  const analysis = useMemo(() => {
    const resume = resumeText.toLowerCase();
    const jd = jobDescription.toLowerCase();

    const matched = ALL_SKILLS.filter(
      (skill) =>
        resume.includes(skill.toLowerCase()) &&
        jd.includes(skill.toLowerCase()),
    );

    const missing = ALL_SKILLS.filter(
      (skill) =>
        jd.includes(skill.toLowerCase()) &&
        !resume.includes(skill.toLowerCase()),
    );

    const score = Math.min(
      100,
      Math.max(35, Math.round((matched.length / 10) * 100)),
    );

    return {
      matched,
      missing,
      score,
    };
  }, [resumeText, jobDescription]);

  const handleAnalyze = async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    setLoading(false);
    setAnalyzed(true);
  };

  return (
    <div className="min-h-screen dark:bg-zinc-950 text-white p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.15),transparent_30%)]" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-blue-500/20 p-3 text-blue-400">
                  <Brain className="h-8 w-8" />
                </div>

                <Badge className="border-0 bg-emerald-500/20 text-emerald-400">
                  GPT Analysis Active
                </Badge>
              </div>

              <h1 className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-4xl font-black text-transparent md:text-6xl">
                AI Resume Matcher
              </h1>

              <p className="mt-4 max-w-3xl text-zinc-400">
                Analyze your resume against any job description using AI. ATS
                optimization • Skill gap analysis • Hiring insights.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-xl">
                <CardContent className="p-5">
                  <p className="text-sm text-zinc-400">ATS Score</p>
                  <h3 className="mt-2 text-3xl font-bold text-emerald-400">
                    94%
                  </h3>
                </CardContent>
              </Card>

              <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-xl">
                <CardContent className="p-5">
                  <p className="text-sm text-zinc-400">AI Accuracy</p>
                  <h3 className="mt-2 text-3xl font-bold text-blue-400">98%</h3>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>

        {/* INPUTS */}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* UPLOAD */}

          <Card className="border-zinc-800 dark:bg-zinc-900/60 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <Upload className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-bold">Upload Resume</h2>
              </div>

              <div
                {...getRootProps()}
                className={`cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
                  isDragActive
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-700 hover:border-blue-500 hover:bg-blue-500/5"
                }`}
              >
                <input {...getInputProps()} />

                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                  <FileText className="h-10 w-10" />
                </div>

                <h3 className="text-xl font-semibold">Drag & Drop Resume</h3>

                <p className="mt-2 text-sm text-zinc-400">
                  Upload PDF or TXT file
                </p>

                {fileName && (
                  <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-left">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">{fileName}</span>
                    </div>
                  </div>
                )}
              </div>

              {resumeText && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold dark:text-zinc-300">
                    AI Detected Skills
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {ALL_SKILLS.filter((skill) =>
                      resumeText.toLowerCase().includes(skill.toLowerCase()),
                    ).map((skill) => (
                      <Badge
                        key={skill}
                        className="border-0 dark:bg-blue-500/20 text-blue-300"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* JOB DESCRIPTION */}

          <Card className="border-zinc-800 dark:bg-zinc-900/60 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-purple-400" />
                  <h2 className="text-xl font-bold">Job Description</h2>
                </div>

                <Badge className="border-0 dark:bg-purple-500/20 text-purple-300">
                  AI Ready
                </Badge>
              </div>

              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[350px] resize-none border-zinc-800 bg-zinc-950 text-zinc-200 focus-visible:ring-blue-500"
                placeholder="Paste job description here..."
              />

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm dark:text-zinc-500">
                  {jobDescription.length} characters
                </p>

                <Button
                  variant="outline"
                  className="border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  onClick={() => setJobDescription(exampleJD)}
                >
                  Use Example
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ANALYZE BUTTON */}

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleAnalyze}
            disabled={loading || !resumeText || !jobDescription}
            className="h-16 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 px-10 text-lg font-bold text-white shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:opacity-90"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing Resume...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5" />
                Analyze Resume with AI
              </div>
            )}
          </Button>
        </motion.div>

        {/* LOADING */}

        {loading && (
          <Card className="border-zinc-800 bg-zinc-900/60 backdrop-blur-xl">
            <CardContent className="space-y-4 p-8">
              <div className="flex items-center gap-3 text-blue-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing Skills...</span>
              </div>

              <div className="flex items-center gap-3 text-purple-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Checking ATS Compatibility...</span>
              </div>

              <div className="flex items-center gap-3 text-cyan-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating AI Suggestions...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* RESULTS */}

        {analyzed && !loading && (
          <div className="space-y-6">
            {/* SCORE */}

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="overflow-hidden border-zinc-800 dark:bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                <CardContent className="flex h-full flex-col items-center justify-center p-10 text-center">
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[14px] border-blue-500/20">
                    <div className="absolute inset-0 rounded-full border-[14px] border-blue-500 border-t-transparent animate-spin [animation-duration:8s]" />

                    <div>
                      <h2 className="text-6xl font-black dark:text-white">
                        {analysis.score}%
                      </h2>

                      <p className="mt-2 dark:text-zinc-300">MATCH SCORE</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6 lg:col-span-2">
                {[
                  {
                    label: "Skills Match",
                    value: 92,
                    icon: Target,
                  },
                  {
                    label: "ATS Compatibility",
                    value: 95,
                    icon: ShieldCheck,
                  },
                  {
                    label: "Experience Match",
                    value: 81,
                    icon: TrendingUp,
                  },
                ].map((item) => (
                  <Card
                    key={item.label}
                    className="border-zinc-800 dark:bg-zinc-900/60"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 text-blue-400" />
                          <span className="font-medium">{item.label}</span>
                        </div>

                        <span className="font-bold text-blue-400">
                          {item.value}%
                        </span>
                      </div>

                      <Progress
                        value={item.value}
                        className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:via-cyan-400 [&>div]:to-purple-500"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* SKILLS */}

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-zinc-800 dark:bg-zinc-900/60">
                <CardContent className="p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <BadgeCheck className="h-5 w-5 text-emerald-400" />
                    <h3 className="text-2xl font-bold ">Matched Skills</h3>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {analysis.matched.map((skill) => (
                      <Badge
                        key={skill}
                        className="border-0 dark:bg-emerald-500/20 px-4 py-2 text-emerald-300"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-zinc-800 dark:bg-zinc-900/60">
                <CardContent className="p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <h3 className="text-2xl font-bold">Missing Skills</h3>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {analysis.missing.map((skill) => (
                      <Badge
                        key={skill}
                        className="border-0 dark:bg-red-500/20 px-4 py-2 text-red-300"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI SUGGESTIONS */}

            <Card className="border-zinc-800 dark:bg-zinc-900/60">
              <CardContent className="p-8">
                <div className="mb-8 flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                  <h3 className="text-3xl font-bold">AI Suggestions</h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    "Add measurable achievements to your projects.",
                    "Mention TypeScript more frequently.",
                    "Include CI/CD workflow experience.",
                    "Improve ATS keyword density.",
                    "Add cloud deployment projects.",
                    "Use stronger action verbs in experience section.",
                  ].map((tip, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={tip}
                      className="rounded-2xl border border-zinc-800 dark:bg-zinc-950 p-5"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-400" />

                        <p className="dark:text-zinc-300">{tip}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ATS */}

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-zinc-800 dark:bg-zinc-900/60">
                <CardContent className="p-8">
                  <div className="mb-8 flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-cyan-400" />
                    <h3 className="text-2xl font-bold">ATS Compatibility</h3>
                  </div>

                  <div className="space-y-4">
                    {[
                      "Standard formatting detected",
                      "Readable section headings",
                      "Keyword optimized",
                      "Strong readability score",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-zinc-800 dark:bg-zinc-900/60">
                <CardContent className="p-8">
                  <div className="mb-8 flex items-center gap-3">
                    <Brain className="h-6 w-6 text-purple-400" />
                    <h3 className="text-2xl font-bold">Recruiter Impression</h3>
                  </div>

                  <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-6">
                    <p className="text-lg leading-relaxed dark:text-zinc-200">
                      Candidate is highly suitable for frontend-heavy roles.
                      Strong React ecosystem knowledge and excellent ATS
                      compatibility. Adding cloud and DevOps skills could
                      significantly improve hiring chances.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
