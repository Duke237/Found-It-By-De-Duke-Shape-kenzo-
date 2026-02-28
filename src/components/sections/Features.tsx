import React from "react";
import Badge from "@/components/ui/Badge";

const features = [
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    title: "AI-Powered Matching",
    description:
      "Our intelligent algorithm automatically matches lost item reports with found submissions using image recognition and keyword analysis.",
    highlight: "Smart Technology",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
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
    title: "Instant Notifications",
    description:
      "Get real-time alerts when a potential match is found for your lost item. Never miss a recovery opportunity with push and email notifications.",
    highlight: "Real-Time Alerts",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
    title: "Location Tracking",
    description:
      "Pin exact locations where items were lost or found on our interactive map. Browse reports by neighborhood, city, or transit hub.",
    highlight: "Geo-Mapping",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    title: "Secure Messaging",
    description:
      "Communicate safely with finders through our encrypted messaging system. Your personal contact details remain private until you choose to share.",
    highlight: "Privacy First",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Photo Verification",
    description:
      "Upload multiple photos of your item for better identification. Our system uses visual matching to increase recovery chances significantly.",
    highlight: "Visual ID",
  },
  {
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "Community Network",
    description:
      "Join thousands of honest community members dedicated to returning lost belongings. Build trust through verified profiles and reputation scores.",
    highlight: "Trusted Community",
  },
];

export default function Features() {
  return (
    <section className="py-20 lg:py-28 bg-app">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="accent" className="mb-4">
            ✨ &nbsp; Platform Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-app mb-6 leading-tight">
            Everything You Need to{" "}
            <span className="gradient-text">
              Recover Your Items
            </span>
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            Our comprehensive platform combines cutting-edge technology with
            community trust to maximize your chances of recovering lost
            belongings.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative bg-card rounded-2xl p-6 lg:p-8 border border-app hover:border-accent transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Background glow on hover */}
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgb(var(--accent)/0.06),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Icon */}
              <div className="relative w-14 h-14 bg-[rgb(var(--accent)/0.12)] border border-[rgb(var(--accent)/0.25)] rounded-2xl flex items-center justify-center text-accent mb-5 group-hover:bg-[rgb(var(--accent)/0.18)] transition-colors duration-300">
                {feature.icon}
              </div>

              {/* Highlight badge */}
              <span className="inline-block text-xs font-semibold text-accent bg-[rgb(var(--accent)/0.12)] px-2 py-0.5 rounded-full mb-3">
                {feature.highlight}
              </span>

              <h3 className="text-app font-bold text-lg mb-3">
                {feature.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Arrow on hover */}
              <div className="mt-4 flex items-center gap-1 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Learn more</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
