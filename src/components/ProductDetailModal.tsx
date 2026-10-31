import React, { useState } from 'react';
import { X, Star, Calendar, ShieldCheck, MapPin, Truck, Plus, Minus, MessageSquare, Scale, Leaf, Clock } from 'lucide-react';
import { Product, Review, User } from '../types';
import { db } from '../services/db';
import { useToast } from './Toast';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewFarmerProfile: (farmerId: string) => void;
  currentUser: User | null;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onViewFarmerProfile,
  currentUser,
}) => {
  const { success, error } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!product) return null;

  const reviews = db.getReviews(product.id);
  const effectivePrice = product.isSurplus && product.surplusDiscountPercent
    ? Number((product.price * (1 - product.surplusDiscountPercent / 100)).toFixed(0))
    : product.price;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    } else {
      error('Limit Reached', `Only ${product.stock} ${product.unit} available in today's harvest.`);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const review: Review = {
        id: 'rev_' + Date.now(),
        productId: product.id,
        customerId: currentUser?.id || 'guest',
        customerName: currentUser?.name || 'Local Food Lover',
        rating: newRating,
        comment: newComment.trim(),
        createdAt: new Date().toISOString(),
      };

      db.addReview(review);
      setNewComment('');
      success('Review Submitted', 'Thank you for supporting our Indian kisans!');
    } catch (err: any) {
      error('Review Error', err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl text-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 p-2 rounded-full transition-colors border border-slate-200 shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Main Grid: Gallery left, purchase module right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Product Image */}
            <div className="space-y-3">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {product.isSurplus && product.surplusDiscountPercent && (
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-extrabold px-3 py-1 rounded-md text-xs shadow-xs">
                    {product.surplusDiscountPercent}% OFF · Surplus Rescue
                  </div>
                )}
                {product.isOrganic && (
                  <div className="absolute bottom-3 left-3 bg-white/95 text-emerald-800 font-bold px-2.5 py-1 rounded-md text-xs border border-emerald-200 shadow-xs flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    <span>NPOP / Jaivik Certified</span>
                  </div>
                )}
              </div>

              {/* Harvest origin metadata */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">HARVEST DATE</span>
                  <span className="font-bold text-slate-800">{product.harvestDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">SHELF FRESHNESS</span>
                  <span className="font-bold text-slate-800">{product.shelfLifeDays} days post-pluck</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">BATCH CODE</span>
                  <span className="font-mono text-slate-700 font-semibold">{product.batchNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">DELIVERY ETA</span>
                  <span className="font-bold text-emerald-800">{product.deliveryEta}</span>
                </div>
              </div>
            </div>

            {/* Right: Contiguous Purchase Module */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="uppercase tracking-wider font-bold text-emerald-700">{product.category}</span>
                  <span aria-hidden="true">·</span>
                  <button
                    onClick={() => onViewFarmerProfile(product.farmerId)}
                    className="hover:text-emerald-800 underline underline-offset-2 transition-colors font-semibold"
                  >
                    {product.farmName}
                  </button>
                </div>

                <h1 className="text-xl sm:text-2xl font-black font-serif-display text-slate-900">
                  {product.title}
                </h1>

                {product.hindiTitle && (
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{product.hindiTitle}</p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="flex items-center gap-1 bg-emerald-700 text-white font-bold text-xs px-2 py-0.5 rounded">
                    <span>{product.rating}</span>
                    <Star className="w-3 h-3 fill-white" />
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-600">{product.reviewsCount} customer reviews</span>
                </div>

                {/* Pricing Box in ₹ */}
                <div className="mt-4 p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                      ₹{effectivePrice}
                    </span>
                    <span className="text-xs text-slate-600">/{product.unit}</span>
                    {product.isSurplus && (
                      <span className="text-xs line-through text-slate-400 font-mono tabular-nums ml-2">
                        ₹{product.price}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-emerald-800 font-bold mt-1">
                    ₹{product.fairPrice.farmerIncomePerUnit.toFixed(0)} credited directly to kisan bank account (85%)
                  </p>

                  {/* Quantity & Add to Cart (Swiggy/Zomato style) */}
                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex items-center bg-white border border-slate-300 rounded-xl p-1 shadow-2xs font-bold text-xs">
                      <button
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 font-mono tabular-nums">{quantity}</span>
                      <button
                        onClick={handleIncrement}
                        disabled={quantity >= product.stock}
                        className="p-1.5 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        onAddToCart(product, quantity);
                        success('Added to Basket', `${quantity} ${product.unit} of ${product.title} added.`);
                      }}
                      disabled={product.stock <= 0}
                      className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-xs transition-all disabled:opacity-40 text-xs uppercase tracking-wide"
                    >
                      {product.stock > 0 ? `Add ${quantity} ${product.unit} · ₹${effectivePrice * quantity}` : 'Harvest Sold Out'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Kisan Story connect ribbon */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800">Cultivated by {product.farmerName}</p>
                  <p className="text-[11px] text-slate-500">{product.originLocation}</p>
                </div>
                <button
                  onClick={() => onViewFarmerProfile(product.farmerId)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-emerald-800 rounded-lg font-bold text-[11px] transition-colors shadow-2xs"
                >
                  View Khet Story
                </button>
              </div>
            </div>
          </div>

          {/* Mandi vs KisanDirect Fair-Price Breakdown in ₹ */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-800">
                  Where Does Your ₹ Food Rupee Go?
                </h3>
              </div>
              <span className="text-xs text-emerald-800 font-extrabold bg-emerald-100 px-2 py-0.5 rounded">
                85% to Kisan (₹{(effectivePrice * 0.85).toFixed(0)})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200">
                <p className="font-bold text-emerald-800">KisanDirect Direct Model</p>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Direct Kisan Income (85%):</span>
                  <strong className="text-emerald-700 font-mono">₹{(effectivePrice * 0.85).toFixed(0)}</strong>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Farm Cold Chain & Eco Van (6%):</span>
                  <span className="font-mono">₹{(effectivePrice * 0.06).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Jute & Compostable Packing (4%):</span>
                  <span className="font-mono">₹{(effectivePrice * 0.04).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Platform Operations (5%):</span>
                  <span className="font-mono">₹{(effectivePrice * 0.05).toFixed(0)}</span>
                </div>
              </div>

              <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200">
                <p className="font-bold text-rose-700">Conventional APMC Mandi</p>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Farmer Share (Only 18%):</span>
                  <strong className="text-rose-700 font-mono">₹{(effectivePrice * 0.18).toFixed(0)}</strong>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Mandi Dalal Commission (28%):</span>
                  <span className="font-mono">₹{(effectivePrice * 0.28).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>Wholesaler & Retailing Markup (54%):</span>
                  <span className="font-mono">₹{(effectivePrice * 0.54).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>Customer Reviews ({reviews.length})</span>
            </h3>

            {/* Post Review */}
            <form onSubmit={handleAddReview} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Rate this harvest:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-0.5 text-slate-300 hover:text-amber-500"
                    >
                      <Star className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={2}
                required
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Share your taste and freshness experience with other consumers..."
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
              />
              <button
                type="submit"
                disabled={isSubmittingReview || !newComment.trim()}
                className="py-1 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-40"
              >
                Submit Review
              </button>
            </form>

            <div className="space-y-2">
              {reviews.map(r => (
                <div key={r.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{r.customerName}</span>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
