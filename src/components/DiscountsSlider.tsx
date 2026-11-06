'use client';

import React from 'react';
import Image from 'next/image';
import { RAFFINI_PRODUCTS } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { formatUZS } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';
import { Percent, ArrowRight } from 'lucide-react';

export function DiscountsSlider() {
  const { setSelectedProduct, t } = useStore();

  const discounted = RAFFINI_PRODUCTS.filter(
    (p) => p.discountPercent && p.discountPercent > 0
  ).slice(0, 8);

  if (discounted.length === 0) return null;

  return (
    <div className="my-6 select-none">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <Percent className="w-3.5 h-3.5 text-rose-600" />
          <h3 className="text-sm font-serif font-bold text-[#1A1F33]">
            {t('discounts')}
          </h3>
        </div>
        <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
          -20% gacha
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-5 px-5">
        {discounted.map((product) => (
          <div
            key={product.id}
            onClick={() => {
              triggerHaptic('light');
              setSelectedProduct(product);
            }}
            className="w-36 flex-shrink-0 bg-white rounded-2xl p-2 border border-black/5 shadow-sm cursor-pointer group active:scale-95 transition-all"
          >
            <div className="relative w-full aspect-[3/3.6] rounded-xl overflow-hidden bg-[#ECE8E1]">
              <Image
                src={product.images[0] || '/images/logo.png'}
                alt={product.title}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-1.5 left-1.5 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm">
                -{product.discountPercent}%
              </span>
            </div>

            <div className="mt-2 px-0.5">
              <h5 className="text-[11px] font-semibold text-[#1A1F33] truncate">
                {product.title}
              </h5>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs font-bold text-[#1A1F33]">
                  {formatUZS(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-[9px] text-[#1A1F33]/40 line-through">
                    {formatUZS(product.oldPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
