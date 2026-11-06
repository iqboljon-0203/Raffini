'use client';

import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { RAFFINI_PRODUCTS, CATEGORIES } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { triggerHaptic } from '@/lib/telegram';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { setSelectedProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');

  if (!isOpen) return null;

  let filtered = RAFFINI_PRODUCTS.filter((p) => {
    const matchesTerm =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat =
      selectedCategory === 'Barchasi' || p.category === selectedCategory;

    return matchesTerm && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FBF8F3] overflow-y-auto animate-in fade-in select-none text-[#1A1F33]">
      {/* Top Search bar */}
      <div className="sticky top-0 z-30 p-4 bg-white/95 backdrop-blur-md border-b border-black/5">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              autoFocus
              placeholder="Qidiruv: kurtka, kostyum, poyabzal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FBF8F3] border border-[#1A1F33]/15 rounded-full px-4 py-2.5 pl-10 text-xs text-[#1A1F33] placeholder:text-[#1A1F33]/40 focus:outline-none focus:border-[#1A1F33]"
            />
            <Search className="w-4 h-4 text-[#1A1F33]/50 absolute left-3.5 top-3" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3 text-[#1A1F33]/40 hover:text-[#1A1F33]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="text-xs font-semibold text-[#1A1F33]/80 hover:text-[#1A1F33]"
          >
            Yopish
          </button>
        </div>

        {/* Categories Bar */}
        <div className="max-w-md mx-auto flex gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                triggerHaptic('selection');
                setSelectedCategory(cat);
              }}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                selectedCategory === cat
                  ? "bg-[#1A1F33] text-[#FAE9D7]"
                  : "bg-black/5 text-[#1A1F33]/70 hover:bg-black/10"
              )}
            >
              {cat === 'Barchasi' ? 'Erkaklar' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-md mx-auto w-full p-5 pb-24">
        <div className="flex items-center justify-between mb-4 text-xs text-[#1A1F33]/60">
          <span>{filtered.length} ta natija topildi</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#1A1F33]/60">
            <Search className="w-10 h-10 mx-auto text-[#1A1F33]/20 mb-2 stroke-[1.5]" />
            <p className="font-medium text-[#1A1F33]">Hech narsa topilmadi</p>
            <p className="text-[11px] text-[#1A1F33]/50 mt-1">
              Boshqa so‘z yoki toifa orqali qidirib ko‘ring.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((product) => (
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
  );
}
