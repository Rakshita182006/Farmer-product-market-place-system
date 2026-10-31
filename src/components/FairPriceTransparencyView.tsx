import React, { useState } from 'react';
import { Scale, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

export const FairPriceTransparencyView: React.FC<{ onBrowseMarketplace: () => void }> = ({
  onBrowseMarketplace,
}) => {
  const [samplePrice, setSamplePrice] = useState<number>(45);
  const [selectedCrop, setSelectedCrop] = useState('Desi Organic Tomatoes');

  const cropPresets = [
    { name: 'Desi Organic Tomatoes', price: 42, unit: 'kg' },
    { name: 'Himachal Crisp Apples', price: 150, unit: 'kg' },
    { name: 'Raw Forest Multiflora Honey', price: 360, unit: 'jar' },
    { name: 'A2 Gir Cow Fresh Milk', price: 76, unit: 'L' },
  ];

  // KisanDirect Model
  const farmerSharePercent = 85;
  const packagingPercent = 4;
  const logisticsPercent = 6;
  const platformPercent = 5;

  const farmerAmount = Number((samplePrice * (farmerSharePercent / 100)).toFixed(0));
  const packagingAmount = Number((samplePrice * (packagingPercent / 100)).toFixed(0));
  const logisticsAmount = Number((samplePrice * (logisticsPercent / 100)).toFixed(0));
  const platformAmount = Number((samplePrice * (platformPercent / 100)).toFixed(0));

  // Conventional APMC Mandi Model
  const conventionalFarmerPercent = 18;
  const conventionalFarmerAmount = Number((samplePrice * (conventionalFarmerPercent / 100)).toFixed(0));
  const conventionalMiddlemenAmount = Number((samplePrice - conventionalFarmerAmount).toFixed(0));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
          <Scale className="w-3.5 h-3.5 text-emerald-700" />
          <span>Economic Transparency in Indian Agriculture</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-display text-slate-900 tracking-tight">
          Where Does Your Food Rupee (₹) Go?
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          For decades, the APMC Mandi system has left Indian kisans with only 15–20 paise on the rupee, while urban consumers pay sky-high prices. KisanDirect cuts out every middleman.
        </p>
      </div>

      {/* Simulator Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Interactive Mandi vs KisanDirect Calculator</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an Indian crop or drag the ₹ slider to see real farmer payout.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {cropPresets.map(crop => (
              <button
                key={crop.name}
                onClick={() => {
                  setSelectedCrop(crop.name);
                  setSamplePrice(crop.price);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap border ${
                  selectedCrop === crop.name
                    ? 'bg-emerald-700 border-emerald-700 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-400'
                }`}
              >
                {crop.name} (₹{crop.price})
              </button>
            ))}
          </div>
        </div>

        {/* Slider in ₹ */}
        <div className="space-y-2 max-w-lg">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 font-semibold">Retail Price per Unit:</span>
            <span className="text-xl font-black font-mono text-emerald-800 tabular-nums">
              ₹{samplePrice}
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="500"
            step="5"
            value={samplePrice}
            onChange={e => setSamplePrice(Number(e.target.value))}
            className="w-full accent-emerald-700 bg-slate-200 rounded-lg cursor-pointer h-2"
          />
        </div>

        {/* Side-by-Side Model Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left: KisanDirect Model */}
          <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                  KisanDirect Direct Model
                </span>
                <span className="text-xs font-mono font-bold text-emerald-900 bg-white border border-emerald-300 px-2 py-0.5 rounded shadow-2xs">
                  Kisan Retains 85%
                </span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                <p className="text-xs text-slate-500 font-semibold">Direct Farmer Bank Payout</p>
                <p className="text-3xl font-black font-mono text-emerald-800 tabular-nums mt-1">
                  ₹{farmerAmount}
                </p>
                <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                  Direct transfer within 2 hours. Funds Jivamrit preparation, seeds, and living wages.
                </p>
              </div>

              {/* Progress bars */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-slate-700 mb-1 font-semibold">
                    <span>Direct Kisan Income ({farmerSharePercent}%)</span>
                    <span className="font-mono text-emerald-800 font-bold">₹{farmerAmount}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${farmerSharePercent}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Cold-Chain Eco Van ({logisticsPercent}%)</span>
                    <span className="font-mono">₹{logisticsAmount}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full" style={{ width: `${logisticsPercent}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Jute Eco Packaging ({packagingPercent}%)</span>
                    <span className="font-mono">₹{packagingAmount}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${packagingPercent}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Platform Operations ({platformPercent}%)</span>
                    <span className="font-mono">₹{platformAmount}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-slate-400 h-full rounded-full" style={{ width: `${platformPercent}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Direct Bank Settlement via UPI / RTGS immediately upon delivery.</span>
            </div>
          </div>

          {/* Right: Traditional APMC Mandi Model */}
          <div className="p-5 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-rose-800">
                  Traditional APMC Mandi System
                </span>
                <span className="text-xs font-mono font-bold text-rose-900 bg-white border border-rose-300 px-2 py-0.5 rounded shadow-2xs">
                  Farmer Gets Only 18%
                </span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-rose-200 shadow-2xs">
                <p className="text-xs text-slate-500 font-semibold">Farmer Realisation</p>
                <p className="text-3xl font-black font-mono text-rose-700 tabular-nums mt-1">
                  ₹{conventionalFarmerAmount}
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Remaining <strong className="text-rose-700 font-bold">₹{conventionalMiddlemenAmount} (82%)</strong> is siphoned off by commission agents, dalals, and multi-tier traders.
                </p>
              </div>

              {/* Progress bars */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span>Supermarket & Retail Markup (35%)</span>
                    <span className="font-mono text-rose-700 font-bold">₹{(samplePrice * 0.35).toFixed(0)}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '35%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span>Mandi Dalal Commission (28%)</span>
                    <span className="font-mono text-rose-700 font-bold">₹{(samplePrice * 0.28).toFixed(0)}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: '28%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Long-Distance Freight & Spoilage (19%)</span>
                    <span className="font-mono">₹{(samplePrice * 0.19).toFixed(0)}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: '19%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>Farmer Realisation (18%)</span>
                    <span className="font-mono font-bold text-slate-800">₹{conventionalFarmerAmount}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-slate-500 h-full rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-rose-200 text-xs text-rose-800 font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Causes chronic agricultural debt and distress selling at mandis.</span>
            </div>
          </div>
        </div>

        {/* Difference Summary */}
        <div className="p-5 bg-emerald-700 text-white rounded-2xl text-center space-y-2 shadow-xs">
          <p className="text-xs uppercase tracking-wider font-extrabold text-emerald-200">Consumer Direct Benefit</p>
          <p className="text-lg sm:text-xl font-bold font-serif-display">
            On every purchase of ₹{samplePrice}, you put <span className="text-amber-300 font-extrabold">+₹{farmerAmount - conventionalFarmerAmount} extra directly into the Kisan's family account</span>.
          </p>
          <div className="pt-1">
            <button
              onClick={onBrowseMarketplace}
              className="px-6 py-2 bg-white text-emerald-900 font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-50 transition-colors inline-flex items-center gap-2"
            >
              <span>Order Directly from Verified Kisans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
