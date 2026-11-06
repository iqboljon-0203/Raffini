'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatUZS } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';

interface CartViewProps {
  onCheckout: () => void;
}

export function CartView({ onCheckout }: CartViewProps) {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    discountAmount,
    promoCode,
    applyPromoCode,
    setActiveTab,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(false);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const ok = applyPromoCode(promoInput);
    if (ok) {
      setPromoSuccess(true);
      setPromoError('');
      triggerHaptic('success');
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#1A1F33', '#FAE9D7', '#D8B485'],
        });
      } catch (e) {}
    } else {
      setPromoError('Promokod noto‘g‘ri (Masalan: RAFFINI)');
      setPromoSuccess(false);
      triggerHaptic('error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] px-6 text-center select-none">
        <div className="w-16 h-16 rounded-full bg-[#1A1F33]/5 flex items-center justify-center text-[#1A1F33] mb-4">
          <ShoppingBag className="w-7 h-7 stroke-[1.6]" />
        </div>
        <h2 className="text-lg font-serif font-bold text-[#1A1F33]">
          Savatingiz bo‘sh
        </h2>
        <p className="text-xs text-[#1A1F33]/60 mt-1.5 max-w-xs leading-relaxed font-light">
          Raffini eksklyuziv erkaklar kolleksiyasidan liboslarni tanlang va savatingizga qo‘shing.
        </p>
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('catalog');
          }}
          className="mt-6 px-6 py-3 rounded-full bg-[#1A1F33] text-[#FAE9D7] font-medium text-xs uppercase tracking-wider shadow-sm active:scale-95 transition"
        >
          Katalogga o‘tish
        </button>
      </div>
    );
  }

  const rawTotal = cartTotal + discountAmount;

  return (
    <div className="max-w-md mx-auto px-5 pb-32 pt-2 select-none text-[#1A1F33]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1A1F33]/10">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#1A1F33]">Savat</h1>
          <span className="text-xs text-[#1A1F33]/60">{cart.length} xil mahsulot</span>
        </div>
        <button
          onClick={() => {
            triggerHaptic('light');
            clearCart();
          }}
          className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Tozalash
        </button>
      </div>

      {/* Cart Items List */}
      <div className="divide-y divide-[#1A1F33]/10 mt-1">
        {cart.map((item, idx) => (
          <div
            key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
            className="py-4 flex gap-3.5"
          >
            {/* Image */}
            <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-[#ECE8E1] flex-shrink-0">
              <Image
                src={item.product.images[0] || '/images/logo.png'}
                alt={item.product.title}
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-semibold text-[#1A1F33] line-clamp-1">
                    {item.product.title}
                  </h3>
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      removeFromCart(item.product.id, item.selectedSize, item.selectedColor);
                    }}
                    className="text-[#1A1F33]/40 hover:text-rose-500 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-[#1A1F33]/60">
                  <span className="bg-black/5 px-2 py-0.5 rounded-full font-medium">
                    {item.selectedSize}
                  </span>
                  <span className="truncate max-w-[110px]">{item.selectedColor}</span>
                </div>
              </div>

              {/* Price & Quantity Stepper */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-bold text-[#1A1F33]">
                  {formatUZS(item.product.price * item.quantity)}
                </span>

                <div className="flex items-center gap-2.5 bg-black/5 px-2.5 py-1 rounded-full">
                  <button
                    onClick={() => {
                      triggerHaptic('selection');
                      updateQuantity(
                        item.product.id,
                        item.selectedSize,
                        item.selectedColor,
                        item.quantity - 1
                      );
                    }}
                    className="w-5 h-5 flex items-center justify-center text-[#1A1F33] active:scale-90"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => {
                      triggerHaptic('selection');
                      updateQuantity(
                        item.product.id,
                        item.selectedSize,
                        item.selectedColor,
                        item.quantity + 1
                      );
                    }}
                    className="w-5 h-5 flex items-center justify-center text-[#1A1F33] active:scale-90"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promocode Box */}
      <div className="mt-4 p-3.5 rounded-2xl bg-white border border-[#1A1F33]/10 shadow-sm">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-4 h-4 text-[#1A1F33]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Promokod (masalan: RAFFINI)"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#FBF8F3] border border-[#1A1F33]/10 text-xs font-medium uppercase tracking-wider text-[#1A1F33] placeholder:text-[#1A1F33]/40 focus:outline-none focus:border-[#1A1F33]"
            />
          </div>
          <button
            onClick={handleApplyPromo}
            className="px-4 h-10 rounded-xl bg-[#1A1F33] text-[#FAE9D7] text-xs font-semibold hover:opacity-95 active:scale-95 transition"
          >
            Qo‘llash
          </button>
        </div>

        {promoSuccess && (
          <p className="text-[11px] text-emerald-600 mt-2 font-medium">
            ✓ 10% VIP chegirma muvaffaqiyatli qo‘llandi!
          </p>
        )}
        {promoError && (
          <p className="text-[11px] text-rose-500 mt-2">
            {promoError}
          </p>
        )}
      </div>

      {/* Summary Box */}
      <div className="mt-4 p-4 rounded-2xl bg-white border border-[#1A1F33]/10 space-y-2 text-xs shadow-sm">
        <div className="flex justify-between text-[#1A1F33]/70">
          <span>Oraliq jami</span>
          <span className="font-semibold text-[#1A1F33]">{formatUZS(rawTotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Chegirma (RAFFINI)</span>
            <span>-{formatUZS(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between text-[#1A1F33]/70">
          <span>Yetkazib berish</span>
          <span className="text-emerald-600 font-medium">Bepul</span>
        </div>

        <div className="pt-2 border-t border-[#1A1F33]/10 flex justify-between text-sm font-bold text-[#1A1F33]">
          <span>Jami to‘lov</span>
          <span>{formatUZS(cartTotal)}</span>
        </div>
      </div>

      {/* Checkout CTA */}
      <div className="mt-5">
        <button
          onClick={() => {
            triggerHaptic('medium');
            onCheckout();
          }}
          className="w-full py-4 rounded-full bg-[#1A1F33] text-[#FAE9D7] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition hover:bg-[#252B44]"
        >
          <span>Rasmiylashtirish</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
