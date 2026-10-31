import React, { useState } from 'react';
import { Calendar, Sprout, Clock, CheckCircle2, Plus, Bell, Leaf } from 'lucide-react';
import { HarvestCalendarItem, CropGrowthStatus, User, ProductCategory } from '../types';
import { db } from '../services/db';
import { useToast } from './Toast';

interface HarvestCalendarViewProps {
  currentUser: User | null;
  onBrowseMarketplace: () => void;
}

export const HarvestCalendarView: React.FC<HarvestCalendarViewProps> = ({
  currentUser,
  onBrowseMarketplace,
}) => {
  const { success } = useToast();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [cropName, setCropName] = useState('');
  const [hindiCropName, setHindiCropName] = useState('');
  const [variety, setVariety] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Fresh Vegetables');
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedHarvestStart, setExpectedHarvestStart] = useState(
    new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [expectedHarvestEnd, setExpectedHarvestEnd] = useState(
    new Date(Date.now() + 28 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [estimatedYield, setEstimatedYield] = useState(500);
  const [status, setStatus] = useState<CropGrowthStatus>('growing');
  const [notes, setNotes] = useState('');

  const harvestList = db.getHarvestCalendar();

  const filteredItems = harvestList.filter(item => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  const handleAddCropSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const farmer = db.getFarmers().find(f => f.userId === currentUser?.id) || db.getFarmers()[0];

    const newItem: HarvestCalendarItem = {
      id: 'harv_' + Date.now(),
      farmerId: farmer.id,
      farmerName: farmer.farmName.split(' ')[0] || 'Kisan',
      farmName: farmer.farmName,
      cropName,
      hindiCropName,
      category,
      variety,
      plantingDate,
      expectedHarvestStart,
      expectedHarvestEnd,
      estimatedYield,
      unit: 'kg',
      status,
      preOrderAvailable: true,
      notes,
    };

    db.addHarvestItem(newItem);
    success('Crop Harvest Scheduled', `${cropName} has been added to regional Indian harvest calendar.`);
    setShowAddModal(false);
    setCropName('');
    setHindiCropName('');
    setVariety('');
    setNotes('');
  };

  const handlePreOrderAlert = (crop: HarvestCalendarItem) => {
    success(
      'Harvest Notification Subscribed',
      `You will receive an alert as soon as ${crop.cropName} is plucked at ${crop.farmName}!`
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-0.5">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Kharif & Rabi Seasonal Ripening Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-display text-slate-900">
            Regional Harvest Calendar (फसल कैलेंडर)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track what is growing in the khet today and pre-order batches before they hit the morning harvest.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser?.role === 'farmer' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Next Crop</span>
            </button>
          )}
          <button
            onClick={onBrowseMarketplace}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors shadow-2xs"
          >
            Shop Active Crops
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Seasonal Crops' },
          { id: 'harvesting_now', label: '🌾 Harvesting Today (आज की तुड़ाई)' },
          { id: 'ready_soon', label: '🌱 Ready Next 14 Days (आगामी फसल)' },
          { id: 'growing', label: '🌿 Maturing in Soil (खेत में तैयार)' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border ${
              filterStatus === tab.id
                ? 'bg-emerald-700 border-emerald-700 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                    {item.category} · {item.farmName}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 font-serif-display mt-0.5">
                    {item.cropName}
                  </h3>
                  {item.hindiCropName && (
                    <p className="text-xs text-emerald-800 font-semibold">{item.hindiCropName}</p>
                  )}
                  <p className="text-[11px] text-slate-500 font-medium">
                    Variety: {item.variety}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded text-[11px] font-bold whitespace-nowrap ${
                    item.status === 'harvesting_now'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : item.status === 'ready_soon'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {item.status === 'harvesting_now'
                    ? 'Harvesting Today'
                    : item.status === 'ready_soon'
                    ? 'Ripening Soon'
                    : 'Growing in Soil'}
                </span>
              </div>

              {/* Harvest Timeline */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">PLANTED ON</span>
                  <span className="font-bold text-slate-800">{item.plantingDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">EXPECTED PLUCK</span>
                  <span className="font-bold text-emerald-800">
                    {item.expectedHarvestStart} to {item.expectedHarvestEnd}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 italic bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                "{item.notes}"
              </p>
            </div>

            {/* Bottom Row */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">
                Est. Harvest: <strong className="text-slate-800 font-mono">{item.estimatedYield} {item.unit}</strong>
              </span>

              {item.status === 'harvesting_now' ? (
                <button
                  onClick={onBrowseMarketplace}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs transition-colors"
                >
                  Order This Batch
                </button>
              ) : (
                <button
                  onClick={() => handlePreOrderAlert(item)}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-600" />
                  <span>Notify on Pluck</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 text-slate-800 space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-serif-display">
              Schedule Next Crop in Indian Harvest Calendar
            </h2>
            <form onSubmit={handleAddCropSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Crop Name (English)</label>
                <input
                  type="text"
                  required
                  value={cropName}
                  onChange={e => setCropName(e.target.value)}
                  placeholder="e.g. Desi Pili Sarson"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Crop Name (Hindi / Regional)</label>
                <input
                  type="text"
                  value={hindiCropName}
                  onChange={e => setHindiCropName(e.target.value)}
                  placeholder="e.g. देशी पीली सरसों"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Variety</label>
                  <input
                    type="text"
                    required
                    value={variety}
                    onChange={e => setVariety(e.target.value)}
                    placeholder="e.g. Native Heirloom"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as ProductCategory)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  >
                    <option value="Fresh Vegetables">Fresh Vegetables</option>
                    <option value="Farm Fresh Fruits">Farm Fresh Fruits</option>
                    <option value="A2 Dairy & Ghee">A2 Dairy & Ghee</option>
                    <option value="Pure Raw Honey">Pure Raw Honey</option>
                    <option value="Organic Dal & Millets">Organic Dal & Millets</option>
                    <option value="Herbs & Microgreens">Herbs & Microgreens</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Target Pluck Start</label>
                  <input
                    type="date"
                    required
                    value={expectedHarvestStart}
                    onChange={e => setExpectedHarvestStart(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Target Pluck End</label>
                  <input
                    type="date"
                    required
                    value={expectedHarvestEnd}
                    onChange={e => setExpectedHarvestEnd(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Soil Stage</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as CropGrowthStatus)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
                >
                  <option value="growing">Maturing in Soil (खेत में तैयार)</option>
                  <option value="ready_soon">Ready in Next 14 Days (आगामी फसल)</option>
                  <option value="harvesting_now">Harvesting Today (आज की तुड़ाई)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl"
                >
                  Publish Crop Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
