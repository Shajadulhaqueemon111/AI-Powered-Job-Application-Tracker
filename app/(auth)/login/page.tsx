/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useLoginMutation } from "@/app/redux/features/auth/authApi";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [loginUser] = useLoginMutation();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      const res = await loginUser(data).unwrap();
      const token = res?.data?.accessToken;

      console.log("TOKEN:", token);

      if (!token) {
        toast.error("Token not found ");
        return;
      }

      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token }),
      });

      const decoded: any = jwtDecode(token);
      const role = decoded?.role;
      console.log("role:", role);

      toast.success("Login successful 🎉");

      // ✅ redirect
      if (role === "admin") {
        router.push("/admin-dashboard");
      } else {
        router.push("/user-dashboard");
      }

      router.refresh();
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#070A12] via-[#0b1020] to-[#0a0f1f] px-4 overflow-hidden">
      <div className="absolute w-[300px] h-[300px] bg-cyan-500/20 blur-3xl rounded-full -top-20 -left-20" />
      <div className="absolute w-[300px] h-[300px] bg-pink-500/20 blur-3xl rounded-full -bottom-20 -right-20" />

      <Card className="relative w-full max-w-md p-6 border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-sm text-white/60">Login to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Email</Label>
            <Input
              placeholder="Enter your email"
              className="bg-white border-white/10 focus:border-cyan-400"
              {...register("email", { required: "Email is required" })}
            />
            <p className="text-xs text-red-400">{errors.email?.message}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              className="bg-white border-white/10 focus:border-cyan-400"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
            />
            <p className="text-xs text-red-400">{errors.password?.message}</p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-white/60 mt-5">
          Dont have account?{" "}
          <Link href="/register" className="text-cyan-400 hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
