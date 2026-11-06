'use client';

import React from 'react';
import { MapPin, Phone, ArrowRight, Clock } from 'lucide-react';
import { triggerHaptic } from '@/lib/telegram';

interface BranchesCardProps {
  onOpenBranches: () => void;
}

export function BranchesCard({ onOpenBranches }: BranchesCardProps) {
  return (
    <div
      onClick={() => {
        triggerHaptic('light');
        onOpenBranches();
      }}
      className="my-6 p-4 rounded-3xl bg-[#1A1F33] text-white shadow-[0_10px_25px_rgba(26,31,51,0.18)] border border-[#FAE9D7]/20 cursor-pointer active:scale-[0.98] transition select-none relative overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-[#FAE9D7]">
              11 Filial Toshkentda
            </span>
          </div>
          <p className="text-[11px] text-white/70 font-light">
            Novza • Golden Life • Chilonzor • Yunusobod • Sergeli
          </p>
          <div className="flex items-center gap-2 text-[10px] text-[#FAE9D7]/80 pt-0.5">
            <Clock className="w-3 h-3" />
            <span>Har kuni: 09:00 — 23:00</span>
          </div>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#FAE9D7] flex-shrink-0">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
