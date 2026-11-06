'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { RaffiniLogoSvg } from './RaffiniLogoSvg';
import { triggerHaptic } from '@/lib/telegram';

interface SplashViewProps {
  onStart: () => void;
}

export function SplashView({ onStart }: SplashViewProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('raffini_splash_dismissed');
    if (seen === 'true') {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  const handleStart = () => {
    triggerHaptic('medium');
    setIsExiting(true);
    setTimeout(() => {
      sessionStorage.setItem('raffini_splash_dismissed', 'true');
      setIsVisible(false);
      onStart();
    }, 400);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F33] p-0 sm:p-4 select-none overflow-hidden"
      >
        {/* Main Minimalist Fashion Card (Reference Screen 1) */}
        <div className="relative w-full max-w-md h-full sm:h-[92vh] sm:rounded-[38px] overflow-hidden bg-[#1A1F33] shadow-2xl flex flex-col justify-between">
          {/* Fullscreen Editorial Model Visual */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/splash_hero.jpg"
              alt="RAFFINI Erkaklar Modasi"
              fill
              priority
              className="object-cover object-center filter brightness-[0.96] contrast-[1.03]"
            />
            {/* Subtle Vignette Gradient for Logo Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
          </div>

          {/* Top Skip Button */}
          <div className="relative z-10 pt-6 px-6 flex justify-end">
            <button
              onClick={handleStart}
              className="text-xs text-white/70 hover:text-white font-medium tracking-wider uppercase transition-colors px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10"
            >
              O‘tkazish
            </button>
          </div>

          {/* Center Brand Identity (1:1 SVG Logo with Hand-Drawn Minimalist Underline) */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 my-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="flex flex-col items-center"
            >
              {/* 1:1 Official Vector SVG Logo */}
              <RaffiniLogoSvg
                color="#FFFFFF"
                className="w-56 sm:w-64 h-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
              />

              {/* Minimal Hand-Drawn Brush Underline (Matching Reference) */}
              <svg
                viewBox="0 0 160 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-36 sm:w-44 h-3 mt-1.5 text-white/90 drop-shadow-md"
              >
                <path
                  d="M 4 7 C 40 2, 90 9, 156 5"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
              </svg>

              <span className="text-[11px] text-[#FAE9D7] tracking-[0.28em] uppercase font-light mt-3 drop-shadow-md">
                Toshkent • 11 Filial
              </span>
            </motion.div>
          </div>

          {/* Bottom Circle Action Button (Matching Reference Screen 1) */}
          <div className="relative z-10 pb-12 flex flex-col items-center">
            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleStart}
              aria-label="Xaridni boshlash"
              className="w-16 h-16 rounded-full bg-white text-[#1A1F33] shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex items-center justify-center transition-transform group cursor-pointer border-4 border-white/20"
            >
              <ArrowRight className="w-6 h-6 stroke-[2.5] text-[#1A1F33] group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
