'use client';

import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { formatUZS, cn } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';

interface ProductCardProps {
  product: Product;
  onSelect?: () => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const { isWishlisted, toggleWishlist, setSelectedProduct } = useStore();
  const liked = isWishlisted(product.id);

  const handleClick = () => {
    triggerHaptic('light');
    if (onSelect) {
      onSelect();
    } else {
      setSelectedProduct(product);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    toggleWishlist(product.id);
  };

  const mainImage = product.images[0] || '/images/logo.png';

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer group flex flex-col select-none bg-white rounded-[24px] p-2.5 pb-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-black/[0.04] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-all justify-between"
    >
      {/* Product Photo Container */}
      <div className="relative w-full aspect-[3/3.8] rounded-[18px] overflow-hidden bg-[#F5F2EB] mb-2.5">
        <Image
          src={mainImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 300px"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Heart Button */}
        <button
          onClick={handleLike}
          aria-label="Sevimlilar"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1A1F33] hover:text-rose-500 shadow-sm active:scale-90 transition"
        >
          <Heart
            className={cn(
              "w-3.5 h-3.5 transition-colors",
              liked ? "fill-rose-500 text-rose-500" : "stroke-[1.8]"
            )}
          />
        </button>

        {product.discountPercent && product.discountPercent > 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#1A1F33] text-[#FAE9D7] text-[9px] font-bold tracking-wider">
            -{product.discountPercent}%
          </span>
        )}
      </div>

      {/* Card Meta */}
      <div className="px-1 flex flex-col">
        <span className="text-xs font-bold text-[#1A1F33] tracking-tight">
          {formatUZS(product.price)}
        </span>
        <span className="text-[11px] text-[#1A1F33]/70 font-normal truncate mt-0.5">
          {product.title}
        </span>
      </div>
    </div>
  );
}
