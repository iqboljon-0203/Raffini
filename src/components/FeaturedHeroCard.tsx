'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Check, Sparkles, ArrowRight } from 'lucide-react';
import { RAFFINI_PRODUCTS } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { formatUZS } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';

export function FeaturedHeroCard() {
  const { setSelectedProduct, addToCart, t } = useStore();
  const [isAdded, setIsAdded] = useState(false);

  // Take the premier jacket as the hero item
  const heroProduct = RAFFINI_PRODUCTS[0];

  if (!heroProduct) return null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('success');
    addToCart(heroProduct, heroProduct.sizes[0] || 'M', heroProduct.colors[0] || 'Klassik Qora', 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      onClick={() => {
        triggerHaptic('light');
        setSelectedProduct(heroProduct);
      }}
      className="relative w-full rounded-[28px] overflow-hidden bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 cursor-pointer my-4 group select-none"
    >
      <div className="flex gap-4 items-center">
        {/* Left: Content */}
        <div className="flex-1 space-y-2">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1A1F33]/5 text-[#1A1F33] text-[9px] font-bold uppercase tracking-wider">
            <Sparkles className="w-2.5 h-2.5" />
            {t('featuredDeal')}
          </div>

          <h3 className="text-base font-serif font-bold text-[#1A1F33] leading-snug line-clamp-2">
            {heroProduct.title}
          </h3>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-base font-black text-[#1A1F33]">
              {formatUZS(heroProduct.price)}
            </span>
            {heroProduct.oldPrice && (
              <span className="text-xs text-[#1A1F33]/40 line-through">
                {formatUZS(heroProduct.oldPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className={`mt-2 py-2 px-4 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#1A1F33] text-[#FAE9D7] hover:bg-[#2A3352]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t('added')}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{t('buy')}</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Large Image */}
        <div className="relative w-32 sm:w-36 aspect-[3/3.8] rounded-2xl overflow-hidden bg-[#ECE8E1] flex-shrink-0">
          <Image
            src={heroProduct.images[0] || '/images/logo.png'}
            alt={heroProduct.title}
            fill
            priority
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          {heroProduct.discountPercent && (
            <span className="absolute top-2 right-2 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
              -{heroProduct.discountPercent}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
