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
      <div className={`${sizeClasses.icon} bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <span className={`font-bold text-gray-900 ${sizeClasses.text} tracking-tight`}>
        Find<span className="text-blue-600">It</span>
      </span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
