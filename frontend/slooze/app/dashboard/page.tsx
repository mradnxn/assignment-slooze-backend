import React from 'react';
import { cookies } from 'next/headers';
import RestaurantList from '../../components/RestaurantList';
import { decodeJwt } from '../../lib/utils';

export const metadata = {
  title: 'Dashboard - Restaurants',
  description: 'Choose a restaurant to view its menu.',
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('access_token');
  let user = null;

  if (tokenCookie && tokenCookie.value) {
    user = decodeJwt(tokenCookie.value);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome to S.H.I.E.L.D. Bites</h1>
        <p className="text-sm text-slate-500 mt-1">
          Select a restaurant below to view its menu, assemble your cart, and place an order.
        </p>
      </div>

      <RestaurantList user={user} />
    </div>
  );
}
