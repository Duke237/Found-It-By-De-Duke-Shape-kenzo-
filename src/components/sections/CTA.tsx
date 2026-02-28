import React from "react";
import Button from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="py-20 lg:py-28 bg-app relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[rgb(var(--accent)/0.06)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[rgb(var(--accent)/0.1)] rounded-full blur-3xl" />
      </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-[rgb(var(--accent))] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-black/10">
            <svg
              className="w-10 h-10 text-white"
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

        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-app mb-6 leading-tight">
          Lost Something?{" "}
          <span className="gradient-text">
            We&apos;ll Help You
          </span>{" "}
          Find It.
        </h2>

        <p className="text-muted text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
          Join over 25,000 community members who trust FindIt to recover their
          lost belongings. Report your item today and let our AI-powered system
          do the searching for you.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button variant="primary" size="lg">
            🔍 &nbsp; Report Lost Item
          </Button>
          <Button variant="secondary" size="lg">
            📋 &nbsp; Browse Found Items
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted2">
          {[
            { icon: "🔒", text: "Secure & Private" },
            { icon: "⚡", text: "Instant Notifications" },
            { icon: "🆓", text: "Free to Use" },
            { icon: "🌍", text: "120+ Cities" },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
