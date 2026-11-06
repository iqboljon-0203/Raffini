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
      className="cursor-pointer group flex flex-col select-none"
    >
      {/* Product Photo Container (Reference Screen 2) */}
      <div className="relative w-full aspect-[3/3.8] rounded-[24px] overflow-hidden bg-[#ECE8E1] transition-transform duration-300 group-hover:scale-[1.01] active:scale-[0.98]">
        <Image
          src={mainImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 300px"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Card Meta: Price Left, Heart Right, Title Underneath */}
      <div className="mt-2.5 px-0.5 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#1A1F33] tracking-tight">
            {formatUZS(product.price)}
          </span>

          <button
            onClick={handleLike}
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
    </div>
  );
}
