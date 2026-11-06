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
  Sparkles,
  Globe,
  Truck
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { RAFFINI_INFO } from '@/data/branches';
import { triggerHaptic } from '@/lib/telegram';
import { RaffiniLogoSvg } from './RaffiniLogoSvg';

interface ProfileViewProps {
  onBranchesClick: () => void;
  onWishlistClick: () => void;
}

export function ProfileView({ onBranchesClick, onWishlistClick }: ProfileViewProps) {
  const { telegramUser, orders, wishlist, cartCount, setActiveTab, language, setLanguage, t } = useStore();

  const userName = telegramUser
    ? `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim()
    : (language === 'uz' ? 'Hurmatli Mehmon' : 'Уважаемый Гость');
    
  const usernameDisplay = telegramUser?.username
    ? `@${telegramUser.username}`
    : 'Telegram Web App';

  return (
    <div className="max-w-md mx-auto px-5 pb-32 pt-2 select-none text-[#1A1F33]">
      {/* 1. Profile Header Card (As shown in video at 00:30) */}
      <div className="relative p-5 rounded-[28px] bg-[#1A1F33] text-white shadow-[0_10px_25px_rgba(26,31,51,0.2)] overflow-hidden">
        <div className="flex items-center gap-3.5">
          {/* Avatar */}
          <div className="relative w-14 h-14 rounded-full bg-white/10 border border-white/20 text-[#FAE9D7] flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
            {telegramUser?.photo_url ? (
              <Image src={telegramUser.photo_url} alt={userName} fill className="object-cover" />
            ) : (
              <span className="font-serif font-bold text-xl text-[#FAE9D7]">
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* User info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-white font-serif truncate">
              {userName}
            </h2>
            <span className="text-xs text-white/60 block truncate">
              {usernameDisplay}
            </span>

            <div className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#FAE9D7] text-[10px] font-semibold">
              <Sparkles className="w-2.5 h-2.5 fill-[#FAE9D7]" />
              {t('vipMember')}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10 text-center">
          <div 
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('orders');
            }}
            className="p-2.5 rounded-2xl bg-white/5 cursor-pointer hover:bg-white/10 transition"
          >
            <span className="text-base font-bold text-white font-mono block">{orders.length}</span>
            <span className="text-[10px] text-white/60">{t('myOrders')}</span>
          </div>

          <div 
            onClick={() => {
              triggerHaptic('light');
              onWishlistClick();
            }}
            className="p-2.5 rounded-2xl bg-white/5 cursor-pointer hover:bg-white/10 transition"
          >
            <span className="text-base font-bold text-[#FAE9D7] font-mono block">{wishlist.length}</span>
            <span className="text-[10px] text-white/60">Sevimlilar</span>
          </div>

          <div 
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('cart');
            }}
            className="p-2.5 rounded-2xl bg-white/5 cursor-pointer hover:bg-white/10 transition"
          >
            <span className="text-base font-bold text-white font-mono block">{cartCount}</span>
            <span className="text-[10px] text-white/60">{t('cart')}</span>
          </div>
        </div>
      </div>

      {/* 2. Language Switcher (Exact Match to Video at 00:32) */}
      <div className="mt-4 p-3.5 rounded-2xl bg-white border border-black/5 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[#1A1F33]">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#1A1F33]/60" />
            <span>Tilni tanlash / Выбор языка</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setLanguage('uz')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              language === 'uz'
                ? 'bg-[#1A1F33] text-[#FAE9D7] shadow-sm'
                : 'bg-[#FBF8F3] text-[#1A1F33]/70 hover:bg-black/5'
            }`}
          >
            <span>🇺🇿 O‘zbekcha</span>
          </button>
          <button
            onClick={() => setLanguage('ru')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              language === 'ru'
                ? 'bg-[#1A1F33] text-[#FAE9D7] shadow-sm'
                : 'bg-[#FBF8F3] text-[#1A1F33]/70 hover:bg-black/5'
            }`}
          >
            <span>🇷🇺 Русский</span>
          </button>
        </div>
      </div>

      {/* 3. Action Links (As in Video at 00:33) */}
      <div className="mt-3 space-y-2">
        {/* My orders */}
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('orders');
          }}
          className="w-full p-4 rounded-2xl bg-white border border-black/5 flex items-center justify-between shadow-sm hover:border-[#1A1F33]/30 transition active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1A1F33]/5 flex items-center justify-center text-[#1A1F33]">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-[#1A1F33] block">{t('myOrders')}</span>
              <span className="text-[10px] text-[#1A1F33]/50">
                {orders.length > 0 ? `${orders.length} ta buyurtma` : 'Buyurtmalar holati'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#1A1F33]/40" />
        </button>

        {/* 11 Branches */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onBranchesClick();
          }}
          className="w-full p-4 rounded-2xl bg-white border border-black/5 flex items-center justify-between shadow-sm hover:border-[#1A1F33]/30 transition active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1A1F33]/5 flex items-center justify-center text-[#1A1F33]">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-[#1A1F33] block">{t('branches')}</span>
              <span className="text-[10px] text-[#1A1F33]/50">Toshkent bo‘ylab barcha filiallar</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#1A1F33]/40" />
        </button>

        {/* Telegram Channel */}
        <a
          href={RAFFINI_INFO.channelUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => triggerHaptic('light')}
          className="w-full p-4 rounded-2xl bg-white border border-black/5 flex items-center justify-between shadow-sm hover:border-[#1A1F33]/30 transition active:scale-[0.99] block"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1A1F33]/5 flex items-center justify-center text-[#1A1F33]">
              <Send className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-[#1A1F33] block">{t('channel')}</span>
              <span className="text-[10px] text-[#1A1F33]/50">@raffini_uz rasmiy kanali</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#1A1F33]/40" />
        </a>

        {/* Contact Manager */}
        <a
          href={`https://t.me/${RAFFINI_INFO.admin.replace('@', '')}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => triggerHaptic('light')}
          className="w-full p-4 rounded-2xl bg-white border border-black/5 flex items-center justify-between shadow-sm hover:border-[#1A1F33]/30 transition active:scale-[0.99] block"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1A1F33]/5 flex items-center justify-center text-[#1A1F33]">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-[#1A1F33] block">{t('manager')}</span>
              <span className="text-[10px] text-[#1A1F33]/50">{RAFFINI_INFO.phones[0]}</span>
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
