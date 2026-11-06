'use client';

import React from 'react';
import { CheckCircle2, Package, ArrowRight, MessageCircle } from 'lucide-react';
import { Order } from '@/types';
import { formatUZS } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onViewOrders: () => void;
}

export function OrderSuccessModal({ order, onClose, onViewOrders }: OrderSuccessModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
      <div className="bg-[#0b1713] border border-luxury-gold/40 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-luxury-gold/20 blur-2xl pointer-events-none" />

        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-4 shadow-lg animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-[10px] tracking-widest uppercase font-extrabold text-luxury-gold">
          Muvaffaqiyatli qabul qilindi
        </span>
        <h3 className="text-xl font-serif font-bold text-white mt-1">
          Rahmat, buyurtmangiz olindi!
        </h3>
        <p className="text-xs text-[#8E9F97] mt-1.5 leading-relaxed">
          Buyurtma raqami: <strong className="text-white font-mono">#{order.id}</strong>.
          Operatorlarimiz tez orada tasdiqlash uchun bog‘lanishadi.
        </p>

        {/* Info card */}
        <div className="my-5 p-3.5 rounded-2xl bg-luxury-card/70 border border-white/5 text-left text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[#8E9F97]">Jami to‘lov:</span>
            <span className="font-bold text-luxury-gold">{formatUZS(order.totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8E9F97]">Yetkazish:</span>
            <span className="text-white truncate max-w-[170px]">
              {order.deliveryType === 'pickup' ? order.branchName : order.address}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8E9F97]">To‘lov turi:</span>
            <span className="font-semibold text-white uppercase">{order.paymentMethod}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              triggerHaptic('light');
              onViewOrders();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-luxury-gold to-[#f0ce78] text-[#091310] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-gold-glow hover:brightness-105 transition"
          >
            <span>Buyurtmani kuzatish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <a
            href="https://t.me/raffini_uzbekistan"
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-white/10 transition"
          >
            <MessageCircle className="w-3.5 h-3.5 text-luxury-gold" />
            Admin bilan bog‘lanish
          </a>
        </div>
      </div>
    </div>
  );
}

