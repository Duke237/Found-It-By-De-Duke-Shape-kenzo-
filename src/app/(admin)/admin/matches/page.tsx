"use client";

import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminBottomNav from "@/components/admin/AdminBottomNav";

type MatchStatus = "pending" | "confirmed" | "rejected";
type FilterStatus = "all" | MatchStatus;

interface Match {
  id: number;
  lostItemId: number;
  foundItemId: number;
  similarityScore: number;
  status: MatchStatus;
  createdAt: string;
  updatedAt: string;
  lostItem: {
    id: number;
    title: string;
    description: string;
    category: string;
    location: string;
    imageUrl: string | null;
  };
  foundItem: {
    id: number;
    title: string;
    description: string;
    category: string;
    location: string;
    imageUrl: string | null;
  };
  lostUser: {
    id: number;
    username: string;
    email: string;
  };
  foundUser: {
    id: number;
    username: string;
    email: string;
  };
}

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("pending");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    rejected: 0,
    avgScore: 0,
  });

  // Fetch matches
  const fetchMatches = useCallback(async () => {
    try {
      const url = filter === "all" 
        ? "/api/admin/matches" 
        : `/api/admin/matches?status=${filter}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const matchData = data.matches || [];
        setMatches(matchData);

        // Calculate stats
        const allRes = await fetch("/api/admin/matches");
        const allData = allRes.ok ? await allRes.json() : { matches: [] };
        const allMatches = allData.matches || [];
        
        setStats({
          total: allMatches.length,
          pending: allMatches.filter((m: Match) => m.status === "pending").length,
          confirmed: allMatches.filter((m: Match) => m.status === "confirmed").length,
          rejected: allMatches.filter((m: Match) => m.status === "rejected").length,
          avgScore: allMatches.length > 0
            ? allMatches.reduce((sum: number, m: Match) => sum + m.similarityScore, 0) / allMatches.length
            : 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // Approve or reject match
  const updateMatchStatus = async (matchId: number, status: "confirmed" | "rejected") => {
    setProcessingId(matchId);
    try {
      const res = await fetch("/api/admin/matches", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, status }),
      });

      if (res.ok) {
        setMatches((prev) =>
          prev.map((m) => (m.id === matchId ? { ...m, status } : m))
        );
        setSelectedMatch(null);
      }
    } catch (error) {
      console.error("Failed to update match:", error);
    } finally {
      setProcessingId(null);
    }
  };

  // Run manual AI matching
  const runManualMatching = async (itemId: number, itemType: "lost" | "found") => {
    setProcessingId(itemId);
    try {
      const res = await fetch("/api/admin/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, itemType }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`AI matching completed! Found ${data.matches?.length || 0} potential matches.`);
        fetchMatches();
      }
    } catch (error) {
      console.error("Failed to run AI matching:", error);
      alert("Failed to run AI matching");
    } finally {
      setProcessingId(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.85) return "text-green-600 bg-green-100";
    if (score >= 0.75) return "text-blue-600 bg-blue-100";
    if (score >= 0.6) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  const getStatusBadge = (status: MatchStatus) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Confirmed
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminSidebar />

      <div className="md:ml-64 pb-20 md:pb-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Match Control</h1>
              <p className="text-sm text-gray-500 mt-1">
                Review and manage AI-detected matches between lost and found items
              </p>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="px-4 md:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Total Matches", value: stats.total, color: "blue" },
              { label: "Pending", value: stats.pending, color: "yellow" },
              { label: "Confirmed", value: stats.confirmed, color: "green" },
              { label: "Rejected", value: stats.rejected, color: "red" },
              { label: "Avg Score", value: `${(stats.avgScore * 100).toFixed(1)}%`, color: "purple" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 text-${stat.color}-600`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-gray-200 px-4 md:px-8">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: "all", label: "All Matches" },
              { key: "pending", label: "Pending Review" },
              { key: "confirmed", label: "Confirmed" },
              { key: "rejected", label: "Rejected" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as FilterStatus)}
                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  filter === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Matches List */}
        <main className="p-4 md:p-8">
          {matches.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500">No matches found</p>
              <p className="text-sm text-gray-400 mt-1">
                {filter === "all" 
                  ? "Matches will appear here when the AI detects potential connections" 
                  : `No ${filter} matches at the moment`}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedMatch(match)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Match Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(match.status)}
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getScoreColor(match.similarityScore)}`}>
                          {(match.similarityScore * 100).toFixed(1)}% Match
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mt-3">
                        {/* Lost Item */}
                        <div className="bg-blue-50 rounded-xl p-3">
                          <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">Lost Item</span>
                          <h3 className="font-semibold text-gray-900 mt-1">{match.lostItem.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{match.lostItem.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {match.lostItem.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {match.lostUser.username}
                            </span>
                          </div>
                        </div>

                        {/* Found Item */}
                        <div className="bg-green-50 rounded-xl p-3">
                          <span className="text-xs font-medium text-green-600 uppercase tracking-wider">Found Item</span>
                          <h3 className="font-semibold text-gray-900 mt-1">{match.foundItem.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{match.foundItem.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {match.foundItem.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {match.foundUser.username}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {match.status === "pending" && (
                      <div className="flex md:flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateMatchStatus(match.id, "confirmed");
                          }}
                          disabled={processingId === match.id}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 text-sm font-medium"
                        >
                          {processingId === match.id ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateMatchStatus(match.id, "rejected");
                          }}
                          disabled={processingId === match.id}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <AdminBottomNav />

      {/* Match Detail Modal */}
      {selectedMatch && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMatch(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Match Details</h2>
                <button 
                  onClick={() => setSelectedMatch(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                {getStatusBadge(selectedMatch.status)}
                <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${getScoreColor(selectedMatch.similarityScore)}`}>
                  AI Confidence: {(selectedMatch.similarityScore * 100).toFixed(1)}%
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Lost Item Details */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-3">Lost Item</h3>
                  {selectedMatch.lostItem.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={selectedMatch.lostItem.imageUrl} 
                      alt={selectedMatch.lostItem.title}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h4 className="font-semibold text-gray-900">{selectedMatch.lostItem.title}</h4>
                  <p className="text-sm text-gray-600 mt-2">{selectedMatch.lostItem.description}</p>
                  <div className="mt-3 space-y-1 text-sm text-gray-500">
                    <p>📍 {selectedMatch.lostItem.location}</p>
                    <p>🏷️ {selectedMatch.lostItem.category}</p>
                    <p>👤 {selectedMatch.lostUser.username} ({selectedMatch.lostUser.email})</p>
                  </div>
                </div>

                {/* Found Item Details */}
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-green-600 uppercase tracking-wider mb-3">Found Item</h3>
                  {selectedMatch.foundItem.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={selectedMatch.foundItem.imageUrl} 
                      alt={selectedMatch.foundItem.title}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h4 className="font-semibold text-gray-900">{selectedMatch.foundItem.title}</h4>
                  <p className="text-sm text-gray-600 mt-2">{selectedMatch.foundItem.description}</p>
                  <div className="mt-3 space-y-1 text-sm text-gray-500">
                    <p>📍 {selectedMatch.foundItem.location}</p>
                    <p>🏷️ {selectedMatch.foundItem.category}</p>
                    <p>👤 {selectedMatch.foundUser.username} ({selectedMatch.foundUser.email})</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {selectedMatch.status === "pending" && (
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => updateMatchStatus(selectedMatch.id, "confirmed")}
                    disabled={processingId === selectedMatch.id}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    {processingId === selectedMatch.id ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Confirm Match
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => updateMatchStatus(selectedMatch.id, "rejected")}
                    disabled={processingId === selectedMatch.id}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject Match
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
