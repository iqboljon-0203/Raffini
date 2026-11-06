'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag, Heart, Search, MapPin } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { triggerHaptic } from '@/lib/telegram';

interface NavbarProps {
  onSearchClick?: () => void;
  onBranchesClick?: () => void;
}

export function Navbar({ onSearchClick, onBranchesClick }: NavbarProps) {
  const { cartCount, wishlist, setActiveTab, activeTab } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-[#091310]/90 backdrop-blur-md border-b border-luxury-gold/15 transition-all">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <div 
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('home');
          }}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-luxury-dark border border-luxury-gold/30 flex items-center justify-center overflow-hidden shadow-sm">
            <span className="font-serif font-bold text-luxury-gold text-lg tracking-wider">R</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold tracking-[0.25em] text-white text-base leading-none">
              RAFFINI
            </span>
            <span className="text-[9px] text-luxury-gold tracking-widest uppercase mt-0.5 font-light">
              Tashkent • 11 Filial
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
            className="w-9 h-9 rounded-full bg-luxury-card border border-luxury-gold/20 flex items-center justify-center text-luxury-gold hover:text-white transition"
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
            className="w-9 h-9 rounded-full bg-luxury-card border border-luxury-gold/20 flex items-center justify-center text-luxury-gold hover:text-white transition"
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
            className="relative w-9 h-9 rounded-full bg-luxury-card border border-luxury-gold/20 flex items-center justify-center text-luxury-gold hover:text-white transition"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-luxury-gold text-[#091310] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

