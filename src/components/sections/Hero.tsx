"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const floatingCards = [
  {
    icon: "🎒",
    title: "Backpack Found",
    location: "Central Park, NY",
    time: "2 min ago",
    status: "Found",
    color: "green",
  },
  {
    icon: "📱",
    title: "iPhone 15 Lost",
    location: "Times Square, NY",
    time: "15 min ago",
    status: "Lost",
    color: "red",
  },
  {
    icon: "🔑",
    title: "Keys Recovered",
    location: "Grand Central, NY",
    time: "1 hr ago",
    status: "Returned",
    color: "blue",
  },
];

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"lost" | "found">("lost");

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-app"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[rgb(var(--accent)/0.18)] rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-[rgb(var(--accent-2)/0.12)] rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-[rgb(var(--accent)/0.1)] rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="accent" className="animate-fade-in">
                🔍 &nbsp; #1 Lost & Found Platform
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-app leading-tight tracking-tight">
                Reunite With{" "}
                <span className="relative">
                  <span className="gradient-text">
                    What Matters
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full text-accent"
                    viewBox="0 0 300 12"
                    fill="none"
                  >
                    <path
                      d="M2 10 Q75 2 150 8 Q225 14 298 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.6"
                    />
                  </svg>
                </span>{" "}
                Most
              </h1>

              <p className="text-muted text-lg lg:text-xl leading-relaxed max-w-lg">
                Report lost items, browse found submissions, and connect with
                finders in your community. Our smart matching system helps
                reunite thousands of items every day.
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-card-strong backdrop-blur-sm border border-app rounded-2xl p-2 shadow-2xl">
              {/* Toggle */}
              <div className="flex bg-[rgb(var(--surface-2)/0.7)] rounded-xl p-1 mb-3">
                <button
                  onClick={() => setSearchType("lost")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    searchType === "lost"
                      ? "bg-[rgb(var(--accent))] text-white shadow-lg"
                      : "text-muted hover:text-app"
                  }`}
                >
                  I Lost Something
                </button>
                <button
                  onClick={() => setSearchType("found")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    searchType === "found"
                      ? "bg-[rgb(var(--accent))] text-white shadow-lg"
                      : "text-muted hover:text-app"
                  }`}
                >
                  I Found Something
                </button>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted2"
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
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      searchType === "lost"
                        ? "Describe your lost item..."
                        : "Describe what you found..."
                    }
                    className="w-full bg-[rgb(var(--surface-2)/0.75)] text-app placeholder:text-muted2 pl-10 pr-4 py-3 rounded-xl border border-app focus:outline-none focus:border-[rgb(var(--accent)/0.5)] text-sm transition-colors"
                  />
                </div>
                <Button variant="primary" size="sm" className="px-5 rounded-xl">
                  Search
                </Button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6">
              {[
                { value: "50K+", label: "Items Reported" },
                { value: "38K+", label: "Items Returned" },
                { value: "98%", label: "Success Rate" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-app">
                    {stat.value}
                  </span>
                  <span className="text-muted text-sm">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="lg">
                Report Lost Item
              </Button>
              <Button variant="outline" size="lg">
                Browse Found Items
              </Button>
            </div>
          </div>

          {/* Right Content - Floating Cards */}
          <div className="relative hidden lg:block">
            {/* Main illustration card */}
            <div className="relative bg-card-strong rounded-3xl border border-app p-8 shadow-2xl">
              {/* Map placeholder */}
              <div className="relative bg-[rgb(var(--surface-2)/0.7)] rounded-2xl overflow-hidden h-64 mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[rgb(var(--accent)/0.18)] rounded-full flex items-center justify-center mx-auto mb-3 animate-ping-slow">
                      <svg
                        className="w-8 h-8 text-accent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-muted text-sm">
                      Live Item Tracking Map
                    </p>
                    <p className="text-muted2 text-xs mt-1">
                      247 active reports nearby
                    </p>
                  </div>
                </div>
                {/* Decorative dots */}
                {[
                  { top: "20%", left: "25%", color: "bg-[rgb(var(--accent))]" },
                  { top: "45%", left: "60%", color: "bg-[rgb(var(--accent-2))]" },
                  { top: "70%", left: "35%", color: "bg-[rgb(var(--accent))]" },
                  { top: "30%", left: "75%", color: "bg-[rgb(var(--accent-2))]" },
                  { top: "60%", left: "15%", color: "bg-[rgb(var(--accent))]" },
                ].map((dot, i) => (
                  <div
                    key={i}
                    className={`absolute w-3 h-3 ${dot.color} rounded-full animate-pulse shadow-lg`}
                    style={{ top: dot.top, left: dot.left }}
                  />
                ))}
              </div>

              {/* Recent activity */}
              <div className="space-y-3">
                <p className="text-muted text-xs font-semibold uppercase tracking-wider">
                  Recent Activity
                </p>
                {floatingCards.map((card, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-[rgb(var(--surface-2)/0.55)] rounded-xl p-3 border border-app hover:border-accent transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 bg-[rgb(var(--surface-2)/0.75)] rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      {card.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-app text-sm font-semibold truncate">
                        {card.title}
                      </p>
                      <p className="text-muted2 text-xs truncate">
                        📍 {card.location}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          card.color === "green"
                            ? "bg-[rgb(var(--accent)/0.16)] text-accent"
                            : card.color === "red"
                              ? "bg-[rgb(var(--accent-2)/0.16)] text-[rgb(var(--accent-2))]"
                              : "bg-[rgb(var(--accent)/0.16)] text-accent"
                        }`}
                      >
                        {card.status}
                      </span>
                      <p className="text-muted2 text-xs mt-1">{card.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating notification */}
            <div className="absolute -top-4 -right-4 bg-card-strong border border-accent rounded-2xl p-3 shadow-xl animate-float">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[rgb(var(--accent)/0.16)] rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-app text-xs font-semibold">
                    Item Matched!
                  </p>
                  <p className="text-muted2 text-xs">Wallet returned ✓</p>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-card-strong border border-app rounded-2xl p-3 shadow-xl animate-float-delayed">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="text-app text-xs font-semibold">
                    Top Community
                  </p>
                  <p className="text-accent text-xs">New York City</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
