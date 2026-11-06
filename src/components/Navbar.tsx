'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag, Search, MapPin } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { triggerHaptic } from '@/lib/telegram';

interface NavbarProps {
  onSearchClick?: () => void;
  onBranchesClick?: () => void;
}

export function Navbar({ onSearchClick, onBranchesClick }: NavbarProps) {
  const { cartCount, setActiveTab } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-[#1A1F33]/95 backdrop-blur-md border-b border-[#FAE9D7]/15 transition-all shadow-sm">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Original Logo & Brand */}
        <div 
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('home');
          }}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-[#FAE9D7]/30 shadow-md bg-[#1A1F33]">
            <Image
              src="/images/logo.png"
              alt="RAFFINI"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-black tracking-[0.22em] text-[#FAE9D7] text-base leading-none">
              RAFFINI
            </span>
            <span className="text-[9px] text-[#A0AEC0] tracking-widest uppercase mt-0.5 font-medium">
              Toshkent • 11 Filial
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Branches button */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onBranchesClick?.();
            }}
            className="w-9 h-9 rounded-xl bg-[#232942] border border-[#FAE9D7]/20 flex items-center justify-center text-[#FAE9D7] hover:text-white transition"
            title="11 Filiallar"
          >
            <MapPin className="w-4 h-4" />
          </button>

          {/* Search button */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onSearchClick?.();
            }}
            className="w-9 h-9 rounded-xl bg-[#232942] border border-[#FAE9D7]/20 flex items-center justify-center text-[#FAE9D7] hover:text-white transition"
            title="Qidiruv"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Cart Icon with badge */}
          <button
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('cart');
            }}
            className="relative w-9 h-9 rounded-xl bg-[#232942] border border-[#FAE9D7]/20 flex items-center justify-center text-[#FAE9D7] hover:text-white transition"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FAE9D7] text-[#1A1F33] text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-md animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
