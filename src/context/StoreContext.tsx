'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order } from '@/types';
import { triggerHaptic, getTelegramUser, TelegramUser } from '@/lib/telegram';
import { Language, translations } from '@/lib/translations';

interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  discountAmount: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  orders: Order[];
  addOrder: (order: Order) => void;
  
  telegramUser: TelegramUser | null;
  activeTab: 'home' | 'catalog' | 'cart' | 'orders' | 'profile';
  setActiveTab: (tab: 'home' | 'catalog' | 'cart' | 'orders' | 'profile') => void;
  
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;

  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['uz']) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [activeTab, setActiveTabState] = useState<'home' | 'catalog' | 'cart' | 'orders' | 'profile'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [language, setLanguageState] = useState<Language>('uz');

  // Load from localStorage & init Telegram
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('raffini_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('raffini_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedOrders = localStorage.getItem('raffini_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedLang = localStorage.getItem('raffini_lang') as Language;
      if (savedLang === 'uz' || savedLang === 'ru') setLanguageState(savedLang);

      const user = getTelegramUser();
      if (user) {
        setTelegramUser(user);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('raffini_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('raffini_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('raffini_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  const setLanguage = (lang: Language) => {
    triggerHaptic('light');
    setLanguageState(lang);
    try {
      localStorage.setItem('raffini_lang', lang);
    } catch (e) {}
  };

  const t = (key: keyof typeof translations['uz']): string => {
    return translations[language][key] || translations['uz'][key] || '';
  };

  const setActiveTab = (tab: 'home' | 'catalog' | 'cart' | 'orders' | 'profile') => {
    triggerHaptic('selection');
    setActiveTabState(tab);
  };

  const addToCart = (product: Product, size: string, color: string, quantity = 1) => {
    triggerHaptic('success');
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.product.id === product.id && i.selectedSize === size && i.selectedColor === color
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, selectedSize: size, selectedColor: color, quantity }];
    });
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    triggerHaptic('light');
    setCart((prev) =>
      prev.filter(
        (i) => !(i.product.id === productId && i.selectedSize === size && i.selectedColor === color)
      )
    );
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    triggerHaptic('selection');
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart((prev) =>
      prev.map((i) => {
        if (i.product.id === productId && i.selectedSize === size && i.selectedColor === color) {
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
    setDiscountPercent(0);
  };

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'RAFFINI' || clean === 'RAFFINI10' || clean === 'VIP') {
      setPromoCode(clean);
      setDiscountPercent(10);
      triggerHaptic('success');
      return true;
    }
    triggerHaptic('error');
    return false;
  };

  const toggleWishlist = (productId: string) => {
    triggerHaptic('medium');
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    clearCart();
  };

  // Calculations
  const rawSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const cartTotal = rawSubtotal - discountAmount;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        discountAmount,
        promoCode,
        applyPromoCode,
        wishlist,
        toggleWishlist,
        isWishlisted,
        orders,
        addOrder,
        telegramUser,
        activeTab,
        setActiveTab,
        selectedProduct,
        setSelectedProduct,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
