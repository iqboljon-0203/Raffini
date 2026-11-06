'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Tag, Check, Copy, Sparkles } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { triggerHaptic } from '@/lib/telegram';

export function VipPromoBanner() {
  const { applyPromoCode } = useStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    triggerHaptic('success');
    applyPromoCode('RAFFINI');
    setCopied(true);

    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText('RAFFINI');
      }
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#1A1F33', '#FAE9D7', '#E2C7A7'],
      });
    } catch (e) {}

    setTimeout(() => {
      setCopied(false);
    }, 2800);
  };

  return (
    <div className="my-5 p-4 rounded-3xl bg-[#1A1F33] text-white shadow-[0_10px_25px_rgba(26,31,51,0.15)] border border-[#FAE9D7]/20 select-none relative overflow-hidden">
      {/* Decorative subtle light flare */}
      <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#FAE9D7]/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#FAE9D7] text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 fill-[#FAE9D7]" />
            VIP 10% Chegirma
          </div>

          <p className="text-[11px] text-white/70 font-light max-w-[200px] leading-tight">
            Har qanday xarid uchun maxsus chegirma promokodi
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FAE9D7] to-[#E2C7A7] text-[#1A1F33] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Qo‘llandi</span>
            </>
          ) : (
            <>
              <span className="font-mono font-black">RAFFINI</span>
              <Copy className="w-3 h-3 opacity-70" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
