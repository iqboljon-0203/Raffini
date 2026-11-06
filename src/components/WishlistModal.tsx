'use client';

import React from 'react';
import { X, Heart } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { RAFFINI_PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { triggerHaptic } from '@/lib/telegram';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistModal({ isOpen, onClose }: WishlistModalProps) {
  const { wishlist, setSelectedProduct } = useStore();

  if (!isOpen) return null;

  const favoriteProducts = RAFFINI_PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in select-none">
      <div className="bg-white text-[#1A1F33] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/5">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <h2 className="text-base font-serif font-bold text-[#1A1F33]">Sevimlilar</h2>
            <span className="text-xs text-[#1A1F33]/60">({favoriteProducts.length})</span>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1F33]/60 hover:bg-black/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto">
          {favoriteProducts.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#1A1F33]/60">
              <Heart className="w-9 h-9 mx-auto text-[#1A1F33]/20 mb-2 stroke-[1.5]" />
              <p className="font-medium text-[#1A1F33]">Saqlangan liboslar yo‘q</p>
              <p className="text-[11px] text-[#1A1F33]/50 mt-1">
                Katalogdagi yurakcha tugmasi orqali o‘zingizga yoqqan liboslarni saqlang.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {favoriteProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={() => {
                    onClose();
                    setSelectedProduct(product);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
