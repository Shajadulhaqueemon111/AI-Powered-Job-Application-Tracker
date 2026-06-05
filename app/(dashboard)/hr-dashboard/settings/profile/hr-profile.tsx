/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  User,
  KeyRound,
  Palette,
  Globe,
  Bell,
  Code,
  Shield,
  Camera,
  Building2,
  CheckCircle2,
  XCircle,
  Copy,
  RefreshCw,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import {
  useToggleTwoFactorMutation,
  useGetMeQuery,
} from "@/app/redux/features/auth/authApi";
import toast from "react-hot-toast";
import Image from "next/image";

/* ─── TYPES ─── */
type UserProfileProps = {
  user: {
    name: string;
    email: string;
    role: string;
    profileImage: string;
    phoneNumber?: string;
    address?: string;
    twoFactorEnabled?: boolean;
  } | null;
};

/* ─── NAV ITEMS ─── */
const NAV = [
  { key: "profile", label: "Profile", Icon: User },
  { key: "security", label: "Security", Icon: KeyRound },

  { key: "notifications", label: "Notifications", Icon: Bell },

  { key: "roles", label: "Roles", Icon: Shield },
];

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function HRProfile({ user }: UserProfileProps) {
  const { data: meData } = useGetMeQuery();
  const freshUser = meData?.data?.user || user;
  const twoFactor = freshUser?.twoFactorEnabled ?? false;

  const [toggleTwoFactor, { isLoading: twoFactorLoading }] =
    useToggleTwoFactorMutation();
  const [activeTab, setActiveTab] = React.useState("profile");

  const handleTwoFactorToggle = async (checked: boolean) => {
    try {
      const res = await toggleTwoFactor({ enable: checked }).unwrap();
      toast.success(res?.message || "2FA updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update 2FA settings");
    }
  };

  return (
    <div
      className="min-h-screen text-zinc-100"
      style={{
        background:
          "linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #0a0f0a 100%)",
      }}
    >
      {/* ── GRID NOISE OVERLAY ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 39px,#fff 39px,#fff 40px),
            repeating-linear-gradient(90deg,transparent,transparent 39px,#fff 39px,#fff 40px)`,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-10">
        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p
            className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2"
            style={{ color: "#4ade80" }}
          >
            HR Management System
          </p>
          <h1
            className="text-4xl font-black tracking-tight"
            style={{
              fontFamily: "'Sora', sans-serif",
              background: "linear-gradient(135deg, #ffffff 0%, #a1a1aa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Account Settings
          </h1>
          <p className="text-zinc-500 text-sm mt-1.5">
            Manage your profile, security, and workspace preferences
          </p>
        </motion.div>

        <div className="flex gap-6">
          {/* ── SIDEBAR ── */}
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-56 flex-shrink-0 space-y-1"
          >
            {/* AVATAR CARD */}
            <div
              className="mb-6 rounded-2xl p-4 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(74,222,128,0.08), rgba(59,130,246,0.08))",
                border: "1px solid rgba(74,222,128,0.15)",
              }}
            >
              <div className="relative w-16 h-16 mx-auto mb-3">
                <Image
                  src={
                    freshUser?.profileImage ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(freshUser?.name || "HR")}&background=1a2a1a&color=4ade80&bold=true&size=128`
                  }
                  alt="avatar"
                  className="w-16 h-16  ring-green-400/40 rounded-full object-cover ring-2"
                  fill
                />
                <button
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: "#4ade80" }}
                  aria-label="Change profile photo"
                >
                  <Camera size={11} className="text-black" />
                </button>
              </div>
              <p className="text-center text-sm font-semibold text-white truncate">
                {freshUser?.name || "—"}
              </p>
              <p className="text-center text-[11px] text-zinc-500 truncate">
                {freshUser?.email}
              </p>
              <div className="mt-2 flex justify-center">
                <span
                  className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(74,222,128,0.12)",
                    color: "#4ade80",
                  }}
                >
                  {freshUser?.role || "HR"}
                </span>
              </div>
            </div>

            {/* NAV */}
            {NAV.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all duration-200 group"
                style={
                  activeTab === key
                    ? {
                        background: "rgba(74,222,128,0.1)",
                        border: "1px solid rgba(74,222,128,0.2)",
                        color: "#4ade80",
                      }
                    : {
                        background: "transparent",
                        border: "1px solid transparent",
                        color: "#71717a",
                      }
                }
              >
                <Icon size={15} />
                <span className="text-[13px] font-medium">{label}</span>
                {activeTab === key && (
                  <ChevronRight size={12} className="ml-auto opacity-60" />
                )}
              </button>
            ))}
          </motion.aside>

          {/* ── CONTENT ── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "profile" && <ProfileTab user={freshUser} />}
                {activeTab === "security" && (
                  <SecurityTab
                    twoFactor={twoFactor}
                    twoFactorLoading={twoFactorLoading}
                    onToggle={handleTwoFactorToggle}
                  />
                )}

                {activeTab === "notifications" && <NotificationsTab />}

                {activeTab === "roles" && <RolesTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SHARED PANEL WRAPPER ─── */
function Panel({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(15,15,26,0.8)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        className="px-6 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <h2 className="text-base font-bold text-white">{title}</h2>
        {sub && <p className="text-[12px] text-zinc-500 mt-0.5">{sub}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

/* ─── FORM FIELD ─── */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold tracking-widest uppercase text-zinc-500">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ─── PREMIUM INPUT ─── */
function PInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Input
      {...props}
      className="h-10 rounded-xl text-sm text-white placeholder:text-zinc-600 transition-all duration-200 focus-visible:ring-1"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    />
  );
}

/* ─── PRIMARY BUTTON ─── */
function PrimaryBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-black transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
      style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)" }}
    >
      {children}
    </button>
  );
}

/* ─── GHOST BUTTON ─── */
function GhostBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 transition-all duration-200 hover:text-white hover:border-zinc-600"
      style={{ border: "1px solid rgba(255,255,255,0.1)" }}
    >
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════
   TABS
══════════════════════════════════════════ */

/* PROFILE */
function ProfileTab({ user }: { user: any }) {
  const company = user?.company;
  return (
    <div className="space-y-4">
      <Panel
        title="Personal Information"
        sub="Update your basic profile details"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Full Name">
            <PInput placeholder="John Doe" defaultValue={user?.name || ""} />
          </Field>
          <Field label="Email Address">
            <PInput
              placeholder="user@email.com"
              defaultValue={user?.email || ""}
            />
          </Field>
          <Field label="Phone Number">
            <PInput
              placeholder="+880 ..."
              defaultValue={user?.phoneNumber || ""}
            />
          </Field>
          <Field label="Role">
            <PInput defaultValue={user?.role || ""} disabled />
          </Field>
        </div>
        <div className="mt-5 flex gap-3">
          <PrimaryBtn>Save Changes</PrimaryBtn>
          <GhostBtn>Discard</GhostBtn>
        </div>
      </Panel>

      {company && (
        <Panel title="Company Information" sub="Your organization details">
          <div className="flex items-center gap-4 mb-5">
            {company.logo ? (
              <Image
                src={company.logo}
                alt="logo"
                className="w-14 h-14 rounded-xl object-cover"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                fill
              />
            ) : (
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(74,222,128,0.08)",
                  border: "1px solid rgba(74,222,128,0.15)",
                }}
              >
                <Building2 size={24} style={{ color: "#4ade80" }} />
              </div>
            )}
            <div>
              <p className="font-bold text-white">{company.name}</p>
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {company.website}
              </a>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              {company.isVerified ? (
                <span
                  className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(74,222,128,0.1)",
                    color: "#4ade80",
                  }}
                >
                  <CheckCircle2 size={12} /> Verified
                </span>
              ) : (
                <span
                  className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    color: "#f87171",
                  }}
                >
                  <XCircle size={12} /> Unverified
                </span>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Company Name">
              <PInput defaultValue={company.name} />
            </Field>
            <Field label="Website">
              <PInput defaultValue={company.website} />
            </Field>
          </div>
          <div className="mt-5">
            <PrimaryBtn>Update Company</PrimaryBtn>
          </div>
        </Panel>
      )}
    </div>
  );
}

/* SECURITY */
function SecurityTab({
  twoFactor,
  twoFactorLoading,
  onToggle,
}: {
  twoFactor: boolean;
  twoFactorLoading: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <Panel
        title="Change Password"
        sub="Keep your account safe with a strong password"
      >
        <div className="space-y-3 max-w-sm">
          <Field label="New Password">
            <PInput type="password" placeholder="••••••••••••" />
          </Field>
          <Field label="Confirm Password">
            <PInput type="password" placeholder="••••••••••••" />
          </Field>
        </div>
        <div className="mt-5">
          <PrimaryBtn>Update Password</PrimaryBtn>
        </div>
      </Panel>

      <Panel
        title="Two-Factor Authentication"
        sub="Add an extra layer of security to your account"
      >
        <div
          className="flex items-center justify-between rounded-xl p-4"
          style={{
            background: twoFactor
              ? "rgba(74,222,128,0.05)"
              : "rgba(255,255,255,0.02)",
            border: `1px solid ${twoFactor ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.06)"}`,
            transition: "all 0.3s",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: twoFactor
                  ? "rgba(74,222,128,0.15)"
                  : "rgba(255,255,255,0.05)",
              }}
            >
              <Shield
                size={18}
                style={{ color: twoFactor ? "#4ade80" : "#52525b" }}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Two-Factor Authentication
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: twoFactor ? "#4ade80" : "#ef4444" }}
                />
                <span className="text-[11px] text-zinc-500">
                  {twoFactor
                    ? "Enabled — OTP required on login"
                    : "Disabled — Login without OTP"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span
              className="text-[11px] font-bold"
              style={{ color: twoFactor ? "#4ade80" : "#52525b" }}
            >
              {twoFactor ? "ON" : "OFF"}
            </span>
            <Switch
              checked={twoFactor}
              onCheckedChange={onToggle}
              disabled={twoFactorLoading}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* NOTIFICATIONS */
function NotificationsTab() {
  const items = [
    {
      label: "Email Alerts",
      sub: "Receive updates via email",
      defaultOn: true,
    },
    {
      label: "System Notifications",
      sub: "In-app alerts and updates",
      defaultOn: true,
    },
    {
      label: "Security Alerts",
      sub: "Login attempts and policy changes",
      defaultOn: true,
    },
    {
      label: "Weekly Digest",
      sub: "Summary report every Monday",
      defaultOn: false,
    },
    {
      label: "New Applications",
      sub: "Alerts when candidates apply",
      defaultOn: true,
    },
  ];
  const [states, setStates] = React.useState(items.map((i) => i.defaultOn));
  return (
    <Panel
      title="Notification Preferences"
      sub="Control how and when you receive alerts"
    >
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={item.label}
            className="flex items-center justify-between px-4 py-3.5 rounded-xl"
            style={{
              border: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div>
              <p className="text-sm font-medium text-white">{item.label}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">{item.sub}</p>
            </div>
            <Switch
              checked={states[i]}
              onCheckedChange={(v) =>
                setStates((s) => s.map((x, j) => (j === i ? v : x)))
              }
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        ))}
      </div>
      <div className="mt-5">
        <PrimaryBtn>Save Preferences</PrimaryBtn>
      </div>
    </Panel>
  );
}

/* ROLES */
function RolesTab() {
  const roles = [
    {
      name: "Admin",
      desc: "Full system access and management",
      perms: ["Manage Users", "All Reports", "API Access", "Billing"],
      color: "#4ade80",
    },
    {
      name: "Editor",
      desc: "Can manage content and applications",
      perms: ["Post Jobs", "Review Applicants", "View Reports"],
      color: "#60a5fa",
    },
    {
      name: "Viewer",
      desc: "Read-only access to dashboards",
      perms: ["View Dashboard", "View Reports"],
      color: "#a78bfa",
    },
  ];
  return (
    <Panel
      title="Role Permissions"
      sub="Overview of access levels in your organization"
    >
      <div className="space-y-3">
        {roles.map((r) => (
          <div
            key={r.name}
            className="p-4 rounded-xl"
            style={{
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <span
                  className="text-[11px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full"
                  style={{ background: `${r.color}15`, color: r.color }}
                >
                  {r.name}
                </span>
                <span className="text-[12px] text-zinc-500">{r.desc}</span>
              </div>
              <GhostBtn>Manage</GhostBtn>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {r.perms.map((p) => (
                <span
                  key={p}
                  className="text-[10px] px-2 py-0.5 rounded-md text-zinc-400"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
