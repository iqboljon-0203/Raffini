'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Star, 
  Plus, 
  Minus, 
  ChevronsRight, 
  Check, 
  ChevronDown, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';
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
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || 'Qora (Black)');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);

  if (!product) return null;

  const liked = isWishlisted(product.id);
  const images = product.images.length > 0 ? product.images : ['/images/logo.png'];

  const nextImage = () => {
    triggerHaptic('selection');
    setSelectedImageIdx((idx) => (idx + 1) % images.length);
  };

  const prevImage = () => {
    triggerHaptic('selection');
    setSelectedImageIdx((idx) => (idx - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0C0F17] overflow-y-auto animate-in fade-in duration-300">
      {/* Top Bar (Reference screen 3: < Product Details Heart) */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-[#0C0F17]/90 backdrop-blur-md border-b border-white/5">
        <button
          onClick={() => {
            triggerHaptic('light');
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-[#1A1F33] border border-white/10 flex items-center justify-center text-white/80 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="font-serif font-black tracking-widest text-xs uppercase text-[#FAE9D7]">
          Product Details
        </span>

        <button
          onClick={() => toggleWishlist(product.id)}
          className={cn(
            "w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all",
            liked
              ? "bg-rose-500 text-white shadow-md scale-105"
              : "bg-[#1A1F33] text-white/80 border border-white/10"
          )}
        >
          <Heart className={cn("w-4 h-4", liked && "fill-white")} />
        </button>
      </div>

      {/* Main Content Scrollable */}
      <div className="max-w-md mx-auto w-full px-4 pb-36 pt-2 space-y-4">
        {/* Giant Rounded Photo Card with Controls & Corner Price Pill */}
        <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden bg-[#161B2C] border border-[#FAE9D7]/20 shadow-luxury group">
          <Image
            src={images[selectedImageIdx] || images[0]}
            alt={product.title}
            fill
            sizes="100vw"
            className="object-cover object-top transition-all duration-300"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          {/* Left / Right Carousel Controls (Reference screen 3) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/70 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/70 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Corner Floating Price Pill (Reference screen 3) */}
          <div className="absolute bottom-4 right-4 bg-[#1A1F33]/95 backdrop-blur-md border border-[#FAE9D7]/40 text-[#FAE9D7] text-xs font-black px-3.5 py-1.5 rounded-full shadow-floating-pill">
            {formatUZS(product.price)}
          </div>

          {/* Carousel Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "rounded-full transition-all",
                    selectedImageIdx === idx
                      ? "w-4 h-1.5 bg-[#FAE9D7]"
                      : "w-1.5 h-1.5 bg-white/40"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Title & Star Reviews (Reference screen 3) */}
        <div>
          <h1 className="text-xl font-bold font-serif text-white tracking-tight">
            {product.title}
          </h1>

          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#FAE9D7]">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#FAE9D7] text-[#FAE9D7]" />
              ))}
            </div>
            <span className="text-[#A0AEC0] text-[11px] font-medium ml-1">
              ({product.rating}/5 based on {product.reviewsCount} reviews)
            </span>
          </div>
        </div>

        {/* Size Selector Pills (Reference screen 3: XS S M L XL XXL) */}
        <div>
          <label className="text-xs font-semibold text-white/90 uppercase tracking-wider block mb-2">
            Size:
          </label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => {
                  triggerHaptic('selection');
                  setSelectedSize(size);
                }}
                className={cn(
                  "min-w-[44px] h-11 px-3.5 rounded-2xl text-xs font-black transition-all border flex items-center justify-center",
                  selectedSize === size
                    ? "bg-[#FAE9D7] text-[#1A1F33] border-[#FAE9D7] shadow-gold-glow scale-105"
                    : "bg-[#1A1F33] text-white/80 border-white/10 hover:border-[#FAE9D7]/40"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Swatches */}
        <div>
          <label className="text-xs font-semibold text-white/90 uppercase tracking-wider block mb-2">
            Color: <span className="text-[#FAE9D7] font-semibold">{selectedColor}</span>
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
                  "px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border",
                  selectedColor === color
                    ? "bg-white/20 text-[#FAE9D7] border-[#FAE9D7]"
                    : "bg-[#1A1F33] text-white/70 border-white/10"
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* View Product Details Accordion (Reference screen 3) */}
        <div className="pt-2 border-t border-white/5">
          <button
            onClick={() => {
              triggerHaptic('light');
              setShowFullDetails(!showFullDetails);
            }}
            className="w-full flex items-center justify-between text-xs font-bold text-white/90 py-2 hover:text-[#FAE9D7] transition"
          >
            <span>View Product Details</span>
            <ChevronDown
              className={cn("w-4 h-4 transition-transform", showFullDetails && "rotate-180")}
            />
          </button>

          {showFullDetails && (
            <div className="p-3.5 rounded-2xl bg-[#1A1F33] border border-white/5 text-xs text-[#A0AEC0] leading-relaxed whitespace-pre-line animate-in fade-in">
              {product.description}
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-emerald-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>{product.branch}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Futuristic Interactive Bottom Bar (Reference screen 3) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0C0F17]/95 backdrop-blur-xl border-t border-[#FAE9D7]/20 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {/* Left: Counter Pill `[-] 2 [+]` (Reference screen 3) */}
          <div className="flex items-center bg-[#1A1F33] border border-[#FAE9D7]/30 rounded-full px-2.5 h-14">
            <button
              onClick={() => {
                triggerHaptic('selection');
                setQuantity((q) => Math.max(1, q - 1));
              }}
              className="w-8 h-8 flex items-center justify-center text-[#FAE9D7] hover:text-white"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-white text-sm">{quantity}</span>
            <button
              onClick={() => {
                triggerHaptic('selection');
                setQuantity((q) => q + 1);
              }}
              className="w-8 h-8 flex items-center justify-center text-[#FAE9D7] hover:text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Pill "Add to Cart >>>>" button (Reference screen 3) */}
          <button
            onClick={handleAddToCart}
            className={cn(
              "flex-1 h-14 rounded-full p-1.5 flex items-center justify-between transition-all duration-300 shadow-luxury active:scale-[0.98] group",
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-[#1A1F33] border border-[#FAE9D7]/40 hover:border-[#FAE9D7]"
            )}
          >
            <div className={cn(
              "h-full px-6 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center shadow-md",
              isAdded
                ? "bg-white text-emerald-700"
                : "bg-[#FAE9D7] text-[#1A1F33]"
            )}>
              {isAdded ? 'Added!' : 'Add to Cart'}
            </div>

            <div className="pr-4 flex items-center gap-1 text-[#FAE9D7] group-hover:translate-x-1 transition-transform">
              <span className="text-[11px] font-mono font-bold mr-1">
                {formatUZS(product.price * quantity)}
              </span>
              <ChevronsRight className="w-5 h-5 animate-chevrons" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
