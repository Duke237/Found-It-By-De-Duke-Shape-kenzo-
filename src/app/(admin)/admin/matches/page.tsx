"use client";

import React, { useState } from "react";

const demoMatches = [
  { id: 1, lostItem: "iPhone 15 Pro", lostLocation: "Times Square", foundItem: "iPhone 15", foundLocation: "Central Park", confidence: "95%", status: "Pending", date: "2026-02-28" },
  { id: 2, lostItem: "Black Wallet", lostLocation: "Brooklyn", foundItem: "Black Leather Wallet", foundLocation: "Brooklyn", confidence: "88%", status: "Confirmed", date: "2026-02-27" },
  { id: 3, lostItem: "Car Keys", lostLocation: "Manhattan", foundItem: "Honda Keys", foundLocation: "Manhattan", confidence: "72%", status: "Pending", date: "2026-02-26" },
  { id: 4, lostItem: "Gold Ring", lostLocation: "Queens", foundItem: "Silver Ring", foundLocation: "Queens", confidence: "45%", status: "Rejected", date: "2026-02-25" },
  { id: 5, lostItem: "Passport", lostLocation: "JFK Airport", foundItem: "US Passport", foundLocation: "JFK Airport", confidence: "99%", status: "Resolved", date: "2026-02-24" },
];

export default function MatchesPage() {
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredMatches = demoMatches.filter((match) => {
    return filterStatus === "All" || match.status === filterStatus;
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Match & Recovery Control</h1>
        <p className="text-gray-500 mt-1">View potential matches, confirm matches, and manage item recoveries.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total Matches</p>
          <p className="text-2xl font-bold text-gray-900">89</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-orange-600">12</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">45</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Resolved</p>
          <p className="text-2xl font-bold text-blue-600">32</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Matches Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lost Item</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Found Item</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Confidence</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMatches.map((match) => (
                <tr key={match.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{match.lostItem}</p>
                    <p className="text-sm text-gray-500">{match.lostLocation}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{match.foundItem}</p>
                    <p className="text-sm text-gray-500">{match.foundLocation}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            parseInt(match.confidence) >= 80 ? "bg-green-600" :
                            parseInt(match.confidence) >= 50 ? "bg-orange-500" : "bg-red-500"
                          }`}
                          style={{ width: match.confidence }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{match.confidence}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{match.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      match.status === "Pending" ? "bg-orange-100 text-orange-800" :
                      match.status === "Confirmed" ? "bg-blue-100 text-blue-800" :
                      match.status === "Resolved" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {match.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {match.status === "Pending" && (
                        <>
                          <button className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                            Confirm
                          </button>
                          <button className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                            Reject
                          </button>
                        </>
                      )}
                      {match.status === "Confirmed" && (
                        <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                          Mark Resolved
                        </button>
                      )}
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
