import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

const sizes = {
  sm: "h-10 w-auto",
  md: "h-12 w-auto",
  lg: "h-14 w-auto",
};

export default function Logo({ size = "md", href = "/", className = "" }: LogoProps) {
  const content = (
    <Image
      src="/images/logo (2).png"
      alt="Found It Logo"
      width={0}
      height={0}
      sizes="100vw"
      className={`${sizes[size]} object-contain group-hover:scale-105 transition-transform duration-300 ${className}`}
      style={{ width: 'auto', height: 'auto' }}
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
