'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { triggerHaptic } from '@/lib/telegram';

export interface StoryItem {
  id: string;
  title: string;
  subtitle: string;
  categoryTag?: string;
  image: string;
  description: string;
  actionText: string;
  isBranchAction?: boolean;
}

export const RAFFINI_STORIES: StoryItem[] = [
  {
    id: 'story-1',
    title: '2026 Yangi Mavsum Kolleksiyasi',
    subtitle: 'Eksklyuziv Erkaklar Kurtkalari',
    categoryTag: 'Kurtkalar & Vitirovka',
    image: '/images/products/prod_1.jpg',
    description: 'Kuz va qishning eng sovuq kunlarida ham olijanob qulaylik va beqiyos uslub.',
    actionText: 'Kurtkalarni Ko‘rish',
  },
  {
    id: 'story-2',
    title: 'Tabiiy Teri Poyabzallar',
    subtitle: 'Italiya Dizayni Va 100% Sifat',
    categoryTag: 'Oyoq kiyimlar',
    image: '/images/products/prod_27.jpg',
    description: 'Har bir qadamingizda mustahkamlik va nafislik. 39 dan 44 gacha barcha o‘lchamlar.',
    actionText: 'Poyabzallarni Ko‘rish',
  },
  {
    id: 'story-3',
    title: 'Klassik Kostyum-Shimlar',
    subtitle: 'Erkaklar Eleganti',
    categoryTag: 'Kostyumlar',
    image: '/images/products/prod_76.jpg',
    description: 'Biznes uchrashuvlar, to‘y va maxsus tantanalar uchun eng sara premium kostyumlar.',
    actionText: 'Kostyumlarni Ko‘rish',
  },
  {
    id: 'story-4',
    title: 'Toshkent Bo‘ylab 11 Filial',
    subtitle: 'Sizga Eng Yaqin Manzilda',
    image: '/images/splash_hero.jpg',
    description: 'Novza, Golden Life, Chilonzor, Yunusobod, Sergeli va barcha markaziy filiallar har kuni 09:00 dan 23:00 gacha xizmatingizda!',
    actionText: 'Filiallarni Ko‘rish',
    isBranchAction: true,
  },
  {
    id: 'story-5',
    title: 'VIP 10% Chegirma Promokodi',
    subtitle: 'Promokod: RAFFINI',
    categoryTag: 'To‘plamlar',
    image: '/images/products/prod_19.jpg',
    description: 'Savatda RAFFINI promokodini kiriting va butun buyurtmangizga darhol 10% chegirmaga ega bo‘ling!',
    actionText: 'To‘plamlarni Ko‘rish',
  },
  {
    id: 'story-6',
    title: 'Yumshoq Trikotaj Kardiganlar',
    subtitle: 'Kuz-Qish Qulayligi',
    categoryTag: 'Sviter & Trikotaj',
    image: '/images/products/prod_64.jpg',
    description: 'Nafis to‘qima, qulay bichim va zamonaviy uslub. Kundalik va tantanali uchrashuvlar uchun.',
    actionText: 'Trikotajlarni Ko‘rish',
  },
];

interface StoriesModalProps {
  isOpen: boolean;
  initialIndex?: number;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
  onOpenBranches: () => void;
}

export function StoriesModal({
  isOpen,
  initialIndex = 0,
  onClose,
  onSelectCategory,
  onOpenBranches,
}: StoriesModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setProgress(0);
    }
  }, [isOpen, initialIndex]);

  // Story progress timer (5 seconds per slide)
  useEffect(() => {
    if (!isOpen) return;

    setProgress(0);
    const interval = 50; // update every 50ms
    const totalDuration = 5000;
    const step = (interval / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < RAFFINI_STORIES.length - 1) {
            setCurrentIndex((c) => c + 1);
            return 0;
          } else {
            clearInterval(timer);
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, currentIndex, onClose]);

  if (!isOpen) return null;

  const currentStory = RAFFINI_STORIES[currentIndex];

  const handleNext = () => {
    triggerHaptic('selection');
    if (currentIndex < RAFFINI_STORIES.length - 1) {
      setCurrentIndex((c) => c + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    triggerHaptic('selection');
    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
      setProgress(0);
    }
  };

  const handleAction = () => {
    triggerHaptic('medium');
    onClose();
    if (currentStory.isBranchAction) {
      onOpenBranches();
    } else if (currentStory.categoryTag) {
      onSelectCategory(currentStory.categoryTag);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl"
      >
        <div className="relative w-full max-w-md h-full sm:h-[92vh] sm:rounded-[36px] overflow-hidden bg-[#0B0E17] border border-[#FAE9D7]/20 flex flex-col justify-between shadow-2xl">
          {/* Background Image with Ambient Vignette */}
          <div className="absolute inset-0 z-0">
            <Image
              src={currentStory.image}
              alt={currentStory.title}
              fill
              className="object-cover object-top filter brightness-[0.85] contrast-[1.05]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E17] via-[#0B0E17]/40 to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0B0E17]" />
          </div>

          {/* Top Progress Bars (Telegram/Instagram format) */}
          <div className="relative z-20 pt-3 px-3">
            <div className="flex gap-1.5 w-full">
              {RAFFINI_STORIES.map((story, idx) => (
                <div
                  key={story.id}
                  className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden"
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#FAE9D7] to-white transition-all duration-75"
                    style={{
                      width:
                        idx === currentIndex
                          ? `${progress}%`
                          : idx < currentIndex
                          ? '100%'
                          : '0%',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header info & Close */}
            <div className="flex items-center justify-between mt-3 px-1">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#FAE9D7]/40 bg-[#1A1F33]">
                  <Image src="/images/logo.png" alt="Raffini" fill className="object-cover" />
                </div>
                <div>
                  <span className="font-serif font-black tracking-widest text-xs text-[#FAE9D7] block leading-none">
                    RAFFINI
                  </span>
                  <span className="text-[10px] text-white/70 block mt-0.5">
                    Toshkent • 11 Filial
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  onClose();
                }}
                className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Invisible Left & Right Tap Zones */}
          <div className="absolute inset-y-20 left-0 w-1/3 z-10 cursor-pointer" onClick={handlePrev} />
          <div className="absolute inset-y-20 right-0 w-1/3 z-10 cursor-pointer" onClick={handleNext} />

          {/* Bottom Editorial Content */}
          <div className="relative z-20 p-6 pb-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1F33]/90 border border-[#FAE9D7]/30 backdrop-blur-md text-[#FAE9D7] text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 fill-[#FAE9D7]" />
              {currentStory.subtitle}
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight">
              {currentStory.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
              {currentStory.description}
            </p>

            {/* Action CTA Button */}
            <button
              onClick={handleAction}
              className="w-full h-13 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FAE9D7] via-[#F3D7B7] to-[#D8B485] text-[#1A1F33] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-105 active:scale-[0.98] transition"
            >
              <span>{currentStory.actionText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

