'use client';

import React from 'react';
import { X, Heart, ShoppingBag } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#0b1713] border border-luxury-gold/30 w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#091310]">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <h2 className="text-base font-serif font-bold text-white">Sevimlilar</h2>
            <span className="text-[11px] text-luxury-gold">({favoriteProducts.length})</span>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto">
          {favoriteProducts.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#8E9F97]">
              <Heart className="w-10 h-10 mx-auto text-white/20 mb-2" />
              <p>Hozircha saqlangan mahsulotlar yo‘q.</p>
              <p className="text-[10px] text-[#63736B] mt-1">
                Katalogdagi yurakcha tugmasini bosib saqlashingiz mumkin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
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

