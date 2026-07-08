'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { createOrder, checkoutOrder } from '../../api/orders';
import Button from '../ui/Button';

interface CartSummaryProps {
  user: {
    role: string;
    sub: number;
  };
  restaurantId: number;
  restaurantCountry: string;
  currencySymbol: string;
}

export default function CartSummary({
  user,
  restaurantId,
  restaurantCountry,
  currencySymbol,
}: CartSummaryProps) {
  const { cart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();

  const formatPrice = (val: number) => `${currencySymbol}${val.toFixed(2)}`;

  // Cart calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const isMember = user.role === 'MEMBER';

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setCheckoutLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // 1. Create order
      const orderPayload = {
        restaurantId,
        paymentMethod,
        items: cart.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
        })),
      };

      const order = await createOrder(orderPayload);

      // 2. Process checkout & pay immediately
      await checkoutOrder(order.id);

      setSuccessMsg('Order placed and paid successfully!');
      clearCart();
      
      // Redirect to orders
      setTimeout(() => {
        router.push('/dashboard/orders');
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to complete checkout.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-24 shadow-sm space-y-6">
      <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">
        Your Order
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs font-medium">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded text-xs font-medium">
          {successMsg}
        </div>
      )}

      {cart.length === 0 ? (
        <div className="py-8 text-center text-slate-400 space-y-2">
          <svg className="w-8 h-8 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-sm font-medium">Cart is empty</p>
          <p className="text-xs">Add menu items to construct your order.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 pr-1">
            {cart.map((item) => (
              <div key={item.menuItemId} className="py-2.5 flex justify-between text-sm">
                <div className="text-slate-700">
                  <span className="font-semibold text-slate-800">{item.quantity}x</span> {item.name}
                </div>
                <div className="font-semibold text-slate-800">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Tax (5%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-800 pt-1 border-t border-slate-100">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            >
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="UPI">UPI</option>
              <option value="CASH">Cash on Delivery</option>
            </select>
          </div>

          {isMember ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md text-xs font-medium mt-4">
              <p className="flex gap-1.5 items-start">
                <svg className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>
                  <strong>Checkout Disabled:</strong> Team Members do not have authorization to checkout orders. Please contact Manager <strong>{restaurantCountry === 'India' ? 'Captain Marvel' : 'Captain America'}</strong>.
                </span>
              </p>
              <Button
                disabled
                className="w-full mt-3"
              >
                Checkout & Pay
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleCheckout}
              loading={checkoutLoading}
              className="w-full mt-4"
            >
              Checkout & Pay
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
