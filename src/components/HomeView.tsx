'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { RAFFINI_PRODUCTS, CATEGORIES } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { formatUZS, cn } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';

interface HomeViewProps {
  onSearchClick: () => void;
  onBranchesClick: () => void;
}

export function HomeView({ onSearchClick, onBranchesClick }: HomeViewProps) {
  const { setSelectedProduct, isWishlisted, toggleWishlist } = useStore();
  const [selectedCat, setSelectedCat] = useState('Barchasi');

  const filteredProducts = RAFFINI_PRODUCTS.filter(
    (p) => selectedCat === 'Barchasi' || p.category === selectedCat
  );

  return (
    <div className="max-w-md mx-auto px-5 pb-28 pt-2 select-none">
      {/* 1. Minimalist Editorial Headline (Matching Reference Screen 2) */}
      <div className="pt-2 pb-5">
        <h1 className="text-2xl sm:text-3xl font-serif text-[#1A1F33] leading-tight tracking-tight">
          Kashf eting <br />
          <span className="font-bold font-serif text-[#1A1F33]">
            Yangi uslubingiz
          </span>
        </h1>
      </div>

      {/* 2. Category Selector Pills (Matching Reference Screen 2) */}
      <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar -mx-5 px-5">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCat === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                triggerHaptic('selection');
                setSelectedCat(cat);
              }}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200",
                isActive
                  ? "bg-[#1A1F33] text-[#FAE9D7] font-semibold shadow-sm"
                  : "bg-transparent text-[#1A1F33]/70 border border-[#1A1F33]/15 hover:border-[#1A1F33]/40"
              )}
            >
              {cat === 'Barchasi' ? 'Erkaklar' : cat}
            </button>
          );
        })}
      </div>

      {/* 3. Minimalist 2-Column Product Grid (Matching Reference Screen 2) */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {filteredProducts.map((product, idx) => {
          const liked = isWishlisted(product.id);
          const mainImage = product.images[0] || '/images/logo.png';
          // Staggered heights for editorial look if desired, or uniform elegant aspect
          const isTaller = idx % 3 === 1;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.3) }}
              onClick={() => {
                triggerHaptic('light');
                setSelectedProduct(product);
              }}
              className="cursor-pointer group flex flex-col"
            >
              {/* Product Photo Container */}
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

              {/* Card Meta: Price Left, Heart Right, Title Underneath (Exact Reference Match) */}
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
                    aria-label="Sevimlilarga qo‘shish"
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
    </div>
  );
}
