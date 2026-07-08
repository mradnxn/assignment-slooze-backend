'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRestaurants } from '../api/restaurants';

interface Restaurant {
  id: number;
  name: string;
  country: string;
}

interface UserProfile {
  role: string;
  country: string;
  sub: number;
}

interface RestaurantListProps {
  user: UserProfile | null;
}

export default function RestaurantList({ user }: RestaurantListProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const data = await getRestaurants();
        
        const checkAccessible = (country: string) => {
          if (!user) return true;
          if (user.role === 'ADMIN') return true;
          return country === user.country;
        };

        const sorted = [...data].sort((a: Restaurant, b: Restaurant) => {
          const aAcc = checkAccessible(a.country);
          const bAcc = checkAccessible(b.country);
          if (aAcc && !bAcc) return -1;
          if (!aAcc && bAcc) return 1;
          return 0;
        });

        setRestaurants(sorted);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch restaurants.');
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, [user?.role, user?.country]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((n) => (
          <div key={n} className="bg-white border border-slate-200 rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-slate-100 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-slate-100 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 font-medium">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
        <p className="text-lg font-semibold mb-1">No Restaurants Available</p>
        <p className="text-sm">There are no restaurants registered for your country node.</p>
      </div>
    );
  }

  const isAccessible = (restaurantCountry: string) => {
    if (!user) return true;
    if (user.role === 'ADMIN') return true;
    return restaurantCountry === user.country;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {restaurants.map((restaurant) => {
        const accessible = isAccessible(restaurant.country);
        return (
          <button
            key={restaurant.id}
            onClick={() => {
              if (accessible) {
                router.push(`/dashboard/restaurants/${restaurant.id}`);
              }
            }}
            disabled={!accessible}
            className={`text-left bg-white border rounded-lg p-6 transition-all shadow-sm flex flex-col justify-between ${
              accessible
                ? 'border-slate-200 hover:border-blue-400 hover:ring-2 hover:ring-blue-50/50 cursor-pointer'
                : 'border-slate-100 opacity-45 cursor-not-allowed bg-slate-50/30'
            }`}
          >
            <div>
              <h3 className={`text-lg font-bold mb-2 transition-colors ${
                accessible ? 'text-slate-800 hover:text-blue-600' : 'text-slate-500'
              }`}>
                {restaurant.name}
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Explore our freshly prepared menu items and customize your order.
              </p>
            </div>
            
            <div className="flex justify-between items-center w-full border-t border-slate-100 pt-4 mt-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wide border ${
                restaurant.country === 'India'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}>
                {restaurant.country}
              </span>
              
              {accessible ? (
                <span className="text-sm text-blue-600 font-medium group hover:underline flex items-center gap-1">
                  View Menu
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              ) : (
                <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider flex items-center gap-1 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0-8V5a2 2 0 10-4 0v4m4 0a2 2 0 012 2v7a2 2 0 01-2 2H8a2 2 0 01-2-2v-7a2 2 0 012-2h4z" />
                  </svg>
                  Restricted Node
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
