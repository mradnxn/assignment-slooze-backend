import React from 'react';

export default function RestaurantLoading() {
  return (
    <div className="space-y-6">
      {/* Header breadcrumb & info */}
      <div className="space-y-2">
        <div className="h-4 bg-slate-100 rounded w-20 animate-pulse mb-2"></div>
        <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-4 bg-slate-100 rounded w-16 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Menu Grid Skeletons */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 bg-slate-200 rounded w-24 mb-4 animate-pulse"></div>
          
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white border border-slate-200 rounded-lg p-5 flex justify-between items-center h-28 animate-pulse"
              >
                <div className="space-y-2 pr-4 flex-grow">
                  <div className="h-5 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-12"></div>
                </div>

                <div className="h-8 bg-blue-50 border border-blue-100 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Cart Summary Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-lg p-6 h-96 animate-pulse space-y-6">
            <div className="h-6 bg-slate-200 rounded w-1/3 border-b border-slate-100 pb-3"></div>
            
            <div className="space-y-4 py-8 text-center">
              <div className="w-8 h-8 bg-slate-100 rounded-full mx-auto"></div>
              <div className="h-4 bg-slate-100 rounded w-1/3 mx-auto"></div>
              <div className="h-3 bg-slate-100 rounded w-1/2 mx-auto"></div>
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-2">
              <div className="h-3 bg-slate-100 rounded w-1/4"></div>
              <div className="h-10 bg-slate-100 rounded w-full mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
