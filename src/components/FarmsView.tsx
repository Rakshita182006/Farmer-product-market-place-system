import React from 'react';
import { MapPin, Award, Star, Sprout, ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import { FarmerProfile } from '../types';
import { db } from '../services/db';

interface FarmsViewProps {
  onViewFarmerProfile: (farmerId: string) => void;
}

export const FarmsView: React.FC<FarmsViewProps> = ({
  onViewFarmerProfile,
}) => {
  const farmers = db.getFarmers();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-display text-slate-900">
          Verified Indian Kisans & Natural Orchards
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Explore independent Indian family farmers practicing Subhash Palekar Natural Farming, Desi Cow Jivamrit soil stewardship, and zero-chemical cultivation.
        </p>
      </div>

      {/* Farms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {farmers.map(farmer => {
          const products = db.getProductsByFarmer(farmer.id);

          return (
            <div
              key={farmer.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 w-full bg-slate-100">
                  <img
                    src={farmer.bannerImage}
                    alt={farmer.farmName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute -bottom-4 left-4 flex items-end gap-3">
                    <img
                      src={farmer.avatarImage}
                      alt={farmer.farmName}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md bg-white"
                    />
                    {farmer.isVerified && (
                      <span className="mb-1 text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Kisan
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-7 space-y-2.5">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 font-serif-display">
                      {farmer.farmName}
                    </h3>
                    <p className="text-xs text-emerald-700 font-semibold line-clamp-1 mt-0.5">
                      {farmer.tagline}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      <span>{farmer.city}, {farmer.state} ({farmer.distanceKm} km away)</span>
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {farmer.bio}
                  </p>

                  {/* Certifications preview */}
                  <div className="space-y-1 pt-1">
                    {farmer.certifications.slice(0, 2).map(c => (
                      <div key={c.id} className="text-[11px] text-slate-600 flex items-center gap-1.5 truncate">
                        <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom stats & action */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">ACTIVE HARVESTS</span>
                  <span className="font-extrabold text-slate-900 font-mono">{products.length} crops listed</span>
                </div>
                <button
                  onClick={() => onViewFarmerProfile(farmer.id)}
                  className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-700 hover:text-white border border-emerald-300 text-emerald-800 font-bold rounded-lg transition-colors flex items-center gap-1 text-xs"
                >
                  <span>Khet Story</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
