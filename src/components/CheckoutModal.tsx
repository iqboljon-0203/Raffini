'use client';

import React, { useState } from 'react';
import { X, Building2, Truck, User as UserIcon, Phone } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { RAFFINI_BRANCHES } from '@/data/branches';
import { formatUZS, cn } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';
import { Order } from '@/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (order: Order) => void;
}

export function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { cart, cartTotal, telegramUser, addOrder } = useStore();

  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedBranch, setSelectedBranch] = useState(RAFFINI_BRANCHES[0].name);
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState(
    telegramUser ? `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim() : ''
  );
  const [phone, setPhone] = useState('+998 ');
  const [paymentMethod, setPaymentMethod] = useState<'payme' | 'click' | 'cash'>('click');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Iltimos, ismingizni kiriting');
      return;
    }
    if (phone.trim().length < 9) {
      setError('Iltimos, to‘g‘ri telefon raqam kiriting');
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      setError('Iltimos, yetkazib berish manzilini kiriting');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const newOrder: Order = {
      id: `RF-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      items: cart.map((i) => ({
        productId: i.product.id,
        title: i.product.title,
        size: i.selectedSize,
        color: i.selectedColor,
        quantity: i.quantity,
        price: i.product.price,
        image: i.product.images[0] || '/images/logo.png',
      })),
      totalPrice: cartTotal,
      status: 'pending',
      deliveryType,
      branchName: deliveryType === 'pickup' ? selectedBranch : undefined,
      address: deliveryType === 'delivery' ? address : undefined,
      customerName,
      customerPhone: phone,
      telegramUserId: telegramUser?.id,
      paymentMethod,
      notes,
    };

    try {
      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      }).catch((err) => console.warn('Order API notice:', err));

      addOrder(newOrder);
      triggerHaptic('success');
      onSuccess(newOrder);
    } catch (err) {
      addOrder(newOrder);
      onSuccess(newOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in select-none">
      <div className="bg-white text-[#1A1F33] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/5">
          <div>
            <h2 className="text-base font-serif font-bold text-[#1A1F33]">
              Buyurtmani rasmiylashtirish
            </h2>
            <span className="text-xs text-[#1A1F33]/60">Jami: {formatUZS(cartTotal)}</span>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Delivery Method Tabs */}
          <div>
            <label className="text-xs font-semibold text-[#1A1F33] block mb-2">
              Yetkazish usuli
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setDeliveryType('pickup');
                }}
                className={cn(
                  "p-3 rounded-2xl border flex flex-col items-center text-center transition-all",
                  deliveryType === 'pickup'
                    ? "bg-[#1A1F33] text-[#FAE9D7] border-[#1A1F33] shadow-sm"
                    : "bg-[#FBF8F3] border-[#1A1F33]/15 text-[#1A1F33]"
                )}
              >
                <Building2 className="w-5 h-5 mb-1" />
                <span className="font-bold text-xs">Filialdan olib ketish</span>
                <span className="text-[10px] opacity-80 mt-0.5">11 filial (bepul)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setDeliveryType('delivery');
                }}
                className={cn(
                  "p-3 rounded-2xl border flex flex-col items-center text-center transition-all",
                  deliveryType === 'delivery'
                    ? "bg-[#1A1F33] text-[#FAE9D7] border-[#1A1F33] shadow-sm"
                    : "bg-[#FBF8F3] border-[#1A1F33]/15 text-[#1A1F33]"
                )}
              >
                <Truck className="w-5 h-5 mb-1" />
                <span className="font-bold text-xs">Kuryer orqali</span>
                <span className="text-[10px] opacity-80 mt-0.5">O‘zbekiston bo‘ylab</span>
              </button>
            </div>
          </div>

          {/* Branch or Address */}
          {deliveryType === 'pickup' ? (
            <div>
              <label className="text-xs font-semibold text-[#1A1F33] block mb-1.5">
                Filialni tanlang (Toshkent):
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full bg-[#FBF8F3] border border-[#1A1F33]/15 rounded-2xl px-3 py-2.5 text-xs text-[#1A1F33] focus:outline-none focus:border-[#1A1F33]"
              >
                {RAFFINI_BRANCHES.map((b) => (
                  <option key={b.id} value={b.name} className="text-[#1A1F33]">
                    {b.name} — {b.landmark} ({b.workHours})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-[#1A1F33] block mb-1.5">
                Yetkazib berish manzili:
              </label>
              <textarea
                placeholder="Shahar, tuman, ko‘cha, xonadon raqami"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full bg-[#FBF8F3] border border-[#1A1F33]/15 rounded-2xl p-3 text-xs text-[#1A1F33] placeholder:text-[#1A1F33]/40 focus:outline-none focus:border-[#1A1F33]"
              />
            </div>
          )}

          {/* Customer info */}
          <div className="space-y-3 pt-2 border-t border-black/5">
            <div>
              <label className="text-xs font-semibold text-[#1A1F33] block mb-1">
                Ismingiz:
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ismingizni kiriting"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#FBF8F3] border border-[#1A1F33]/15 rounded-2xl px-3 py-2.5 pl-9 text-xs text-[#1A1F33] placeholder:text-[#1A1F33]/40 focus:outline-none focus:border-[#1A1F33]"
                />
                <UserIcon className="w-4 h-4 text-[#1A1F33]/50 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1A1F33] block mb-1">
                Telefon raqamingiz:
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FBF8F3] border border-[#1A1F33]/15 rounded-2xl px-3 py-2.5 pl-9 text-xs text-[#1A1F33] placeholder:text-[#1A1F33]/40 focus:outline-none focus:border-[#1A1F33] font-mono"
                />
                <Phone className="w-4 h-4 text-[#1A1F33]/50 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="pt-2 border-t border-black/5">
            <label className="text-xs font-semibold text-[#1A1F33] block mb-2">
              To‘lov usuli
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'click' as const, label: 'Click' },
                { id: 'payme' as const, label: 'Payme' },
                { id: 'cash' as const, label: 'Naqd pul' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    setPaymentMethod(p.id);
                  }}
                  className={cn(
                    "py-2.5 px-2 rounded-2xl border text-center font-bold text-xs transition-all",
                    paymentMethod === p.id
                      ? "bg-[#1A1F33] text-[#FAE9D7] border-[#1A1F33]"
                      : "bg-[#FBF8F3] border-[#1A1F33]/15 text-[#1A1F33]"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Order Notes */}
          <div>
            <label className="text-xs font-semibold text-[#1A1F33] block mb-1">
              Qo‘shimcha izoh (ixtiyoriy):
            </label>
            <input
              type="text"
              placeholder="Masalan: Qo‘ng‘iroq qilib kelinsin"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#FBF8F3] border border-[#1A1F33]/15 rounded-2xl px-3 py-2.5 text-xs text-[#1A1F33] placeholder:text-[#1A1F33]/40 focus:outline-none focus:border-[#1A1F33]"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-[#1A1F33] text-[#FAE9D7] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition disabled:opacity-50 hover:bg-[#252B44]"
            >
              {isSubmitting ? (
                <span>Yuborilmoqda...</span>
              ) : (
                <span>Tasdiqlash • {formatUZS(cartTotal)}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
