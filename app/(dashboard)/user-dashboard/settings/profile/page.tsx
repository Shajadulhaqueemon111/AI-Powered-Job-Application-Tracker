/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// 🟢 Shadcn UI Dialog Components Imports
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  User,
  Upload,
  Shield,
  Bell,
  Sparkles,
  Camera,
  Mail,
  Loader2,
  FileText,
  CheckCircle2,
  Eye,
  Download as DownloadIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  useToggleTwoFactorMutation,
  useGetMeQuery,
  useChangePasswordMutation,
  useUploadResumeMutation,
  useUploadProfileMutation,
  useUpdateNotificationSettingsMutation,
} from "@/app/redux/features/auth/authApi";
import toast from "react-hot-toast";

type UserProps = {
  user: {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    role: string;
    profileImage: string;
    skills?: string[];
    phoneNumber?: string;
    address?: string;
    status?: string;
    twoFactorEnabled?: boolean;
    resumeUrl?: string;
    resumeOriginalName?: string;
    notifications?: {
      emailAlerts?: boolean;
      jobAlerts?: boolean;
      interviewReminders?: boolean;
    };
  } | null;
};

const DEFAULT_AVATAR = "https://i.pravatar.cc/300?img=12";
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function ProfileSettingsForm({ freshUser }: { freshUser: any }) {
  const resumeRef = useRef<HTMLInputElement | null>(null);
  const avatarRef = useRef<HTMLInputElement | null>(null);

  const twoFactor = freshUser?.twoFactorEnabled ?? false;
  const [toggleTwoFactor, { isLoading: is2FALoading }] =
    useToggleTwoFactorMutation();

  // 🟢 Shadcn Dialog-এর জন্য স্টেট
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // ---------- PROFILE INFO ----------
  const [profileForm, setProfileForm] = useState({
    name: freshUser?.name || "",
    email: freshUser?.email || "",
    phoneNumber: freshUser?.phoneNumber || "",
    address: freshUser?.address || "",
    skills: freshUser?.skills?.join(", ") || "",
  });

  const [saveUserProfile, { isLoading: isProfileSaving }] =
    useUploadProfileMutation();

  // ---------- AVATAR STATE ----------
  const initialAvatar = freshUser?.profileImage
    ? freshUser.profileImage.startsWith("http")
      ? freshUser.profileImage
      : `${BASE_URL}/uploads/${freshUser.profileImage}`
    : DEFAULT_AVATAR;

  const [avatarPreview, setAvatarPreview] = useState(initialAvatar);

  // ---------- RESUME STATE & URL ----------
  const initialResumeName = freshUser?.resumeOriginalName
    ? freshUser.resumeOriginalName
    : freshUser?.resumeUrl
      ? freshUser.resumeUrl.split("/").pop() || "resume.pdf"
      : null;

  const [resumeName, setResumeName] = useState<string | null>(
    initialResumeName,
  );

  const resumeFullUrl = freshUser?.resumeUrl
    ? freshUser.resumeUrl.startsWith("http")
      ? freshUser.resumeUrl
      : `${BASE_URL}/uploads/${freshUser.resumeUrl}`
    : null;

  // ---------- NOTIFICATIONS ----------
  const [notifications, setNotifications] = useState({
    emailAlerts: freshUser?.notifications?.emailAlerts ?? true,
    jobAlerts: freshUser?.notifications?.jobAlerts ?? true,
    interviewReminders: freshUser?.notifications?.interviewReminders ?? true,
  });

  const [updateNotifications, { isLoading: isNotifSaving }] =
    useUpdateNotificationSettingsMutation();

  const handleProfileChange =
    (field: keyof typeof profileForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfileForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSaveProfile = async () => {
    try {
      const skillsArray = profileForm.skills
        .split(",")
        .map((s: any) => s.trim())
        .filter(Boolean);

      const formData = new FormData();
      formData.append("name", profileForm.name);
      formData.append("phoneNumber", profileForm.phoneNumber);
      formData.append("address", profileForm.address);
      formData.append("skills", JSON.stringify(skillsArray));

      const res = await saveUserProfile({
        id: (freshUser?._id || freshUser?.id || "") as string,
        formData,
      }).unwrap();

      toast.success(res?.message || "Profile updated successfully");
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to update profile"));
    }
  };

  // ---------- SECURITY / PASSWORD ----------
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changePassword, { isLoading: isPasswordSaving }] =
    useChangePasswordMutation();

  const handlePasswordChange =
    (field: keyof typeof passwordForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleUpdatePassword = async () => {
    if (!passwordForm.newPassword || !passwordForm.currentPassword) {
      toast.error("Please fill in both current and new password");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    try {
      const res = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();

      toast.success(res?.message || "Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to update password"));
    }
  };

  // ---------- AVATAR UPLOAD ----------
  const [uploadProfile, { isLoading: isProfileUploading }] =
    useUploadProfileMutation();

  const handleAvatarUpload = async (file: File | undefined) => {
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await uploadProfile({
        id: (freshUser?._id || freshUser?.id || "") as string,
        formData,
      }).unwrap();
      toast.success(res?.message || "Profile photo updated");
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to upload photo"));
      setAvatarPreview(initialAvatar);
    }
  };

  // ---------- RESUME UPLOAD ----------
  const [uploadResume, { isLoading: isResumeUploading }] =
    useUploadResumeMutation();

  const handleResumeUpload = async (file: File | undefined) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await uploadResume({
        id: (freshUser?._id || freshUser?.id || "") as string,
        formData: formData,
      }).unwrap();

      setResumeName(file.name);
      toast.success(res?.message || "Resume uploaded successfully");
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error, "Failed to upload resume"));
    }
  };

  // ---------- NOTIFICATIONS TOGGLE ----------
  const handleNotificationToggle = async (
    key: keyof typeof notifications,
    checked: boolean,
  ) => {
    const previous = notifications;
    setNotifications((prev) => ({ ...prev, [key]: checked }));

    try {
      const res = await updateNotifications({
        ...notifications,
        [key]: checked,
      }).unwrap();
      toast.success(res?.message || "Notification settings updated");
    } catch (error: unknown) {
      setNotifications(previous);
      toast.error(extractErrorMessage(error, "Failed to update notifications"));
    }
  };

  // ---------- LIVE PROFILE COMPLETION % ----------
  const skillsCount = profileForm.skills
    .split(",")
    .map((s: any) => s.trim())
    .filter(Boolean).length;
  const checks = [
    !!profileForm.name.trim(),
    !!profileForm.email.trim(),
    !!profileForm.phoneNumber.trim(),
    !!profileForm.address.trim(),
    skillsCount > 0,
    avatarPreview !== DEFAULT_AVATAR,
    !!resumeName,
  ];
  const completion = Math.round(
    (checks.filter(Boolean).length / checks.length) * 100,
  );

  const completionTips: string[] = [];
  if (!profileForm.phoneNumber.trim()) completionTips.push("phone number");
  if (!profileForm.address.trim()) completionTips.push("address");
  if (skillsCount === 0) completionTips.push("skills");
  if (avatarPreview === DEFAULT_AVATAR) completionTips.push("a profile photo");
  if (!resumeName) completionTips.push("your resume");

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-500 via-cyan-500 to-purple-500 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-zinc-500 mt-2">
            Manage your AI-powered career profile & recruiter visibility
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-white dark:border-zinc-800 shadow-2xl">
              <AvatarImage src={avatarPreview} />
              <AvatarFallback>
                {(freshUser?.name || "EM").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <button
              onClick={() => avatarRef.current?.click()}
              disabled={isProfileUploading}
              className="absolute bottom-1 right-1 bg-linear-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full shadow-lg hover:scale-105 transition disabled:opacity-60"
            >
              {isProfileUploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Camera size={16} />
              )}
            </button>
          </div>

          <div>
            <h2 className="font-bold text-lg">
              {freshUser?.name || "John Doe"}
            </h2>
            <p className="text-sm text-zinc-500 flex items-center gap-1">
              <Mail size={14} /> {freshUser?.email || "user@email.com"}
            </p>
            {freshUser?.status && (
              <Badge className="mt-2 bg-green-500/10 text-green-500 border-green-500/20">
                {freshUser.status}
              </Badge>
            )}
          </div>

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

            <Input
              placeholder="Your Full Name"
              value={profileForm.name}
              onChange={handleProfileChange("name")}
              required
            />
            <Input
              placeholder="Email Address"
              value={profileForm.email}
              disabled
              title="Email cannot be changed here"
            />
            <Input
              placeholder="Phone Number"
              value={profileForm.phoneNumber}
              onChange={handleProfileChange("phoneNumber")}
              required
            />
            <Input
              placeholder="Address"
              value={profileForm.address}
              onChange={handleProfileChange("address")}
              required
            />
            <Input
              placeholder="Your Skills (React, Next.js)"
              value={profileForm.skills}
              onChange={handleProfileChange("skills")}
              required
            />

            <Button
              onClick={handleSaveProfile}
              disabled={isProfileSaving}
              className="w-full h-11 rounded-xl bg-linear-to-r from-blue-600 via-cyan-600 to-purple-600 text-white font-medium shadow-lg hover:scale-[1.01] transition cursor-pointer"
            >
              {isProfileSaving ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </span>
              ) : (
                "Save Profile"
              )}
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

            <div className="group flex items-center justify-between rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 p-5 shadow-sm">
              <div className="space-y-1">
                <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-zinc-400 flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${twoFactor ? "bg-green-500" : "bg-red-500"}`}
                  />
                  {twoFactor
                    ? "Enabled — OTP required on login"
                    : "Disabled — Login without OTP"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500">
                  {twoFactor ? "ON" : "OFF"}
                </span>
                <Switch
                  checked={twoFactor}
                  onCheckedChange={async (checked) => {
                    try {
                      const res = await toggleTwoFactor({
                        enable: checked,
                      }).unwrap();
                      toast.success(res?.message || "2FA updated successfully");
                    } catch (error: unknown) {
                      toast.error(
                        extractErrorMessage(
                          error,
                          "Failed to update 2FA settings",
                        ),
                      );
                    }
                  }}
                  disabled={is2FALoading}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>

            <Input
              type="password"
              placeholder="Current Password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange("currentPassword")}
            />
            <Input
              type="password"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange("newPassword")}
            />
            <Input
              type="password"
              placeholder="Confirm New Password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange("confirmPassword")}
            />
            <Button
              onClick={handleUpdatePassword}
              disabled={isPasswordSaving}
              className="w-full rounded-xl"
            >
              {isPasswordSaving ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* RESUME UPLOAD, PREVIEW & DOWNLOAD */}
        <Card className="md:col-span-2 rounded-3xl border-0 shadow-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10">
                <Upload className="text-cyan-500" size={18} />
              </div>
              <h2 className="font-semibold text-lg">Resume Upload</h2>
            </div>

            <div
              onClick={() => !isResumeUploading && resumeRef.current?.click()}
              className="rounded-3xl border-2 border-dashed border-blue-300 dark:border-zinc-700 p-12 text-center cursor-pointer hover:bg-blue-50 dark:hover:bg-zinc-800/60 transition-all"
            >
              {isResumeUploading ? (
                <div className="space-y-3">
                  <Loader2
                    className="mx-auto text-blue-500 animate-spin"
                    size={32}
                  />
                  <p className="text-blue-500 font-medium">
                    Uploading Resume...
                  </p>
                </div>
              ) : resumeName ? (
                <div className="space-y-4">
                  <CheckCircle2 className="mx-auto text-green-500" size={32} />
                  <p className="text-green-500 font-semibold">
                    Resume Uploaded Successfully
                  </p>

                  <Badge className="text-sm px-4 py-1 flex items-center gap-1 w-fit mx-auto">
                    <FileText size={14} /> {resumeName}
                  </Badge>

                  {/* PREVIEW & DOWNLOAD BUTTONS */}
                  {resumeFullUrl && (
                    <div
                      className="flex items-center justify-center gap-3 mt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 rounded-xl"
                        onClick={() => setIsPreviewOpen(true)}
                      >
                        <Eye size={14} /> Preview Resume
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => window.open(resumeFullUrl, "_blank")}
                      >
                        <DownloadIcon size={14} /> Download PDF
                      </Button>
                    </div>
                  )}

                  <p className="text-xs text-zinc-500 pt-2">
                    Click area to replace with a new file
                  </p>
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
              {isNotifSaving && (
                <Loader2
                  size={14}
                  className="animate-spin text-zinc-400 ml-auto"
                />
              )}
            </div>

            <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-4">
              <span>Email Alerts</span>
              <Switch
                checked={notifications.emailAlerts}
                onCheckedChange={(checked) =>
                  handleNotificationToggle("emailAlerts", checked)
                }
                disabled={isNotifSaving}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-4">
              <span>Job Alerts</span>
              <Switch
                checked={notifications.jobAlerts}
                onCheckedChange={(checked) =>
                  handleNotificationToggle("jobAlerts", checked)
                }
                disabled={isNotifSaving}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-4">
              <span>Interview Reminders</span>
              <Switch
                checked={notifications.interviewReminders}
                onCheckedChange={(checked) =>
                  handleNotificationToggle("interviewReminders", checked)
                }
                disabled={isNotifSaving}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI INSIGHT */}
        <Card className="rounded-3xl border-0 shadow-2xl bg-linear-to-br from-blue-500/10 via-cyan-500/10 to-purple-500/10 backdrop-blur-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/10">
                <Sparkles className="text-purple-500" size={18} />
              </div>
              <h2 className="font-semibold text-lg">AI Career Insight</h2>
            </div>

            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              Your profile is{" "}
              <span className="font-semibold text-blue-500">
                {completion}% optimized
              </span>{" "}
              for recruiters.
              {completionTips.length > 0 ? (
                <>
                  {" "}
                  Add {completionTips.slice(0, 3).join(", ")} to increase your
                  interview rate.
                </>
              ) : (
                " Your profile looks complete!"
              )}
            </p>

            <div className="w-full h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completion}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>

            <Button
              onClick={() => {
                if (completionTips.length === 0) {
                  toast.success("You're all set — profile is complete!");
                  return;
                }
                toast(`Focus on: ${completionTips.join(", ")}`);
              }}
              className="w-full bg-linear-to-r from-blue-500 via-cyan-500 to-purple-500 text-white rounded-xl"
            >
              Improve My Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 🟢 SHADCN UI RESUME PREVIEW DIALOG */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden gap-0 rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900">
          {/* Dialog Header */}
          <DialogHeader className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <FileText className="text-blue-500" size={20} />
              <DialogTitle className="font-semibold text-sm md:text-base max-w-62.5 md:max-w-md truncate text-zinc-900 dark:text-zinc-100">
                {resumeName}
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* Dialog Body (PDF View via Iframe) */}
          <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 p-2">
            {resumeFullUrl && (
              <iframe
                src={`${resumeFullUrl}#toolbar=0`}
                className="w-full h-full rounded-2xl border-0"
                title="Resume Preview"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ProfileSettings({ user }: UserProps) {
  const { data: meData } = useGetMeQuery();
  const freshUser = meData?.data?.user || user;
  const userKey = freshUser?._id || freshUser?.id || "initial";

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-white p-6 md:p-10">
      <ProfileSettingsForm key={userKey} freshUser={freshUser} />
    </div>
  );
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const err = error as { data?: { message?: string } };
    return err.data?.message || fallback;
  }
  return fallback;
}
