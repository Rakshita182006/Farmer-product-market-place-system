import React, { useState, useMemo } from 'react';
import { Search, Star, Leaf, Plus, Minus, Check, MapPin, Clock, Sparkles, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';
import { Product, ProductCategory, FarmerProfile } from '../types';
import { db, ASSET_IMAGES } from '../services/db';

interface MarketplaceProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewFarmerProfile: (farmerId: string) => void;
  setActiveView: (view: string) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  onSelectProduct,
  onAddToCart,
  onViewFarmerProfile,
  setActiveView,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [surplusOnly, setSurplusOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'freshness' | 'price-asc' | 'price-desc' | 'rating'>('freshness');

  const products = db.getProducts();
  const cart = db.getCart();

  const categories: { label: ProductCategory | 'All'; icon: string; hindi: string }[] = [
    { label: 'All', icon: '🧺', hindi: 'सभी' },
    { label: 'Fresh Vegetables', icon: '🥦', hindi: 'सब्जियां' },
    { label: 'Farm Fresh Fruits', icon: '🍎', hindi: 'ताज़ा फल' },
    { label: 'A2 Dairy & Ghee', icon: '🥛', hindi: 'देशी दूध-घी' },
    { label: 'Pure Raw Honey', icon: '🍯', hindi: 'शुद्ध शहद' },
    { label: 'Herbs & Microgreens', icon: '🌿', hindi: 'साग व धनिया' },
    { label: 'Organic Dal & Millets', icon: '🌾', hindi: 'दाल व मिलेट्स' },
  ];

  const getProductCartCount = (productId: string) => {
    const item = cart.find(c => c.productId === productId);
    return item ? item.quantity : 0;
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = p.title.toLowerCase().includes(q) || (p.hindiTitle && p.hindiTitle.toLowerCase().includes(q));
          const matchesFarm = p.farmName.toLowerCase().includes(q);
          const matchesCategory = p.category.toLowerCase().includes(q);
          if (!matchesTitle && !matchesFarm && !matchesCategory) return false;
        }

        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (organicOnly && !p.isOrganic) return false;
        if (surplusOnly && !p.isSurplus) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'freshness') {
          return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
        }
        if (sortBy === 'price-asc') {
          const priceA = a.isSurplus && a.surplusDiscountPercent ? a.price * (1 - a.surplusDiscountPercent / 100) : a.price;
          const priceB = b.isSurplus && b.surplusDiscountPercent ? b.price * (1 - b.surplusDiscountPercent / 100) : b.price;
          return priceA - priceB;
        }
        if (sortBy === 'price-desc') {
          const priceA = a.isSurplus && a.surplusDiscountPercent ? a.price * (1 - a.surplusDiscountPercent / 100) : a.price;
          const priceB = b.isSurplus && b.surplusDiscountPercent ? b.price * (1 - b.surplusDiscountPercent / 100) : b.price;
          return priceB - priceA;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        return 0;
      });
  }, [products, searchQuery, selectedCategory, organicOnly, surplusOnly, sortBy]);

  return (
    <div className="space-y-8 pb-16">
      {/* Swiggy / Zomato Style Promotional Harvest Hero */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-800 via-emerald-700 to-amber-700 text-white shadow-md p-6 sm:p-10">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>Morning Harvest Window · Cut fresh at 5:00 AM</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-display leading-tight text-white">
            Pure Desi Harvest Delivered Fast. <br className="hidden sm:inline" />
            <span className="text-amber-300">85% Goes Straight to Our Kisans.</span>
          </h1>

          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-xl">
            Skip industrial mandi dalals and cold-storage chemicals. Order freshly picked vegetables, mountain apples, raw honeycomb, and whole A2 milk delivered to your kitchen in ₹.
          </p>

          {/* Quick trust metrics */}
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-emerald-100">
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
              <span className="text-amber-300 font-bold">⚡ 35-45 Mins</span>
              <span>Cluster Delivery</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
              <span className="text-emerald-300 font-bold">₹0 Middleman Cut</span>
              <span>Direct Bank Payout</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-xs">
              <span className="text-amber-300 font-bold">100% Desi</span>
              <span>Zero Ethylene Gas</span>
            </div>
          </div>
        </div>

        {/* Decorative corner produce illustration */}
        <div className="absolute -right-6 -bottom-6 w-72 h-72 opacity-20 hidden lg:block pointer-events-none">
          <img src={ASSET_IMAGES.tomatoes} alt="" className="w-full h-full object-cover rounded-full" />
        </div>
      </section>

      {/* Swiggy/Zomato Search & Filter Toolbar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 'Desi Tamatar', 'Shimla Apple', 'A2 Milk', 'Raw Honey'..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 shadow-xs transition-all"
            />
          </div>

          {/* Filter Toggles */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-700 hover:border-emerald-500 shadow-xs">
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={e => setOrganicOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-0"
              />
              <span className="font-semibold text-emerald-800">Jaivik / Organic Only</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap bg-white border border-amber-200 px-3 py-2 rounded-xl text-amber-800 hover:border-amber-400 shadow-xs">
              <input
                type="checkbox"
                checked={surplusOnly}
                onChange={e => setSurplusOnly(e.target.checked)}
                className="rounded text-amber-600 focus:ring-0"
              />
              <span className="font-semibold text-amber-700">Surplus Flash Deals</span>
            </label>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:border-emerald-600 shadow-xs text-xs"
            >
              <option value="freshness">Sort: Fresh Pluck</option>
              <option value="price-asc">Price: ₹ Low to High</option>
              <option value="price-desc">Price: ₹ High to Low</option>
              <option value="rating">Top Kisan Rating</option>
            </select>
          </div>
        </div>

        {/* Swiggy / Zomato Food Category Carousel / Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-all whitespace-nowrap shrink-0 border ${
                selectedCategory === cat.label
                  ? 'bg-emerald-700 border-emerald-700 text-white font-bold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-800'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span className="font-semibold">{cat.label}</span>
              <span className="text-[10px] opacity-75">({cat.hindi})</span>
            </button>
          ))}
        </div>
      </section>

      {/* Produce Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <p>
            Showing <strong className="text-slate-800 font-bold tabular-nums">{filteredProducts.length}</strong> farm-fresh harvests in your region
          </p>
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Farms actively harvesting & packing</span>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
            <p className="text-base font-bold text-slate-700">No harvests found matching your criteria</p>
            <p className="text-xs text-slate-500">Try clearing filters or search terms.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setOrganicOnly(false);
                setSurplusOnly(false);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => {
              const effectivePrice = product.isSurplus && product.surplusDiscountPercent
                ? Number((product.price * (1 - product.surplusDiscountPercent / 100)).toFixed(0))
                : product.price;

              const inCartCount = getProductCartCount(product.id);

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                >
                  {/* Image with Swiggy/Zomato style badges */}
                  <div
                    onClick={() => onSelectProduct(product)}
                    className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Delivery Time Badge (Swiggy style) */}
                    <div className="absolute bottom-2.5 left-2.5 bg-slate-900/85 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{product.deliveryEta}</span>
                    </div>

                    {/* Surplus Tag */}
                    {product.isSurplus && product.surplusDiscountPercent && (
                      <div className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded-md text-[11px] shadow-sm">
                        {product.surplusDiscountPercent}% OFF · Surplus Bachao
                      </div>
                    )}

                    {/* Organic Label */}
                    {product.isOrganic && (
                      <div className="absolute top-2.5 right-2.5 bg-white/95 text-emerald-800 font-bold px-2 py-0.5 rounded-md text-[10px] border border-emerald-200 shadow-xs flex items-center gap-1">
                        <Leaf className="w-3 h-3 text-emerald-600" />
                        <span>Jaivik</span>
                      </div>
                    )}

                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                        <span className="text-xs font-bold text-white uppercase tracking-wider px-3 py-1 bg-slate-800 rounded-lg">
                          Today's Harvest Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Farm Source & Rating */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onViewFarmerProfile(product.farmerId);
                          }}
                          className="hover:text-emerald-700 font-medium truncate max-w-[170px] text-left transition-colors"
                        >
                          {product.farmName}
                        </button>
                        <span className="flex items-center gap-1 bg-emerald-700 text-white font-bold text-[10px] px-1.5 py-0.5 rounded">
                          <span>{product.rating}</span>
                          <Star className="w-2.5 h-2.5 fill-white" />
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.title}
                      </h3>

                      {product.hindiTitle && (
                        <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                          {product.hindiTitle}
                        </p>
                      )}

                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-snug">
                        {product.description}
                      </p>
                    </div>

                    {/* Pricing & Swiggy-style ADD button */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-extrabold text-slate-900 font-mono tabular-nums">
                            ₹{effectivePrice}
                          </span>
                          <span className="text-xs text-slate-500">/{product.unit}</span>
                          {product.isSurplus && (
                            <span className="text-[11px] text-slate-400 line-through tabular-nums ml-1">
                              ₹{product.price}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold block">
                          ₹{product.fairPrice.farmerIncomePerUnit.toFixed(0)} to kisan (85%)
                        </span>
                      </div>

                      {/* Swiggy/Zomato style ADD Button */}
                      <div>
                        {inCartCount === 0 ? (
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onAddToCart(product);
                            }}
                            disabled={product.stock <= 0}
                            className="py-1.5 px-5 bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border-2 border-emerald-600 shadow-xs hover:shadow transition-all disabled:opacity-40 flex items-center gap-1 uppercase"
                          >
                            <span>ADD</span>
                            <Plus className="w-3 h-3 text-emerald-700" />
                          </button>
                        ) : (
                          <div className="flex items-center bg-emerald-700 text-white rounded-lg shadow-xs font-bold text-xs">
                            <button
                              onClick={() => {
                                const currentQty = getProductCartCount(product.id);
                                db.updateCartQuantity(product.id, currentQty - 1);
                              }}
                              className="px-2 py-1.5 hover:bg-emerald-800 rounded-l-lg transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 font-mono tabular-nums">{inCartCount}</span>
                            <button
                              onClick={() => {
                                const currentQty = getProductCartCount(product.id);
                                db.updateCartQuantity(product.id, currentQty + 1);
                              }}
                              className="px-2 py-1.5 hover:bg-emerald-800 rounded-r-lg transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Kisan Direct Guarantee */}
      <section className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200/90 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span>85% Mandi-Direct Payout</span>
          </p>
          <h4 className="text-sm font-bold text-slate-800">No Dalals, No Deductions</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            In standard APMC mandis, kisans receive only 18-22%. Through KisanDirect, 85% of your ₹ bill is credited into the farmer's account within 2 hours.
          </p>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>NPOP & PGS India Audited</span>
          </p>
          <h4 className="text-sm font-bold text-slate-800">Jaivik Bharat Standards</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every participating kisan is verified for pesticide-free Jivamrit soil practices and desi cow organic nutrition.
          </p>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Under 12-Hour Harvest</span>
          </p>
          <h4 className="text-sm font-bold text-slate-800">Zero Cold Storage Ripening</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Produce picked at 5 AM reaches your cooking pot by afternoon, delivering peak antioxidants and country flavor.
          </p>
        </div>
      </section>
    </div>
  );
};
