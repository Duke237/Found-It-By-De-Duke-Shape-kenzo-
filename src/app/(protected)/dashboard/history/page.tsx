"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type ItemStatus = "pending" | "approved" | "rejected" | "resolved";

interface HistoryItem {
  id: number;
  type: "lost" | "found";
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  imageUrl: string | null;
  status: ItemStatus;
  createdAt: string;
}

type ViewMode = "lost" | "found";

const categoryLabels: Record<string, string> = {
  electronics: "Electronics",
  jewelry: "Jewelry & Watches",
  documents: "Documents & IDs",
  keys: "Keys & Access Cards",
  wallet: "Wallets & Purses",
  clothing: "Clothing & Accessories",
  pets: "Pets",
  other: "Other",
};

const statusConfig: Record<ItemStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  approved: { label: "Active", color: "bg-green-100 text-green-800 border-green-200" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 border-red-200" },
  resolved: { label: "Resolved", color: "bg-blue-100 text-blue-800 border-blue-200" },
};

export default function HistoryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("lost");
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserItems();
  }, []);

  const fetchUserItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/items?mine=true");
      
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      
      const data = await response.json();
      setItems(data.items || []);
    } catch (err) {
      setError("Failed to load your history. Please try again.");
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => item.type === viewMode);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My History</h1>
        <p className="text-gray-600">
          View all your reported lost and found items. Track their status and manage your submissions.
        </p>
      </div>

      {/* Toggle Switch */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
        <div className="flex p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setViewMode("lost")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
              viewMode === "lost"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              View Lost History
            </span>
          </button>
          <button
            onClick={() => setViewMode("found")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
              viewMode === "found"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
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
              View Found History
            </span>
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your history...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading History</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchUserItems}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No {viewMode === "lost" ? "Lost" : "Found"} Items Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven&apos;t reported any {viewMode} items yet. Start by reporting a {viewMode} item to see it here.
            </p>
            <a
              href={`/dashboard/report-${viewMode}`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Report {viewMode === "lost" ? "Lost" : "Found"} Item
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-300 group"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate pr-2">
                        {item.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[item.status].color}`}>
                        {statusConfig[item.status].label}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="truncate">{categoryLabels[item.category] || item.category}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{item.location}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
