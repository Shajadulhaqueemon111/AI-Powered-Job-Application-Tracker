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

export default function UserProfile() {
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
        {/* NAV */}
        <TabsList className="grid grid-cols-3 md:grid-cols-7 gap-2 bg-muted/40 p-1 rounded-xl">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-1" /> Profile
          </TabsTrigger>

          <TabsTrigger value="security">
            <KeyRound className="w-4 h-4 mr-1" /> Security
          </TabsTrigger>

          <TabsTrigger value="theme">
            <Palette className="w-4 h-4 mr-1" /> Theme
          </TabsTrigger>

          <TabsTrigger value="language">
            <Globe className="w-4 h-4 mr-1" /> Language
          </TabsTrigger>

          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-1" /> Alerts
          </TabsTrigger>

          <TabsTrigger value="api">
            <Code className="w-4 h-4 mr-1" /> API Keys
          </TabsTrigger>

          <TabsTrigger value="roles">
            <Shield className="w-4 h-4 mr-1" /> Roles
          </TabsTrigger>
        </TabsList>

        {/* PROFILE */}
        <TabsContent value="profile">
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Profile Settings</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input placeholder="John Doe" />
              </div>

              <div>
                <Label>Email</Label>
                <Input placeholder="user@email.com" />
              </div>

              <div>
                <Label>Phone</Label>
                <Input placeholder="+880..." />
              </div>

              <div>
                <Label>Role</Label>
                <Input placeholder="Admin" disabled />
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

            {/* 2FA placeholder */}
            <div className="p-4 border rounded-xl bg-muted/30">
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Enable extra security for your account
              </p>
              <Button variant="outline" className="mt-2">
                Enable 2FA
              </Button>
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

        {/* API KEYS */}
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
