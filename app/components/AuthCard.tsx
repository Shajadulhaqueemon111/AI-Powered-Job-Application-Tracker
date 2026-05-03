"use client";
import { ReactNode } from "react";

interface AuthCardProps {
  icon: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  shake?: boolean;
  className?: string;
}

export default function AuthCard({
  icon,
  title,
  subtitle,
  children,
  shake,
}: AuthCardProps) {
  return (
    <div
      className="flex items-center justify-center px-4 py-8"
      style={{ minHeight: "calc(100vh - 60px)" }}
    >
      <div
        className={`relative w-full max-w-[420px] rounded-[20px] p-8 ${shake ? "animate-shake" : ""}`}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Glow border */}
        <div
          className="absolute inset-[-1px] rounded-[21px] -z-10"
          style={{
            background:
              "linear-gradient(135deg, var(--accent), transparent, var(--accent2))",
            opacity: 0.4,
          }}
        />

        {/* Header */}
        <div className="text-center mb-7">
          <div
            className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[22px] mx-auto mb-4"
            style={{
              background:
                "linear-gradient(135deg, var(--accent), var(--accent2))",
            }}
          >
            {icon}
          </div>
          <h2 className="text-[20px] font-bold tracking-tight mb-1">{title}</h2>
          <p className="text-[13px]" style={{ color: "var(--text2)" }}>
            {subtitle}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
