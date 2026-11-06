'use client';

import React from 'react';
import { Home, Grid, Heart, ShoppingBag, User } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { triggerHaptic } from '@/lib/telegram';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  onWishlistClick?: () => void;
}

export function BottomNavigation({ onWishlistClick }: BottomNavigationProps) {
  const { activeTab, setActiveTab, cartCount, wishlist } = useStore();

  const navItems = [
    { id: 'home' as const, label: 'Asosiy', icon: Home },
    { id: 'catalog' as const, label: 'Katalog', icon: Grid },
    {
      id: 'wishlist' as const,
      label: 'Sevimlilar',
      icon: Heart,
      badge: wishlist.length > 0 ? wishlist.length : undefined,
      isWishlistAction: true,
    },
    {
      id: 'cart' as const,
      label: 'Savat',
      icon: ShoppingBag,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    { id: 'profile' as const, label: 'Profil', icon: User },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none flex justify-center pb-[env(safe-area-inset-bottom)]">
      {/* Floating Organic Curved Bottom Bar (Matching Reference Screen 2) */}
      <nav className="pointer-events-auto h-15 px-5 bg-[#1A1F33] text-white rounded-full shadow-[0_12px_32px_rgba(0,0,0,0.35)] border border-[#FAE9D7]/20 flex items-center justify-between gap-5 sm:gap-7 backdrop-blur-xl">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                triggerHaptic('light');
                if (item.isWishlistAction && onWishlistClick) {
                  onWishlistClick();
                } else if (!item.isWishlistAction) {
                  setActiveTab(item.id as any);
                }
              }}
              aria-label={item.label}
              className={cn(
                "relative flex items-center justify-center p-2 rounded-full transition-all duration-200 active:scale-90",
                isActive
                  ? "text-[#FAE9D7]"
                  : "text-white/60 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-transform",
                  isActive && "scale-110 stroke-[2.4]"
                )}
              />

              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-1 bg-[#FAE9D7] text-[#1A1F33] text-[9px] font-black rounded-full px-1 min-w-[15px] h-[15px] flex items-center justify-center shadow-md">
                  {item.badge}
                </span>
              )}

              {isActive && (
                <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-[#FAE9D7] shadow-sm" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
