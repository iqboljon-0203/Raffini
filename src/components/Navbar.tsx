'use client';

import React from 'react';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { RaffiniLogoSvg } from './RaffiniLogoSvg';
import { triggerHaptic } from '@/lib/telegram';

interface NavbarProps {
  onSearchClick?: () => void;
  onBranchesClick?: () => void;
}

export function Navbar({ onSearchClick, onBranchesClick }: NavbarProps) {
  const { cartCount, setActiveTab } = useStore();

  return (
    <header className="sticky top-0 z-30 bg-[#FBF8F3]/90 backdrop-blur-md transition-all">
      <div className="max-w-md mx-auto px-5 h-14 flex items-center justify-between">
        {/* Left: Minimal Menu Icon (Matching Reference Screen 2) */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onBranchesClick?.();
          }}
          aria-label="Filiallar va menyu"
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#1A1F33] hover:bg-black/5 active:scale-90 transition"
        >
          {/* Elegant two-line hamburger icon as in reference */}
          <div className="w-5 flex flex-col gap-1.5 items-start">
            <span className="w-5 h-[2px] bg-[#1A1F33] rounded-full" />
            <span className="w-3.5 h-[2px] bg-[#1A1F33] rounded-full" />
          </div>
        </button>

        {/* Center: 1:1 Vector SVG Logo (Razor-sharp, pure vector) */}
        <div
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('home');
          }}
          className="cursor-pointer flex items-center justify-center"
        >
          <RaffiniLogoSvg
            color="#1A1F33"
            className="h-6 w-auto hover:opacity-90 transition"
          />
        </div>

        {/* Right: Minimal Search & Bag Icons */}
        <div className="flex items-center gap-1 -mr-2">
          <button
            onClick={() => {
              triggerHaptic('light');
              onSearchClick?.();
            }}
            aria-label="Qidiruv"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#1A1F33] hover:bg-black/5 active:scale-90 transition"
          >
            <Search className="w-5 h-5 stroke-[1.8]" />
          </button>

          <button
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('cart');
            }}
            aria-label="Savat"
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#1A1F33] hover:bg-black/5 active:scale-90 transition"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#1A1F33] ring-2 ring-[#FBF8F3]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
