"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  User,
  Upload,
  Shield,
  Bell,
  Sparkles,
  Camera,
  Mail,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileSettings() {
  /* ---------------- REFS ---------------- */

  const resumeRef = useRef<HTMLInputElement | null>(null);
  const avatarRef = useRef<HTMLInputElement | null>(null);

  /* ---------------- STATES ---------------- */

  const [resume, setResume] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [avatar, setAvatar] = useState("https://i.pravatar.cc/300?img=12");

  /* ---------------- RESUME UPLOAD ---------------- */

  const handleResumeUpload = (file: File | undefined) => {
    if (!file) return;

    setLoading(true);

    setTimeout(() => {
      setResume(file.name);
      setLoading(false);
    }, 1500);
  };

  /* ---------------- PROFILE IMAGE ---------------- */

  const handleAvatarUpload = (file: File | undefined) => {
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setAvatar(imageUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-white p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          {/* LEFT */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 bg-clip-text text-transparent">
              Profile Settings
            </h1>

            <p className="text-zinc-500 mt-2">
              Manage your AI-powered career profile & recruiter visibility
            </p>
          </div>

          {/* PROFILE */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="w-24 h-24 border-4 border-white dark:border-zinc-800 shadow-2xl">
                <AvatarImage src={avatar} />
                <AvatarFallback>EM</AvatarFallback>
              </Avatar>

              {/* CAMERA BUTTON */}
              <button
                onClick={() => avatarRef.current?.click()}
                className="absolute bottom-1 right-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full shadow-lg hover:scale-105 transition"
              >
                <Camera size={16} />
              </button>

              {/* HOVER */}
              <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition" />
            </div>

            <div>
              <h2 className="font-bold text-lg">Md Emon</h2>

              <p className="text-sm text-zinc-500 flex items-center gap-1">
                <Mail size={14} />
                emon@gmail.com
              </p>

              <Badge className="mt-2 bg-green-500/10 text-green-500 border-green-500/20">
                Recruiter Ready
              </Badge>
            </div>

            {/* HIDDEN INPUT */}
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
            />
          </div>
        </motion.div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* PROFILE INFO */}
          <Card className="rounded-3xl border-0 shadow-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <User className="text-blue-500" size={18} />
                </div>

                <h2 className="font-semibold text-lg">Profile Information</h2>
              </div>

              <Input placeholder="Your Full Name" />

              <Input placeholder="Email Address" />

              <Input placeholder="Phone Number" />

              <Input placeholder="Your Skills (React, Next.js)" />

              <Button className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 text-white font-medium shadow-lg hover:scale-[1.01] transition">
                Save Profile
              </Button>
            </CardContent>
          </Card>

          {/* SECURITY */}
          <Card className="rounded-3xl border-0 shadow-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10">
                  <Shield className="text-purple-500" size={18} />
                </div>

                <h2 className="font-semibold text-lg">Security Settings</h2>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>

                  <p className="text-sm text-zinc-500">
                    Extra protection for your account
                  </p>
                </div>

                <Switch />
              </div>

              <Input type="password" placeholder="New Password" />

              <Button className="w-full rounded-xl">Update Password</Button>
            </CardContent>
          </Card>

          {/* RESUME */}
          <Card className="md:col-span-2 rounded-3xl border-0 shadow-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10">
                  <Upload className="text-cyan-500" size={18} />
                </div>

                <h2 className="font-semibold text-lg">Resume Upload</h2>
              </div>

              <div
                onClick={() => resumeRef.current?.click()}
                className="rounded-3xl border-2 border-dashed border-blue-300 dark:border-zinc-700 p-12 text-center cursor-pointer hover:bg-blue-50 dark:hover:bg-zinc-800/60 transition-all"
              >
                {loading ? (
                  <div className="space-y-3">
                    <p className="text-blue-500 animate-pulse font-medium">
                      Uploading Resume...
                    </p>

                    <div className="w-40 h-2 mx-auto rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
                    </div>
                  </div>
                ) : resume ? (
                  <div className="space-y-3">
                    <p className="text-green-500 font-semibold">
                      Resume Uploaded Successfully ✔
                    </p>

                    <Badge className="text-sm px-4 py-1">{resume}</Badge>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="mx-auto text-blue-500" size={42} />

                    <div>
                      <p className="font-medium">Click to upload Resume</p>

                      <p className="text-sm text-zinc-500 mt-1">
                        PDF only • Max 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={resumeRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleResumeUpload(e.target.files?.[0])}
              />
            </CardContent>
          </Card>

          {/* NOTIFICATION */}
          <Card className="rounded-3xl border-0 shadow-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-yellow-500/10">
                  <Bell className="text-yellow-500" size={18} />
                </div>

                <h2 className="font-semibold text-lg">Notification Settings</h2>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                <span>Email Alerts</span>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                <span>Job Alerts</span>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                <span>Interview Reminders</span>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* AI INSIGHT */}
          <Card className="rounded-3xl border-0 shadow-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-purple-500/10 backdrop-blur-xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10">
                  <Sparkles className="text-purple-500" size={18} />
                </div>

                <h2 className="font-semibold text-lg">AI Career Insight</h2>
              </div>

              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                Your profile is 78% optimized for recruiters. Add more projects,
                skills, and certifications to increase your interview rate.
              </p>

              <div className="w-full h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div className="h-full w-[78%] bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-full" />
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 text-white rounded-xl">
                Improve My Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
