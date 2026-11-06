'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { RAFFINI_PRODUCTS, CATEGORIES } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { formatUZS, cn } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';
import { StoriesModal, RAFFINI_STORIES } from './StoriesModal';
import { InteractiveLookbook } from './InteractiveLookbook';
import { LuxuryMarquee } from './LuxuryMarquee';
import { VipPromoBanner } from './VipPromoBanner';
import { LiveBoutiqueToast } from './LiveBoutiqueToast';

interface HomeViewProps {
  onSearchClick: () => void;
  onBranchesClick: () => void;
}

export function HomeView({ onSearchClick, onBranchesClick }: HomeViewProps) {
  const { setSelectedProduct, isWishlisted, toggleWishlist } = useStore();
  const [selectedCat, setSelectedCat] = useState('Barchasi');
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);

  const filteredProducts = RAFFINI_PRODUCTS.filter(
    (p) => selectedCat === 'Barchasi' || p.category === selectedCat
  );

  return (
    <div className="max-w-md mx-auto px-5 pb-40 pt-1 select-none text-[#1A1F33]">
      {/* 1. Interactive Story Highlights (Instagram / TMA Luxury Stories) */}
      <div className="pt-1 pb-4">
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar -mx-5 px-5">
          {RAFFINI_STORIES.map((story, idx) => (
            <button
              key={story.id}
              onClick={() => {
                triggerHaptic('light');
                setStoryIndex(idx);
                setIsStoriesOpen(true);
              }}
              className="flex flex-col items-center flex-shrink-0 group active:scale-95 transition-transform"
            >
              {/* Gradient Luxury Ring with Explicit 62px Size */}
              <div className="relative w-[62px] h-[62px] rounded-full p-[2.5px] bg-gradient-to-tr from-[#1A1F33] via-[#FAE9D7] to-[#1A1F33] shadow-sm flex-shrink-0">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-[#ECE8E1] border-2 border-white">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    sizes="64px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
              <span className="text-[10px] text-[#1A1F33]/80 font-medium mt-1.5 truncate max-w-[64px]">
                {story.title.split(' ')[0]} {story.title.split(' ')[1] || ''}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Minimalist Editorial Headline */}
      <div className="pt-1 pb-4">
        <h1 className="text-2xl sm:text-3xl font-serif text-[#1A1F33] leading-tight tracking-tight">
          Yangi uslubingizni <br />
          <span className="font-bold font-serif text-[#1A1F33]">
            kashf eting
          </span>
        </h1>
      </div>

      {/* 3. Category Selector Pills with Fluid Spring Animation */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
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
                "relative px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 select-none",
                isActive
                  ? "text-[#FAE9D7] font-semibold"
                  : "text-[#1A1F33]/70 border border-[#1A1F33]/15 hover:border-[#1A1F33]/40"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="homeCategoryPill"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  className="absolute inset-0 bg-[#1A1F33] rounded-full shadow-sm"
                />
              )}
              <span className="relative z-10">
                {cat === 'Barchasi' ? 'Erkaklar' : cat}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Kinetic Luxury Marquee Ribbon */}
      <LuxuryMarquee />

      {/* 5. Interactive Editorial Lookbook with Hotspots */}
      <InteractiveLookbook />

      {/* 6. VIP Promokod Voucher Card */}
      <VipPromoBanner />

      {/* 7. Section Title */}
      <div className="flex items-center justify-between mb-4 mt-6 px-1">
        <h3 className="text-sm font-serif font-bold text-[#1A1F33] tracking-tight">
          {selectedCat === 'Barchasi' ? 'Sara To‘plam' : selectedCat}
        </h3>
        <span className="text-xs text-[#1A1F33]/60 font-medium">
          {filteredProducts.length} ta libos
        </span>
      </div>

      {/* 8. Minimalist 2-Column Product Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {filteredProducts.map((product, idx) => {
          const liked = isWishlisted(product.id);
          const mainImage = product.images[0] || '/images/logo.png';
          const isTaller = idx % 3 === 1;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.3) }}
              onClick={() => {
                triggerHaptic('light');
                setSelectedProduct(product);
              }}
              className="cursor-pointer group flex flex-col bg-white rounded-[24px] p-2.5 pb-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-black/[0.04] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-all justify-between"
            >
              {/* Product Photo Container */}
              <div
                className={cn(
                  "relative w-full rounded-[18px] overflow-hidden bg-[#F5F2EB] mb-2.5",
                  isTaller ? "aspect-[3/4.1]" : "aspect-[3/3.8]"
                )}
              >
                <Image
                  src={mainImage}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  priority={idx < 4}
                />

                {/* Floating Heart Button with Spring Pop */}
                <motion.button
                  whileTap={{ scale: 1.4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic('medium');
                    toggleWishlist(product.id);
                  }}
                  aria-label="Sevimlilar"
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1A1F33] hover:text-rose-500 shadow-sm transition"
                >
                  <Heart
                    className={cn(
                      "w-3.5 h-3.5 transition-colors",
                      liked ? "fill-rose-500 text-rose-500" : "stroke-[1.8]"
                    )}
                  />
                </motion.button>

                {/* Discount Badge */}
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
            </motion.div>
          );
        })}
      </div>

      {/* 9. Fullscreen Interactive Stories Viewer */}
      <StoriesModal
        isOpen={isStoriesOpen}
        initialIndex={storyIndex}
        onClose={() => setIsStoriesOpen(false)}
        onSelectCategory={(cat) => setSelectedCat(cat)}
        onOpenBranches={onBranchesClick}
      />

      {/* 10. Floating Live Boutique Activity Toast */}
      <LiveBoutiqueToast />
    </div>
  );
}
