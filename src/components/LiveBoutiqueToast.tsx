'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

interface ToastData {
  id: string;
  customer: string;
  product: string;
  branch: string;
  time: string;
  image: string;
}

const RECENT_ACTIVITIES: ToastData[] = [
  {
    id: '1',
    customer: 'Jasur (Chilonzor)',
    product: 'Raffini Premial Qishki Kurtka',
    branch: 'Novza filiali',
    time: '2 daqiqa oldin',
    image: '/images/products/prod_1.jpg',
  },
  {
    id: '2',
    customer: 'Sardor (Yunusobod)',
    product: 'Raffini Tabiiy Teri Poyabzal',
    branch: 'Mega Planet filiali',
    time: '5 daqiqa oldin',
    image: '/images/products/prod_27.jpg',
  },
  {
    id: '3',
    customer: 'Bobur (Sergeli)',
    product: 'Italiya Uslubidagi Kostyum-Shim',
    branch: 'Golden Life filiali',
    time: '8 daqiqa oldin',
    image: '/images/products/prod_76.jpg',
  },
  {
    id: '4',
    customer: 'Ulug‘bek (Toshkent)',
    product: 'Eksklyuziv Ikki Qismli To‘plam',
    branch: 'Kuryer orqali',
    time: '12 daqiqa oldin',
    image: '/images/products/prod_19.jpg',
  },
];

export function LiveBoutiqueToast() {
  const [currentToast, setCurrentToast] = useState<ToastData | null>(null);
  const [toastIndex, setToastIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show first toast after 4 seconds
    const initialTimer = setTimeout(() => {
      setCurrentToast(RECENT_ACTIVITIES[0]);
    }, 4000);

    // Loop through toasts every 22 seconds
    const interval = setInterval(() => {
      if (isDismissed) return;
      setToastIndex((prev) => {
        const next = (prev + 1) % RECENT_ACTIVITIES.length;
        setCurrentToast(RECENT_ACTIVITIES[next]);
        return next;
      });
    }, 22000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  // Auto hide after 5 seconds of displaying
  useEffect(() => {
    if (!currentToast) return;
    const hideTimer = setTimeout(() => {
      setCurrentToast(null);
    }, 5500);

    return () => clearTimeout(hideTimer);
  }, [currentToast]);

  return (
    <div className="fixed bottom-24 left-4 z-30 pointer-events-none select-none max-w-[320px]">
      <AnimatePresence>
        {currentToast && !isDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="pointer-events-auto flex items-center gap-3 p-2.5 pr-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#1A1F33]/15 shadow-[0_8px_25px_rgba(0,0,0,0.12)] text-[#1A1F33]"
          >
            {/* Small Product Thumbnail */}
            <div className="relative w-10 h-12 rounded-xl overflow-hidden bg-[#ECE8E1] flex-shrink-0 border border-black/5">
              <Image
                src={currentToast.image}
                alt={currentToast.product}
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1 text-[10px] text-[#1A1F33]/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium truncate">{currentToast.customer}</span>
                <span>• {currentToast.time}</span>
              </div>
              <h4 className="text-xs font-bold text-[#1A1F33] truncate mt-0.5">
                {currentToast.product}
              </h4>
              <span className="text-[10px] text-[#1A1F33]/50 block">
                {currentToast.branch}
              </span>
            </div>

            {/* Dismiss button */}
            <button
              onClick={() => {
                setCurrentToast(null);
                setIsDismissed(true);
              }}
              className="text-[#1A1F33]/40 hover:text-[#1A1F33] p-1 -mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

