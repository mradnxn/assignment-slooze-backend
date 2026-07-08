'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  // If the path starts with /dashboard/orders, highlight "My Orders"
  const isOrders = pathname.startsWith('/dashboard/orders');
  // Otherwise, if it starts with /dashboard, highlight "Restaurants" (includes details screens)
  const isRestaurants = pathname.startsWith('/dashboard') && !isOrders;

  return (
    <nav className="flex space-x-2">
      <Link
        href="/dashboard"
        className={`text-sm font-semibold px-3 py-2 rounded-md transition-all ${
          isRestaurants
            ? 'text-blue-600 bg-blue-50/70'
            : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
        }`}
      >
        Restaurants
      </Link>
      
      <Link
        href="/dashboard/orders"
        className={`text-sm font-semibold px-3 py-2 rounded-md transition-all ${
          isOrders
            ? 'text-blue-600 bg-blue-50/70'
            : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
        }`}
      >
        My Orders
      </Link>
    </nav>
  );
}
