'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Heart, Check } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { formatUZS, cn } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addToCart, isWishlisted, toggleWishlist } = useStore();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || 'Klassik Qora');
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const liked = isWishlisted(product.id);
  const images = product.images.length > 0 ? product.images : ['/images/logo.png'];

  const handleAddToCart = () => {
    triggerHaptic('medium');
    addToCart(product, selectedSize, selectedColor, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  // Color mapping helper for visual swatches
  const getColorHex = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('ko‘k') || n.includes('kok') || n.includes('navy')) return '#1A1F33';
    if (n.includes('jigarrang') || n.includes('qahva') || n.includes('shokolad')) return '#4A3525';
    if (n.includes('yashil') || n.includes('zaytun')) return '#3A4A3B';
    if (n.includes('krem') || n.includes('bej') || n.includes('qum')) return '#FAE9D7';
    if (n.includes('kulrang') || n.includes('zamsh')) return '#7B828E';
    if (n.includes('oq')) return '#F4F4F4';
    return '#111319'; // default black
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm select-none"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-md h-full sm:h-[94vh] sm:rounded-[36px] overflow-hidden bg-[#FAF7F2] flex flex-col justify-between shadow-2xl"
        >
          {/* Top Bar: Minimal Back & Wishlist (Matching Reference Screen 3) */}
          <div className="absolute top-0 left-0 right-0 z-20 px-5 pt-4 flex items-center justify-between">
            <button
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              aria-label="Orqaga"
              className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md text-[#1A1F33] flex items-center justify-center shadow-sm active:scale-90 transition"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                toggleWishlist(product.id);
              }}
              aria-label="Sevimlilar"
              className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md text-[#1A1F33] flex items-center justify-center shadow-sm active:scale-90 transition"
            >
              <Heart
                className={cn(
                  "w-5 h-5 stroke-[2]",
                  liked ? "fill-rose-500 text-rose-500" : "text-[#1A1F33]"
                )}
              />
            </button>
          </div>

          {/* Model Photo Container with Vertical Indicator Dots on Right */}
          <div className="relative w-full h-[58%] bg-[#ECE7DF] flex-shrink-0">
            <Image
              src={images[selectedImageIdx] || images[0]}
              alt={product.title}
              fill
              priority
              className="object-cover object-top"
            />

            {/* Vertical Indicator Dots (Exact Reference Screen 3 Match) */}
            {images.length > 1 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10 bg-black/20 backdrop-blur-md py-2 px-1.5 rounded-full">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      triggerHaptic('selection');
                      setSelectedImageIdx(idx);
                    }}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      selectedImageIdx === idx
                        ? "bg-[#1A1F33] scale-125"
                        : "bg-white/70 hover:bg-white"
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Organic Wavy Bottom Sheet (Exact Reference Screen 3 Match) */}
          <div className="relative -mt-10 z-10 flex-1 bg-white rounded-t-[32px] sm:rounded-t-[36px] px-6 pt-5 pb-8 flex flex-col justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.06)] overflow-y-auto no-scrollbar">
            {/* Top Wave Decorator (Organic smooth curve as in reference) */}
            <div className="space-y-4">
              {/* Title & Price Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#1A1F33]/50 block">
                    RAFFINI
                  </span>
                  <h2 className="text-xl font-serif font-bold text-[#1A1F33] leading-tight mt-0.5">
                    {product.title}
                  </h2>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-lg font-bold text-[#1A1F33] block">
                    {formatUZS(product.price)}
                  </span>
                </div>
              </div>

              {/* Minimal Short Description (1-2 sentences ONLY, no wall of text!) */}
              <p className="text-xs text-[#1A1F33]/70 leading-relaxed font-light">
                {product.description.split('\n')[0] || 'Italiya uslubidagi qulay va issiq mato. Kuz va qish mavsumi uchun maxsus tanlangan.'}
              </p>

              {/* Sizes & Colors in Clean Horizontal Layout (Reference Screen 3) */}
              <div className="pt-1 space-y-3.5">
                {/* Sizes Row */}
                <div>
                  <span className="text-xs font-semibold text-[#1A1F33] block mb-2">
                    O‘lcham
                  </span>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            triggerHaptic('selection');
                            setSelectedSize(size);
                          }}
                          className={cn(
                            "w-9 h-9 rounded-full text-xs font-medium flex items-center justify-center transition-all",
                            isSelected
                              ? "bg-[#1A1F33] text-[#FAE9D7] font-bold shadow-sm"
                              : "bg-[#F4EFEA] text-[#1A1F33]/80 hover:bg-[#EFE9E2]"
                          )}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Colors Row */}
                <div>
                  <span className="text-xs font-semibold text-[#1A1F33] block mb-2">
                    Rang
                  </span>
                  <div className="flex gap-2.5 items-center">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor === color;
                      const hex = getColorHex(color);
                      return (
                        <button
                          key={color}
                          onClick={() => {
                            triggerHaptic('selection');
                            setSelectedColor(color);
                          }}
                          aria-label={color}
                          style={{ backgroundColor: hex }}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all relative border border-black/10 shadow-sm",
                            isSelected && "ring-2 ring-offset-2 ring-[#1A1F33]"
                          )}
                        >
                          {isSelected && (
                            <Check
                              className={cn(
                                "w-3.5 h-3.5",
                                hex === '#FAE9D7' || hex === '#F4F4F4'
                                  ? "text-[#1A1F33]"
                                  : "text-white"
                              )}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Add to Bag Button (Matching Reference Screen 3 "+ Add to Bag") */}
            <div className="pt-5">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={isAdded}
                className={cn(
                  "w-full h-13 py-3.5 rounded-full font-medium text-xs uppercase tracking-widest flex items-center justify-center transition-all shadow-md",
                  isAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-[#1A1F33] text-[#FAE9D7] hover:bg-[#252B44]"
                )}
              >
                {isAdded ? '✓ Savatga qo‘shildi' : '+ Savatga qo‘shish'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
