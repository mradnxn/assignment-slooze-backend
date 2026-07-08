import React from 'react';

export default function OrdersLoading() {
  return (
    <div className="space-y-6">
      {/* Title & Description skeleton */}
      <div className="space-y-2">
        <div className="h-7 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse"></div>
      </div>

      {/* Table skeleton */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden animate-pulse">
        <div className="bg-slate-50 h-12 border-b border-slate-200 flex items-center px-6">
          <div className="grid grid-cols-9 gap-4 w-full">
            <div className="h-4 bg-slate-200 rounded col-span-1"></div>
            <div className="h-4 bg-slate-200 rounded col-span-1"></div>
            <div className="h-4 bg-slate-200 rounded col-span-1"></div>
            <div className="h-4 bg-slate-200 rounded col-span-1"></div>
            <div className="h-4 bg-slate-200 rounded col-span-2"></div>
            <div className="h-4 bg-slate-200 rounded col-span-1"></div>
            <div className="h-4 bg-slate-200 rounded col-span-1"></div>
            <div className="h-4 bg-slate-200 rounded col-span-1"></div>
          </div>
        </div>
        
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="h-16 flex items-center px-6">
              <div className="grid grid-cols-9 gap-4 w-full">
                <div className="h-4 bg-slate-100 rounded col-span-1"></div>
                <div className="h-3 bg-slate-100 rounded col-span-1"></div>
                <div className="h-4 bg-slate-150 rounded col-span-1"></div>
                <div className="h-4 bg-slate-100 rounded col-span-1"></div>
                <div className="h-4 bg-slate-100 rounded col-span-2"></div>
                <div className="h-4 bg-slate-150 rounded col-span-1"></div>
                <div className="h-4 bg-slate-100 rounded col-span-1"></div>
                <div className="h-5 bg-slate-100 rounded col-span-1 w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
