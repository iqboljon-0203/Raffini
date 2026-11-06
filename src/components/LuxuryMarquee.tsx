'use client';

import React from 'react';

export function LuxuryMarquee() {
  const items = [
    'RAFFINI ERKAKLAR MODASI',
    'TOSHKENT BO‘YLAB 11 FILIAL',
    '2026 YANGI MAVSUM KOLLEKSIYASI',
    '100% SIFAT KAFOLATI',
    'BEPUL YETKAZIB BERISH',
    'ITALIYA BICHIMI VA USLUBI',
  ];

  return (
    <div className="relative overflow-hidden py-3 my-4 border-y border-[#1A1F33]/10 bg-[#1A1F33]/[0.02] select-none">
      <div className="flex w-max animate-marquee space-x-6">
        {/* Double array for seamless infinite marquee loop */}
        {[...items, ...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center space-x-6 text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#1A1F33]/70 uppercase">
            <span>{text}</span>
            <span className="text-[#1A1F33]/30">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

