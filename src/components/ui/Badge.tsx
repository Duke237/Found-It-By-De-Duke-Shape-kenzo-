import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "orange" | "green" | "blue" | "red" | "gray";
  className?: string;
}

export default function Badge({
  children,
  variant = "orange",
  className = "",
}: BadgeProps) {
  const variants = {
    orange: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    green: "bg-green-500/20 text-green-400 border border-green-500/30",
    blue: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    red: "bg-red-500/20 text-red-400 border border-red-500/30",
    gray: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
