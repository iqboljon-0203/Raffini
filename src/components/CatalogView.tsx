'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, ArrowUpDown, Filter, X, Check } from 'lucide-react';
import { RAFFINI_PRODUCTS, CATEGORIES } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { triggerHaptic } from '@/lib/telegram';
import { cn } from '@/lib/utils';

export function CatalogView() {
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filter products
  let products = RAFFINI_PRODUCTS.filter((p) => {
    const matchesCat =
      selectedCategory === 'Barchasi' || p.category === selectedCategory;
    const matchesSize = !selectedSize || p.sizes.includes(selectedSize);
    return matchesCat && matchesSize;
  });

  // Sort products
  if (sortBy === 'price-asc') {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    products = [...products].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    products = [...products].sort((a, b) => b.rating - a.rating);
  }

  const allSizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '39', '40', '41', '42', '43', '44'];

  return (
    <div className="max-w-md mx-auto px-4 pb-36 pt-2">
      {/* Category Pills Header */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              triggerHaptic('selection');
              setSelectedCategory(cat);
            }}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border",
              selectedCategory === cat
                ? "bg-luxury-gold text-[#091310] border-luxury-gold shadow-gold-glow"
                : "bg-luxury-card text-[#8E9F97] border-white/5 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Info & Count Bar */}
      <div className="flex items-center justify-between my-3 text-xs text-[#7A8A82]">
        <span className="font-medium text-white/90">
          {products.length} ta mahsulot
          {selectedSize && (
            <span className="ml-1 text-luxury-gold font-bold">• O‘lcham: {selectedSize}</span>
          )}
        </span>

        <button
          onClick={() => {
            triggerHaptic('light');
            setIsFilterModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-luxury-card border border-luxury-gold/25 text-luxury-gold text-[11px] font-semibold hover:border-luxury-gold transition"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filtr & Saralash
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Filter Modal Drawer */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b1713] border border-luxury-gold/30 w-full max-w-md rounded-t-3xl p-5 text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif font-bold text-white text-base">Filtr va Saralash</h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Options */}
            <div className="mt-4">
              <label className="font-semibold text-white/90 uppercase tracking-wider text-[11px] block mb-2">
                Saralash tartibi
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'default' as const, label: 'Standart' },
                  { id: 'price-asc' as const, label: 'Arzonroq' },
                  { id: 'price-desc' as const, label: 'Qimmatroq' },
                  { id: 'rating' as const, label: 'Reyting bo‘yicha' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      triggerHaptic('selection');
                      setSortBy(s.id);
                    }}
                    className={cn(
                      "py-2 px-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between",
                      sortBy === s.id
                        ? "bg-luxury-gold text-[#091310] border-luxury-gold font-bold shadow-sm"
                        : "bg-luxury-card text-white/70 border-white/5"
                    )}
                  >
                    <span>{s.label}</span>
                    {sortBy === s.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-white/90 uppercase tracking-wider text-[11px]">
                  O‘lcham bo‘yicha filtr
                </label>
                {selectedSize && (
                  <button
                    onClick={() => setSelectedSize(null)}
                    className="text-[10px] text-rose-400 hover:underline"
                  >
                    Filtrni tozalash
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      triggerHaptic('selection');
                      setSelectedSize(selectedSize === size ? null : size);
                    }}
                    className={cn(
                      "min-w-[40px] h-9 px-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center",
                      selectedSize === size
                        ? "bg-luxury-gold text-[#091310] border-luxury-gold shadow-gold-glow"
                        : "bg-luxury-card text-white/80 border-white/5"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action button */}
            <div className="mt-6 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setIsFilterModalOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-luxury-gold to-[#f0ce78] text-[#091310] font-bold text-xs uppercase tracking-wider shadow-gold-glow"
              >
                Natijalarni ko‘rish ({products.length} ta)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
