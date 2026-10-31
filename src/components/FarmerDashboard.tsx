import React, { useState } from 'react';
import { Tractor, DollarSign, Package, AlertTriangle, Plus, Edit, Trash2, CheckCircle2, Clock, Truck, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { User, FarmerProfile, Product, Order, OrderStatus } from '../types';
import { db } from '../services/db';
import { FarmerProductModal } from './FarmerProductModal';
import { useToast } from './Toast';

interface FarmerDashboardProps {
  currentUser: User;
  onOpenProductModal: (product?: Product | null) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  currentUser,
}) => {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'profile'>('inventory');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Farmer profile lookup
  const farmerProfile = db.getFarmerByUserId(currentUser.id) || db.getFarmers()[0];
  const products = db.getProductsByFarmer(farmerProfile.id);
  const orders = db.getOrdersForFarmer(farmerProfile.id);

  const [farmBio, setFarmBio] = useState(farmerProfile.bio);
  const [farmStory, setFarmStory] = useState(farmerProfile.directStory);
  const [tagline, setTagline] = useState(farmerProfile.tagline);
  const [acreage, setAcreage] = useState(farmerProfile.acreage);

  // Total farmer earnings in ₹
  const totalRevenue = orders.reduce((sum, order) => {
    const farmItems = order.items.filter(i => i.product.farmerId === farmerProfile.id);
    const itemTotal = farmItems.reduce((acc, i) => acc + (i.unitPrice * i.quantity * (i.product.fairPrice.farmerSharePercent / 100)), 0);
    return sum + itemTotal;
  }, 0);

  const pendingFulfillments = orders.filter(o => o.status === 'pending' || o.status === 'harvested').length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10).length;

  const handleUpdateStock = (productId: string, delta: number) => {
    const prod = db.getProductById(productId);
    if (prod) {
      const next = Math.max(0, prod.stock + delta);
      db.updateProductStock(productId, next);
      success('Stock Updated', `${prod.title} inventory set to ${next} ${prod.unit}.`);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this crop listing?')) {
      db.deleteProduct(productId);
      success('Listing Removed', 'The harvest listing has been deleted.');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const noteMap: Record<OrderStatus, string> = {
      pending: 'Order confirmed by Kisan.',
      harvested: 'Fresh crops harvested from khet and packed in breathable jute crates.',
      dispatched: 'Out for delivery via temperature controlled farm cold van.',
      delivered: 'Delivered directly to consumer home.',
      cancelled: 'Order cancelled.',
    };
    db.updateOrderStatus(orderId, status, noteMap[status]);
    success('Order Status Updated', `Order ${orderId} marked as ${status}.`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateFarmerProfile({
      ...farmerProfile,
      bio: farmBio,
      directStory: farmStory,
      tagline,
      acreage,
    });
    success('Kisan Profile Saved', 'Your farm story has been updated for all consumers.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 border border-amber-200 rounded-2xl">
            <Tractor className="w-6 h-6 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold font-serif-display text-slate-900">
                {farmerProfile.farmName}
              </h1>
              {farmerProfile.isVerified && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-800 font-bold bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Kisan
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kisan Kendra Portal · {farmerProfile.city}, {farmerProfile.state} · Direct Bank Settlement
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>List Fresh Harvest (फसल जोड़ें)</span>
        </button>
      </div>

      {/* KPI Cards Strip in ₹ */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-1">
          <p className="text-xs text-slate-500 font-semibold">Net Kisan Earnings (₹)</p>
          <p className="text-2xl font-black font-mono text-emerald-700 tabular-nums">
            ₹{totalRevenue.toFixed(0)}
          </p>
          <p className="text-[11px] text-slate-400">85% direct payout retained</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-1">
          <p className="text-xs text-slate-500 font-semibold">Orders to Pack</p>
          <p className="text-2xl font-black font-mono text-slate-800 tabular-nums">
            {pendingFulfillments}
          </p>
          <p className="text-[11px] text-slate-400">Pending morning pluck</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-1">
          <p className="text-xs text-slate-500 font-semibold">Listed Crops in Store</p>
          <p className="text-2xl font-black font-mono text-slate-800 tabular-nums">
            {products.length}
          </p>
          <p className="text-[11px] text-slate-400">Active in marketplace</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-1">
          <p className="text-xs text-slate-500 font-semibold">Low Stock Warnings</p>
          <p className="text-2xl font-black font-mono text-amber-600 tabular-nums">
            {lowStockProducts}
          </p>
          <p className="text-[11px] text-slate-400">&le; 10 units left</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'inventory'
              ? 'border-emerald-600 text-emerald-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Crops & Stock Management ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-emerald-600 text-emerald-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Customer Orders to Harvest ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-emerald-600 text-emerald-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Kisan Bio & Soil Settings
        </button>
      </div>

      {/* Tab 1: Inventory Table in ₹ */}
      {activeTab === 'inventory' && (
        <div className="space-y-3">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <tr>
                    <th className="py-3 px-4">Produce Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Retail Price (₹)</th>
                    <th className="py-3 px-4">Kisan Share (₹)</th>
                    <th className="py-3 px-4">Live Inventory</th>
                    <th className="py-3 px-4">Pluck Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-800">{product.title}</p>
                            <p className="text-[10px] text-slate-400 font-mono">
                              Batch: {product.batchNumber} {product.isSurplus && '· Surplus Deal'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{product.category}</td>
                      <td className="py-3 px-4 font-mono font-extrabold text-slate-900 tabular-nums">
                        ₹{product.price} / {product.unit}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-800 font-bold tabular-nums">
                        ₹{product.fairPrice.farmerIncomePerUnit.toFixed(0)} ({product.fairPrice.farmerSharePercent}%)
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateStock(product.id, -5)}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                          >
                            -
                          </button>
                          <span className={`font-mono font-bold min-w-[2.5rem] text-center tabular-nums ${
                            product.stock === 0 ? 'text-rose-600' : 'text-slate-800'
                          }`}>
                            {product.stock} {product.unit}
                          </span>
                          <button
                            onClick={() => handleUpdateStock(product.id, +5)}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{product.harvestDate}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Listing"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Orders Fulfillment */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-xs text-slate-500">
              No orders received yet. New customer orders will show up here immediately.
            </div>
          ) : (
            orders.map(order => {
              const myItems = order.items.filter(i => i.product.farmerId === farmerProfile.id);
              const orderTotalForFarm = myItems.reduce((acc, i) => acc + (i.unitPrice * i.quantity), 0);

              return (
                <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-slate-900">{order.id}</span>
                        <span className="text-slate-500">· Customer: {order.customerName} ({order.customerPhone})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Slot: {order.deliverySlot} · Drop: {order.deliveryAddress.street}, {order.deliveryAddress.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-emerald-800 text-sm">
                        Kisan Share: ₹{(orderTotalForFarm * 0.85).toFixed(0)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'harvested')}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs"
                          >
                            Mark Harvested
                          </button>
                        )}
                        {order.status === 'harvested' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'dispatched')}
                            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs"
                          >
                            Dispatch Cold Van
                          </button>
                        )}
                        {order.status === 'dispatched' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs">
                            ✓ Delivered
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {myItems.map((item, idx) => (
                      <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                        <span className="font-semibold text-slate-800">{item.product.title}</span>
                        <span className="font-mono text-emerald-800 font-bold">
                          {item.quantity} {item.product.unit} · ₹{item.unitPrice * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: Profile Settings */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3.5 text-xs max-w-2xl shadow-xs">
          <h3 className="text-sm font-bold text-slate-900">Kisan Profile & Living Soil Story</h3>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Acreage</label>
            <input
              type="number"
              value={acreage}
              onChange={e => setAcreage(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Short Bio</label>
            <textarea
              rows={3}
              value={farmBio}
              onChange={e => setFarmBio(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-semibold">Founder Story</label>
            <textarea
              rows={4}
              value={farmStory}
              onChange={e => setFarmStory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-colors"
          >
            Save Farm Story
          </button>
        </form>
      )}

      {isModalOpen && (
        <FarmerProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productToEdit={editingProduct}
          farmerProfile={farmerProfile}
          onSaved={() => {}}
        />
      )}
    </div>
  );
};
