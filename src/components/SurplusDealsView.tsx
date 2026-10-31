import React from 'react';
import { Sparkles, Clock, Plus, CheckCircle2, Leaf, ArrowRight } from 'lucide-react';
import { SurplusOffer, Product } from '../types';
import { db } from '../services/db';
import { useToast } from './Toast';

interface SurplusDealsViewProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SurplusDealsView: React.FC<SurplusDealsViewProps> = ({
  onSelectProduct,
  onAddToCart,
}) => {
  const { success } = useToast();
  const surplusList = db.getSurplusOffers();
  const allProducts = db.getProducts();

  const handleQuickAdd = (offer: SurplusOffer) => {
    const product = allProducts.find(p => p.id === offer.productId);
    if (product) {
      onAddToCart(product);
      success('Surplus Deal Added', `Added ${offer.cropName} at ${offer.discountPercent}% off to your basket!`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md overflow-hidden">
        <div className="relative max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Kisan Surplus Bachao Initiative (किसान सरप्लस बचाओ)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-display text-white">
            Bumper Harvest Flash Deals in ₹
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            When good weather produces an unexpected bumper crop, our kisans discount the peak-ripe harvest by 20–25% to guarantee zero food waste in the khet. You enjoy fresh country produce at deep savings.
          </p>

          <div className="flex items-center gap-4 pt-1 text-xs text-amber-200 font-semibold">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>100% Grade-A Quality</span>
            </div>
            <div className="flex items-center gap-1">
              <Leaf className="w-4 h-4 text-emerald-300" />
              <span>Zero Mandi Dalal Waste</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {surplusList.map(deal => {
          const product = allProducts.find(p => p.id === deal.productId);
          return (
            <div
              key={deal.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                  <img
                    src={deal.imageUrl}
                    alt={deal.cropName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-extrabold px-3 py-1 rounded-md text-xs shadow-xs">
                    {deal.discountPercent}% OFF · Flash Deal
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Expires in 36h</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                      Grown at {deal.farmName}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 font-serif-display mt-0.5">
                      {deal.cropName}
                    </h3>
                  </div>

                  {/* Pricing Comparison in ₹ */}
                  <div className="flex items-baseline gap-2.5 p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs">
                    <span className="text-2xl font-black text-amber-800 font-mono tabular-nums">
                      ₹{deal.discountedPrice}
                    </span>
                    <span className="text-slate-400 line-through text-sm font-mono tabular-nums">
                      ₹{deal.originalPrice}
                    </span>
                    <span className="text-slate-600 font-medium">per {deal.unit}</span>
                    <span className="ml-auto text-[11px] text-emerald-800 font-bold bg-white border border-emerald-300 px-2 py-0.5 rounded shadow-2xs">
                      {deal.quantityAvailable} {deal.unit} left
                    </span>
                  </div>

                  {/* Why Surplus? */}
                  <div className="space-y-1 text-xs">
                    <span className="text-slate-500 font-semibold">Kisan Harvest Reason:</span>
                    <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      "{deal.reason}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-5 pt-0 flex items-center justify-between gap-3">
                {product && (
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="text-xs text-slate-500 hover:text-emerald-700 font-bold transition-colors"
                  >
                    View Harvest Details
                  </button>
                )}

                <button
                  onClick={() => handleQuickAdd(deal)}
                  className="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs text-xs transition-colors flex items-center gap-1.5 uppercase"
                >
                  <Plus className="w-4 h-4" />
                  <span>Claim Deal · ₹{deal.discountedPrice}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
