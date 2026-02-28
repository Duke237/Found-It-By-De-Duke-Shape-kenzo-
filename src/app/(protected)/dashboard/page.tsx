"use client";

import { useAuth } from "@/components/auth/useAuth";
import Sidebar from "@/components/dashboard/Sidebar";
import BottomNav from "@/components/dashboard/BottomNav";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = user?.username || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop sidebar - hidden on mobile */}
      <Sidebar />

      {/* Main content area */}
      <div className="md:ml-64 pb-20 md:pb-0">
        {/* Top header bar - visible on mobile */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-4">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        </header>

        {/* Welcome section */}
        <main className="p-6 md:p-8 animate-fade-in">
          <div className="max-w-4xl">
            <div className="bg-blue-50 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Welcome, {displayName}
              </h2>
              <p className="text-gray-600">
                You&apos;re welcome to your dashboard—track your reports and more.
              </p>
            </div>

            {/* Dashboard content grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick Stats Cards */}
              <DashboardCard
                title="My Reports"
                value="0"
                description="Items you've reported"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />
              <DashboardCard
                title="Found Items"
                value="0"
                description="Items you've found"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
              <DashboardCard
                title="Notifications"
                value="0"
                description="Unread notifications"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                }
              />
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickActionCard
                  title="Report Lost Item"
                  description="Submit a report for a lost item"
                  href="/report"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  }
                />
                <QuickActionCard
                  title="Report Found Item"
                  description="Submit a found item report"
                  href="/report"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
                <QuickActionCard
                  title="Browse Found Items"
                  description="Search through found items"
                  href="/browse"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
                <QuickActionCard
                  title="AI Assistant"
                  description="Get help finding items"
                  href="#"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation - hidden on desktop */}
      <BottomNav />
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">{icon}</div>
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="p-3 bg-gray-100 rounded-xl text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 group-hover:text-blue-700">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </a>
  );
}
