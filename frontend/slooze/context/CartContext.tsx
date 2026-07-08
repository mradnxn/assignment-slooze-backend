'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: { id: number; name: string; price: number }) => void;
  updateQuantity: (itemId: number, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: { id: number; name: string; price: number }) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.menuItemId === item.id);
      if (existing) {
        return prevCart.map((i) =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((i) => {
          if (i.menuItemId === itemId) {
            const newQty = i.quantity + delta;
            return { ...i, quantity: newQty };
          }
          return i;
        })
        .filter((i) => i.quantity > 0);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
