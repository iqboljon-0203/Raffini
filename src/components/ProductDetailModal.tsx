'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Heart, Star, ShoppingBag, MapPin, Check, Plus, Minus, Share2 } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { formatUZS, cn } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addToCart, isWishlisted, toggleWishlist, setActiveTab } = useStore();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || 'Qora (Black)');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const liked = isWishlisted(product.id);
  const images = product.images.length > 0 ? product.images : ['/images/logo.png'];

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleDirectBuy = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
    setActiveTab('cart');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#07100D] overflow-y-auto animate-in fade-in duration-200">
      {/* Top action bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-[#07100D]/80 backdrop-blur-md border-b border-white/5">
        <button
          onClick={() => {
            triggerHaptic('light');
            onClose();
          }}
          className="w-9 h-9 rounded-full bg-luxury-card border border-white/10 flex items-center justify-center text-white/80 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="font-serif font-bold tracking-widest text-xs uppercase text-luxury-gold">
          RAFFINI EXCLUSIVE
        </span>

        <button
          onClick={() => toggleWishlist(product.id)}
          className={cn(
            "w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all",
            liked
              ? "bg-rose-500/20 text-rose-500 border border-rose-500/30"
              : "bg-luxury-card text-white/80 border border-white/10"
          )}
        >
          <Heart className={cn("w-4 h-4", liked && "fill-rose-500")} />
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto w-full pb-32">
        {/* Large Image Showcase */}
        <div className="relative w-full aspect-[4/5] bg-[#0c1914] overflow-hidden">
          <Image
            src={images[selectedImageIdx] || images[0]}
            alt={product.title}
            fill
            sizes="100vw"
            className="object-cover object-top transition-all duration-300"
            priority
          />

          {/* Discount badge */}
          {product.discountPercent && product.discountPercent > 0 && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-luxury-gold to-[#f3cf7a] text-[#091310] text-xs font-black px-3 py-1 rounded-full shadow-lg">
              -{product.discountPercent}% CHEGIRMA
            </div>
          )}

          {/* New Season Badge */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-luxury-gold text-[10px] font-bold px-2.5 py-1 rounded-full border border-luxury-gold/30">
            KUZ / QISH 2026
          </div>
        </div>

        {/* Image Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2.5 px-4 mt-3 overflow-x-auto pb-1 no-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  triggerHaptic('selection');
                  setSelectedImageIdx(idx);
                }}
                className={cn(
                  "relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0",
                  selectedImageIdx === idx
                    ? "border-luxury-gold scale-105 shadow-gold-glow"
                    : "border-white/10 opacity-60 hover:opacity-100"
                )}
              >
                <Image src={img} alt="thumb" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Product Details info */}
        <div className="px-4 mt-4">
          {/* Category & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-luxury-gold font-semibold">
              {product.category}
            </span>
            <div className="flex items-center gap-1.5 bg-luxury-card px-2.5 py-1 rounded-full border border-luxury-gold/20">
              <Star className="w-3.5 h-3.5 fill-luxury-gold text-luxury-gold" />
              <span className="text-xs font-bold text-white">{product.rating}</span>
              <span className="text-[10px] text-[#7A8881]">({product.reviewsCount} sharh)</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl font-bold text-white mt-1.5 font-serif tracking-tight">
            {product.title}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-2xl font-black text-luxury-gold font-serif">
              {formatUZS(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-[#72857D] line-through">
                {formatUZS(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Size Selector */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                O‘lchamni tanlang:
              </label>
              <span className="text-[11px] text-luxury-gold font-medium">Barchasi mavjud</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    triggerHaptic('selection');
                    setSelectedSize(size);
                  }}
                  className={cn(
                    "min-w-[46px] h-11 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center",
                    selectedSize === size
                      ? "bg-luxury-gold text-[#091310] border-luxury-gold shadow-gold-glow scale-105"
                      : "bg-luxury-card text-white/80 border-white/10 hover:border-luxury-gold/40"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="mt-4">
            <label className="text-xs font-semibold text-white/90 uppercase tracking-wider block mb-2">
              Rang: <span className="text-luxury-gold font-normal">{selectedColor}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    triggerHaptic('selection');
                    setSelectedColor(color);
                  }}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all border",
                    selectedColor === color
                      ? "bg-white/15 text-white border-luxury-gold"
                      : "bg-luxury-card text-white/70 border-white/10"
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Branch Availability Banner */}
          <div className="mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-luxury-card to-[#10241c] border border-luxury-gold/25 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-luxury-gold/20 flex items-center justify-center text-luxury-gold flex-shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-white block">Toshkent bo‘yicha 11 ta filialda mavjud</span>
              <span className="text-[#8E9F97] text-[11px] mt-0.5 block">
                {product.branch} • Ish vaqti: 09:00 - 23:00
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
              Mahsulot tavsifi
            </h4>
            <div className="p-3.5 rounded-xl bg-luxury-card/50 border border-white/5 text-xs text-[#A1B3AB] leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#091310]/95 backdrop-blur-xl border-t border-luxury-gold/20 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center bg-luxury-card border border-luxury-gold/30 rounded-xl px-2 h-12">
            <button
              onClick={() => {
                triggerHaptic('selection');
                setQuantity((q) => Math.max(1, q - 1));
              }}
              className="w-8 h-8 flex items-center justify-center text-luxury-gold hover:text-white"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-7 text-center font-bold text-white text-sm">{quantity}</span>
            <button
              onClick={() => {
                triggerHaptic('selection');
                setQuantity((q) => q + 1);
              }}
              className="w-8 h-8 flex items-center justify-center text-luxury-gold hover:text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className={cn(
              "flex-1 h-12 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-lg active:scale-[0.98]",
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-gradient-to-r from-luxury-gold to-[#f0ce78] text-[#091310] hover:brightness-105"
            )}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                Savatga qo‘shildi!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Savatga qo‘shish ({formatUZS(product.price * quantity)})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
