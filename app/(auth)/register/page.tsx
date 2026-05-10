/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useRegisterMutation } from "@/app/redux/features/auth/authApi";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type FormValues = {
  name: string;
  profilImage?: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [registerUser, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const inputStyle =
    "bg-white/5 border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition";

  const onSubmit = async (data: FormValues) => {
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      const res = await registerUser(userData).unwrap();

      console.log(res);

      toast.success("Account created successfully 🎉");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error: any) {
      console.log(error);

      toast.error(error?.data?.message || "Registration failed ❌");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 text-white bg-gradient-to-br from-[#070A12] via-[#0b1020] to-[#0a0f1f] overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[400px] h-[400px] bg-pink-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />
        <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />
      </div>

      <Card className="relative w-full max-w-md p-6 border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Create Account
          </h1>

          <p className="text-sm text-white/60">Start your AI job journey 🚀</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-white">Name</Label>

            <Input
              className={inputStyle}
              placeholder="John Emon"
              {...register("name", {
                required: "Name is required",
              })}
            />

            <p className="text-xs text-red-400">{errors.name?.message}</p>
          </div>

          {/* Profile Image */}
          {/* <div className="space-y-2">
            <Label className="text-white">Profile Image</Label>

            <Input
              className={inputStyle}
              placeholder="Image URL"
              {...register("profilImage")}
            />
          </div> */}

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-white">Email</Label>

            <Input
              type="email"
              className={inputStyle}
              placeholder="johndoe@example.com"
              {...register("email", {
                required: "Email is required",
              })}
            />

            <p className="text-xs text-red-400">{errors.email?.message}</p>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="text-white">Password</Label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                className={`${inputStyle} pr-10`}
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className="text-xs text-red-400">{errors.password?.message}</p>
          </div>

          {/* Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:opacity-90 transition font-semibold"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-white/60 mt-5">
          Already have account?{" "}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
