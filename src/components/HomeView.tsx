'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, SlidersHorizontal, Bell, Heart, Star, Sparkles, MapPin, ChevronRight, ArrowUpRight } from 'lucide-react';
import { RAFFINI_PRODUCTS, CATEGORIES } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { formatUZS, cn } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';

interface HomeViewProps {
  onSearchClick: () => void;
  onBranchesClick: () => void;
}

export function HomeView({ onSearchClick, onBranchesClick }: HomeViewProps) {
  const { telegramUser, setActiveTab, setSelectedProduct, isWishlisted, toggleWishlist } = useStore();
  const [selectedCat, setSelectedCat] = useState('Barchasi');

  const userName = telegramUser ? telegramUser.first_name : 'Fashion Lover';

  // Story highlights (Instagram / TMA style interactive circles with gradient rings)
  const stories = [
    { id: 'new', title: 'New Look', img: '/images/products/prod_1.jpg', tag: 'Kurtkalar & Vitirovka' },
    { id: 'shoes', title: 'Poyabzal', img: '/images/products/prod_10.jpg', tag: 'Oyoq kiyimlar' },
    { id: 'suits', title: 'Kostyum', img: '/images/products/prod_20.jpg', tag: 'Kostyumlar' },
    { id: 'branches', title: '11 Filial', img: '/images/logo.png', isBranch: true },
    { id: 'sweaters', title: 'Sviter', img: '/images/products/prod_15.jpg', tag: 'Sviter & Kardigan' },
  ];

  const filteredProducts = RAFFINI_PRODUCTS.filter(
    (p) => selectedCat === 'Barchasi' || p.category === selectedCat
  );

  return (
    <div className="max-w-md mx-auto px-4 pb-32 pt-2 space-y-5">
      {/* 1. Header Greeting & Notification Bell (as in screen 2) */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#FAE9D7]/30 bg-[#1A1F33]">
            {telegramUser?.photo_url ? (
              <Image src={telegramUser.photo_url} alt={userName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#FAE9D7] font-serif font-black text-sm">
                {userName.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <span className="text-[11px] text-[#8E9BAE] block leading-none">
              Hello! 👋
            </span>
            <span className="text-sm font-bold text-white font-serif mt-0.5 block">
              {userName}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            triggerHaptic('light');
            onBranchesClick();
          }}
          className="relative w-10 h-10 rounded-full bg-[#1A1F33] border border-[#FAE9D7]/20 flex items-center justify-center text-[#FAE9D7] hover:border-[#FAE9D7] transition shadow-sm"
          title="11 Filial Toshkent"
        >
          <MapPin className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#FAE9D7] animate-ping" />
        </button>
      </div>

      {/* 2. Editorial Headline (Exact match from reference screen 2) */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight">
          Tailored Trends, <br />
          <span className="italic text-[#FAE9D7]">Handpicked for you.</span>
        </h1>
      </div>

      {/* 3. Interactive Story Highlights with animated gradient rings */}
      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar pt-1">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => {
              triggerHaptic('selection');
              if (story.isBranch) {
                onBranchesClick();
              } else if (story.tag) {
                setSelectedCat(story.tag);
              }
            }}
            className="flex flex-col items-center flex-shrink-0 group active:scale-95 transition-transform"
          >
            <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#FAE9D7] via-[#E5C49F] to-[#1A1F33] group-hover:shadow-gold-glow transition-all">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-[#1A1F33] border-2 border-[#0C0F17]">
                <Image src={story.img} alt={story.title} fill className="object-cover" />
              </div>
            </div>
            <span className="text-[10px] text-[#A0AEC0] group-hover:text-[#FAE9D7] font-medium mt-1.5 truncate max-w-[64px]">
              {story.title}
            </span>
          </button>
        ))}
      </div>

      {/* 4. Minimalist Pill Search Bar with Filter Button (Reference screen 2) */}
      <div className="flex items-center gap-2.5">
        <div
          onClick={() => {
            triggerHaptic('light');
            onSearchClick();
          }}
          className="flex-1 h-12 rounded-full bg-[#1A1F33] border border-[#FAE9D7]/20 px-4 flex items-center gap-2.5 text-[#8E9BAE] text-xs cursor-pointer hover:border-[#FAE9D7]/40 transition shadow-sm"
        >
          <Search className="w-4 h-4 text-[#FAE9D7] flex-shrink-0" />
          <span className="flex-1 font-light">Search luxury fashion...</span>
        </div>

        <button
          onClick={() => {
            triggerHaptic('light');
            onSearchClick();
          }}
          className="w-12 h-12 rounded-full bg-[#FAE9D7] text-[#1A1F33] flex items-center justify-center hover:brightness-110 active:scale-95 transition shadow-gold-glow flex-shrink-0"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* 5. Category Slider (All, Jackets, Suits, Shoes, etc.) */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
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
                "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border",
                isActive
                  ? "bg-[#FAE9D7] text-[#1A1F33] border-[#FAE9D7] shadow-gold-glow font-bold scale-105"
                  : "bg-[#1A1F33] text-[#8E9BAE] border-white/5 hover:text-white"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 6. High-Fashion Editorial Product Grid (Reference screen 2) */}
      <div className="grid grid-cols-2 gap-3.5 pt-1">
        {filteredProducts.map((product) => {
          const liked = isWishlisted(product.id);
          const mainImage = product.images[0] || '/images/logo.png';

          return (
            <div
              key={product.id}
              onClick={() => {
                triggerHaptic('light');
                setSelectedProduct(product);
              }}
              className="group relative flex flex-col justify-between cursor-pointer transition-transform active:scale-[0.98]"
            >
              {/* Image card with rounded corners & floating corner price pill */}
              <div className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden bg-[#161B2C] border border-[#FAE9D7]/15 group-hover:border-[#FAE9D7]/40 transition-all duration-300 shadow-luxury">
                <Image
                  src={mainImage}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className={cn(
                    "absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all",
                    liked
                      ? "bg-rose-500 text-white shadow-md scale-110"
                      : "bg-black/50 text-white/80 hover:text-white border border-white/10"
                  )}
                >
                  <Heart className={cn("w-3.5 h-3.5", liked && "fill-white")} />
                </button>

                {/* Corner Floating Price Pill (Exact match to reference screen 2) */}
                <div className="absolute bottom-3 right-3 bg-[#1A1F33]/90 backdrop-blur-md border border-[#FAE9D7]/30 text-[#FAE9D7] text-[11px] font-black px-2.5 py-1 rounded-full shadow-floating-pill">
                  {formatUZS(product.price)}
                </div>
              </div>

              {/* Product Info below card */}
              <div className="mt-2.5 px-1">
                <h3 className="text-white text-xs font-semibold line-clamp-1 group-hover:text-[#FAE9D7] transition-colors">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between mt-1 text-[11px] text-[#8E9BAE]">
                  <span className="text-[10px] uppercase tracking-wider text-[#A0AEC0] truncate max-w-[95px]">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-[#FAE9D7]">
                    <Star className="w-3 h-3 fill-[#FAE9D7]" />
                    <span className="font-bold text-white text-[11px]">{product.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
