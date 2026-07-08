'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cancelOrder } from '../../api/orders';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface CancelOrderButtonProps {
  orderId: number;
}

export default function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCancelSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await cancelOrder(orderId);
      setIsModalOpen(false);
      router.refresh(); // Tells Next.js to re-fetch the SSR orders data
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to cancel order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-block">
      <Button
        variant="danger"
        size="sm"
        onClick={() => {
          setError(null);
          setIsModalOpen(true);
        }}
      >
        Cancel Order
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Cancellation"
        description={`Are you sure you want to cancel order #${orderId}? This action cannot be undone.`}
        confirmText="Cancel Order"
        confirmVariant="danger"
        onConfirm={handleCancelSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
}
