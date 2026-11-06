'use client';

import React, { useState } from 'react';
import { X, MapPin, Phone, Clock, Search } from 'lucide-react';
import { RAFFINI_BRANCHES } from '@/data/branches';
import { triggerHaptic } from '@/lib/telegram';

interface BranchesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BranchesModal({ isOpen, onClose }: BranchesModalProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = RAFFINI_BRANCHES.filter(
    (b) =>
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.landmark.toLowerCase().includes(query.toLowerCase()) ||
      b.address.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in select-none">
      <div className="bg-white text-[#1A1F33] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/5">
          <div>
            <h2 className="text-base font-serif font-bold text-[#1A1F33]">RAFFINI Filiallari</h2>
            <span className="text-xs text-[#1A1F33]/60">Toshkent bo‘yicha 11 ta filial</span>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1F33]/60 hover:bg-black/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 bg-[#FBF8F3] border-b border-black/5">
          <div className="relative">
            <input
              type="text"
              placeholder="Filial yoki mo‘ljalni qidirish..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border border-[#1A1F33]/15 rounded-full px-4 py-2.5 pl-10 text-xs text-[#1A1F33] placeholder:text-[#1A1F33]/40 focus:outline-none focus:border-[#1A1F33]"
            />
            <Search className="w-4 h-4 text-[#1A1F33]/50 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* List of Branches */}
        <div className="p-4 overflow-y-auto space-y-3">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="p-3.5 rounded-2xl bg-[#FBF8F3] border border-[#1A1F33]/10 space-y-2 hover:border-[#1A1F33]/30 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-xs text-[#1A1F33]">{b.name}</h3>
                  <p className="text-[11px] text-[#1A1F33]/60 mt-0.5">{b.address}</p>
                </div>
                <a
                  href={`tel:${b.phone.replace(/[^0-9+]/g, '')}`}
                  onClick={() => triggerHaptic('light')}
                  className="px-3 py-1.5 rounded-full bg-[#1A1F33] text-[#FAE9D7] text-[10px] font-bold flex items-center gap-1 active:scale-95 transition"
                >
                  <Phone className="w-3 h-3" />
                  Qo‘ng‘iroq
                </a>
              </div>

              <div className="flex items-center gap-4 text-[10px] text-[#1A1F33]/70 pt-1 border-t border-black/5">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#1A1F33]" />
                  <span>{b.landmark}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#1A1F33]" />
                  <span>{b.workHours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
