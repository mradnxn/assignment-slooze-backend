'use client';

import React from 'react';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';

interface AddToCartButtonProps {
  item: {
    id: number;
    name: string;
    price: number;
  };
}

export default function AddToCartButton({ item }: AddToCartButtonProps) {
  const { cart, addToCart, updateQuantity } = useCart();
  
  const cartItem = cart.find((i) => i.menuItemId === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  if (quantity > 0) {
    return (
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md p-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => updateQuantity(item.id, -1)}
          className="w-8 h-8 p-0 flex items-center justify-center"
        >
          -
        </Button>
        <span className="w-6 text-center font-bold text-sm text-slate-800">
          {quantity}
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => updateQuantity(item.id, 1)}
          className="w-8 h-8 p-0 flex items-center justify-center"
        >
          +
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => addToCart(item)}
    >
      + Add to Cart
    </Button>
  );
}
