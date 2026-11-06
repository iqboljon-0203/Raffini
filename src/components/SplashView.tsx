'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { triggerHaptic } from '@/lib/telegram';

interface SplashViewProps {
  onStart: () => void;
}

export function SplashView({ onStart }: SplashViewProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has seen splash
    const seen = localStorage.getItem('raffini_splash_seen');
    if (seen === 'true') {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  const handleStart = () => {
    triggerHaptic('medium');
    localStorage.setItem('raffini_splash_seen', 'true');
    setIsVisible(false);
    onStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-gradient-to-b from-[#06120e] via-[#091a14] to-[#040c09] p-6 text-center animate-in fade-in duration-300">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-luxury-gold/10 blur-3xl pointer-events-none" />

      {/* Top Brand Logo */}
      <div className="pt-8 relative z-10">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-luxury-gold/15 border border-luxury-gold/30 text-luxury-gold text-[10px] font-bold tracking-widest uppercase mb-3">
          <Sparkles className="w-3 h-3 fill-luxury-gold" />
          EST. 2025 • TASHKENT
        </div>
        <h1 className="font-serif font-black tracking-[0.3em] text-3xl sm:text-4xl text-white">
          RAFFINI
        </h1>
        <p className="text-xs text-luxury-gold tracking-widest uppercase font-light mt-1">
          Wear Your Style • Premium Fashion
        </p>
      </div>

      {/* Center Image Showcase */}
      <div className="relative my-auto w-full max-w-[280px] aspect-[3/4] mx-auto rounded-3xl overflow-hidden border-2 border-luxury-gold/30 shadow-2xl shadow-luxury-gold/10">
        <Image
          src="/images/products/prod_1.jpg"
          alt="Raffini Model"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-left">
          <span className="text-[10px] bg-luxury-gold text-[#091310] font-black px-2 py-0.5 rounded-full uppercase">
            11 ta filial
          </span>
          <h3 className="text-sm font-bold text-white font-serif mt-1">
            Yangi Mavsum Erkaklar Kolleksiyasi
          </h3>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pb-6 relative z-10 max-w-sm mx-auto w-full">
        <p className="text-xs text-[#8E9F97] mb-4">
          Toshkentdagi eng zamonaviy erkaklar kiyimlari do‘konining rasmiy Telegram Web App ilovasi
        </p>

        <button
          onClick={handleStart}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-luxury-gold to-[#f0ce78] text-[#091310] font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-105 active:scale-95 transition"
        >
          <span>Do‘konga kirish</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            localStorage.setItem('raffini_splash_seen', 'true');
            setIsVisible(false);
          }}
          className="mt-3 text-[11px] text-[#7A8A82] hover:text-white"
        >
          O‘tkazib yuborish
        </button>
      </div>
    </div>
  );
}
