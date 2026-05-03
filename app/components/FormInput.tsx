"use client";

import { useState, InputHTMLAttributes, forwardRef } from "react";

type Status = "idle" | "error" | "success";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: string;
  status?: Status;
  error?: string;
  hint?: string;
  showPasswordToggle?: boolean;
}

const borderColor: Record<Status, string> = {
  idle: "var(--border)",
  error: "var(--accent3)",
  success: "var(--accent2)",
};
const shadowColor: Record<Status, string> = {
  idle: "transparent",
  error: "rgba(255,107,107,0.15)",
  success: "rgba(78,205,196,0.15)",
};

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      icon,
      status = "idle",
      error,
      hint,
      showPasswordToggle,
      type,
      ...props
    },
    ref,
  ) => {
    const [showPass, setShowPass] = useState(false);
    const inputType = showPasswordToggle
      ? showPass
        ? "text"
        : "password"
      : type;

    return (
      <div className="mb-4">
        {/* Label */}
        <label
          className="block text-[11px] font-semibold tracking-[0.3px] uppercase mb-[6px]"
          style={{ color: "var(--text2)" }}
        >
          {label}
        </label>

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] pointer-events-none"
            style={{ opacity: 0.5 }}
          >
            {icon}
          </span>

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            className="w-full outline-none text-[14px] font-sora transition-all duration-200"
            style={{
              padding: "10px 12px 10px 38px",
              paddingRight: showPasswordToggle ? "40px" : "12px",
              background: "var(--bg2)",
              border: `1px solid ${borderColor[status]}`,
              borderRadius: "10px",
              color: "var(--text)",
              boxShadow: `0 0 0 3px ${shadowColor[status]}`,
            }}
            {...props}
          />

          {/* Password toggle */}
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] transition-colors duration-200 bg-transparent border-none cursor-pointer"
              style={{ color: "var(--text2)" }}
              tabIndex={-1}
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? "🙈" : "👁"}
            </button>
          )}
        </div>

        {/* Error */}
        {error && status === "error" && (
          <p
            className="flex items-center gap-1 text-[11px] mt-1 animate-err-slide"
            style={{ color: "var(--accent3)" }}
          >
            ⚠ {error}
          </p>
        )}

        {/* Hint */}
        {hint && status === "success" && (
          <p
            className="flex items-center gap-1 text-[11px] mt-1"
            style={{ color: "var(--accent2)" }}
          >
            ✓ {hint}
          </p>
        )}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
export default FormInput;
