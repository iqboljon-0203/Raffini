'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { SlidersHorizontal, Heart, Star, X, Check, ArrowUpDown } from 'lucide-react';
import { RAFFINI_PRODUCTS, CATEGORIES } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { formatUZS, cn } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';

export function CatalogView() {
  const { setSelectedProduct, isWishlisted, toggleWishlist } = useStore();
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
              "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border",
              selectedCategory === cat
                ? "bg-[#FAE9D7] text-[#1A1F33] border-[#FAE9D7] shadow-gold-glow font-bold scale-105"
                : "bg-[#1A1F33] text-[#8E9BAE] border-white/5 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Info & Count Bar */}
      <div className="flex items-center justify-between my-3 text-xs text-[#8E9BAE]">
        <span className="font-medium text-white/90">
          {products.length} ta mahsulot
          {selectedSize && (
            <span className="ml-1 text-[#FAE9D7] font-bold">• O‘lcham: {selectedSize}</span>
          )}
        </span>

        <button
          onClick={() => {
            triggerHaptic('light');
            setIsFilterModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A1F33] border border-[#FAE9D7]/30 text-[#FAE9D7] text-xs font-semibold hover:border-[#FAE9D7] transition shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filtr & Saralash
        </button>
      </div>

      {/* Editorial High-Fashion Product Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        {products.map((product) => {
          const liked = isWishlisted(product.id);
          const mainImage = product.images[0] || '/images/logo.png';

          return (
            <div
              key={product.id}
              onClick={() => {
                triggerHaptic('light');
                setSelectedProduct(product);
              }}
              className="group relative flex flex-col justify-between cursor-pointer transition-transform active:scale-[0.98]"
            >
              {/* Rounded image card with corner price pill */}
              <div className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden bg-[#161B2C] border border-[#FAE9D7]/15 group-hover:border-[#FAE9D7]/40 transition-all duration-300 shadow-luxury">
                <Image
                  src={mainImage}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className={cn(
                    "absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all",
                    liked
                      ? "bg-rose-500 text-white shadow-md scale-110"
                      : "bg-black/50 text-white/80 hover:text-white border border-white/10"
                  )}
                >
                  <Heart className={cn("w-3.5 h-3.5", liked && "fill-white")} />
                </button>

                {/* Corner Floating Price Pill */}
                <div className="absolute bottom-3 right-3 bg-[#1A1F33]/90 backdrop-blur-md border border-[#FAE9D7]/30 text-[#FAE9D7] text-[11px] font-black px-2.5 py-1 rounded-full shadow-floating-pill">
                  {formatUZS(product.price)}
                </div>
              </div>

              {/* Info */}
              <div className="mt-2 px-1">
                <h3 className="text-white text-xs font-semibold line-clamp-1 group-hover:text-[#FAE9D7] transition-colors">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between mt-1 text-[11px] text-[#8E9BAE]">
                  <span className="text-[10px] uppercase tracking-wider text-[#A0AEC0] truncate max-w-[95px]">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-[#FAE9D7]">
                    <Star className="w-3 h-3 fill-[#FAE9D7]" />
                    <span className="font-bold text-white text-[11px]">{product.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Modal Drawer */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1A1F33] border border-[#FAE9D7]/30 w-full max-w-md rounded-t-3xl p-5 text-xs shadow-2xl">
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
                      "py-2.5 px-3 rounded-2xl border text-xs font-medium text-left flex items-center justify-between",
                      sortBy === s.id
                        ? "bg-[#FAE9D7] text-[#1A1F33] border-[#FAE9D7] font-bold shadow-sm"
                        : "bg-[#141928] text-white/70 border-white/5"
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
              <div className="flex flex-wrap gap-2">
                {allSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      triggerHaptic('selection');
                      setSelectedSize(selectedSize === size ? null : size);
                    }}
                    className={cn(
                      "min-w-[42px] h-10 px-3 rounded-2xl border text-xs font-black transition flex items-center justify-center",
                      selectedSize === size
                        ? "bg-[#FAE9D7] text-[#1A1F33] border-[#FAE9D7] shadow-gold-glow"
                        : "bg-[#141928] text-white/80 border-white/5"
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
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#FAE9D7] to-[#E5C49F] text-[#1A1F33] font-black text-xs uppercase tracking-wider shadow-gold-glow"
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
