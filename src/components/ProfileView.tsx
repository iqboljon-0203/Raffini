'use client';

import React from 'react';
import Image from 'next/image';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Heart, 
  Phone, 
  Send, 
  Clock, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { RAFFINI_INFO } from '@/data/branches';
import { triggerHaptic } from '@/lib/telegram';

interface ProfileViewProps {
  onBranchesClick: () => void;
  onWishlistClick: () => void;
}

export function ProfileView({ onBranchesClick, onWishlistClick }: ProfileViewProps) {
  const { telegramUser, orders, wishlist, cartCount, setActiveTab } = useStore();

  const userName = telegramUser
    ? `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim()
    : 'Hurmatli Mehmon';
  const usernameDisplay = telegramUser?.username
    ? `@${telegramUser.username}`
    : 'Telegram Web App';

  return (
    <div className="max-w-md mx-auto px-5 pb-40 pt-2 select-none text-[#1A1F33]">
      {/* Profile Header Card */}
      <div className="relative p-5 rounded-[28px] bg-white border border-[#1A1F33]/10 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3.5">
          {/* Avatar */}
          <div className="relative w-14 h-14 rounded-full bg-[#1A1F33] text-[#FAE9D7] flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
            {telegramUser?.photo_url ? (
              <Image src={telegramUser.photo_url} alt={userName} fill className="object-cover" />
            ) : (
              <span className="font-serif font-bold text-xl">
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* User info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-[#1A1F33] font-serif truncate">
              {userName}
            </h2>
            <span className="text-xs text-[#1A1F33]/60 block truncate">
              {usernameDisplay}
            </span>

            <div className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-[#1A1F33]/5 text-[#1A1F33] text-[10px] font-semibold">
              <Sparkles className="w-2.5 h-2.5" />
              VIP Xaridor
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-black/5 text-center">
          <div 
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('orders');
            }}
            className="p-2.5 rounded-2xl bg-[#FBF8F3] cursor-pointer hover:bg-black/5 transition"
          >
            <span className="text-base font-bold text-[#1A1F33] font-mono block">{orders.length}</span>
            <span className="text-[10px] text-[#1A1F33]/60">Buyurtmalar</span>
          </div>

          <div 
            onClick={() => {
              triggerHaptic('light');
              onWishlistClick();
            }}
            className="p-2.5 rounded-2xl bg-[#FBF8F3] cursor-pointer hover:bg-black/5 transition"
          >
            <span className="text-base font-bold text-[#1A1F33] font-mono block">{wishlist.length}</span>
            <span className="text-[10px] text-[#1A1F33]/60">Sevimlilar</span>
          </div>

          <div 
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('cart');
            }}
            className="p-2.5 rounded-2xl bg-[#FBF8F3] cursor-pointer hover:bg-black/5 transition"
          >
            <span className="text-base font-bold text-[#1A1F33] font-mono block">{cartCount}</span>
            <span className="text-[10px] text-[#1A1F33]/60">Savatda</span>
          </div>
        </div>
      </div>

      {/* Action Links */}
      <div className="mt-4 space-y-2">
        <button
          onClick={() => {
            triggerHaptic('light');
            onBranchesClick();
          }}
          className="w-full p-4 rounded-2xl bg-white border border-[#1A1F33]/10 flex items-center justify-between shadow-sm hover:border-[#1A1F33]/30 transition active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1A1F33]/5 flex items-center justify-center text-[#1A1F33]">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-[#1A1F33] block">11 Filial Toshkentda</span>
              <span className="text-[10px] text-[#1A1F33]/60">Manzillar, telefon va ish vaqti</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#1A1F33]/40" />
        </button>

        <a
          href={RAFFINI_INFO.channelUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => triggerHaptic('light')}
          className="w-full p-4 rounded-2xl bg-white border border-[#1A1F33]/10 flex items-center justify-between shadow-sm hover:border-[#1A1F33]/30 transition active:scale-[0.99] block"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1A1F33]/5 flex items-center justify-center text-[#1A1F33]">
              <Send className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-[#1A1F33] block">Telegram Kanal</span>
              <span className="text-[10px] text-[#1A1F33]/60">@raffini_uz rasmiy kanali</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#1A1F33]/40" />
        </a>

        <a
          href={`https://t.me/${RAFFINI_INFO.admin.replace('@', '')}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => triggerHaptic('light')}
          className="w-full p-4 rounded-2xl bg-white border border-[#1A1F33]/10 flex items-center justify-between shadow-sm hover:border-[#1A1F33]/30 transition active:scale-[0.99] block"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1A1F33]/5 flex items-center justify-center text-[#1A1F33]">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-[#1A1F33] block">Menejer Bilan Bog‘lanish</span>
              <span className="text-[10px] text-[#1A1F33]/60">{RAFFINI_INFO.phones[0]}</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#1A1F33]/40" />
        </a>
      </div>

      {/* Brand Footer */}
      <div className="mt-8 text-center text-[10px] text-[#1A1F33]/40 space-y-1">
        <p className="font-serif tracking-widest uppercase font-bold text-[#1A1F33]/60">RAFFINI</p>
        <p>2025-yilda asos solingan erkaklar kiyimlari brendi</p>
        <p>Versiya 2.0 • Web App</p>
      </div>
    </div>
  );
}
