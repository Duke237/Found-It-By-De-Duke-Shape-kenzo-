"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 cursor-pointer";

  const variants = {
    primary:
      "bg-[linear-gradient(90deg,rgb(var(--accent)),rgb(var(--accent-2)))] text-white hover:brightness-110 shadow-lg hover:shadow-black/10 hover:scale-105",
    secondary:
      "bg-[rgb(var(--surface))] text-app hover:bg-[rgb(var(--surface-2))] shadow-lg hover:shadow-black/10 hover:scale-105 border border-app",
    outline:
      "border-2 border-[rgb(var(--accent))] text-accent hover:bg-[rgb(var(--accent))] hover:text-white hover:scale-105",
    ghost:
      "text-muted hover:text-app hover:bg-[rgb(var(--surface)/0.6)] border border-transparent",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}
