'use client';

import React from 'react';
import { Search, MapPin, Globe } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { RaffiniLogoSvg } from './RaffiniLogoSvg';
import { triggerHaptic } from '@/lib/telegram';

interface NavbarProps {
  onSearchClick?: () => void;
  onBranchesClick?: () => void;
}

export function Navbar({ onSearchClick, onBranchesClick }: NavbarProps) {
  const { setActiveTab, language, setLanguage, t } = useStore();

  const toggleLang = () => {
    triggerHaptic('light');
    setLanguage(language === 'uz' ? 'ru' : 'uz');
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FBF8F3]/95 backdrop-blur-md border-b border-black/5 transition-all select-none">
      <div className="max-w-md mx-auto px-4 h-15 flex items-center justify-between">
        {/* Left: 1:1 Vector SVG Brand Identity */}
        <div
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('home');
          }}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="flex flex-col">
            <RaffiniLogoSvg
              color="#1A1F33"
              className="h-5 w-auto hover:opacity-90 transition"
            />
            <span className="text-[9px] text-[#1A1F33]/55 font-semibold tracking-wider uppercase mt-0.5">
              {t('subtitle')}
            </span>
          </div>
        </div>

        {/* Right: Actions (Language toggle + Branches + Search) */}
        <div className="flex items-center gap-1.5">
          {/* Language Switcher [ UZ | RU ] (As pointed out in the video by Komoliddin) */}
          <button
            onClick={toggleLang}
            className="px-2.5 py-1 rounded-full bg-black/5 hover:bg-black/10 text-[10px] font-bold text-[#1A1F33] flex items-center gap-1 transition active:scale-95"
            title="Tilni o‘zgartirish / Сменить язык"
          >
            <Globe className="w-3 h-3 text-[#1A1F33]/60" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* 11 Branches quick button */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onBranchesClick?.();
            }}
            aria-label="11 Filial"
            className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#1A1F33] active:scale-90 transition"
          >
            <MapPin className="w-4 h-4" />
          </button>

          {/* Search button */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onSearchClick?.();
            }}
            aria-label="Qidiruv"
            className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#1A1F33] active:scale-90 transition"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
