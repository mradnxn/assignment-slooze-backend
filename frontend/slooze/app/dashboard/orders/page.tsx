import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { fetchServer } from '../../../api/server';
import { decodeJwt } from '../../../lib/utils';
import CancelOrderButton from '../../../components/order/CancelOrderButton';
import UpdatePaymentButton from '../../../components/order/UpdatePaymentButton';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  menuItem: {
    name: string;
  };
}

interface Order {
  id: number;
  createdAt: string;
  restaurantId: number;
  restaurant: {
    name: string;
  };
  totalAmount: number;
  paymentMethod: string;
  status: string;
  country: string;
  orderItems: OrderItem[];
}

async function getOrdersList(): Promise<Order[]> {
  try {
    return await fetchServer('/orders');
  } catch (err) {
    throw new Error('Failed to load order history details.');
  }
}

export const metadata = {
  title: 'Dashboard - Order History',
  description: 'View your S.H.I.E.L.D. Bites orders log and status updates.',
};

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('access_token');

  if (!tokenCookie || !tokenCookie.value) {
    redirect('/');
  }

  const user = decodeJwt(tokenCookie.value);
  if (!user) {
    redirect('/');
  }

  let orders: Order[] = [];
  let errorMsg: string | null = null;

  try {
    orders = await getOrdersList();
  } catch (err: any) {
    errorMsg = err.message || 'Failed to fetch order history.';
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCurrencySymbol = (country: string) => (country === 'India' ? '₹' : '$');

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PLACED':
      case 'PAID':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const isAdmin = user.role === 'ADMIN';
  const isManager = user.role === 'MANAGER';
  const isMember = user.role === 'MEMBER';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          {isAdmin ? 'Global Orders Management' : 'My Order History'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isAdmin
            ? 'Review and manage orders globally, change payment options, or cancel orders.'
            : isManager
            ? `Review and manage food orders placed in Node [${user.country}].`
            : 'Track your personal food orders and their real-time payment states.'}
        </p>
      </div>

      {errorMsg ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg font-medium">
          <p>Error: {errorMsg}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500 shadow-sm">
          <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-lg font-semibold mb-1">No Orders Found</p>
          <p className="text-sm mb-4">No order records exist in your active node registry.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center font-semibold rounded-md transition-all shadow-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm"
          >
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Restaurant</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4">Status</th>
                {(isAdmin || isManager) && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.map((order) => {
                const currency = getCurrencySymbol(order.country);
                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Order ID */}
                    <td className="px-6 py-4 font-bold text-slate-800">
                      #{order.id}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                      {formatDate(order.createdAt)}
                    </td>

                    {/* Restaurant */}
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {order.restaurant.name}
                    </td>

                    {/* Region */}
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wide border ${
                        order.country === 'India'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}>
                        {order.country}
                      </span>
                    </td>

                    {/* Items */}
                    <td className="px-6 py-4 text-xs">
                      <ul className="list-disc list-inside space-y-0.5 max-w-xs truncate">
                        {order.orderItems.map((item) => (
                          <li key={item.id}>
                            <span className="font-semibold text-slate-800">{item.quantity}x</span> {item.menuItem.name}
                          </li>
                        ))}
                      </ul>
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {currency}{order.totalAmount.toFixed(2)}
                    </td>

                    {/* Payment Method */}
                    <td className="px-6 py-4 text-xs">
                      {isAdmin ? (
                        <UpdatePaymentButton
                          orderId={order.id}
                          currentMethod={order.paymentMethod}
                        />
                      ) : (
                        <span className="font-semibold">{order.paymentMethod}</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>

                    {/* Actions (Cancel Button) */}
                    {(isAdmin || isManager) && (
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {order.status !== 'CANCELLED' ? (
                          <CancelOrderButton orderId={order.id} />
                        ) : (
                          <span className="text-xs text-slate-400 font-medium italic">Cancelled</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
