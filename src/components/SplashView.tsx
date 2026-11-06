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
              className="object-cover object-center filter brightness-[0.92] contrast-[1.05]"
            />
            {/* Darker Center Gradient to make White Logo Pop Crisp & Clear */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40 pointer-events-none" />
          </div>

          {/* Top Skip Button */}
          <div className="relative z-20 pt-6 px-6 flex justify-end">
            <button
              onClick={handleStart}
              className="text-xs text-white/80 hover:text-white font-medium tracking-wider uppercase transition-colors px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20"
            >
              O‘tkazish
            </button>
          </div>

          {/* Center Brand Identity: Positioned directly across the image */}
          <div className="absolute top-[48%] -translate-y-1/2 left-0 right-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
            {/* 1:1 Vector SVG Logo with bold shadow */}
            <RaffiniLogoSvg
              color="#FFFFFF"
              className="w-64 sm:w-72 h-16 sm:h-20 drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]"
            />

            {/* Minimal Hand-Drawn Brush Underline (Matching Reference Screen 1) */}
            <svg
              viewBox="0 0 160 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-40 sm:w-48 h-3 mt-1 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
            >
              <path
                d="M 4 7 C 40 2, 90 9, 156 5"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </svg>

            <span className="text-[11px] text-[#FAE9D7] tracking-[0.3em] uppercase font-bold mt-2.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Toshkent • 11 Filial
            </span>
          </div>

          {/* Bottom Circle Action Button (Matching Reference Screen 1) */}
          <div className="relative z-20 pb-12 flex flex-col items-center">
            <div className="relative">
              {/* Subtle Pulsing Aura Ring */}
              <span className="absolute -inset-2 rounded-full bg-white/20 animate-ping pointer-events-none" />

              <motion.button
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleStart}
                aria-label="Xaridni boshlash"
                className="relative w-16 h-16 rounded-full bg-white text-[#1A1F33] shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex items-center justify-center transition-transform group cursor-pointer border-4 border-white/30"
              >
                <ArrowRight className="w-6 h-6 stroke-[2.5] text-[#1A1F33] group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
