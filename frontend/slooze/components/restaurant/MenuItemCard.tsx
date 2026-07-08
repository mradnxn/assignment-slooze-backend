import React from 'react';
import AddToCartButton from './AddToCartButton';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface MenuItemCardProps {
  item: MenuItem;
  currencySymbol: string;
}

export default function MenuItemCard({
  item,
  currencySymbol,
}: MenuItemCardProps) {
  const formattedPrice = `${currencySymbol}${item.price.toFixed(2)}`;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex justify-between items-center hover:border-slate-300 transition-colors shadow-sm">
      <div className="space-y-1 pr-4">
        <h3 className="font-bold text-slate-800">{item.name}</h3>
        <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
        <span className="inline-block text-sm font-bold text-blue-600 mt-1">
          {formattedPrice}
        </span>
      </div>

      <div className="flex-shrink-0">
        {/* Interactive client-side button context */}
        <AddToCartButton item={item} />
      </div>
    </div>
  );
}
