import React from 'react';
import { Package, Clock, CheckCircle2, Truck, Sprout, ArrowRight, ShieldCheck, MapPin, Phone, Smartphone } from 'lucide-react';
import { Order, User } from '../types';
import { db } from '../services/db';

interface OrdersViewProps {
  currentUser: User | null;
  onBrowseMarketplace: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  currentUser,
  onBrowseMarketplace,
}) => {
  const allOrders = db.getOrders();
  const orders = currentUser?.role === 'customer'
    ? allOrders.filter(o => o.customerId === currentUser.id || o.customerEmail === currentUser.email)
    : allOrders;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-display text-slate-900">
            My Farm Harvest Orders
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Live Swiggy-style farm-to-door tracking for freshly plucked crops.
          </p>
        </div>
        <button
          onClick={onBrowseMarketplace}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          Order More Fresh Plucks
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No active orders yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your direct harvest orders will appear here with live rider tracking and kisan farm updates.
          </p>
          <button
            onClick={onBrowseMarketplace}
            className="mt-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Start Shopping from Kisans
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs p-5 sm:p-6 space-y-5"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-extrabold text-slate-900 text-sm">{order.id}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : order.status === 'dispatched'
                          ? 'bg-sky-100 text-sky-800 border border-sky-300'
                          : order.status === 'harvested'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {order.status === 'dispatched' ? '⚡ OUT FOR DELIVERY' : order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
                    Total: ₹{order.total}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-bold">
                    ₹{order.kisanDirectPayout} paid directly to kisan
                  </p>
                </div>
              </div>

              {/* Rider / Delivery Partner Strip (Swiggy/Zomato style) */}
              {order.riderName && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold shrink-0">
                      🛵
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{order.riderName}</p>
                      <p className="text-[11px] text-slate-500">Delivering in Cold Eco-Van</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${order.riderPhone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-emerald-700 font-bold hover:bg-slate-100 transition-colors shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Driver</span>
                  </a>
                </div>
              )}

              {/* Ordered Items */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Harvest Basket ({order.items.length} items)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-white shrink-0 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-bold text-slate-800 truncate">{item.product.title}</p>
                        <p className="text-[11px] text-slate-500 truncate">{item.product.farmName}</p>
                        <p className="text-[11px] text-emerald-700 font-mono font-bold mt-0.5">
                          {item.quantity} {item.product.unit} × ₹{item.unitPrice} = ₹{item.quantity * item.unitPrice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px] font-semibold mb-0.5">Delivery Address</span>
                  <p className="font-bold text-slate-800">{order.customerName}</p>
                  <p className="text-slate-600 mt-0.5">
                    {order.deliveryAddress.street}, {order.deliveryAddress.area}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-1">Phone: {order.customerPhone}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-semibold mb-0.5">Delivery Time Slot</span>
                  <p className="font-bold text-slate-800">{order.deliverySlot}</p>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Payment: <span className="uppercase font-bold text-emerald-800">{order.paymentMethod}</span> ({order.isPaid ? 'Paid Online' : 'Pay at Doorstep'})
                  </p>
                </div>
              </div>

              {/* Swiggy style Live Delivery Progress Timeline */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Live Farm-to-Kitchen Status
                </p>
                <div className="space-y-2 border-l-2 border-emerald-200 ml-3 pl-4">
                  {order.timeline.map((event, idx) => (
                    <div key={idx} className="relative text-xs">
                      <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                          {event.status}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{event.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
