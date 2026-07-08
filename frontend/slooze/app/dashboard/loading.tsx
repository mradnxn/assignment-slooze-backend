import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-7 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse"></div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between h-44 animate-pulse"
          >
            <div>
              <div className="h-6 bg-slate-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-slate-100 rounded w-5/6 mb-2"></div>
              <div className="h-4 bg-slate-100 rounded w-2/3"></div>
            </div>
            
            <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-4">
              <div className="h-5 bg-slate-100 rounded w-16"></div>
              <div className="h-4 bg-blue-100 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
