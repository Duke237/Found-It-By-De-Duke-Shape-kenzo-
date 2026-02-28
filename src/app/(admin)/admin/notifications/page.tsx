"use client";

import React, { useState } from "react";

const demoNotifications = [
  { id: 1, type: "system", title: "New User Registration", message: "A new user has registered on the platform", date: "2026-02-28 10:30", read: false },
  { id: 2, type: "alert", title: "Pending Reports", message: "15 reports are awaiting review", date: "2026-02-28 09:15", read: false },
  { id: 3, type: "success", title: "Match Confirmed", message: "iPhone 15 Pro matched with found item", date: "2026-02-27 16:45", read: true },
  { id: 4, type: "system", title: "System Update", message: "Platform will undergo maintenance on March 1st", date: "2026-02-27 14:00", read: true },
  { id: 5, type: "alert", title: "High Volume Reports", message: "Found item reports have increased by 40%", date: "2026-02-26 11:30", read: true },
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState(demoNotifications);
  const [message, setMessage] = useState("");

  const unreadCount = notifications.filter(n => !n.read).length;

  const sendBroadcast = () => {
    if (!message.trim()) return;
    alert(`Broadcast sent: ${message}`);
    setMessage("");
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Notifications & Announcements</h1>
        <p className="text-gray-500 mt-1">Send messages to users and view system alerts.</p>
      </div>

      {/* Send Broadcast */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Broadcast Message</h2>
        <div className="flex flex-col lg:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter your broadcast message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button 
            onClick={sendBroadcast}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Send to All Users
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Notifications List */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
            <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
              {unreadCount} unread
            </span>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    notification.type === "system" ? "bg-gray-100" :
                    notification.type === "alert" ? "bg-orange-100" : "bg-green-100"
                  }`}>
                    {notification.type === "system" && <span className="text-gray-600">ℹ️</span>}
                    {notification.type === "alert" && <span className="text-orange-600">⚠️</span>}
                    {notification.type === "success" && <span className="text-green-600">✓</span>}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-500">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.date}</p>
                  </div>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center gap-3 transition-colors">
                <span className="text-blue-600">📧</span>
                <span className="font-medium text-gray-900">Send Individual Notification</span>
              </button>
              <button className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-xl flex items-center gap-3 transition-colors">
                <span className="text-green-600">📢</span>
                <span className="font-medium text-gray-900">Create Announcement</span>
              </button>
              <button className="w-full p-4 bg-purple-50 hover:bg-purple-100 rounded-xl flex items-center gap-3 transition-colors">
                <span className="text-purple-600">🔔</span>
                <span className="font-medium text-gray-900">Notification Settings</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-gray-900">234</p>
                <p className="text-sm text-gray-500">Total Sent</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-gray-900">89%</p>
                <p className="text-sm text-gray-500">Open Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
