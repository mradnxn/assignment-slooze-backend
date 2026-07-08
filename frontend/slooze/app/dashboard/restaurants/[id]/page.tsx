import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CartProvider } from '../../../../context/CartContext';
import MenuItemCard from '../../../../components/restaurant/MenuItemCard';
import CartSummary from '../../../../components/restaurant/CartSummary';
import { decodeJwt } from '../../../../lib/utils';
import { fetchServer } from '../../../../api/server';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getRestaurantData(id: number) {
  try {
    return await fetchServer(`/restaurants/${id}`);
  } catch (err) {
    throw new Error('Access denied: You are not authorized to view this restaurant node.');
  }
}

async function getRestaurantMenu(id: number) {
  return fetchServer(`/restaurants/${id}/menu`);
}

export default async function RestaurantPage({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('access_token');

  if (!tokenCookie || !tokenCookie.value) {
    redirect('/');
  }

  const user = decodeJwt(tokenCookie.value);
  if (!user) {
    redirect('/');
  }

  const restaurantId = parseInt(id, 10);
  if (isNaN(restaurantId)) {
    redirect('/dashboard');
  }

  try {
    const [restaurant, menuItems] = await Promise.all([
      getRestaurantData(restaurantId),
      getRestaurantMenu(restaurantId),
    ]);

    const currencySymbol = restaurant.country === 'India' ? '₹' : '$';

    return (
      <CartProvider>
        <div className="space-y-6">
          {/* Header breadcrumb & info */}
          <div>
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 mb-2"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Restaurants
            </Link>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{restaurant.name}</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Node: <span className="font-semibold text-slate-700">{restaurant.country}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side: Server-Side Menu Items list */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Menu Items</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {menuItems.map((item: any) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    currencySymbol={currencySymbol}
                  />
                ))}
              </div>
            </div>

            {/* Right Side: Reusable Cart Summary Sidebar */}
            <div className="lg:col-span-1">
              <CartSummary
                user={user}
                restaurantId={restaurant.id}
                restaurantCountry={restaurant.country}
                currencySymbol={currencySymbol}
              />
            </div>
          </div>
        </div>
      </CartProvider>
    );
  } catch (err: any) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg font-medium">
        <p>Error: {err.message}</p>
        <Link href="/dashboard" className="mt-4 text-sm text-blue-600 underline font-semibold block">
          Back to Dashboard
        </Link>
      </div>
    );
  }
}
