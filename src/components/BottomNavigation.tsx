'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
    <div className="fixed bottom-4 left-0 right-0 z-40 px-3 sm:px-4 pointer-events-none flex justify-center pb-[env(safe-area-inset-bottom)]">
      {/* Ultra-Luxury Obsidian Floating Dock */}
      <nav
        style={{ backgroundColor: '#1A1F33' }}
        className="pointer-events-auto relative px-3 py-2 bg-[#1A1F33] text-white rounded-full border border-[#FAE9D7]/30 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_25px_rgba(250,233,215,0.08)] flex items-center justify-between gap-1 w-full max-w-[395px] select-none before:absolute before:inset-x-8 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-[#FAE9D7]/40 before:to-transparent"
      >
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
                "relative flex items-center justify-center rounded-full transition-all duration-300 active:scale-95 group",
                isActive ? "px-3.5 py-2" : "p-2.5 hover:bg-white/10"
              )}
            >
              {/* Animated Liquid Active Capsule */}
              {isActive && (
                <motion.div
                  layoutId="activeNavTab"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  className="absolute inset-0 bg-gradient-to-r from-[#FAE9D7] to-[#F3DEC5] rounded-full shadow-[0_4px_15px_rgba(250,233,215,0.35)]"
                />
              )}

              {/* Icon & Optional Active Expanding Label */}
              <div className="relative z-10 flex items-center gap-1.5">
                <Icon
                  className={cn(
                    "transition-all duration-200",
                    isActive
                      ? "w-4.5 h-4.5 text-[#1A1F33] stroke-[2.4]"
                      : "w-5 h-5 text-white/75 group-hover:text-white stroke-[2]"
                  )}
                />

                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs font-bold text-[#1A1F33] tracking-tight whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}

                {/* Badge Indicator */}
                {item.badge !== undefined && (
                  <span
                    className={cn(
                      "text-[9px] font-black rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center transition-colors shadow-sm",
                      isActive
                        ? "bg-[#1A1F33] text-[#FAE9D7]"
                        : "bg-[#FAE9D7] text-[#1A1F33] absolute -top-1 -right-1 animate-pulse"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default BottomNavigation;
