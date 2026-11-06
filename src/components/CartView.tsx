'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
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
    } else {
      setPromoError('Promokod yaroqsiz! (Masalan: RAFFINI)');
      setPromoSuccess(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-luxury-card border border-luxury-gold/25 flex items-center justify-center text-luxury-gold mb-4 shadow-luxury">
          <ShoppingBag className="w-10 h-10 opacity-70" />
        </div>
        <h2 className="text-xl font-serif font-bold text-white">Savatingiz bo‘sh</h2>
        <p className="text-xs text-[#8E9F97] mt-2 max-w-xs leading-relaxed">
          Raffini yangi erkaklar kolleksiyasidan o‘zingizga yoqqan liboslarni tanlang va savatga qo‘shing.
        </p>
        <button
          onClick={() => {
            triggerHaptic('light');
            setActiveTab('catalog');
          }}
          className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-luxury-gold to-[#f0ce78] text-[#091310] font-bold text-xs uppercase tracking-wider shadow-gold-glow"
        >
          Katalogni ko‘rish
        </button>
      </div>
    );
  }

  const rawTotal = cartTotal + discountAmount;

  return (
    <div className="max-w-md mx-auto px-4 pb-36 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div>
          <h1 className="text-lg font-serif font-bold text-white">Savat</h1>
          <span className="text-[11px] text-luxury-gold">{cart.length} xil mahsulot</span>
        </div>
        <button
          onClick={() => {
            triggerHaptic('light');
            clearCart();
          }}
          className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Tozalash
        </button>
      </div>

      {/* Cart Items List */}
      <div className="divide-y divide-white/5 mt-2">
        {cart.map((item, idx) => (
          <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`} className="py-3.5 flex gap-3">
            {/* Image */}
            <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#0d1814] border border-white/10 flex-shrink-0">
              <Image
                src={item.product.images[0] || '/images/logo.png'}
                alt={item.product.title}
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xs font-semibold text-white line-clamp-1">
                    {item.product.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-luxury-card px-2 py-0.5 rounded border border-luxury-gold/20 text-luxury-gold font-bold">
                      {item.selectedSize}
                    </span>
                    <span className="text-[10px] text-[#8E9F97] truncate max-w-[110px]">
                      {item.selectedColor}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                  className="text-[#6D7D76] hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Price & Quantity Controls */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-bold text-luxury-gold">
                  {formatUZS(item.product.price * item.quantity)}
                </span>

                <div className="flex items-center bg-luxury-card border border-luxury-gold/20 rounded-lg px-1.5 h-7">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)
                    }
                    className="w-5 h-5 flex items-center justify-center text-luxury-gold"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)
                    }
                    className="w-5 h-5 flex items-center justify-center text-luxury-gold"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promocode Block */}
      <div className="mt-5 p-3.5 rounded-2xl bg-luxury-card/60 border border-luxury-gold/20">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-3.5 h-3.5 text-luxury-gold" />
          <span className="text-xs font-semibold text-white">Promokod bormi?</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Masalan: RAFFINI"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            className="flex-1 bg-[#091310] border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder:normal-case placeholder:text-[#5E6E67] focus:outline-none focus:border-luxury-gold"
          />
          <button
            onClick={handleApplyPromo}
            className="px-4 py-2 rounded-xl bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/40 text-xs font-bold hover:bg-luxury-gold hover:text-[#091310] transition"
          >
            Qo‘llash
          </button>
        </div>
        {promoSuccess && (
          <p className="text-[11px] text-emerald-400 mt-1.5 font-medium">
            ✓ Promokod faollashtirildi! 10% chegirma berildi.
          </p>
        )}
        {promoError && (
          <p className="text-[11px] text-rose-400 mt-1.5">
            {promoError}
          </p>
        )}
      </div>

      {/* Order Summary */}
      <div className="mt-4 p-4 rounded-2xl bg-luxury-card border border-white/5 space-y-2.5 text-xs">
        <div className="flex justify-between text-[#8E9F97]">
          <span>Mahsulotlar narxi:</span>
          <span className="text-white font-medium">{formatUZS(rawTotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-400">
            <span>Chegirma ({promoCode}):</span>
            <span className="font-semibold">-{formatUZS(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-[#8E9F97]">
          <span>Yetkazib berish (Toshkent):</span>
          <span className="text-emerald-400 font-medium">Bepul (Filial/Kuryer)</span>
        </div>
        <div className="pt-2.5 border-t border-white/10 flex justify-between items-baseline">
          <span className="text-sm font-bold text-white font-serif">Jami to‘lov:</span>
          <span className="text-base font-black text-luxury-gold font-serif">
            {formatUZS(cartTotal)}
          </span>
        </div>
      </div>

      {/* Trust banner */}
      <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-[#788880]">
        <ShieldCheck className="w-3.5 h-3.5 text-luxury-gold" />
        <span>100% original Raffini brend mahsulotlari</span>
      </div>

      {/* Sticky Checkout CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-[#091310]/95 backdrop-blur-md border-t border-luxury-gold/20 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => {
              triggerHaptic('medium');
              onCheckout();
            }}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-luxury-gold to-[#f0ce78] text-[#091310] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition"
          >
            <span>Rasmiylashtirish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

