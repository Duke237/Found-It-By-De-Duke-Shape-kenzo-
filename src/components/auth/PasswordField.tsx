"use client";

import React, { useId, useState } from "react";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (next: string) => void;
  autoComplete?: string;
  error?: string;
  helpText?: string;
};

export default function PasswordField({
  label,
  name,
  value,
  onChange,
  autoComplete,
  error,
  helpText,
}: Props) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  const describedBy = [
    error ? `${id}-error` : null,
    helpText ? `${id}-help` : null,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-app">
        {label}
      </label>
      <div className="mt-2 relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className={`w-full rounded-xl border bg-[rgb(var(--bg))] pl-4 pr-12 py-3 text-app placeholder:text-muted2 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent)/0.35)] ${
            error
              ? "border-red-300 focus:ring-red-200"
              : "border-app hover:border-[rgb(var(--accent)/0.35)]"
          }`}
          placeholder={label}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:text-app hover:bg-[rgb(var(--surface)/0.7)] transition-colors"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {helpText && (
        <p id={`${id}-help`} className="mt-2 text-sm text-muted">
          {helpText}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

