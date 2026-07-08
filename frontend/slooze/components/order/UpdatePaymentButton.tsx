'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateOrderPaymentMethod } from '../../api/orders';
import Button from '../ui/Button';

interface UpdatePaymentButtonProps {
  orderId: number;
  currentMethod: string;
}

export default function UpdatePaymentButton({
  orderId,
  currentMethod,
}: UpdatePaymentButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [method, setMethod] = useState(currentMethod);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (method === currentMethod) {
      setIsEditing(false);
      return;
    }

    setLoading(true);

    try {
      await updateOrderPaymentMethod(orderId, method);
      setIsEditing(false);
      router.refresh(); // Refresh SSR layout to render new values
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to update payment method.');
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1.5">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded p-1 text-slate-800 focus:outline-none focus:border-blue-400"
          disabled={loading}
        >
          <option value="CREDIT_CARD">Credit Card</option>
          <option value="UPI">UPI</option>
          <option value="CASH">Cash</option>
        </select>
        
        <Button
          size="sm"
          loading={loading}
          onClick={handleSave}
          className="px-2 py-1 text-xs"
        >
          ✓
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setMethod(currentMethod);
            setIsEditing(false);
          }}
          disabled={loading}
          className="px-2 py-1 text-xs"
        >
          ✗
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold">{currentMethod}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="text-[10px] text-blue-600 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Edit
      </button>
    </div>
  );
}
