import React from 'react';
import { Leaf, ShieldCheck, Heart, Scale } from 'lucide-react';

export const Footer: React.FC<{ setActiveView: (view: string) => void }> = ({ setActiveView }) => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-emerald-800 tracking-tight font-serif-display">KisanDirect</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              भारत
            </span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">
            Eliminating APMC middleman cuts and commission agents. Empowering verified Indian smallholder farmers with direct-to-consumer digital commerce and fair Rupee remuneration.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
              🌱 NPOP / PGS-India Jaivik Certified
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-bold uppercase tracking-wider text-slate-800 text-[11px]">Kisan Marketplace</p>
          <ul className="space-y-2">
            <li>
              <button onClick={() => setActiveView('marketplace')} className="hover:text-emerald-700 transition-colors">
                Sabzi & Taaza Phal (Fresh Produce)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('farms')} className="hover:text-emerald-700 transition-colors">
                Verified Kisan Farms (Nashik, Shimla, Mandya)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('harvest-calendar')} className="hover:text-emerald-700 transition-colors">
                Rabi & Kharif Harvest Calendar
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView('surplus-deals')} className="hover:text-amber-600 transition-colors font-medium">
                Kisan Surplus Bachao (20–40% Off)
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="font-bold uppercase tracking-wider text-slate-800 text-[11px]">Indian Agri Standards</p>
          <ul className="space-y-2 text-slate-500">
            <li>
              <button onClick={() => setActiveView('fair-price')} className="hover:text-emerald-700 transition-colors font-medium text-slate-700">
                ₹ Direct Kisan Share Calculator
              </button>
            </li>
            <li>
              <span>FSSAI & APMC Quality Benchmarks</span>
            </li>
            <li>
              <span>Refrigerated Electric Van Cold Chain</span>
            </li>
            <li>
              <span>Eco-Friendly Jute & Recycled Paper Totes</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="font-bold uppercase tracking-wider text-slate-800 text-[11px]">The KisanDirect Commitment</p>
          <p className="text-slate-500 leading-relaxed">
            Conventional wholesale Mandi brokers take up to 75% of your food spend. KisanDirect ensures at least <strong className="text-slate-700">₹84 out of every ₹100</strong> goes directly into the farmer's bank account via UPI.
          </p>
          <div className="flex items-center gap-2 text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/80">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>100% Transparent Price Split in ₹</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <p>© {new Date().getFullYear()} KisanDirect Agricultural Cooperative. Direct Farm-to-Fork Platform (India).</p>
        <p className="flex items-center gap-1.5 font-medium text-slate-600">
          <span>Swiggy & Zomato-inspired ultra-fresh agricultural logistics</span>
        </p>
      </div>
    </footer>
  );
};

