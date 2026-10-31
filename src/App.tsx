/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db, initializeDatabase } from './services/db';
import { auth } from './services/auth';
import { User, Product, FarmerProfile, Order } from './types';
import { ToastProvider, useToast } from './components/Toast';
import { Navbar } from './components/Navbar';
import { StageNavigator } from './components/StageNavigator';
import { Marketplace } from './components/Marketplace';
import { FarmsView } from './components/FarmsView';
import { HarvestCalendarView } from './components/HarvestCalendarView';
import { SurplusDealsView } from './components/SurplusDealsView';
import { FairPriceTransparencyView } from './components/FairPriceTransparencyView';
import { FarmerDashboard } from './components/FarmerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { OrdersView } from './components/OrdersView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FarmerProfileView } from './components/FarmerProfileView';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

function MainApp() {
  const { success, info } = useToast();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<string>('marketplace');
  const [cart, setCart] = useState(db.getCart());

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);

  // Sync state with database reactive storage
  useEffect(() => {
    initializeDatabase().then(() => {
      setCurrentUser(db.getCurrentUser());
      setCart(db.getCart());
    });

    const unsubscribe = db.subscribe(() => {
      setCurrentUser(db.getCurrentUser());
      setCart(db.getCart());
    });

    return () => unsubscribe();
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.unitPrice ?? item.product.price) * item.quantity, 0);

  const handleAddToCart = (product: Product, quantity = 1) => {
    try {
      db.addToCart(product, quantity);
    } catch (err: any) {
      info('Notice', err.message);
    }
  };

  const handleResetDb = () => {
    if (confirm('Reset KisanDirect database back to pristine initial Indian farm seed?')) {
      db.resetDatabase();
      success('Database Reset', 'Fresh Indian harvest records, verified kisans, and ₹ pricing restored.');
      setActiveView('marketplace');
    }
  };

  const selectedFarmer = selectedFarmerId ? db.getFarmerById(selectedFarmerId) || null : null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* 8-Stage Interactive Navigator Header */}
      <StageNavigator
        activeView={activeView}
        setActiveView={setActiveView}
        openAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Top Navigation conforming to Swiggy/Zomato style with Indian personas */}
      <Navbar
        currentUser={currentUser}
        activeView={activeView}
        setActiveView={setActiveView}
        cartCount={totalCartCount}
        cartTotal={cartTotal}
        openCart={() => setIsCartOpen(true)}
        openAuthModal={() => setIsAuthModalOpen(true)}
        onResetDb={handleResetDb}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 w-full">
        {activeView === 'marketplace' && (
          <Marketplace
            onSelectProduct={setSelectedProduct}
            onAddToCart={handleAddToCart}
            onViewFarmerProfile={setSelectedFarmerId}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'farms' && (
          <FarmsView
            onViewFarmerProfile={setSelectedFarmerId}
          />
        )}

        {activeView === 'harvest-calendar' && (
          <HarvestCalendarView
            currentUser={currentUser}
            onBrowseMarketplace={() => setActiveView('marketplace')}
          />
        )}

        {activeView === 'surplus-deals' && (
          <SurplusDealsView
            onSelectProduct={setSelectedProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeView === 'fair-price' && (
          <FairPriceTransparencyView
            onBrowseMarketplace={() => setActiveView('marketplace')}
          />
        )}

        {activeView === 'orders' && (
          <OrdersView
            currentUser={currentUser}
            onBrowseMarketplace={() => setActiveView('marketplace')}
          />
        )}

        {activeView === 'farmer-dashboard' && (
          currentUser?.role === 'farmer' ? (
            <FarmerDashboard
              currentUser={currentUser}
              onOpenProductModal={() => {}}
            />
          ) : (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 max-w-xl mx-auto my-12">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto text-xl">
                🚜
              </div>
              <h2 className="text-xl font-bold text-slate-900">Kisan Producer Portal Access Required</h2>
              <p className="text-sm text-slate-600">
                You are currently signed in as a <span className="font-semibold text-slate-800">{currentUser?.role || 'Guest'}</span>. Switch to the Kisan Producer persona (<strong className="text-emerald-700">Rameshwar Patel - Nashik</strong>) in the top demo banner to manage crops, harvest yields, and live delivery orders.
              </p>
              <button
                onClick={() => auth.switchPersona('farmer')}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
              >
                Switch to Kisan Producer (Rameshwar Patel)
              </button>
            </div>
          )
        )}

        {activeView === 'admin-dashboard' && (
          currentUser?.role === 'admin' ? (
            <AdminDashboard
              currentUser={currentUser}
              onViewFarmerProfile={setSelectedFarmerId}
            />
          ) : (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 max-w-xl mx-auto my-12">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto text-xl">
                ⚖️
              </div>
              <h2 className="text-xl font-bold text-slate-900">Mandi Admin Console Access Required</h2>
              <p className="text-sm text-slate-600">
                You are currently signed in as a <span className="font-semibold text-slate-800">{currentUser?.role || 'Guest'}</span>. Switch to the Mandi Board Admin persona (<strong className="text-blue-700">Vikram Deshmukh - APMC Pune</strong>) in the top demo banner to review fair-price MSP compliance and farm certifications.
              </p>
              <button
                onClick={() => auth.switchPersona('admin')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
              >
                Switch to Mandi Admin (Vikram Deshmukh)
              </button>
            </div>
          )
        )}
      </main>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onViewFarmerProfile={(id) => {
            setSelectedProduct(null);
            setSelectedFarmerId(id);
          }}
          currentUser={currentUser}
        />
      )}

      {/* Farmer Profile Modal */}
      {selectedFarmer && (
        <FarmerProfileView
          farmer={selectedFarmer}
          onClose={() => setSelectedFarmerId(null)}
          onSelectProduct={setSelectedProduct}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        currentUser={currentUser}
        onOrderCompleted={() => {
          setActiveView('orders');
        }}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Anti-Slop Clean Footer */}
      <Footer setActiveView={setActiveView} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
