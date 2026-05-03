"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import { validators } from "@/app/lib/useFormValidation";

type Field = "firstName" | "lastName" | "email" | "password" | "confirm";
type Status = "idle" | "error" | "success";

type FieldState = {
  value: string;
  error: string;
  status: Status;
};

const initial: Record<Field, FieldState> = {
  firstName: { value: "", error: "", status: "idle" },
  lastName: { value: "", error: "", status: "idle" },
  email: { value: "", error: "", status: "idle" },
  password: { value: "", error: "", status: "idle" },
  confirm: { value: "", error: "", status: "idle" },
};

export default function RegisterPage() {
  const router = useRouter();
  const [fields, setFields] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  function update(
    field: Field,
    value: string,
    validateFn: (v: string) => string,
  ) {
    const error = value ? validateFn(value) : "";
    const status: Status = !value ? "idle" : error ? "error" : "success";

    setFields((prev) => ({
      ...prev,
      [field]: { value, error, status },
    }));
  }

  function updatePassword(value: string) {
    const passError = validators.password(value, 8);

    const confirmError = fields.confirm.value
      ? validators.confirmPassword(fields.confirm.value, value)
      : "";

    setFields((prev) => ({
      ...prev,
      password: {
        value,
        error: passError,
        status: passError ? "error" : "success",
      },
      confirm: {
        ...prev.confirm,
        error: confirmError,
        status: confirmError ? "error" : "success",
      },
    }));
  }

  function updateConfirm(value: string) {
    const error = validators.confirmPassword(value, fields.password.value);

    setFields((prev) => ({
      ...prev,
      confirm: {
        value,
        error,
        status: error ? "error" : "success",
      },
    }));
  }

  function validate() {
    const errs = {
      firstName: validators.required(fields.firstName.value, "First name"),
      lastName: validators.required(fields.lastName.value, "Last name"),
      email: validators.email(fields.email.value),
      password: validators.password(fields.password.value, 8),
      confirm: validators.confirmPassword(
        fields.confirm.value,
        fields.password.value,
      ),
    };

    setFields((prev) => {
      const next = { ...prev };
      (Object.keys(errs) as Field[]).forEach((f) => {
        next[f] = {
          ...prev[f],
          error: errs[f],
          status: errs[f] ? "error" : "success",
        };
      });
      return next;
    });

    return Object.values(errs).every((e) => !e);
  }

  async function handleSubmit() {
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);

    router.push("/dashboard");
  }

  const inputStyle =
    "bg-white/5 border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition";

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 text-white bg-gradient-to-br from-[#070A12] via-[#0b1020] to-[#0a0f1f] overflow-hidden">
      {/* 🔥 Glow Background (FIXED) */}
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

        <div className="space-y-4">
          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-white">First Name</Label>
              <Input
                className={inputStyle}
                placeholder="First Name "
                value={fields.firstName.value}
                onChange={(e) =>
                  update("firstName", e.target.value, (v) =>
                    validators.required(v, "First name"),
                  )
                }
              />
              <p className="text-xs text-red-400">{fields.firstName.error}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Last Name</Label>
              <Input
                className={inputStyle}
                placeholder="Last Name"
                value={fields.lastName.value}
                onChange={(e) =>
                  update("lastName", e.target.value, (v) =>
                    validators.required(v, "Last name"),
                  )
                }
              />
              <p className="text-xs text-red-400">{fields.lastName.error}</p>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-white">Email</Label>
            <Input
              className={inputStyle}
              type="email"
              placeholder="Email"
              value={fields.email.value}
              onChange={(e) =>
                update("email", e.target.value, validators.email)
              }
            />
            <p className="text-xs text-red-400">{fields.email.error}</p>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="text-white">Password</Label>
            <Input
              className={inputStyle}
              placeholder="Password"
              type="password"
              value={fields.password.value}
              onChange={(e) => updatePassword(e.target.value)}
            />
            <p className="text-xs text-red-400">{fields.password.error}</p>
          </div>

          {/* Confirm */}
          <div className="space-y-2">
            <Label className="text-white">Confirm Password</Label>
            <Input
              className={inputStyle}
              placeholder="Confirm Password"
              type="password"
              value={fields.confirm.value}
              onChange={(e) => updateConfirm(e.target.value)}
            />
            <p className="text-xs text-red-400">{fields.confirm.error}</p>
          </div>

          {/* Button */}
          <Button
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:opacity-90 transition font-semibold"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </div>

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
