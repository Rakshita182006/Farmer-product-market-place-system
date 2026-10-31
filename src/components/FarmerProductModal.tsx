import React, { useState } from 'react';
import { X, Sprout, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product, ProductCategory, FarmerProfile } from '../types';
import { db, ASSET_IMAGES } from '../services/db';
import { useToast } from './Toast';

interface FarmerProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  farmerProfile: FarmerProfile;
  onSaved: () => void;
}

export const FarmerProductModal: React.FC<FarmerProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  farmerProfile,
  onSaved,
}) => {
  const { success, error } = useToast();

  const [title, setTitle] = useState(productToEdit?.title || '');
  const [hindiTitle, setHindiTitle] = useState(productToEdit?.hindiTitle || '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [category, setCategory] = useState<ProductCategory>(productToEdit?.category || 'Fresh Vegetables');
  const [price, setPrice] = useState<number>(productToEdit?.price || 45);
  const [unit, setUnit] = useState<Product['unit']>(productToEdit?.unit || 'kg');
  const [stock, setStock] = useState<number>(productToEdit?.stock || 50);
  const [harvestDate, setHarvestDate] = useState(productToEdit?.harvestDate || new Date().toISOString().split('T')[0]);
  const [shelfLifeDays, setShelfLifeDays] = useState<number>(productToEdit?.shelfLifeDays || 5);
  const [batchNumber, setBatchNumber] = useState(productToEdit?.batchNumber || `KISAN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [isOrganic, setIsOrganic] = useState(productToEdit?.isOrganic ?? true);
  const [isDesi, setIsDesi] = useState(productToEdit?.isDesi ?? true);
  const [isSurplus, setIsSurplus] = useState(productToEdit?.isSurplus ?? false);
  const [surplusDiscountPercent, setSurplusDiscountPercent] = useState<number>(productToEdit?.surplusDiscountPercent || 25);
  const [imageUrl, setImageUrl] = useState(productToEdit?.imageUrl || ASSET_IMAGES.tomatoes);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiRationale, setAiRationale] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAiPriceSuggestion = async () => {
    setIsAiLoading(true);
    setAiRationale(null);
    try {
      const response = await fetch('/api/ai/suggest-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: title || 'Fresh Harvest Produce',
          category,
          isOrganic,
          isDesi,
          unit,
        }),
      });

      const data = await response.json();
      if (data?.suggestedPrice) {
        setPrice(Number(data.suggestedPrice));
        setAiRationale(data.rationale || `Recommended fair farm-gate pricing of ₹${Number(data.suggestedPrice)} per ${unit}.`);
      }
    } catch {
      const baseRates: Record<string, number> = {
        'Fresh Vegetables': 42,
        'Farm Fresh Fruits': 120,
        'A2 Dairy & Ghee': 80,
        'Pure Raw Honey': 350,
        'Organic Dal & Millets': 140,
        'Herbs & Microgreens': 25,
      };
      const suggested = baseRates[category] || 50;
      setPrice(suggested);
      setAiRationale(`Estimated fair-price benchmark: ₹${suggested} / ${unit} directly to farmer.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      error('Crop name required', 'Please provide a name for this produce.');
      return;
    }

    try {
      const farmerSharePercent = 85;
      const farmerIncomePerUnit = Math.round(price * 0.85);

      const newProduct: Product = {
        id: productToEdit ? productToEdit.id : `prod-kisan-${Date.now()}`,
        farmerId: farmerProfile.id,
        farmerName: farmerProfile.farmName,
        farmName: farmerProfile.farmName,
        title: title.trim(),
        hindiTitle: hindiTitle.trim() || undefined,
        description: description.trim(),
        category,
        price: Number(price),
        unit,
        stock: Number(stock),
        minOrder: 1,
        harvestDate,
        shelfLifeDays: Number(shelfLifeDays),
        imageUrl: imageUrl || ASSET_IMAGES.tomatoes,
        isOrganic,
        isDesi,
        isSurplus,
        surplusDiscountPercent: isSurplus ? surplusDiscountPercent : undefined,
        fairPrice: {
          farmerSharePercent,
          packagingPercent: 4,
          coldChainLogisticsPercent: 6,
          platformFeePercent: 5,
          conventionalMandiFarmerShare: 20,
          farmerIncomePerUnit,
        },
        batchNumber,
        originLocation: `${farmerProfile.city}, ${farmerProfile.state}`,
        rating: productToEdit ? productToEdit.rating : 5.0,
        reviewsCount: productToEdit ? productToEdit.reviewsCount : 0,
        status: stock > 0 ? 'active' : 'sold_out',
        deliveryEta: 'Morning 6 AM Pluck',
      };

      if (productToEdit) {
        db.updateProduct(newProduct);
        success('Produce Updated', `${newProduct.title} has been successfully updated.`);
      } else {
        db.addProduct(newProduct);
        success('Crop Listed', `${newProduct.title} is now active in KisanDirect.`);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      error('Error saving crop', err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-800 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {productToEdit ? 'Edit Harvest Produce' : 'List New Crop / Produce'}
            </h2>
            <p className="text-xs text-slate-500">KisanDirect Farm Inventory Management</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title & Hindi Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Crop Name (English)</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Desi Vine-Ripened Tomatoes"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hindi / Local Name (Optional)</label>
              <input
                type="text"
                value={hindiTitle}
                onChange={e => setHindiTitle(e.target.value)}
                placeholder="e.g. देसी लाल टमाटर"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Category & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
              >
                <option value="Fresh Vegetables">Fresh Vegetables</option>
                <option value="Farm Fresh Fruits">Farm Fresh Fruits</option>
                <option value="A2 Dairy & Ghee">A2 Dairy & Ghee</option>
                <option value="Pure Raw Honey">Pure Raw Honey</option>
                <option value="Organic Dal & Millets">Organic Dal & Millets</option>
                <option value="Herbs & Microgreens">Herbs & Microgreens</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Harvest Notes & Description</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Freshly plucked, pesticide-free, natural sweetness..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Price, Unit, Stock */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Price (₹)</label>
                  <button
                    type="button"
                    onClick={handleAiPriceSuggestion}
                    disabled={isAiLoading}
                    className="text-[10px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{isAiLoading ? 'Estimating...' : 'AI Fair Price'}</span>
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Unit</label>
                <select
                  value={unit}
                  onChange={e => setUnit(e.target.value as Product['unit'])}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="bunch">bunch</option>
                  <option value="L">L</option>
                  <option value="jar">jar</option>
                  <option value="box">box</option>
                  <option value="carton">carton</option>
                  <option value="pack">pack</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Stock Available ({unit})</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock}
                  onChange={e => setStock(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {aiRationale && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <p>{aiRationale}</p>
              </div>
            )}
          </div>

          {/* Harvest Date & Shelf Life */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Harvest Date</label>
              <input
                type="date"
                required
                value={harvestDate}
                onChange={e => setHarvestDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Shelf Life (Days)</label>
              <input
                type="number"
                min="1"
                value={shelfLifeDays}
                onChange={e => setShelfLifeDays(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kisan Batch Code</label>
              <input
                type="text"
                value={batchNumber}
                onChange={e => setBatchNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
              />
            </div>
          </div>

          {/* Photo Presets */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Crop Image</label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              <button
                type="button"
                onClick={() => setImageUrl(ASSET_IMAGES.tomatoes)}
                className={`p-1 rounded-lg border overflow-hidden transition-all ${
                  imageUrl === ASSET_IMAGES.tomatoes ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-slate-200'
                }`}
              >
                <img src={ASSET_IMAGES.tomatoes} alt="Tomatoes" className="w-full h-12 object-cover rounded" />
                <span className="block text-[10px] text-slate-700 text-center mt-0.5 font-medium">Tomatoes</span>
              </button>
              <button
                type="button"
                onClick={() => setImageUrl(ASSET_IMAGES.apples)}
                className={`p-1 rounded-lg border overflow-hidden transition-all ${
                  imageUrl === ASSET_IMAGES.apples ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-slate-200'
                }`}
              >
                <img src={ASSET_IMAGES.apples} alt="Apples" className="w-full h-12 object-cover rounded" />
                <span className="block text-[10px] text-slate-700 text-center mt-0.5 font-medium">Apples</span>
              </button>
              <button
                type="button"
                onClick={() => setImageUrl(ASSET_IMAGES.honey)}
                className={`p-1 rounded-lg border overflow-hidden transition-all ${
                  imageUrl === ASSET_IMAGES.honey ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-slate-200'
                }`}
              >
                <img src={ASSET_IMAGES.honey} alt="Honey" className="w-full h-12 object-cover rounded" />
                <span className="block text-[10px] text-slate-700 text-center mt-0.5 font-medium">Raw Honey</span>
              </button>
              <button
                type="button"
                onClick={() => setImageUrl(ASSET_IMAGES.hero)}
                className={`p-1 rounded-lg border overflow-hidden transition-all ${
                  imageUrl === ASSET_IMAGES.hero ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-slate-200'
                }`}
              >
                <img src={ASSET_IMAGES.hero} alt="Greens" className="w-full h-12 object-cover rounded" />
                <span className="block text-[10px] text-slate-700 text-center mt-0.5 font-medium">Greens</span>
              </button>
            </div>
            <input
              type="text"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="Or enter custom image URL"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          {/* Toggles: Organic, Desi, Surplus */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOrganic}
                  onChange={e => setIsOrganic(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span className="font-semibold text-slate-700">🌱 NPOP / PGS-India Jaivik Certified</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDesi}
                  onChange={e => setIsDesi(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span className="font-semibold text-slate-700">🌾 Desi Heirloom Seed Variety</span>
              </label>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSurplus}
                  onChange={e => setIsSurplus(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-0"
                />
                <div>
                  <span className="font-bold text-amber-800">⚡ Kisan Surplus Bachao (Flash Deal)</span>
                  <p className="text-[10px] text-slate-500">Offer bumper harvest at discount to prevent farm gate spoilage</p>
                </div>
              </label>
              {isSurplus && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-600 font-medium">Discount:</span>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={surplusDiscountPercent}
                    onChange={e => setSurplusDiscountPercent(Number(e.target.value))}
                    className="w-16 bg-white border border-slate-300 rounded px-2 py-1 text-amber-700 font-bold text-center"
                  />
                  <span className="text-slate-600 font-bold">%</span>
                </div>
              )}
            </div>
          </div>

          {/* Fair-Price Preview in INR */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-slate-700">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fair-Price Direct Split</span>
              </span>
              <span className="text-emerald-800 font-black text-sm">
                Kisan Payout: ₹{Math.round(price * 0.85)} / {unit} (85%)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              Conventional APMC Mandi middleman would pay you only ₹{Math.round(price * 0.20)} / {unit}.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              {productToEdit ? 'Save Changes' : 'Publish Crop to KisanDirect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
