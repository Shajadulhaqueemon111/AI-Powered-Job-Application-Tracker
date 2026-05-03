"use client";

import { useState, useCallback } from "react";

export type FieldState = {
  value: string;
  error: string;
  touched: boolean;
  status: "idle" | "error" | "success";
};

export type FormFields<T extends string> = Record<T, FieldState>;

export function useFormValidation<T extends string>(fields: T[]) {
  const initial = fields.reduce((acc, field) => {
    acc[field] = { value: "", error: "", touched: false, status: "idle" };
    return acc;
  }, {} as FormFields<T>);

  const [form, setForm] = useState<FormFields<T>>(initial);

  const setField = useCallback((field: T, value: string, error: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: {
        value,
        error,
        touched: true,
        status: !value ? "idle" : error ? "error" : "success",
      },
    }));
  }, []);

  const touchAll = useCallback(
    (validators: Record<T, () => string>) => {
      setForm((prev) => {
        const next = { ...prev };
        for (const field of fields) {
          const error = validators[field]();
          next[field] = {
            ...prev[field],
            touched: true,
            error,
            status: !prev[field].value ? "idle" : error ? "error" : "success",
          };
        }
        return next;
      });
    },
    [fields],
  );

  const isValid = fields.every(
    (f) =>
      form[f].status === "success" ||
      (form[f].status === "idle" && !form[f].error),
  );

  return { form, setField, touchAll, isValid };
}

// ── Validation helpers ──────────────────────────────────────────────
export const validators = {
  email: (v: string) =>
    !v
      ? "Email is required"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? "Enter a valid email address"
        : "",

  password: (v: string, min = 6) =>
    !v
      ? "Password is required"
      : v.length < min
        ? `Password must be at least ${min} characters`
        : "",

  required: (v: string, label = "This field") =>
    !v
      ? `${label} is required`
      : v.length < 2
        ? `${label} must be at least 2 characters`
        : "",

  confirmPassword: (v: string, original: string) =>
    !v
      ? "Please confirm your password"
      : v !== original
        ? "Passwords do not match"
        : "",
};

// ── Password strength ────────────────────────────────────────────────
export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const map = [
    { label: "", color: "var(--border)" },
    { label: "Weak", color: "#FF6B6B" },
    { label: "Fair", color: "#FF9F43" },
    { label: "Good", color: "#FFC107" },
    { label: "Strong", color: "#4ECDC4" },
  ];

  return { score, ...map[score] };
}
