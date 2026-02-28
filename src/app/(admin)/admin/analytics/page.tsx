import React from "react";

export default function AnalyticsPage() {
  const monthlyData = [
    { month: "Aug", lost: 45, found: 52 },
    { month: "Sep", lost: 52, found: 48 },
    { month: "Oct", lost: 61, found: 67 },
    { month: "Nov", lost: 55, found: 72 },
    { month: "Dec", lost: 48, found: 58 },
    { month: "Jan", lost: 72, found: 85 },
    { month: "Feb", lost: 89, found: 103 },
  ];

  const categoryData = [
    { category: "Electronics", count: 156, percentage: 28 },
    { category: "Wallet/Purse", count: 89, percentage: 16 },
    { category: "Keys", count: 78, percentage: 14 },
    { category: "Documents", count: 67, percentage: 12 },
    { category: "Jewelry", count: 56, percentage: 10 },
    { category: "Clothing", count: 45, percentage: 8 },
    { category: "Other", count: 68, percentage: 12 },
  ];

  const maxCount = Math.max(...monthlyData.map(d => Math.max(d.lost, d.found)));

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">System Analytics</h1>
        <p className="text-gray-500 mt-1">View platform performance and usage statistics.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total Lost</p>
          <p className="text-2xl font-bold text-red-600">422</p>
          <p className="text-xs text-green-600 mt-1">+18% from last month</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Total Found</p>
          <p className="text-2xl font-bold text-green-600">485</p>
          <p className="text-xs text-green-600 mt-1">+22% from last month</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Recovery Rate</p>
          <p className="text-2xl font-bold text-blue-600">67%</p>
          <p className="text-xs text-green-600 mt-1">+5% from last month</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">Avg. Resolution</p>
          <p className="text-2xl font-bold text-purple-600">3.2 days</p>
          <p className="text-xs text-green-600 mt-1">-0.5 days faster</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trends Chart */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Lost vs Found Trends</h2>
          <div className="space-y-4">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex items-center gap-4">
                <span className="w-10 text-sm text-gray-600">{data.month}</span>
                <div className="flex-1 flex gap-1">
                  <div 
                    className="h-8 bg-red-500 rounded-l-lg"
                    style={{ width: `${(data.lost / maxCount) * 100}%` }}
                  />
                  <div 
                    className="h-8 bg-green-500 rounded-r-lg"
                    style={{ width: `${(data.found / maxCount) * 100}%` }}
                  />
                </div>
                <div className="w-20 text-right text-sm">
                  <span className="text-red-600 font-medium">{data.lost}</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-green-600 font-medium">{data.found}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Lost</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Found</span>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Category Distribution</h2>
          <div className="space-y-4">
            {categoryData.map((data) => (
              <div key={data.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{data.category}</span>
                  <span className="text-sm font-medium text-gray-900">{data.count} ({data.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 bg-blue-600 rounded-full"
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
