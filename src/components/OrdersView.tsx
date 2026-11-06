'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Clock, CheckCircle2, Truck, Package, MessageCircle, MapPin, ChevronRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatUZS, cn } from '@/lib/utils';
import { triggerHaptic } from '@/lib/telegram';
import { Order } from '@/types';

export function OrdersView() {
  const { orders, setActiveTab } = useStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'shipping' | 'delivered'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return o.status === 'pending' || o.status === 'confirmed';
    if (filter === 'shipping') return o.status === 'shipping';
    if (filter === 'delivered') return o.status === 'delivered';
    return true;
  });

  return (
    <div className="max-w-md mx-auto px-4 pb-32 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div>
          <h1 className="text-lg font-serif font-bold text-white">Buyurtmalarim</h1>
          <span className="text-[11px] text-luxury-gold">{orders.length} ta buyurtma</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all' as const, label: 'Barchasi' },
          { id: 'pending' as const, label: 'Kutilmoqda' },
          { id: 'shipping' as const, label: 'Yetkazilmoqda' },
          { id: 'delivered' as const, label: 'Yetkazildi' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              triggerHaptic('selection');
              setFilter(tab.id);
            }}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border",
              filter === tab.id
                ? "bg-luxury-gold text-[#091310] border-luxury-gold shadow-gold-glow"
                : "bg-luxury-card text-[#8E9F97] border-white/5 hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <div className="w-16 h-16 rounded-full bg-luxury-card border border-luxury-gold/20 flex items-center justify-center text-luxury-gold mb-3">
            <Package className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="text-sm font-bold text-white font-serif">Hozircha buyurtma yo‘q</h3>
          <p className="text-xs text-[#7A8A82] mt-1 max-w-xs">
            Buyurtma berganingizdan so‘ng uning holatini shu yerda real vaqtda kuzatib borishingiz mumkin.
          </p>
          <button
            onClick={() => setActiveTab('catalog')}
            className="mt-5 px-5 py-2.5 rounded-xl bg-luxury-card border border-luxury-gold/30 text-luxury-gold font-bold text-xs hover:bg-luxury-gold hover:text-[#091310] transition"
          >
            Katalogga o‘tish
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {filteredOrders.map((order) => {
            const isDelivered = order.status === 'delivered';
            const isShipping = order.status === 'shipping';

            return (
              <div
                key={order.id}
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedOrder(order);
                }}
                className="p-4 rounded-2xl bg-luxury-card border border-white/5 hover:border-luxury-gold/30 transition cursor-pointer active:scale-[0.99]"
              >
                {/* Order Top Bar */}
                <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white tracking-wider">
                      #{order.id}
                    </span>
                    <span className="text-[10px] text-[#7A8A82]">
                      {new Date(order.date).toLocaleDateString('uz-UZ', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1",
                      isDelivered && "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
                      isShipping && "bg-blue-500/20 text-blue-400 border border-blue-500/30",
                      !isDelivered && !isShipping && "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    )}
                  >
                    {isDelivered && <CheckCircle2 className="w-3 h-3" />}
                    {isShipping && <Truck className="w-3 h-3" />}
                    {!isDelivered && !isShipping && <Clock className="w-3 h-3" />}
                    {isDelivered
                      ? 'Yetkazildi'
                      : isShipping
                      ? 'Yetkazilmoqda'
                      : 'Qabul qilindi'}
                  </span>
                </div>

                {/* Items preview */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="relative w-12 h-14 rounded-lg overflow-hidden bg-[#0d1814] border border-white/10 flex-shrink-0"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-14 rounded-lg bg-[#091310] border border-white/10 flex items-center justify-center text-[11px] font-bold text-luxury-gold">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#7A8A82] block">Jami summa:</span>
                    <span className="text-xs font-bold text-luxury-gold font-serif">
                      {formatUZS(order.totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Bottom link */}
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/70">
                  <span className="flex items-center gap-1 text-[10px] text-[#8E9F97]">
                    <MapPin className="w-3 h-3 text-luxury-gold" />
                    {order.deliveryType === 'pickup'
                      ? order.branchName || 'Filialdan olib ketish'
                      : 'Kuryer orqali'}
                  </span>
                  <span className="text-luxury-gold flex items-center gap-0.5 text-[11px] font-semibold">
                    Kuzatish <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Tracking Modal Sheet */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in">
          <div className="bg-[#0b1713] border border-luxury-gold/30 w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-5 text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-serif font-bold text-white text-base">
                  Buyurtma #{selectedOrder.id}
                </h3>
                <span className="text-[11px] text-[#8E9F97]">
                  {new Date(selectedOrder.date).toLocaleString('uz-UZ')}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Tracking Progress */}
            <div className="my-5 p-4 rounded-2xl bg-luxury-card/70 border border-luxury-gold/20">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Buyurtma holati
              </h4>
              <div className="space-y-4">
                {[
                  { title: 'Buyurtma qabul qilindi', desc: 'Do‘kon tizimiga kelib tushdi', done: true },
                  { title: 'Menejer tasdiqladi', desc: 'Kiyimlar filialdan tayyorlanmoqda', done: true },
                  { title: 'Yetkazish jarayonida', desc: 'Kuryer yoki filialda kutmoqda', done: selectedOrder.status === 'shipping' || selectedOrder.status === 'delivered' },
                  { title: 'Muvaffaqiyatli topshirildi', desc: 'Mijozga topshirildi', done: selectedOrder.status === 'delivered' },
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5",
                        step.done
                          ? "bg-luxury-gold text-[#091310] shadow-gold-glow"
                          : "bg-white/10 text-white/40"
                      )}
                    >
                      {step.done ? '✓' : idx + 1}
                    </div>
                    <div>
                      <span className={cn("font-bold text-xs block", step.done ? "text-white" : "text-white/40")}>
                        {step.title}
                      </span>
                      <span className="text-[10px] text-[#7A8A82] block">{step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-3.5 rounded-xl bg-luxury-card border border-white/5 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#8E9F97]">Mijoz:</span>
                <span className="font-semibold text-white">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E9F97]">Telefon:</span>
                <span className="font-semibold text-luxury-gold font-mono">{selectedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E9F97]">Yetkazish:</span>
                <span className="font-semibold text-white">
                  {selectedOrder.deliveryType === 'pickup'
                    ? selectedOrder.branchName
                    : selectedOrder.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E9F97]">To‘lov usuli:</span>
                <span className="font-semibold uppercase text-white">{selectedOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Admin support link */}
            <a
              href="https://t.me/raffini_uzbekistan"
              target="_blank"
              rel="noreferrer"
              className="mt-4 w-full py-3 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/40 text-[#29b6f6] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#0088cc]/30 transition"
            >
              <MessageCircle className="w-4 h-4" />
              Telegram Admin bilan bog‘lanish (@raffini_uzbekistan)
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

