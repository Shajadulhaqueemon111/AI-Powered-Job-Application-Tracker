"use client";

import { getPasswordStrength } from "../lib/useFormValidation";

interface Props {
  password: string;
}

export default function PasswordStrengthBar({ password }: Props) {
  const { score, label, color } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-[6px]">
      {/* Bar segments */}
      <div className="flex gap-[3px]">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[3px] flex-1 rounded-sm transition-all duration-300"
            style={{ background: i <= score ? color : "var(--border)" }}
          />
        ))}
      </div>
      {/* Label */}
      {label && (
        <p
          className="text-[11px] mt-1 transition-colors duration-200"
          style={{ color }}
        >
          {label}
        </p>
      )}
    </div>
  );
}
