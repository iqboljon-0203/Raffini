'use client';

import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in zoom-in-95 duration-200 select-none">
      <div className="bg-white text-[#1A1F33] w-full max-w-sm rounded-[32px] p-6 text-center shadow-2xl relative overflow-hidden">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-[10px] tracking-widest uppercase font-bold text-[#1A1F33]/50">
          Muvaffaqiyatli qabul qilindi
        </span>
        <h3 className="text-lg font-serif font-bold text-[#1A1F33] mt-1">
          Rahmat, buyurtmangiz olindi!
        </h3>
        <p className="text-xs text-[#1A1F33]/60 mt-1 leading-relaxed">
          Buyurtma kodi: <strong className="text-[#1A1F33] font-mono">#{order.id}</strong>.
          Menejerimiz tez orada bog‘lanadi.
        </p>

        {/* Info card */}
        <div className="my-5 p-3.5 rounded-2xl bg-[#FBF8F3] border border-black/5 text-left text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[#1A1F33]/60">Jami to‘lov:</span>
            <span className="font-bold text-[#1A1F33]">{formatUZS(order.totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#1A1F33]/60">Manzil/Filial:</span>
            <span className="text-[#1A1F33] font-medium truncate max-w-[170px]">
              {order.deliveryType === 'pickup' ? order.branchName : order.address}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#1A1F33]/60">To‘lov usuli:</span>
            <span className="font-semibold text-[#1A1F33] uppercase">{order.paymentMethod}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              triggerHaptic('medium');
              onViewOrders();
            }}
            className="w-full py-3.5 rounded-full bg-[#1A1F33] text-[#FAE9D7] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
          >
            <span>Buyurtmalarni ko‘rish</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-full py-3 rounded-full text-xs font-semibold text-[#1A1F33]/70 hover:bg-black/5 transition"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    </div>
  );
}
