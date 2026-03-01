import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

const sizes = {
  sm: { icon: "w-7 h-7", text: "text-lg" },
  md: { icon: "w-8 h-8", text: "text-xl" },
  lg: { icon: "w-9 h-9", text: "text-2xl" },
};

export default function Logo({ size = "md", href = "/", className = "" }: LogoProps) {
  const sizeClasses = sizes[size];
  const content = (
    <div className={`flex items-center gap-2 group ${className}`}>
      <img
        src="/found-it-logo.png"
        alt="Found It Logo"
        className={`${sizeClasses.icon} shadow-lg group-hover:scale-110 transition-transform duration-300`}
        style={{ borderRadius: '12px' }}
      />
      <span className={`font-bold text-gray-900 ${sizeClasses.text} tracking-tight`}>
        Found <span className="text-blue-600">It</span>
      </span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
