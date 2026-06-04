/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  User,
  KeyRound,
  Palette,
  Globe,
  Bell,
  Code,
  Shield,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

import {
  useToggleTwoFactorMutation,
  useGetMeQuery,
} from "@/app/redux/features/auth/authApi";
import toast from "react-hot-toast";

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

export default function UserProfile({ user }: UserProfileProps) {
  const { data: meData } = useGetMeQuery();

  const freshUser = meData?.data?.user || user;

  // ✅ সরাসরি cache থেকে নাও — onQueryStarted optimistic update করে
  const twoFactor = freshUser?.twoFactorEnabled ?? false;

  const [toggleTwoFactor, { isLoading: twoFactorLoading }] =
    useToggleTwoFactorMutation();

  const handleTwoFactorToggle = async (checked: boolean) => {
    try {
      const res = await toggleTwoFactor({ enable: checked }).unwrap();
      toast.success(res?.message || "2FA updated successfully");
      // onQueryStarted cache update করেছে
      // invalidateTags background-এ fresh data আনবে
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update 2FA settings");
      // onQueryStarted এর patchResult.undo() automatically rollback করবে
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>

        <p className="text-muted-foreground">
          Manage system preferences, security, and account configuration
        </p>
      </div>

      {/* TABS */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 gap-2 bg-muted/40 p-1 rounded-xl">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-1" />
            Profile
          </TabsTrigger>

          <TabsTrigger value="security">
            <KeyRound className="w-4 h-4 mr-1" />
            Security
          </TabsTrigger>

          <TabsTrigger value="theme">
            <Palette className="w-4 h-4 mr-1" />
            Theme
          </TabsTrigger>

          <TabsTrigger value="language">
            <Globe className="w-4 h-4 mr-1" />
            Language
          </TabsTrigger>

          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-1" />
            Alerts
          </TabsTrigger>

          <TabsTrigger value="api">
            <Code className="w-4 h-4 mr-1" />
            API Keys
          </TabsTrigger>

          <TabsTrigger value="roles">
            <Shield className="w-4 h-4 mr-1" />
            Roles
          </TabsTrigger>
        </TabsList>

        {/* PROFILE */}
        <TabsContent value="profile">
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Profile Settings</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  placeholder="John Doe"
                  defaultValue={freshUser?.name || ""}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  placeholder="user@email.com"
                  defaultValue={freshUser?.email || ""}
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  placeholder="+880..."
                  defaultValue={freshUser?.phoneNumber || ""}
                />
              </div>

              <div>
                <Label>Role</Label>
                <Input
                  placeholder="Admin"
                  defaultValue={freshUser?.role || ""}
                  disabled
                />
              </div>
            </div>

            <Button>Save Profile</Button>
          </Card>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security">
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Security</h2>

            <Input type="password" placeholder="New Password" />

            <Input type="password" placeholder="Confirm Password" />

            <Button>Update Password</Button>

            {/* 2FA */}
            <div className="group flex items-center justify-between rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="space-y-1">
                <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Two-Factor Authentication
                </p>

                <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      twoFactor ? "bg-green-500" : "bg-red-500"
                    }`}
                  />

                  {twoFactor
                    ? "Enabled — OTP required on login"
                    : "Disabled — Login without OTP"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {twoFactor ? "ON" : "OFF"}
                </span>

                <Switch
                  checked={twoFactor}
                  onCheckedChange={handleTwoFactorToggle}
                  disabled={twoFactorLoading}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* THEME */}
        <TabsContent value="theme">
          <div className="grid md:grid-cols-3 gap-4">
            {["Light", "Dark", "System"].map((t) => (
              <Card key={t} className="p-6 cursor-pointer hover:border-primary">
                <div className="h-20 bg-muted rounded-xl mb-3" />
                <p className="font-semibold">{t} Mode</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* LANGUAGE */}
        <TabsContent value="language">
          <Card className="p-6 space-y-3">
            <h2 className="text-xl font-semibold">Language</h2>

            <div className="grid md:grid-cols-3 gap-3">
              {["English", "Bangla", "Hindi"].map((lang) => (
                <Button key={lang} variant="outline">
                  {lang}
                </Button>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications">
          <Card className="p-6 space-y-3">
            <h2 className="text-xl font-semibold">Notifications</h2>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Email alerts</p>
              <p>• System alerts</p>
              <p>• Security alerts</p>
            </div>

            <Button variant="outline">Configure Notifications</Button>
          </Card>
        </TabsContent>

        {/* API */}
        <TabsContent value="api">
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">API Keys</h2>

            <div className="p-3 border rounded-xl bg-muted/30">
              <p className="text-sm">sk_live_xxxxxxxxxxxxx</p>
            </div>

            <Button>Generate New Key</Button>
          </Card>
        </TabsContent>

        {/* ROLES */}
        <TabsContent value="roles">
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Role Permissions</h2>

            <div className="space-y-2 text-sm">
              <p>✔ Admin - Full access</p>
              <p>✔ Editor - Limited access</p>
              <p>✔ User - Read only</p>
            </div>

            <Button variant="outline">Manage Roles</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
