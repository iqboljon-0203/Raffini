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
  Award, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
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
    : 'Raffini Mehmoni';
  const usernameDisplay = telegramUser?.username
    ? `@${telegramUser.username}`
    : 'Telegram Web App';

  return (
    <div className="max-w-md mx-auto px-4 pb-32 pt-2">
      {/* Profile Header Card */}
      <div className="relative p-5 rounded-3xl bg-gradient-to-b from-[#132820] to-luxury-card border border-luxury-gold/30 shadow-luxury overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-luxury-gold/10 blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          {/* Avatar */}
          <div className="relative w-16 h-16 rounded-2xl bg-luxury-dark border-2 border-luxury-gold/40 flex items-center justify-center text-luxury-gold overflow-hidden shadow-md">
            {telegramUser?.photo_url ? (
              <Image src={telegramUser.photo_url} alt={userName} fill className="object-cover" />
            ) : (
              <span className="font-serif font-black text-2xl text-luxury-gold">
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* User info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-white font-serif truncate">
              {userName}
            </h2>
            <span className="text-xs text-[#8E9F97] block truncate">
              {usernameDisplay}
            </span>

            {/* Premium Badge */}
            <div className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-luxury-gold to-[#f0ce78] text-[#091310] text-[10px] font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-2.5 h-2.5 fill-[#091310]" />
              VIP Premium Member
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/10 text-center">
          <div 
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('orders');
            }}
            className="p-2 rounded-xl bg-black/30 cursor-pointer hover:bg-black/40 transition"
          >
            <span className="text-sm font-bold text-white font-mono block">{orders.length}</span>
            <span className="text-[10px] text-[#8E9F97]">Buyurtmalar</span>
          </div>

          <div 
            onClick={() => {
              triggerHaptic('light');
              onWishlistClick();
            }}
            className="p-2 rounded-xl bg-black/30 cursor-pointer hover:bg-black/40 transition"
          >
            <span className="text-sm font-bold text-luxury-gold font-mono block">{wishlist.length}</span>
            <span className="text-[10px] text-[#8E9F97]">Sevimlilar</span>
          </div>

          <div 
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('cart');
            }}
            className="p-2 rounded-xl bg-black/30 cursor-pointer hover:bg-black/40 transition"
          >
            <span className="text-sm font-bold text-emerald-400 font-mono block">{cartCount}</span>
            <span className="text-[10px] text-[#8E9F97]">Savatda</span>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="mt-5 space-y-2.5">
        <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider px-1">
          Do‘kon va xizmatlar
        </h3>

        {/* 11 Branches */}
        <div
          onClick={() => {
            triggerHaptic('light');
            onBranchesClick();
          }}
          className="p-3.5 rounded-2xl bg-luxury-card border border-luxury-gold/20 flex items-center justify-between cursor-pointer hover:border-luxury-gold/40 transition active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-luxury-gold/15 text-luxury-gold flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                11 ta Filiallar (Toshkent)
              </span>
              <span className="text-[10px] text-[#8E9F97] block">
                Novza, Golden Life, Yunusobod, Sergeli...
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-luxury-gold" />
        </div>

        {/* Working Hours */}
        <div className="p-3.5 rounded-2xl bg-luxury-card border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 text-luxury-gold flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Ish vaqti</span>
              <span className="text-[10px] text-emerald-400 block font-medium">
                {RAFFINI_INFO.workHours}
              </span>
            </div>
          </div>
        </div>

        {/* Telegram Channel */}
        <a
          href={RAFFINI_INFO.channelUrl}
          target="_blank"
          rel="noreferrer"
          className="p-3.5 rounded-2xl bg-luxury-card border border-white/5 flex items-center justify-between hover:border-[#0088cc]/50 transition block"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0088cc]/15 text-[#29b6f6] flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Rasmiy Telegram kanal</span>
              <span className="text-[10px] text-[#8E9F97] block">
                {RAFFINI_INFO.channel} (7.8K+ obunachi)
              </span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-[#29b6f6]" />
        </a>

        {/* Admin Contact */}
        <a
          href="https://t.me/raffini_uzbekistan"
          target="_blank"
          rel="noreferrer"
          className="p-3.5 rounded-2xl bg-luxury-card border border-white/5 flex items-center justify-between hover:border-luxury-gold/40 transition block"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-luxury-gold/15 text-luxury-gold flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Admin bilan bog‘lanish</span>
              <span className="text-[10px] text-luxury-gold block">
                {RAFFINI_INFO.admin}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white/40" />
        </a>

        {/* Phone Call */}
        <a
          href={`tel:${RAFFINI_INFO.phones[0].replace(/[\s\(\)-]/g, '')}`}
          className="p-3.5 rounded-2xl bg-luxury-card border border-white/5 flex items-center justify-between hover:border-emerald-500/40 transition block"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Do‘kon Call-Markazi</span>
              <span className="text-[10px] text-[#8E9F97] block font-mono">
                {RAFFINI_INFO.phones.join(' • ')}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white/40" />
        </a>
      </div>

      {/* Brand Footer Info */}
      <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/5 text-center text-[10px] text-[#697A72] space-y-1">
        <p className="font-serif font-bold text-white/70 text-xs tracking-wider">
          RAFFINI — WEAR YOUR STYLE
        </p>
        <p>2025-yilda asos solingan • Asoschi: {RAFFINI_INFO.founder}</p>
        <p>Telegram Mini App v1.0.0 • Vercel Webhook Edition</p>
      </div>
    </div>
  );
}

