'use client';

import React from 'react';
import { Home, Grid, ShoppingBag, Clock, User, Heart } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { cn } from '@/lib/utils';

export function BottomNavigation() {
  const { activeTab, setActiveTab, cartCount, wishlist } = useStore();

  const navItems = [
    { id: 'home' as const, label: 'Asosiy', icon: Home },
    { id: 'catalog' as const, label: 'Katalog', icon: Grid },
    { 
      id: 'cart' as const, 
      label: 'Savat', 
      icon: ShoppingBag, 
      badge: cartCount > 0 ? cartCount : undefined 
    },
    { id: 'orders' as const, label: 'Buyurtma', icon: Clock },
    { id: 'profile' as const, label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#091310]/95 backdrop-blur-lg border-t border-luxury-gold/15 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto px-3 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center w-14 py-1 transition-all duration-200",
                isActive ? "text-luxury-gold" : "text-[#8E9B94] hover:text-white"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5 transition-transform duration-200", isActive && "scale-110")} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-luxury-gold text-[#091310] text-[9px] font-extrabold rounded-full px-1 min-w-[15px] h-[15px] flex items-center justify-center shadow">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] mt-1 font-medium transition-colors",
                isActive ? "text-luxury-gold font-semibold" : "text-[#7A8881]"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-4 h-0.5 rounded-full bg-luxury-gold shadow-gold-glow" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
