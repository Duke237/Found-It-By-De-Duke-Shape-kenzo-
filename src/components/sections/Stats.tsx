import React from "react";

const stats = [
  {
    value: "50,000+",
    label: "Items Reported",
    description: "Lost and found items submitted by our community",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
    color: "orange",
  },
  {
    value: "38,500+",
    label: "Items Returned",
    description: "Successfully reunited with their rightful owners",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    color: "green",
  },
  {
    value: "120+",
    label: "Cities Covered",
    description: "Active community networks across the country",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
        />
      </svg>
    ),
    color: "blue",
  },
  {
    value: "98%",
    label: "Match Accuracy",
    description: "AI-powered matching system precision rate",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    color: "purple",
  },
];

const colorMap: Record<string, string> = {
  orange: "bg-orange-500/20 text-orange-400 border-orange-500/20",
  green: "bg-green-500/20 text-green-400 border-green-500/20",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/20",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/20",
};

export default function Stats() {
  return (
    <section className="py-16 lg:py-20 bg-gray-950 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group relative bg-gray-900/50 rounded-2xl p-6 border border-white/5 hover:border-orange-500/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${colorMap[stat.color]}`}
              >
                {stat.icon}
              </div>
              <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-orange-400 font-semibold text-sm mb-2">
                {stat.label}
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">
                {stat.description}
              </p>
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
