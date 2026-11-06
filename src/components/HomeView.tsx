'use client';

import React, { useState } from 'react';
import { Search, Flame, ArrowRight } from 'lucide-react';
import { RAFFINI_PRODUCTS, CATEGORIES } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';
import { ProductCard } from './ProductCard';
import { FeaturedHeroCard } from './FeaturedHeroCard';
import { InteractiveLookbook } from './InteractiveLookbook';
import { DiscountsSlider } from './DiscountsSlider';
import { BranchesCard } from './BranchesCard';
import { StoriesModal, RAFFINI_STORIES } from './StoriesModal';
import { LiveBoutiqueToast } from './LiveBoutiqueToast';
import Image from 'next/image';

interface HomeViewProps {
  onSearchClick: () => void;
  onBranchesClick: () => void;
}

export function HomeView({ onSearchClick, onBranchesClick }: HomeViewProps) {
  const { setActiveTab, t } = useStore();
  const [selectedCat, setSelectedCat] = useState('Barchasi');
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);

  const filteredProducts = RAFFINI_PRODUCTS.filter(
    (p) => selectedCat === 'Barchasi' || p.category === selectedCat
  );

  return (
    <div className="max-w-md mx-auto px-5 pb-32 pt-2 select-none text-[#1A1F33]">
      {/* 1. Search Bar (As shown in video at 00:10) */}
      <div
        onClick={() => {
          triggerHaptic('light');
          onSearchClick();
        }}
        className="w-full h-11 px-4 rounded-full bg-white border border-black/10 flex items-center gap-2.5 text-xs text-[#1A1F33]/50 cursor-pointer shadow-sm hover:border-[#1A1F33]/30 transition"
      >
        <Search className="w-4 h-4 text-[#1A1F33]/50 flex-shrink-0" />
        <span className="truncate">{t('searchPlaceholder')}</span>
      </div>

      {/* 2. Interactive Stories Carousel */}
      <div className="pt-3 pb-2">
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
              <div className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#1A1F33] via-[#FAE9D7] to-[#1A1F33] group-hover:shadow-md transition-all">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-[#ECE8E1] border-2 border-white">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>
              <span className="text-[10px] text-[#1A1F33]/80 font-medium mt-1 truncate max-w-[58px]">
                {story.title.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Category Filter Pills (Exact Match to Video at 00:12) */}
      <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar -mx-5 px-5">
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
                "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200",
                isActive
                  ? "bg-[#1A1F33] text-[#FAE9D7] shadow-sm"
                  : "bg-white text-[#1A1F33]/70 border border-black/5 hover:border-black/20"
              )}
            >
              {cat === 'Barchasi' ? t('all') : cat}
            </button>
          );
        })}
      </div>

      {/* 4. Featured Hero Card (Exact Match to Video at 00:13) */}
      <FeaturedHeroCard />

      {/* 5. "Yangi Kelganlar" / Новинки (Video at 00:16) */}
      <div className="mt-6 mb-3">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
            <h3 className="text-sm font-serif font-bold text-[#1A1F33]">
              {selectedCat === 'Barchasi' ? t('newArrivals') : selectedCat}
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('catalog')}
            className="text-xs font-semibold text-[#1A1F33]/60 hover:text-[#1A1F33] flex items-center gap-0.5"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2-Column Product Grid with Quick "+ Savatga" Button (Video 00:18) */}
        <div className="grid grid-cols-2 gap-3.5">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* 6. "Tayyor Obrazlar" / Готовые образы (Lookbook Video at 00:25) */}
      <InteractiveLookbook />

      {/* 7. "Maxsus Chegirmalar" / Скидки (Video at 00:28) */}
      <DiscountsSlider />

      {/* 8. 11 Filial Toshkentda Card (Video at 00:29) */}
      <BranchesCard onOpenBranches={onBranchesClick} />

      {/* 9. Fullscreen Stories Modal */}
      <StoriesModal
        isOpen={isStoriesOpen}
        initialIndex={storyIndex}
        onClose={() => setIsStoriesOpen(false)}
        onSelectCategory={(cat) => setSelectedCat(cat)}
        onOpenBranches={onBranchesClick}
      />

      {/* 10. Live Boutique Social Proof Toast */}
      <LiveBoutiqueToast />
    </div>
  );
}
