"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, KeyRound, Palette, User, Monitor } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, security & appearance
        </p>
      </div>

      {/* TABS */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full md:w-fit bg-muted/40 p-1 rounded-xl">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-1" />
            Profile
          </TabsTrigger>

          <TabsTrigger value="security">
            <KeyRound className="w-4 h-4 mr-1" />
            Security
          </TabsTrigger>

          <TabsTrigger value="appearance">
            <Palette className="w-4 h-4 mr-1" />
            Theme
          </TabsTrigger>

          <TabsTrigger value="sessions">
            <Monitor className="w-4 h-4 mr-1" />
            Sessions
          </TabsTrigger>
        </TabsList>

        {/* PROFILE */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* AVATAR */}
            <Card className="p-6 rounded-2xl">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-28 w-28">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>

                <Button variant="outline" className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </Card>

            {/* FORM */}
            <Card className="lg:col-span-2 p-6 rounded-2xl space-y-4">
              <h2 className="text-xl font-semibold">Personal Info</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
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
                  <Input placeholder="User" disabled />
                </div>
              </div>

              {/* Bio replaced with simple input */}
              <div>
                <Label>Bio (short)</Label>
                <Input placeholder="Write a short bio..." />
              </div>

              <Button className="w-full md:w-auto">Save Changes</Button>
            </Card>
          </div>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security">
          <Card className="p-6 max-w-xl space-y-4 rounded-2xl">
            <h2 className="text-xl font-semibold">Change Password</h2>

            <Input type="password" placeholder="New password" />
            <Input type="password" placeholder="Confirm password" />

            <Button className="w-full">Update Password</Button>
          </Card>
        </TabsContent>

        {/* THEME */}
        <TabsContent value="appearance">
          <div className="grid md:grid-cols-3 gap-4">
            {["Light", "Dark", "System"].map((t, i) => (
              <button
                key={i}
                className="p-5 rounded-2xl border hover:border-primary transition text-left"
              >
                <div className="h-20 rounded-xl bg-muted mb-3" />
                <p className="font-semibold">{t}</p>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* SESSIONS */}
        <TabsContent value="sessions" className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">Chrome on Windows</p>
                <p className="text-sm text-muted-foreground">
                  Last active 2 hours ago
                </p>
              </div>

              <Button variant="outline">Revoke</Button>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
