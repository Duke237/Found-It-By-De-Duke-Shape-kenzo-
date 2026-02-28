"use client";

import React, { useId } from "react";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (next: string) => void;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  error?: string;
};

export default function AuthField({
  label,
  name,
  value,
  onChange,
  type = "text",
  autoComplete,
  error,
}: Props) {
  const id = useId();
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-app">
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`w-full rounded-xl border bg-[rgb(var(--bg))] px-4 py-3 text-app placeholder:text-muted2 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.35)] ${
            error
              ? "border-red-300 focus:ring-red-200"
              : "border-app hover:border-[rgb(var(--accent)/0.35)]"
          }`}
          placeholder={label}
        />
      </div>
      {error && (
        <p id={describedBy} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

