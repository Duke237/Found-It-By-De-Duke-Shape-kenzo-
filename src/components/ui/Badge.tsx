import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "accent" | "green" | "blue" | "red" | "gray";
  className?: string;
}

export default function Badge({
  children,
  variant = "accent",
  className = "",
}: BadgeProps) {
  const variants = {
    accent:
      "bg-[rgb(var(--accent)/0.14)] text-accent border border-[rgb(var(--accent)/0.28)]",
    green:
      "bg-[rgb(var(--accent)/0.12)] text-accent border border-[rgb(var(--accent)/0.24)]",
    blue:
      "bg-[rgb(var(--accent-2)/0.12)] text-[rgb(var(--accent-2))] border border-[rgb(var(--accent-2)/0.24)]",
    red:
      "bg-[rgb(var(--accent-2)/0.12)] text-[rgb(var(--accent-2))] border border-[rgb(var(--accent-2)/0.24)]",
    gray:
      "bg-[rgb(var(--surface-2)/0.6)] text-muted border border-[rgb(var(--border)/0.7)]",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
