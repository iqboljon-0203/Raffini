'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Heart, X, Check } from 'lucide-react';
import { RAFFINI_PRODUCTS, CATEGORIES } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { formatUZS, cn } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';

export function CatalogView() {
  const { setSelectedProduct, isWishlisted, toggleWishlist } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  let products = RAFFINI_PRODUCTS.filter((p) => {
    const matchesCat =
      selectedCategory === 'Barchasi' || p.category === selectedCategory;
    const matchesSize = !selectedSize || p.sizes.includes(selectedSize);
    return matchesCat && matchesSize;
  });

  if (sortBy === 'price-asc') {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    products = [...products].sort((a, b) => b.price - a.price);
  }

  const allSizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '39', '40', '41', '42', '43', '44'];

  return (
    <div className="max-w-md mx-auto px-5 pb-28 pt-2 select-none">
      {/* Category Pills Header */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              triggerHaptic('selection');
              setSelectedCategory(cat);
            }}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200",
              selectedCategory === cat
                ? "bg-[#1A1F33] text-[#FAE9D7] font-semibold shadow-sm"
                : "bg-transparent text-[#1A1F33]/70 border border-[#1A1F33]/15 hover:border-[#1A1F33]/40"
            )}
          >
            {cat === 'Barchasi' ? 'Erkaklar' : cat}
          </button>
        ))}
      </div>

      {/* Info & Filter Button */}
      <div className="flex items-center justify-between my-3 text-xs text-[#1A1F33]/70">
        <span className="font-medium text-[#1A1F33]">
          {products.length} ta libos
          {selectedSize && (
            <span className="ml-1 text-[#1A1F33] font-bold">• O‘lcham: {selectedSize}</span>
          )}
        </span>

        <button
          onClick={() => {
            triggerHaptic('light');
            setIsFilterModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#1A1F33]/20 text-[#1A1F33] text-xs font-medium hover:bg-[#1A1F33] hover:text-[#FAE9D7] transition shadow-sm active:scale-95"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filtr
        </button>
      </div>

      {/* Minimalist 2-Column Product Grid (Matching Reference Screen 2) */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {products.map((product, idx) => {
          const liked = isWishlisted(product.id);
          const mainImage = product.images[0] || '/images/logo.png';
          const isTaller = idx % 3 === 1;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.25) }}
              onClick={() => {
                triggerHaptic('light');
                setSelectedProduct(product);
              }}
              className="cursor-pointer group flex flex-col"
            >
              <div
                className={cn(
                  "relative w-full rounded-[26px] overflow-hidden bg-[#ECE8E1] transition-transform duration-300 group-hover:scale-[1.01] active:scale-[0.98]",
                  isTaller ? "aspect-[3/4.2]" : "aspect-[3/3.8]"
                )}
              >
                <Image
                  src={mainImage}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  priority={idx < 4}
                />
              </div>

              <div className="mt-2.5 px-0.5 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1A1F33] tracking-tight">
                    {formatUZS(product.price)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic('light');
                      toggleWishlist(product.id);
                    }}
                    aria-label="Sevimlilar"
                    className="p-1 -mr-1 text-[#1A1F33]/60 hover:text-rose-500 active:scale-90 transition"
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4 transition-colors",
                        liked ? "fill-rose-500 text-rose-500" : "stroke-[1.8]"
                      )}
                    />
                  </button>
                </div>

                <span className="text-[11px] text-[#1A1F33]/65 font-normal truncate mt-0.5">
                  {product.title}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filter Bottom Sheet */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="bg-white text-[#1A1F33] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-black/5">
                <h3 className="text-base font-serif font-bold text-[#1A1F33]">
                  Filtr va Saralash
                </h3>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 text-[#1A1F33]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#1A1F33] block mb-2">
                  Narx bo‘yicha saralash
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      triggerHaptic('selection');
                      setSortBy('price-asc');
                    }}
                    className={cn(
                      "py-2.5 px-3 rounded-2xl text-xs font-medium border text-center transition",
                      sortBy === 'price-asc'
                        ? "bg-[#1A1F33] text-[#FAE9D7] border-[#1A1F33]"
                        : "border-[#1A1F33]/15 text-[#1A1F33]"
                    )}
                  >
                    Avval arzonroq
                  </button>
                  <button
                    onClick={() => {
                      triggerHaptic('selection');
                      setSortBy('price-desc');
                    }}
                    className={cn(
                      "py-2.5 px-3 rounded-2xl text-xs font-medium border text-center transition",
                      sortBy === 'price-desc'
                        ? "bg-[#1A1F33] text-[#FAE9D7] border-[#1A1F33]"
                        : "border-[#1A1F33]/15 text-[#1A1F33]"
                    )}
                  >
                    Avval qimmatroq
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#1A1F33] block mb-2">
                  O‘lcham bo‘yicha
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      triggerHaptic('selection');
                      setSelectedSize(null);
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition",
                      selectedSize === null
                        ? "bg-[#1A1F33] text-[#FAE9D7]"
                        : "bg-[#F4EFEA] text-[#1A1F33]"
                    )}
                  >
                    Barchasi
                  </button>
                  {allSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        triggerHaptic('selection');
                        setSelectedSize(s);
                      }}
                      className={cn(
                        "w-9 h-9 rounded-full text-xs font-medium flex items-center justify-center transition",
                        selectedSize === s
                          ? "bg-[#1A1F33] text-[#FAE9D7] font-bold"
                          : "bg-[#F4EFEA] text-[#1A1F33]"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-full py-3.5 rounded-full bg-[#1A1F33] text-[#FAE9D7] text-xs font-bold uppercase tracking-widest shadow-md active:scale-98 transition"
                >
                  Qo‘llash
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
