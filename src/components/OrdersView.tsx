'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Clock, CheckCircle2, Truck, Package, MessageCircle, MapPin, ChevronRight, X } from 'lucide-react';
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
    <div className="max-w-md mx-auto px-5 pb-32 pt-2 select-none text-[#1A1F33]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1A1F33]/10">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#1A1F33]">Buyurtmalarim</h1>
          <span className="text-xs text-[#1A1F33]/60">{orders.length} ta buyurtma</span>
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
              "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
              filter === tab.id
                ? "bg-[#1A1F33] text-[#FAE9D7] font-semibold"
                : "bg-black/5 text-[#1A1F33]/70 hover:bg-black/10"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center text-[#1A1F33] mb-3">
            <Package className="w-7 h-7 stroke-[1.6]" />
          </div>
          <h3 className="text-sm font-bold text-[#1A1F33] font-serif">Hozircha buyurtma yo‘q</h3>
          <p className="text-xs text-[#1A1F33]/60 mt-1 max-w-xs font-light">
            Buyurtma berganingizdan so‘ng uning holatini shu yerda real vaqtda kuzatib borishingiz mumkin.
          </p>
          <button
            onClick={() => setActiveTab('catalog')}
            className="mt-5 px-5 py-2.5 rounded-full bg-[#1A1F33] text-[#FAE9D7] font-medium text-xs shadow-sm"
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
                className="p-4 rounded-2xl bg-white border border-[#1A1F33]/10 shadow-sm hover:border-[#1A1F33]/30 transition cursor-pointer active:scale-[0.99]"
              >
                {/* Order Top Bar */}
                <div className="flex items-center justify-between pb-2.5 border-b border-black/5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1A1F33]">
                      #{order.id}
                    </span>
                    <span className="text-[11px] text-[#1A1F33]/50">
                      {new Date(order.date).toLocaleDateString('uz-UZ', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                      isDelivered
                        ? "bg-emerald-50 text-emerald-700"
                        : isShipping
                        ? "bg-blue-50 text-blue-700"
                        : "bg-amber-50 text-amber-700"
                    )}
                  >
                    {isDelivered
                      ? 'Yetkazildi'
                      : isShipping
                      ? 'Yetkazilmoqda'
                      : 'Kutilmoqda'}
                  </span>
                </div>

                {/* Items preview */}
                <div className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div
                        key={i}
                        className="relative w-10 h-12 rounded-lg overflow-hidden bg-[#ECE8E1] border border-black/5 flex-shrink-0"
                      >
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-[10px] text-[#1A1F33]/60 font-semibold pl-1">
                        +{order.items.length - 3} ta
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-[#1A1F33] block">
                      {formatUZS(order.totalPrice)}
                    </span>
                    <span className="text-[10px] text-[#1A1F33]/50">
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} ta libos
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px] text-[#1A1F33]/70">
                  <div className="flex items-center gap-1 truncate max-w-[200px]">
                    <MapPin className="w-3 h-3 text-[#1A1F33]/60 flex-shrink-0" />
                    <span className="truncate">
                      {order.branchName || order.address || 'Toshkent'}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[#1A1F33] font-semibold">
                    <span>Kuzatish</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 select-none">
          <div className="bg-white text-[#1A1F33] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-black/5">
              <div>
                <h3 className="font-serif font-bold text-base text-[#1A1F33]">
                  Buyurtma #{selectedOrder.id}
                </h3>
                <span className="text-xs text-[#1A1F33]/60">
                  {new Date(selectedOrder.date).toLocaleString('uz-UZ')}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1F33]/60 hover:bg-black/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Items List */}
              <div className="space-y-2">
                <span className="font-semibold block text-[#1A1F33]">Mahsulotlar:</span>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FBF8F3]">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-black/5 flex-shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="font-semibold text-xs block text-[#1A1F33] line-clamp-1">{item.title}</span>
                        <span className="text-[10px] text-[#1A1F33]/60">
                          {item.size} • {item.color} • {item.quantity} dona
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-[#1A1F33]">{formatUZS(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Info */}
              <div className="p-3.5 rounded-2xl bg-[#FBF8F3] space-y-1.5">
                <span className="font-semibold block text-[#1A1F33]">Yetkazish ma’lumotlari:</span>
                <p className="text-[11px] text-[#1A1F33]/70">
                  <span className="font-medium text-[#1A1F33]">Xaridor:</span> {selectedOrder.customerName} ({selectedOrder.customerPhone})
                </p>
                <p className="text-[11px] text-[#1A1F33]/70">
                  <span className="font-medium text-[#1A1F33]">Manzil/Filial:</span> {selectedOrder.branchName || selectedOrder.address}
                </p>
                <p className="text-[11px] text-[#1A1F33]/70">
                  <span className="font-medium text-[#1A1F33]">To‘lov:</span> {selectedOrder.paymentMethod.toUpperCase()}
                </p>
              </div>

              <div className="pt-2 border-t border-black/5 flex justify-between items-center text-sm font-bold text-[#1A1F33]">
                <span>Jami to‘lov:</span>
                <span>{formatUZS(selectedOrder.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
