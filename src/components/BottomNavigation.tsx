'use client';

import React from 'react';
import { Home, Grid, ShoppingBag, MapPin, User, Heart } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { triggerHaptic } from '@/lib/telegram';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  onBranchesClick?: () => void;
  onWishlistClick?: () => void;
}

export function BottomNavigation({ onBranchesClick, onWishlistClick }: BottomNavigationProps) {
  const { activeTab, setActiveTab, cartCount, t } = useStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-black/5 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_25px_rgba(0,0,0,0.06)] select-none">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around relative">
        {/* 1. Asosiy / Главная */}
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('home');
          }}
          className={cn(
            "flex flex-col items-center justify-center w-14 py-1 transition-all duration-200",
            activeTab === 'home' ? "text-[#1A1F33]" : "text-[#1A1F33]/45 hover:text-[#1A1F33]"
          )}
        >
          <Home className={cn("w-5 h-5", activeTab === 'home' ? "stroke-[2.5]" : "stroke-[1.8]")} />
          <span className="text-[10px] mt-1 font-semibold">{t('home')}</span>
        </button>

        {/* 2. Katalog / Каталог */}
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('catalog');
          }}
          className={cn(
            "flex flex-col items-center justify-center w-14 py-1 transition-all duration-200",
            activeTab === 'catalog' ? "text-[#1A1F33]" : "text-[#1A1F33]/45 hover:text-[#1A1F33]"
          )}
        >
          <Grid className={cn("w-5 h-5", activeTab === 'catalog' ? "stroke-[2.5]" : "stroke-[1.8]")} />
          <span className="text-[10px] mt-1 font-semibold">{t('catalog')}</span>
        </button>

        {/* 3. Center Elevated Cart Button (Exact Match to Video at 00:20) */}
        <button
          onClick={() => {
            triggerHaptic('medium');
            setActiveTab('cart');
          }}
          className="relative -top-5 flex flex-col items-center group active:scale-90 transition-transform"
        >
          <div className="w-14 h-14 rounded-full bg-[#1A1F33] text-[#FAE9D7] flex items-center justify-center shadow-[0_8px_20px_rgba(26,31,51,0.35)] border-4 border-white group-hover:scale-105 transition-all">
            <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center shadow-md animate-pulse border-2 border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className={cn(
            "text-[10px] mt-0.5 font-bold tracking-tight",
            activeTab === 'cart' ? "text-[#1A1F33]" : "text-[#1A1F33]/60"
          )}>
            {t('cart')}
          </span>
        </button>

        {/* 4. 11 Filial / Филиалы */}
        <button
          onClick={() => {
            triggerHaptic('light');
            if (onBranchesClick) onBranchesClick();
          }}
          className="flex flex-col items-center justify-center w-14 py-1 text-[#1A1F33]/45 hover:text-[#1A1F33] transition-colors"
        >
          <MapPin className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-1 font-semibold">{t('branches')}</span>
        </button>

        {/* 5. Profil / Профиль */}
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('profile');
          }}
          className={cn(
            "flex flex-col items-center justify-center w-14 py-1 transition-all duration-200",
            activeTab === 'profile' ? "text-[#1A1F33]" : "text-[#1A1F33]/45 hover:text-[#1A1F33]"
          )}
        >
          <User className={cn("w-5 h-5", activeTab === 'profile' ? "stroke-[2.5]" : "stroke-[1.8]")} />
          <span className="text-[10px] mt-1 font-semibold">{t('profile')}</span>
        </button>
      </div>
    </div>
  );
}
