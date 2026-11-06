'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, Plus, Star } from 'lucide-react';
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
    toggleWishlist(product.id);
  };

  const mainImage = product.images[0] || '/images/logo.png';

  return (
    <div
      onClick={handleClick}
      className="group relative bg-[#12221b] border border-luxury-gold/15 rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-300 hover:border-luxury-gold/40 hover:shadow-luxury hover:-translate-y-0.5 active:scale-[0.98]"
    >
      {/* Image container */}
      <div className="relative w-full aspect-[4/5] bg-[#0d1814] overflow-hidden">
        <Image
          src={mainImage}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 300px"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />

        {/* Gradient shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12221b] via-transparent to-black/30 pointer-events-none" />

        {/* Discount Badge */}
        {product.discountPercent && product.discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-luxury-gold to-[#f3cf7a] text-[#091310] text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
            -{product.discountPercent}%
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={handleLike}
          className={cn(
            "absolute top-2.5 right-2.5 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200",
            liked
              ? "bg-rose-500/20 text-rose-500 border border-rose-500/30 scale-110"
              : "bg-black/40 text-white/70 hover:text-white border border-white/10"
          )}
        >
          <Heart className={cn("w-3.5 h-3.5", liked && "fill-rose-500")} />
        </button>

        {/* Filial / tag pill */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="text-[9px] text-white/90 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md truncate max-w-[85%] font-light">
            {product.category}
          </span>
        </div>
      </div>

      {/* Info container */}
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          {/* Title */}
          <h3 className="text-white text-xs sm:text-sm font-medium line-clamp-1 group-hover:text-luxury-gold transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-[11px] text-luxury-gold">
            <Star className="w-3 h-3 fill-luxury-gold" />
            <span className="font-semibold text-white/90">{product.rating}</span>
            <span className="text-[#7A8881] text-[10px]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-luxury-gold font-bold text-xs sm:text-sm tracking-tight">
              {formatUZS(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-[#6D7D76] text-[10px] line-through -mt-0.5">
                {formatUZS(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="w-7 h-7 rounded-xl bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 flex items-center justify-center transition-all group-hover:bg-luxury-gold group-hover:text-[#091310]">
            <Plus className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

