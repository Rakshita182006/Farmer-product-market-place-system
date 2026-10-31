import React from 'react';
import { X, Award, MapPin, Calendar, Heart, ShieldCheck, Droplet, Sprout, Star, Phone, Mail, Clock } from 'lucide-react';
import { FarmerProfile, Product } from '../types';
import { db } from '../services/db';

interface FarmerProfileViewProps {
  farmer: FarmerProfile | null;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const FarmerProfileView: React.FC<FarmerProfileViewProps> = ({
  farmer,
  onClose,
  onSelectProduct,
  onAddToCart,
}) => {
  if (!farmer) return null;

  const products = db.getProductsByFarmer(farmer.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl text-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Banner with Close button */}
        <div className="relative h-44 sm:h-56 w-full bg-slate-100 shrink-0">
          <img
            src={farmer.bannerImage}
            alt={farmer.farmName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 p-2 rounded-full transition-colors border border-slate-200 shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Farm Avatar & Badges */}
          <div className="absolute -bottom-6 left-6 flex items-end gap-3.5">
            <img
              src={farmer.avatarImage}
              alt={farmer.farmName}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
            />
            <div className="mb-2 text-white">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold font-serif-display drop-shadow-sm">
                  {farmer.farmName}
                </h2>
                {farmer.isVerified && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-800 font-bold bg-white px-2 py-0.5 rounded shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-200 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{farmer.city}, {farmer.state} ({farmer.distanceKm} km from Indiranagar)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 pt-10 overflow-y-auto space-y-6">
          {/* Bio & Story */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Kisan Soil Story & Natural Stewardship
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {farmer.bio}
            </p>
            {farmer.directStory && (
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 italic leading-relaxed">
                "{farmer.directStory}"
              </div>
            )}
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-slate-500 font-medium flex items-center gap-1 mb-1">
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cultivated Land</span>
              </p>
              <p className="font-bold text-slate-800">{farmer.acreage} Organic Acres</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-slate-500 font-medium flex items-center gap-1 mb-1">
                <Droplet className="w-3.5 h-3.5 text-sky-600" />
                <span>Water Source</span>
              </p>
              <p className="font-bold text-slate-800 truncate">{farmer.waterSource}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-slate-500 font-medium flex items-center gap-1 mb-1">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                <span>Kisan Rating</span>
              </p>
              <p className="font-bold text-slate-800">{farmer.rating} ★ ({farmer.reviewsCount})</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-slate-500 font-medium flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Delivery Route</span>
              </p>
              <p className="font-bold text-slate-800 truncate">{farmer.deliveryTimeEstimate}</p>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Official Agricultural Certifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {farmer.certifications.map(cert => (
                <div
                  key={cert.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5"
                >
                  <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">{cert.name}</p>
                    <p className="text-[11px] text-slate-500">Issued by {cert.issuingBody}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {cert.badgeNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Harvests from this Farm */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">
              Available Fresh Crops from this Kisan ({products.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {products.map(prod => (
                <div
                  key={prod.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-28 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => {
                      onClose();
                      onSelectProduct(prod);
                    }}
                  />
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">{prod.category}</p>
                      <h4
                        onClick={() => {
                          onClose();
                          onSelectProduct(prod);
                        }}
                        className="text-xs font-bold text-slate-800 hover:text-emerald-700 transition-colors cursor-pointer truncate"
                      >
                        {prod.title}
                      </h4>
                      <p className="text-xs font-extrabold text-emerald-800 font-mono mt-1">
                        ₹{prod.price} / {prod.unit}
                      </p>
                    </div>
                    <button
                      onClick={() => onAddToCart(prod)}
                      className="mt-2 w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors"
                    >
                      ADD +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
