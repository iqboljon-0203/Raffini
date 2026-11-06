'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronsRight, Sparkles } from 'lucide-react';
import { triggerHaptic } from '@/lib/telegram';

interface SplashViewProps {
  onStart: () => void;
}

export function SplashView({ onStart }: SplashViewProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('raffini_splash_seen');
    if (seen === 'true') {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  const handleStart = () => {
    triggerHaptic('medium');
    setIsExiting(true);
    setTimeout(() => {
      localStorage.setItem('raffini_splash_seen', 'true');
      setIsVisible(false);
      onStart();
    }, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-gradient-to-b from-[#0C0F17] via-[#141826] to-[#0A0D14] p-6 text-center overflow-hidden transition-all duration-500 ${
        isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Animated Gradient Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-gradient-to-tr from-[#1A1F33] via-[#FAE9D7]/15 to-transparent blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Massive Editorial Kinetic Typography Behind Model */}
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none z-0 overflow-hidden">
        <span className="font-serif font-black text-[125px] sm:text-[140px] leading-[0.82] tracking-tighter text-[#FAE9D7]/[0.08] select-none">
          RAF
        </span>
        <span className="font-serif font-black text-[125px] sm:text-[140px] leading-[0.82] tracking-tighter text-[#FAE9D7]/[0.08] select-none">
          FINI
        </span>
      </div>

      {/* Top Header Pill */}
      <div className="pt-6 relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1F33]/80 backdrop-blur-md border border-[#FAE9D7]/20 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#FAE9D7] animate-ping" />
          <span className="text-[10px] font-bold text-[#FAE9D7] tracking-widest uppercase">
            NEW COLLECTION 2026
          </span>
        </div>

        <button
          onClick={handleStart}
          className="text-xs text-[#8E9BAE] hover:text-[#FAE9D7] tracking-wider transition uppercase font-semibold"
        >
          O‘tkazish
        </button>
      </div>

      {/* Center 3D Fashion Model Visual */}
      <div className="relative my-auto w-full max-w-[310px] aspect-[3/4] mx-auto z-10 animate-float">
        <div className="relative w-full h-full rounded-[36px] overflow-hidden border border-[#FAE9D7]/30 shadow-luxury bg-gradient-to-b from-[#1A1F33] to-[#0C0F17]">
          <Image
            src="/images/products/prod_1.jpg"
            alt="Raffini Model"
            fill
            className="object-cover object-top filter brightness-[1.02] contrast-[1.02]"
            priority
          />

          {/* Luxury vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0F17] via-transparent to-transparent opacity-90" />

          {/* Floating Branch Badge on photo */}
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between pointer-events-none">
            <div className="bg-[#1A1F33]/90 backdrop-blur-md border border-[#FAE9D7]/30 px-3 py-1.5 rounded-2xl shadow-lg">
              <span className="text-[10px] font-black text-[#FAE9D7] uppercase tracking-wider block">
                11 Filial Toshkent
              </span>
              <span className="text-[9px] text-[#A0AEC0] block">
                Novza • Golden Life • Chilonzor
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#FAE9D7] flex items-center justify-center text-[#1A1F33] font-serif font-black text-sm shadow-gold-glow">
              R
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Editorial Content */}
      <div className="pb-4 relative z-10 max-w-sm mx-auto w-full text-left">
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight">
          Elevate Your Style <br />
          <span className="text-[#FAE9D7] italic font-serif">Game With Raffini.</span>
        </h2>
        <p className="text-xs text-[#8E9BAE] mt-2 leading-relaxed">
          Discover the latest trends, autumn & winter collections and exclusive tailored fashion to keep yourself dashing.
        </p>

        {/* High-fashion Interactive Button with animated chevrons */}
        <button
          onClick={handleStart}
          className="mt-5 w-full h-14 rounded-full bg-[#1A1F33] border border-[#FAE9D7]/30 p-1.5 flex items-center justify-between hover:border-[#FAE9D7] transition shadow-luxury active:scale-[0.98] group"
        >
          <div className="h-full px-6 rounded-full bg-[#FAE9D7] text-[#1A1F33] font-black text-xs uppercase tracking-widest flex items-center justify-center shadow-md">
            Get Started
          </div>
          <div className="pr-5 flex items-center gap-1 text-[#FAE9D7] group-hover:translate-x-1 transition-transform">
            <ChevronsRight className="w-5 h-5 animate-chevrons" />
          </div>
        </button>
      </div>
    </div>
  );
}
