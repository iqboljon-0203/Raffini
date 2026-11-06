'use client';

import React from 'react';
import Image from 'next/image';
import { Search, ArrowRight, Sparkles, MapPin, ShieldCheck, Flame, Percent } from 'lucide-react';
import { RAFFINI_PRODUCTS, CATEGORIES } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { triggerHaptic } from '@/lib/telegram';

interface HomeViewProps {
  onSearchClick: () => void;
  onBranchesClick: () => void;
}

export function HomeView({ onSearchClick, onBranchesClick }: HomeViewProps) {
  const { setActiveTab, setSelectedProduct } = useStore();

  const trendingProducts = RAFFINI_PRODUCTS.filter((p) => p.isTrending).slice(0, 6);
  const newArrivals = RAFFINI_PRODUCTS.slice(0, 8);

  const heroImage = RAFFINI_PRODUCTS[0]?.images[0] || '/images/logo.png';

  return (
    <div className="max-w-md mx-auto px-4 pb-32 pt-2 space-y-6">
      {/* Search Input Trigger */}
      <div
        onClick={() => {
          triggerHaptic('light');
          onSearchClick();
        }}
        className="flex items-center gap-2.5 p-3 rounded-2xl bg-luxury-card border border-luxury-gold/20 text-[#7D8F86] text-xs cursor-pointer hover:border-luxury-gold/40 transition shadow-sm"
      >
        <Search className="w-4 h-4 text-luxury-gold flex-shrink-0" />
        <span className="flex-1">Kurtka, kostyum, poyabzal qidirish...</span>
      </div>

      {/* Luxury Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0d261e] via-[#113328] to-[#0b211a] border border-luxury-gold/30 shadow-luxury p-5 min-h-[170px] flex items-center justify-between">
        {/* Glow effect */}
        <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-luxury-gold/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[62%]">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-luxury-gold/20 text-luxury-gold text-[9px] font-bold tracking-wider uppercase mb-2 border border-luxury-gold/30">
            <Sparkles className="w-2.5 h-2.5 fill-luxury-gold" />
            Yangi Mavsum 2026
          </div>
          <h2 className="text-lg font-serif font-bold text-white leading-tight">
            Elegance & <br />
            <span className="text-luxury-gold">Premium Style</span>
          </h2>
          <p className="text-[11px] text-[#A2B6AD] mt-1 font-light">
            Eksklyuziv erkaklar liboslari
          </p>
          <button
            onClick={() => {
              triggerHaptic('medium');
              setActiveTab('catalog');
            }}
            className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-luxury-gold to-[#f0ce78] text-[#091310] font-extrabold text-[11px] uppercase tracking-wider shadow-gold-glow hover:brightness-105 active:scale-95 transition"
          >
            <span>Xarid qilish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hero Product Cutout Image */}
        <div className="relative w-32 h-36 rounded-2xl overflow-hidden border border-luxury-gold/30 shadow-2xl flex-shrink-0">
          <Image
            src={heroImage}
            alt="Hero Fashion"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      </div>

      {/* Quick Category Chips */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-serif font-bold text-white">Kategoriyalar</h3>
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('catalog');
            }}
            className="text-[11px] text-luxury-gold font-semibold hover:underline"
          >
            Barchasi →
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.slice(1).map((cat, idx) => (
            <button
              key={idx}
              onClick={() => {
                triggerHaptic('selection');
                setActiveTab('catalog');
              }}
              className="px-3.5 py-2 rounded-xl bg-luxury-card border border-white/5 hover:border-luxury-gold/30 text-white/90 text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 active:scale-95"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* VIP Promocode Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-luxury-card to-[#152e24] border border-luxury-gold/25 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-luxury-gold/20 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold flex-shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">VIP Chegirma</span>
              <span className="text-[10px] bg-luxury-gold text-[#091310] font-extrabold px-1.5 py-0.2 rounded font-mono">
                RAFFINI
              </span>
            </div>
            <p className="text-[10px] text-[#9CB0A7] mt-0.5">
              Savatda ushbu kodni kiriting va 10% chegirmaga ega bo‘ling!
            </p>
          </div>
        </div>
      </div>

      {/* Trending Collection (Horizontal slider / highlights) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
            <h3 className="text-sm font-serif font-bold text-white">Trenddagi to‘plam</h3>
          </div>
          <button
            onClick={() => setActiveTab('catalog')}
            className="text-[11px] text-luxury-gold font-semibold"
          >
            Ko‘proq →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {trendingProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* 11 Filial Banner */}
      <div
        onClick={() => {
          triggerHaptic('medium');
          onBranchesClick();
        }}
        className="p-4 rounded-2xl bg-[#0e211a] border border-luxury-gold/30 flex items-center justify-between cursor-pointer hover:border-luxury-gold/50 transition active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-luxury-gold/20 flex items-center justify-center text-luxury-gold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block font-serif">
              Toshkentda 11 ta Filial
            </span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">
              Novza, Golden Life, Yunusobod... Filiallarni ko‘rish
            </span>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-luxury-gold" />
      </div>

      {/* New Arrivals Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-serif font-bold text-white">Yangi kelganlar</h3>
          <span className="text-[11px] text-[#7A8A82]">Raffini 2026</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {newArrivals.slice(6, 12).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
