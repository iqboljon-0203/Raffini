'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { initTelegramApp } from '@/lib/telegram';
import { Navbar } from '@/components/Navbar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { HomeView } from '@/components/HomeView';
import { CatalogView } from '@/components/CatalogView';
import { CartView } from '@/components/CartView';
import { OrdersView } from '@/components/OrdersView';
import { ProfileView } from '@/components/ProfileView';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';
import { BranchesModal } from '@/components/BranchesModal';
import { WishlistModal } from '@/components/WishlistModal';
import { SearchModal } from '@/components/SearchModal';
import { SplashView } from '@/components/SplashView';
import { Order } from '@/types';

export default function MainPage() {
  const { activeTab, setActiveTab, selectedProduct, setSelectedProduct } = useStore();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isBranchesOpen, setIsBranchesOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    initTelegramApp();
  }, []);

  return (
    <main className="min-h-screen bg-[#FBF8F3] text-[#1A1F33] selection:bg-[#1A1F33] selection:text-[#FAE9D7] relative font-sans">
      {/* Onboarding Splash (Reference Screen 1) */}
      <SplashView onStart={() => setActiveTab('home')} />

      {/* Top Navbar (Reference Screen 2) */}
      <Navbar
        onSearchClick={() => setIsSearchOpen(true)}
        onBranchesClick={() => setIsBranchesOpen(true)}
      />

      {/* Main Tab View */}
      <div className="pt-1">
        {activeTab === 'home' && (
          <HomeView
            onSearchClick={() => setIsSearchOpen(true)}
            onBranchesClick={() => setIsBranchesOpen(true)}
          />
        )}
        {activeTab === 'catalog' && <CatalogView />}
        {activeTab === 'cart' && (
          <CartView onCheckout={() => setIsCheckoutOpen(true)} />
        )}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'profile' && (
          <ProfileView
            onBranchesClick={() => setIsBranchesOpen(true)}
            onWishlistClick={() => setIsWishlistOpen(true)}
          />
        )}
      </div>

      {/* Floating Organic Bottom Nav Bar (Reference Screen 2) */}
      <BottomNavigation onWishlistClick={() => setIsWishlistOpen(true)} />

      {/* Modals & Sheets (Reference Screen 3) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={(order) => {
          setIsCheckoutOpen(false);
          setCompletedOrder(order);
        }}
      />

      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        onViewOrders={() => {
          setCompletedOrder(null);
          setActiveTab('orders');
        }}
      />

      <BranchesModal
        isOpen={isBranchesOpen}
        onClose={() => setIsBranchesOpen(false)}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </main>
  );
}
