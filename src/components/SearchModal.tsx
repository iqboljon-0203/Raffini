'use client';

import React, { useState } from 'react';
import { X, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { RAFFINI_PRODUCTS, CATEGORIES } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { triggerHaptic } from '@/lib/telegram';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { setSelectedProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');

  if (!isOpen) return null;

  let filtered = RAFFINI_PRODUCTS.filter((p) => {
    const matchesTerm =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.branch.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat =
      selectedCategory === 'Barchasi' || p.category === selectedCategory;

    return matchesTerm && matchesCat;
  });

  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#07100D] overflow-y-auto animate-in fade-in">
      {/* Top Search bar */}
      <div className="sticky top-0 z-30 p-4 bg-[#091310] border-b border-white/10">
        <div className="max-w-md mx-auto flex items-center gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              autoFocus
              placeholder="Kurtka, kostyum, poyabzal, shim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-luxury-card border border-luxury-gold/30 rounded-xl px-3 py-2.5 pl-9 text-xs text-white placeholder:text-[#5E6E67] focus:outline-none focus:border-luxury-gold"
            />
            <Search className="w-4 h-4 text-luxury-gold absolute left-3 top-3" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-white/50 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-luxury-card border border-white/10 flex items-center justify-center text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories scroll */}
        <div className="max-w-md mx-auto flex gap-1.5 mt-3 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                triggerHaptic('selection');
                setSelectedCategory(cat);
              }}
              className={cn(
                "px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition border",
                selectedCategory === cat
                  ? "bg-luxury-gold text-[#091310] border-luxury-gold font-bold shadow-sm"
                  : "bg-luxury-card text-[#8E9F97] border-white/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="max-w-md mx-auto flex items-center justify-between mt-2.5 text-[11px] text-[#7A8A82]">
          <span>{filtered.length} ta mahsulot topildi</span>
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3 h-3 text-luxury-gold" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-luxury-gold font-medium focus:outline-none cursor-pointer"
            >
              <option value="default" className="bg-[#0b1713]">Saralash: Standart</option>
              <option value="price-asc" className="bg-[#0b1713]">Narx: Arzonroq</option>
              <option value="price-desc" className="bg-[#0b1713]">Narx: Qimmatroq</option>
              <option value="rating" className="bg-[#0b1713]">Reyting: Yuqori</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results grid */}
      <div className="max-w-md mx-auto w-full p-4 pb-20">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-xs text-[#8E9F97]">
            <p>Qidiruvingiz bo‘yicha mahsulot topilmadi.</p>
            <p className="text-[10px] text-[#63736B] mt-1">Boshqa so‘z bilan qidirib ko‘ring.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={() => {
                  onClose();
                  setSelectedProduct(product);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

