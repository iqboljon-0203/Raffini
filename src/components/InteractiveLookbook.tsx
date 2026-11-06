'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X, Plus } from 'lucide-react';
import { RAFFINI_PRODUCTS } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { formatUZS } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';

export function InteractiveLookbook() {
  const { setSelectedProduct } = useStore();
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  // Hotspots configured on the editorial look
  const hotspots = [
    {
      id: 1,
      x: '52%', // on jacket
      y: '38%',
      label: 'Kuzgi Premial Kurtka',
      price: 850000,
      productId: 'raffini_1',
    },
    {
      id: 2,
      x: '48%', // on pants/shoes
      y: '80%',
      label: 'Tabiiy Teri Poyabzal',
      price: 1200000,
      productId: 'raffini_2',
    },
  ];

  const handleOpenProduct = (productId: string) => {
    triggerHaptic('medium');
    const prod = RAFFINI_PRODUCTS.find((p) => p.id === productId);
    if (prod) {
      setSelectedProduct(prod);
    }
  };

  return (
    <div className="relative my-6 select-none">
      {/* Editorial Card Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#1A1F33]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#1A1F33]">
            Kunning Saralangan Obrazi
          </span>
        </div>
        <span className="text-[11px] text-[#1A1F33]/60 font-medium">
          Interaktiv Lookbook
        </span>
      </div>

      {/* Main Editorial Image Container */}
      <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden bg-[#ECE8E1] shadow-[0_15px_35px_rgba(0,0,0,0.08)] border border-black/5 group">
        <Image
          src="/images/products/prod_2.jpg"
          alt="Raffini Editorial Look"
          fill
          priority
          className="object-cover object-top filter brightness-[0.98]"
        />

        {/* Ambient Gradient for Hotspot Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Top Floating Badge */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <span className="px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md text-[#1A1F33] text-[10px] font-black uppercase tracking-widest shadow-sm">
            Mavsum Tanlovi
          </span>
        </div>

        {/* Interactive Pulsing Hotspot Pins */}
        {hotspots.map((spot) => {
          const isActive = activeHotspot === spot.id;

          return (
            <div
              key={spot.id}
              style={{ left: spot.x, top: spot.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              {/* Concentric Pulse Ring */}
              <span className="absolute -inset-2 rounded-full bg-white/40 animate-ping pointer-events-none" />

              {/* Pin Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic('light');
                  setActiveHotspot(isActive ? null : spot.id);
                }}
                aria-label={spot.label}
                className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isActive
                    ? 'bg-[#1A1F33] text-[#FAE9D7] scale-110'
                    : 'bg-white text-[#1A1F33] hover:scale-110'
                }`}
              >
                {isActive ? (
                  <X className="w-3.5 h-3.5" />
                ) : (
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                )}
              </motion.button>

              {/* Floating Tooltip Pill */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 5 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="absolute left-1/2 -translate-x-1/2 top-10 w-48 p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-black/10 shadow-[0_10px_25px_rgba(0,0,0,0.18)] text-left z-30 pointer-events-auto"
                  >
                    <span className="text-[10px] text-[#1A1F33]/60 block leading-tight">
                      Tanlangan kiyim
                    </span>
                    <h5 className="text-xs font-bold text-[#1A1F33] truncate mt-0.5">
                      {spot.label}
                    </h5>
                    <span className="text-xs font-bold text-[#1A1F33] block mt-1">
                      {formatUZS(spot.price)}
                    </span>

                    <button
                      onClick={() => handleOpenProduct(spot.productId)}
                      className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-[#1A1F33] text-[#FAE9D7] text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95 transition"
                    >
                      <span>Ko‘rish</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Bottom Hint */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/90 text-xs pointer-events-none z-10">
          <span className="text-[11px] font-light bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
            Kiyim ustidagi <span className="font-bold text-[#FAE9D7]">+</span> belgisini bosing
          </span>
          <span className="font-serif font-bold text-sm tracking-widest text-[#FAE9D7]">
            RAFFINI
          </span>
        </div>
      </div>
    </div>
  );
}
