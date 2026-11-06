'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, Plus, Check } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { formatUZS, cn } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';

interface ProductCardProps {
  product: Product;
  onSelect?: () => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const { isWishlisted, toggleWishlist, setSelectedProduct, addToCart, t } = useStore();
  const liked = isWishlisted(product.id);
  const [isAdded, setIsAdded] = useState(false);

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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('success');
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0] || 'Klassik Qora';
    addToCart(product, defaultSize, defaultColor, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const mainImage = product.images[0] || '/images/logo.png';

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer group flex flex-col bg-white rounded-[24px] p-2.5 border border-black/5 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all select-none"
    >
      {/* Product Photo Container */}
      <div className="relative w-full aspect-[3/3.8] rounded-[18px] overflow-hidden bg-[#ECE8E1]">
        <Image
          src={mainImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 300px"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {product.discountPercent && product.discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-[#1A1F33] text-[#FAE9D7] text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            -{product.discountPercent}%
          </div>
        )}

        {/* Heart Wishlist Button */}
        <button
          onClick={handleLike}
          aria-label="Sevimlilar"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#1A1F33]/70 hover:text-rose-500 active:scale-90 transition shadow-sm"
        >
          <Heart
            className={cn(
              "w-3.5 h-3.5 transition-colors",
              liked ? "fill-rose-500 text-rose-500" : "stroke-[2]"
            )}
          />
        </button>
      </div>

      {/* Card Info */}
      <div className="mt-2.5 px-1 flex flex-col justify-between flex-1">
        <div>
          <h4 className="text-xs font-semibold text-[#1A1F33] line-clamp-1 group-hover:text-blue-900 transition-colors">
            {product.title}
          </h4>
          <span className="text-[10px] text-[#1A1F33]/50 block mt-0.5">
            {product.category}
          </span>
        </div>

        {/* Price & Quick Add Button (Exact Match to Video at 00:18) */}
        <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-black/5">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#1A1F33]">
              {formatUZS(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-[9px] text-[#1A1F33]/40 line-through">
                {formatUZS(product.oldPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className={cn(
              "px-2.5 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 active:scale-90 transition shadow-sm",
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-[#1A1F33] text-[#FAE9D7] hover:bg-[#2A3352]"
            )}
          >
            {isAdded ? (
              <>
                <Check className="w-3 h-3" />
                <span>{t('added')}</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3 stroke-[2.5]" />
                <span>{t('buy')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
