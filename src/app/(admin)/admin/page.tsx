import React from "react";

export default function AdminDashboard() {
  // Demo data - in a real app this would come from the database
  const stats = [
    { label: "Total Lost Items", value: "156", change: "+12%", color: "red" },
    { label: "Total Found Items", value: "203", change: "+18%", color: "green" },
    { label: "Total Users", value: "1,247", change: "+8%", color: "blue" },
    { label: "Total Matches", value: "89", change: "+25%", color: "purple" },
    { label: "Pending Reports", value: "34", change: "-5%", color: "orange" },
  ];

  const recentActivity = [
    { type: "lost", item: "iPhone 15 Pro", location: "Times Square", time: "5 min ago", status: "Pending" },
    { type: "found", item: "Black Wallet", location: "Central Park", time: "15 min ago", status: "Approved" },
    { type: "match", item: "Car Keys → Found", location: "Brooklyn", time: "1 hr ago", status: "Resolved" },
    { type: "user", item: "New User Registration", location: "John Doe", time: "2 hrs ago", status: "Active" },
    { type: "found", item: "Gold Ring", location: "Grand Central", time: "3 hrs ago", status: "Pending" },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
              <span className={`text-sm font-medium ${
                stat.change.startsWith("+") ? "text-green-600" : "text-red-600"
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <a href="/admin/lost-reports" className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Lost Reports</p>
            <p className="text-sm text-gray-500">View & manage</p>
          </div>
        </a>
        <a href="/admin/found-reports" className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Found Reports</p>
            <p className="text-sm text-gray-500">View & manage</p>
          </div>
        </a>
        <a href="/admin/matches" className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Matches</p>
            <p className="text-sm text-gray-500">Control & recover</p>
          </div>
        </a>
        <a href="/admin/users" className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">Users</p>
            <p className="text-sm text-gray-500">Manage users</p>
          </div>
        </a>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.type === "lost" ? "bg-red-100" :
                  activity.type === "found" ? "bg-green-100" :
                  activity.type === "match" ? "bg-purple-100" : "bg-blue-100"
                }`}>
                  {activity.type === "lost" && <span className="text-red-600">⚠️</span>}
                  {activity.type === "found" && <span className="text-green-600">✓</span>}
                  {activity.type === "match" && <span className="text-purple-600">🔗</span>}
                  {activity.type === "user" && <span className="text-blue-600">👤</span>}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.item}</p>
                  <p className="text-sm text-gray-500">{activity.location}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium ${
                  activity.status === "Pending" ? "text-orange-600" :
                  activity.status === "Approved" ? "text-green-600" :
                  activity.status === "Resolved" ? "text-blue-600" : "text-gray-600"
                }`}>
                  {activity.status}
                </span>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
