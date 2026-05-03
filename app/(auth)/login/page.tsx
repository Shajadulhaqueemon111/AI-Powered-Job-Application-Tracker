/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const result = loginSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<FormData> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData;
        fieldErrors[field] = issue.message as any;
      });

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    setLoading(false);

    router.push("/dashboard");
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#070A12] via-[#0b1020] to-[#0a0f1f] px-4 overflow-hidden">
      {/* Background glow (fixed overflow issue) */}
      <div className="absolute w-[300px] h-[300px] bg-cyan-500/20 blur-3xl rounded-full -top-20 -left-20" />
      <div className="absolute w-[300px] h-[300px] bg-pink-500/20 blur-3xl rounded-full -bottom-20 -right-20" />

      <Card className="relative w-full max-w-md p-6 border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-sm text-white/60">Login to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label className="text-white">Email</Label>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="bg-white border-white/10 focus:border-cyan-400"
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="text-white">Password</Label>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="bg-white border-white/10 focus:border-cyan-400"
            />
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-gray-300 bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-200 rounded-xl py-2.5 font-medium text-gray-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M21.35 11.1h-9.18v2.92h5.28c-.23 1.24-1.4 3.64-5.28 3.64-3.18 0-5.78-2.63-5.78-5.86s2.6-5.86 5.78-5.86c1.81 0 3.02.77 3.72 1.43l2.54-2.45C16.9 3.9 15.1 3 13.17 3 8.58 3 4.9 6.58 4.9 11.1s3.68 8.1 8.27 8.1c4.78 0 7.95-3.36 7.95-8.1 0-.54-.06-.95-.14-1.4z"
              />
            </svg>
            Login with Google
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-white/60 mt-5">
          Don’t have account?{" "}
          <Link href="/register" className="text-cyan-400 hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
