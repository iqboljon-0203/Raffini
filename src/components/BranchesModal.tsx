'use client';

import React, { useState } from 'react';
import { X, MapPin, Phone, Clock, Search, Navigation } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#0b1713] border border-luxury-gold/30 w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#091310]">
          <div>
            <h2 className="text-base font-serif font-bold text-white">RAFFINI Filiallari</h2>
            <span className="text-[11px] text-luxury-gold">Toshkent shahri bo‘yicha 11 ta filial</span>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 bg-[#091310]/60 border-b border-white/5">
          <div className="relative">
            <input
              type="text"
              placeholder="Filial yoki mo‘ljalni qidirish..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-luxury-card border border-white/10 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder:text-[#5E6E67] focus:outline-none focus:border-luxury-gold"
            />
            <Search className="w-4 h-4 text-luxury-gold absolute left-3 top-2.5" />
          </div>
        </div>

        {/* List of Branches */}
        <div className="p-4 overflow-y-auto space-y-3 divide-y divide-white/5">
          {filtered.map((b) => (
            <div key={b.id} className="pt-3 first:pt-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-luxury-gold inline-block" />
                    {b.name}
                  </h3>
                  <p className="text-[11px] text-luxury-gold font-medium mt-0.5">
                    {b.landmark}
                  </p>
                  <p className="text-[10px] text-[#8E9F97] mt-0.5">{b.address}</p>
                </div>

                <a
                  href={`tel:${b.phone.replace(/[\s\(\)-]/g, '')}`}
                  className="w-8 h-8 rounded-full bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 flex items-center justify-center hover:bg-luxury-gold hover:text-[#091310] transition flex-shrink-0"
                  title="Qo‘ng‘iroq qilish"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex items-center gap-4 mt-2 text-[10px] text-[#7A8A82]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-luxury-gold" />
                  {b.workHours}
                </span>
                {b.metro && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Navigation className="w-3 h-3" />
                    {b.metro}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
