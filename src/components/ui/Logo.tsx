import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

const sizes = {
  sm: "h-8 w-auto",
  md: "h-10 w-auto",
  lg: "h-12 w-auto",
};

export default function Logo({ size = "md", href = "/", className = "" }: LogoProps) {
  const content = (
    <img
      src="/images/logo (2).png"
      alt="Found It Logo"
      className={`${sizes[size]} object-contain group-hover:scale-105 transition-transform duration-300 ${className}`}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-block group">
        {content}
      </Link>
    );
  }

  return content;
}
