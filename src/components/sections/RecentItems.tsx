"use client";

import React, { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

type ItemStatus = "Lost" | "Found" | "Returned";
type ItemCategory =
  | "Electronics"
  | "Accessories"
  | "Documents"
  | "Clothing"
  | "Bags"
  | "Keys"
  | "Jewelry"
  | "Pets";

interface Item {
  id: number;
  emoji: string;
  title: string;
  category: ItemCategory;
  status: ItemStatus;
  location: string;
  date: string;
  description: string;
  reward?: string;
  verified: boolean;
}

const items: Item[] = [
  {
    id: 1,
    emoji: "📱",
    title: "iPhone 15 Pro Max",
    category: "Electronics",
    status: "Lost",
    location: "Times Square Station, NYC",
    date: "Feb 27, 2026",
    description:
      "Space black iPhone 15 Pro Max with a cracked screen protector. Has a blue leather case with initials 'J.M.' engraved.",
    reward: "$200",
    verified: true,
  },
  {
    id: 2,
    emoji: "👜",
    title: "Brown Leather Handbag",
    category: "Bags",
    status: "Found",
    location: "Central Park, NYC",
    date: "Feb 27, 2026",
    description:
      "Found a brown leather handbag near the Bethesda Fountain. Contains personal items. Please contact to verify ownership.",
    verified: true,
  },
  {
    id: 3,
    emoji: "🔑",
    title: "Car Keys + Keychain",
    category: "Keys",
    status: "Found",
    location: "Grand Central Terminal, NYC",
    date: "Feb 26, 2026",
    description:
      "Found a set of car keys with a distinctive red heart keychain and what appears to be a Toyota key fob.",
    verified: false,
  },
  {
    id: 4,
    emoji: "💻",
    title: "MacBook Pro 14-inch",
    category: "Electronics",
    status: "Lost",
    location: "Brooklyn Coffee Shop, NYC",
    date: "Feb 26, 2026",
    description:
      "Silver MacBook Pro 14-inch M3. Has a sticker of a mountain on the lid. Left at a coffee shop on Atlantic Ave.",
    reward: "$500",
    verified: true,
  },
  {
    id: 5,
    emoji: "🎒",
    title: "North Face Backpack",
    category: "Bags",
    status: "Returned",
    location: "Penn Station, NYC",
    date: "Feb 25, 2026",
    description:
      "Navy blue North Face backpack with laptop compartment. Successfully returned to owner after 3 days.",
    verified: true,
  },
  {
    id: 6,
    emoji: "💍",
    title: "Gold Wedding Ring",
    category: "Jewelry",
    status: "Lost",
    location: "Prospect Park, Brooklyn",
    date: "Feb 25, 2026",
    description:
      "Gold wedding band with inscription 'Forever & Always - 2019'. Lost while jogging in Prospect Park.",
    reward: "$1,000",
    verified: true,
  },
];

const categories: (ItemCategory | "All")[] = [
  "All",
  "Electronics",
  "Bags",
  "Keys",
  "Jewelry",
  "Documents",
  "Accessories",
];

const statusColors: Record<ItemStatus, string> = {
  Lost: "bg-[rgb(var(--accent)/0.14)] text-accent border border-[rgb(var(--accent)/0.28)]",
  Found:
    "bg-[rgb(var(--accent-2)/0.14)] text-[rgb(var(--accent-2))] border border-[rgb(var(--accent-2)/0.28)]",
  Returned:
    "bg-[rgb(var(--accent)/0.12)] text-accent border border-[rgb(var(--accent)/0.25)]",
};

export default function RecentItems() {
  const [activeFilter, setActiveFilter] = useState<ItemCategory | "All">("All");
  const [activeStatus, setActiveStatus] = useState<ItemStatus | "All">("All");

  const filtered = items.filter((item) => {
    const catMatch =
      activeFilter === "All" || item.category === activeFilter;
    const statusMatch =
      activeStatus === "All" || item.status === activeStatus;
    return catMatch && statusMatch;
  });

  return (
    <section
      id="recent-items"
      className="py-20 lg:py-28 bg-app relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[rgb(var(--accent)/0.06)] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <Badge variant="accent" className="mb-4">
              📋 &nbsp; Live Reports
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-app mb-4 leading-tight">
              Recent{" "}
              <span className="gradient-text">
                Lost & Found
              </span>{" "}
              Items
            </h2>
            <p className="text-muted text-lg max-w-xl">
              Browse the latest submissions from our community. New items are
              added every few minutes.
            </p>
          </div>
          <Button variant="outline" size="md">
            View All Reports →
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Status filter */}
          <div className="flex gap-2">
            {(["All", "Lost", "Found", "Returned"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeStatus === s
                    ? "bg-[rgb(var(--accent))] text-white"
                    : "bg-[rgb(var(--surface-2)/0.7)] text-muted hover:text-app hover:bg-[rgb(var(--surface-2)/0.9)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeFilter === cat
                    ? "bg-[rgb(var(--surface-2))] text-app border border-[rgb(var(--accent)/0.45)]"
                    : "bg-[rgb(var(--surface-2)/0.55)] text-muted2 hover:text-muted border border-app"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group bg-card rounded-2xl border border-app hover:border-accent transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Card Header */}
              <div
                className="bg-[rgb(var(--accent)/0.08)] p-6 flex items-start justify-between border-b border-app"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-[rgb(var(--surface)/0.7)] rounded-2xl flex items-center justify-center text-3xl">
                    {item.emoji}
                  </div>
                  <div>
                    <h3 className="text-app font-bold text-base leading-tight">
                      {item.title}
                    </h3>
                    <span className="text-muted text-xs">{item.category}</span>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${statusColors[item.status]}`}
                >
                  {item.status}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <p className="text-muted text-sm leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted2">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
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
                    </svg>
                    {item.location}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-app">
                  <div className="flex items-center gap-2">
                    <span className="text-muted2 text-xs">{item.date}</span>
                    {item.verified && (
                      <span className="flex items-center gap-1 text-xs text-accent">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.reward && (
                      <span className="text-xs font-bold text-accent bg-[rgb(var(--accent)/0.12)] px-2 py-0.5 rounded-full">
                        🏆 {item.reward}
                      </span>
                    )}
                    <button className="text-xs text-accent hover:opacity-90 font-semibold transition-colors">
                      View →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="mt-10 text-center">
          <Button variant="outline" size="md">
            Load More Items
          </Button>
        </div>
      </div>
    </section>
  );
}
