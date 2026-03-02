import React from "react";
import Badge from "@/components/ui/Badge";

const BootstrapIcon = ({ name, className = "" }: { name: string; className?: string }) => (
  <i className={`bi bi-${name} ${className}`}></i>
);

const steps = [
  {
    number: "01",
    title: "Submit Your Report",
    description:
      "Fill out a detailed report with item description, photos, last known location, and date. The more details you provide, the better your chances of recovery.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
    tips: ["Add clear photos", "Describe unique features", "Mark exact location"],
  },
  {
    number: "02",
    title: "AI Scans for Matches",
    description:
      "Our intelligent system instantly scans thousands of existing reports to find potential matches based on description, location, and visual similarity.",
    icon: (
      <svg
        className="w-8 h-8"
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
    ),
    tips: ["Instant matching", "98% accuracy rate", "Continuous monitoring"],
  },
  {
    number: "03",
    title: "Get Notified Instantly",
    description:
      "Receive immediate notifications when a match is found. Review the potential match details and confirm if it's your item before making contact.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
    tips: ["Push notifications", "Email alerts", "SMS updates"],
  },
  {
    number: "04",
    title: "Arrange Safe Return",
    description:
      "Connect securely with the finder through our encrypted messaging system. Arrange a safe handover at a public location and confirm the return.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    tips: ["Encrypted chat", "Meet in public", "Confirm receipt"],
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 lg:py-28 bg-subtle relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[rgb(var(--accent)/0.06)] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <Badge variant="accent" className="mb-4">
            <BootstrapIcon name="arrow-repeat" className="mr-1" /> Simple Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-app mb-6 leading-tight">
            How{" "}
            <span className="gradient-text">
              FindIt
            </span>{" "}
            Works
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            Our streamlined four-step process makes it easy to report, track,
            and recover your lost belongings with minimal effort.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-[rgb(var(--accent)/0.25)]" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                {/* Step card */}
                <div className="bg-card rounded-2xl p-6 border border-app hover:border-accent transition-all duration-300 hover:-translate-y-2 h-full">
                  {/* Number + Icon */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-14 h-14 bg-[rgb(var(--accent))] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    <span className="text-5xl font-black text-[rgb(var(--text)/0.06)] group-hover:text-[rgb(var(--accent)/0.12)] transition-colors duration-300">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-app font-bold text-lg mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Tips */}
                  <ul className="space-y-1.5">
                    {step.tips.map((tip, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-2 text-xs text-muted2"
                      >
                        <div className="w-1.5 h-1.5 bg-[rgb(var(--accent))] rounded-full flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow connector (desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-16 z-10 w-6 h-6 bg-app border border-accent rounded-full items-center justify-center">
                    <svg
                      className="w-3 h-3 text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-card border border-app rounded-2xl px-6 py-4">
            <div className="w-10 h-10 bg-[rgb(var(--accent)/0.14)] rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-app font-semibold text-sm">
                Average recovery time: 48 hours
              </p>
              <p className="text-muted2 text-xs">
                Most items are returned within 2 days of reporting
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
