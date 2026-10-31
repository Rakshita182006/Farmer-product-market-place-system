import React from 'react';
import { ShoppingBag, User as UserIcon, LogOut, ShieldCheck, Tractor, MapPin, ChevronDown, RefreshCw, Sparkles, Search } from 'lucide-react';
import { User, UserRole } from '../types';
import { auth } from '../services/auth';

interface NavbarProps {
  currentUser: User | null;
  activeView: string;
  setActiveView: (view: string) => void;
  cartCount: number;
  cartTotal: number;
  openCart: () => void;
  openAuthModal: () => void;
  onResetDb: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeView,
  setActiveView,
  cartCount,
  cartTotal,
  openCart,
  openAuthModal,
  onResetDb,
}) => {
  const handlePersonaSwitch = (role: UserRole) => {
    auth.switchPersona(role);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs text-slate-800">
      {/* Top Demo Bar - Distinct Login Personas */}
      <div className="bg-emerald-50 border-b border-emerald-100/80 px-4 py-1.5 text-xs text-emerald-900">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-800 flex items-center gap-1">
              <span>🇮🇳 KisanDirect 3-Role Demo:</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePersonaSwitch('customer')}
                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold transition-all ${
                  currentUser?.role === 'customer'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
                title="Customer Ananya Sharma (Bengaluru)"
              >
                🛒 Consumer (Ananya)
              </button>

              <button
                onClick={() => handlePersonaSwitch('farmer')}
                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold transition-all ${
                  currentUser?.role === 'farmer'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
                title="Kisan Rameshwar Patel (Nashik)"
              >
                👨‍🌾 Kisan (Rameshwar)
              </button>

              <button
                onClick={() => handlePersonaSwitch('admin')}
                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold transition-all ${
                  currentUser?.role === 'admin'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
                title="Mandi Board Director Vikramaditya Rao"
              >
                🏛️ Mandi Admin (Vikram)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-xs">
            <span className="hidden sm:inline">
              Active: <strong className="text-slate-800 font-semibold">{currentUser ? currentUser.name : 'Guest'}</strong>
            </span>
            <button
              onClick={onResetDb}
              title="Reset Database to initial Indian seed"
              className="flex items-center gap-1 text-slate-600 hover:text-emerald-700 transition-colors text-[11px] font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar: Swiggy/Zomato style clean layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Left: Brand & Location */}
        <div className="flex items-center gap-5 shrink-0">
          <button
            onClick={() => setActiveView('marketplace')}
            className="text-left group flex items-baseline gap-1.5 focus:outline-none"
          >
            <span className="text-2xl font-black tracking-tight text-emerald-800 font-serif-display group-hover:text-emerald-700 transition-colors">
              Kisan<span className="text-amber-600">Direct</span>
            </span>
            <span className="hidden md:inline-block text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
              खेत से रसोई
            </span>
          </button>

          {/* Delivery Location Selector (Swiggy / Zomato style) */}
          <div className="hidden lg:flex items-center gap-1 text-xs text-slate-600 border-l border-slate-200 pl-4 py-1">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="text-left">
              <div className="flex items-center gap-1 font-bold text-slate-900 hover:text-emerald-700 cursor-pointer">
                <span>Indiranagar, Bengaluru</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-500 truncate max-w-[200px]">
                Delivering from Malur & Nashik Organic Clusters
              </p>
            </div>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => setActiveView('marketplace')}
            className={`transition-colors hover:text-emerald-700 py-1 ${
              activeView === 'marketplace' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600' : ''
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveView('farms')}
            className={`transition-colors hover:text-emerald-700 py-1 ${
              activeView === 'farms' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600' : ''
            }`}
          >
            Kisans & Farms
          </button>
          <button
            onClick={() => setActiveView('harvest-calendar')}
            className={`transition-colors hover:text-emerald-700 py-1 ${
              activeView === 'harvest-calendar' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600' : ''
            }`}
          >
            Harvest Calendar
          </button>
          <button
            onClick={() => setActiveView('surplus-deals')}
            className={`transition-colors hover:text-amber-600 py-1 flex items-center gap-1 ${
              activeView === 'surplus-deals' ? 'text-amber-600 font-bold border-b-2 border-amber-500' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Surplus Bachao</span>
          </button>
          <button
            onClick={() => setActiveView('fair-price')}
            className={`transition-colors hover:text-emerald-700 py-1 ${
              activeView === 'fair-price' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600' : ''
            }`}
          >
            Mandi vs KisanDirect
          </button>

          {/* Role Views */}
          {currentUser?.role === 'farmer' && (
            <button
              onClick={() => setActiveView('farmer-dashboard')}
              className={`transition-colors hover:text-amber-700 flex items-center gap-1.5 py-1 ${
                activeView === 'farmer-dashboard' ? 'text-amber-700 font-bold border-b-2 border-amber-600' : 'text-amber-800'
              }`}
            >
              <Tractor className="w-4 h-4 text-amber-600" />
              <span>Kisan Portal</span>
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActiveView('admin-dashboard')}
              className={`transition-colors hover:text-purple-700 flex items-center gap-1.5 py-1 ${
                activeView === 'admin-dashboard' ? 'text-purple-700 font-bold border-b-2 border-purple-600' : 'text-purple-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Mandi Board</span>
            </button>
          )}

          {currentUser?.role === 'customer' && (
            <button
              onClick={() => setActiveView('orders')}
              className={`transition-colors hover:text-emerald-700 py-1 ${
                activeView === 'orders' ? 'text-emerald-700 font-bold border-b-2 border-emerald-600' : ''
              }`}
            >
              My Orders
            </button>
          )}
        </nav>

        {/* Right: Cart & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Swiggy/Zomato style Cart Button with item count & ₹ total */}
          <button
            onClick={openCart}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-900 font-extrabold text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="font-mono">
              {cartTotal > 0 ? `₹${cartTotal.toFixed(0)}` : 'Cart'}
            </span>
          </button>

          {/* User Profile */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentUser.role === 'farmer') setActiveView('farmer-dashboard');
                  else if (currentUser.role === 'admin') setActiveView('admin-dashboard');
                  else setActiveView('orders');
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
              >
                <UserIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span className="truncate max-w-[110px]">{currentUser.name.split(' ')[0]}</span>
              </button>
              <button
                onClick={() => auth.logout()}
                title="Log Out"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-300"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center justify-between text-xs font-semibold text-slate-600 overflow-x-auto gap-4">
        <button
          onClick={() => setActiveView('marketplace')}
          className={`whitespace-nowrap ${activeView === 'marketplace' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Market
        </button>
        <button
          onClick={() => setActiveView('farms')}
          className={`whitespace-nowrap ${activeView === 'farms' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Kisans
        </button>
        <button
          onClick={() => setActiveView('harvest-calendar')}
          className={`whitespace-nowrap ${activeView === 'harvest-calendar' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Harvest
        </button>
        <button
          onClick={() => setActiveView('surplus-deals')}
          className={`whitespace-nowrap ${activeView === 'surplus-deals' ? 'text-amber-600 font-bold' : ''}`}
        >
          Surplus
        </button>
        <button
          onClick={() => setActiveView('fair-price')}
          className={`whitespace-nowrap ${activeView === 'fair-price' ? 'text-emerald-700 font-bold' : ''}`}
        >
          Fair Price
        </button>
        {currentUser?.role === 'farmer' && (
          <button onClick={() => setActiveView('farmer-dashboard')} className="text-amber-700 font-bold whitespace-nowrap">
            Kisan Ops
          </button>
        )}
        {currentUser?.role === 'admin' && (
          <button onClick={() => setActiveView('admin-dashboard')} className="text-purple-700 font-bold whitespace-nowrap">
            Mandi Board
          </button>
        )}
        {currentUser?.role === 'customer' && (
          <button onClick={() => setActiveView('orders')} className="text-emerald-700 font-bold whitespace-nowrap">
            Orders
          </button>
        )}
      </div>
    </header>
  );
};
