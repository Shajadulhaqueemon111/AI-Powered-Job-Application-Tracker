/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import {
  useLoginMutation,
  useVerifyOtpMutation,
} from "@/app/redux/features/auth/authApi";

import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";

type FormData = {
  email: string;
  password: string;
};

type AuthStep = "login" | "otp" | "done";

export default function LoginPage() {
  const router = useRouter();

  const [loginUser] = useLoginMutation();
  const [verifyOtp] = useVerifyOtpMutation();

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);

  const [otp, setOtp] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [authStep, setAuthStep] = useState<AuthStep>("login");

  const [timeLeft, setTimeLeft] = useState(120);
  const [timerActive, setTimerActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // ================= TIMER =================
  useEffect(() => {
    let interval: any;

    if (showOtpModal && timerActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);

            toast.error("OTP expired ⌛");

            setShowOtpModal(false);
            setOtp("");
            setTimerActive(false);
            setAuthStep("login");

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [showOtpModal, timerActive]);

  // ================= LOGIN =================
  const onSubmit = async (data: FormData) => {
    if (authStep !== "login") return;

    try {
      setLoading(true);

      const res = await loginUser(data).unwrap();
      const user = res?.data?.user;

      if (user?.status === "blocked") {
        toast.error("Your account has been blocked 🚫");
        return;
      }
      /**
       * 🔥 IMPORTANT FIX:
       * backend must return:
       * {
       *   twoFactorRequired: boolean,
       *   data?: { accessToken }
       * }
       */

      setUserEmail(data.email);

      // ================= NO 2FA =================
      if (!res?.data?.twoFactorEnabled) {
        const token = res?.data?.accessToken;

        if (!token) {
          toast.error("Token not found");
          return;
        }

        await fetch("/api/auth/set-cookie", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: token }),
        });
        localStorage.setItem("accessToken", token);
        const decoded: any = jwtDecode(token);
        const role = decoded?.role;

        toast.success("Login successful 🎉");

        if (role === "admin") router.push("/admin-dashboard");
        else if (role === "hr") router.push("/hr-dashboard");
        else router.push("/user-dashboard");

        router.refresh();
        return;
      }

      // ================= 2FA ENABLED =================
      setShowOtpModal(true);
      setAuthStep("otp");

      setTimeLeft(120);
      setTimerActive(true);

      toast.success("OTP sent to your email 📩");
    } catch (error: any) {
      toast.error(error?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async () => {
    try {
      setVerifying(true);

      const res = await verifyOtp({
        email: userEmail,
        otp,
      }).unwrap();
      const user = res?.data?.user;
      if (user?.status === "blocked") {
        toast.error("Your account has been blocked 🚫");
        setShowOtpModal(false);
        setTimerActive(false);
        setAuthStep("login");
        return;
      }
      const token = res?.data?.accessToken;

      if (!token) {
        toast.error("Token not found");
        return;
      }

      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token }),
      });
      localStorage.setItem("accessToken", token);
      const decoded: any = jwtDecode(token);
      const role = decoded?.role;

      setTimerActive(false);
      setShowOtpModal(false);
      setAuthStep("done");

      toast.success("Login successful 🎉");

      if (role === "admin") router.push("/admin-dashboard");
      else if (role === "hr") router.push("/hr-dashboard");
      else router.push("/user-dashboard");

      router.refresh();
    } catch (error: any) {
      toast.error(error?.data?.message || "OTP verification failed");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#070A12] via-[#0b1020] to-[#0a0f1f] px-4">
      {/* LOGIN CARD */}
      <Card className="w-full max-w-md p-6 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text">
            Welcome Back
          </h1>
          <p className="text-white/60 text-sm">Login to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="text-white mb-2">Email</Label>
            <Input
              className="text-white"
              placeholder="correct email"
              {...register("email", { required: "Email is required" })}
            />
            <p className="text-red-400 text-xs">{errors.email?.message}</p>
          </div>

          <div>
            <Label className="text-white mb-2">Password</Label>
            <Input
              type="password"
              placeholder="password"
              className="text-white"
              {...register("password", { required: "Password is required" })}
            />
            <p className="text-red-400 text-xs">{errors.password?.message}</p>
          </div>

          <Button disabled={loading || authStep !== "login"} className="w-full">
            {loading ? "Processing..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-white/60 mt-4 text-sm">
          Don&apos;t have account?{" "}
          <Link href="/register" className="text-cyan-400">
            Register
          </Link>
        </p>
      </Card>

      {/* ================= OTP MODAL ================= */}
      {showOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-[#0f172a] p-6 rounded-xl w-full max-w-sm border border-white/10">
            <h2 className="text-white text-center text-xl mb-2">Verify OTP</h2>

            <p className="text-center text-red-400 mb-2">
              OTP expires in: {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </p>

            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className=" text-white"
              placeholder="Enter OTP"
            />

            <Button
              onClick={handleVerifyOtp}
              disabled={verifying}
              className="w-full mt-4"
            >
              {verifying ? "Verifying..." : "Verify OTP"}
            </Button>

            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => {
                setShowOtpModal(false);
                setAuthStep("login");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {verifying && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70">
          <div className="flex flex-col items-center gap-3">
            <Spinner />
            <p className="text-white">Verifying OTP...</p>
          </div>
        </div>
      )}
    </div>
  );
}
