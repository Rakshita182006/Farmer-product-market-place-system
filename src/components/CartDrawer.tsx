import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2, Truck, CreditCard, Banknote, Smartphone, MapPin } from 'lucide-react';
import { CartItem, Order, PaymentMethod, User } from '../types';
import { db } from '../services/db';
import { useToast } from './Toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currentUser: User | null;
  onOrderCompleted: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  currentUser,
  onOrderCompleted,
}) => {
  const { success, error } = useToast();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  // Checkout address & details (Indian format)
  const [name, setName] = useState(currentUser?.name || 'Ananya Sharma');
  const [email, setEmail] = useState(currentUser?.email || 'ananya.bengaluru@gmail.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98450 12890');
  const [street, setStreet] = useState(currentUser?.address?.street || '#402, Green Glen Layout');
  const [area, setArea] = useState(currentUser?.address?.area || 'Bellandur / Outer Ring Road');
  const [city, setCity] = useState(currentUser?.address?.city || 'Bengaluru');
  const [state, setState] = useState(currentUser?.address?.state || 'Karnataka');
  const [pincode, setPincode] = useState(currentUser?.address?.pincode || '560103');
  const [deliverySlot, setDeliverySlot] = useState('⚡ Morning Harvest Slot (6:30 AM - 8:00 AM)');
  const [deliveryNotes, setDeliveryNotes] = useState('Ring bell and leave near door cooler bag');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = subtotal >= 199 ? 0 : 35; // Swiggy style free delivery over ₹199
  const platformFee = 3; // Swiggy/Zomato style nominal platform fee in ₹
  const total = subtotal + deliveryFee + (cart.length > 0 ? platformFee : 0);

  // Direct Kisan share in ₹
  const kisanPayoutTotal = cart.reduce((sum, item) => {
    const share = item.product.fairPrice.farmerSharePercent / 100;
    return sum + (item.unitPrice * item.quantity * share);
  }, 0);

  const itemsByFarm = cart.reduce((acc, item) => {
    const farmName = item.product.farmName;
    if (!acc[farmName]) acc[farmName] = [];
    acc[farmName].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    try {
      db.updateCartQuantity(productId, quantity);
    } catch (err: any) {
      error('Limit Reached', err.message);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderId = 'KD-BLR-' + Math.floor(1000 + Math.random() * 9000);
      const newOrder: Order = {
        id: orderId,
        customerId: currentUser?.id || 'guest_cust',
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        deliveryAddress: {
          street,
          area,
          city,
          state,
          pincode,
        },
        deliverySlot,
        deliveryNotes,
        paymentMethod,
        isPaid: paymentMethod === 'upi' || paymentMethod === 'card',
        items: [...cart],
        subtotal: Number(subtotal.toFixed(0)),
        deliveryFee,
        kisanDirectPayout: Number(kisanPayoutTotal.toFixed(0)),
        total: Number(total.toFixed(0)),
        status: 'pending',
        riderName: 'Manjunath (Cold Van Route #4)',
        riderPhone: '+91 97412 55901',
        createdAt: new Date().toISOString(),
        timeline: [
          {
            status: 'pending',
            timestamp: new Date().toISOString(),
            note: 'Order confirmed with farm clusters. Kisan packing initiated.',
          }
        ],
      };

      const completed = db.createOrder(newOrder);
      success('Order Confirmed!', `Order ${orderId} placed. ₹${kisanPayoutTotal.toFixed(0)} credited directly to our kisans.`);
      onOrderCompleted(completed);
      onClose();
    } catch (err: any) {
      error('Order Error', err.message || 'Unable to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white text-slate-800 h-full flex flex-col shadow-2xl border-l border-slate-200">
        {/* Header like Swiggy / Zomato */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {step === 'cart' ? `My Farm Basket (${cart.length} items)` : 'Checkout & Delivery'}
              </h2>
              <p className="text-[11px] text-slate-500">KisanDirect Express Delivery</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#f8f9fa]">
          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <span className="text-4xl block">🧺</span>
              <p className="text-base font-bold text-slate-800">Your basket is empty</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Add farm fresh desi vegetables, Shimla apples, or A2 milk directly from Indian growers.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Explore Khet Harvests
              </button>
            </div>
          ) : step === 'cart' ? (
            <>
              {/* Swiggy/Zomato Savings & Kisan Impact Strip */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between text-emerald-800 font-bold">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Direct Kisan Earning</span>
                  </span>
                  <span className="font-mono text-sm font-extrabold">₹{kisanPayoutTotal.toFixed(0)}</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  85% of your ₹ bill transfers directly to Rameshwar & Lakshmi without any Mandi commission.
                </p>
              </div>

              {/* Items grouped by farm */}
              <div className="space-y-4">
                {Object.entries(itemsByFarm).map(([farmName, items]) => (
                  <div key={farmName} className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-3 shadow-2xs">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center justify-between">
                      <span>Harvested at {farmName}</span>
                      <span className="text-emerald-700 font-semibold">100% Verified Farm</span>
                    </div>

                    <div className="space-y-2.5">
                      {items.map(item => (
                        <div key={item.productId} className="flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.title}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <div className="truncate">
                              <h4 className="font-bold text-slate-800 truncate">{item.product.title}</h4>
                              <p className="text-[11px] text-slate-500">₹{item.unitPrice} / {item.product.unit}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {/* Swiggy style quantity pill */}
                            <div className="flex items-center bg-emerald-50 border border-emerald-600 text-emerald-800 rounded-lg text-xs font-bold">
                              <button
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                className="px-2 py-1 hover:bg-emerald-100 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 font-mono tabular-nums">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                className="px-2 py-1 hover:bg-emerald-100 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="font-mono font-bold text-slate-900 w-14 text-right">
                              ₹{(item.unitPrice * item.quantity).toFixed(0)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Swiggy / Zomato Bill Details Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5 shadow-2xs text-xs">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Bill Details</h3>
                
                <div className="flex justify-between text-slate-600">
                  <span>Item Total</span>
                  <span className="font-mono font-semibold text-slate-900">₹{subtotal.toFixed(0)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>Delivery Partner Fee</span>
                    {deliveryFee === 0 && <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-1 rounded">FREE</span>}
                  </span>
                  <span className="font-mono font-semibold text-slate-900">
                    {deliveryFee === 0 ? <span className="line-through text-slate-400 mr-1">₹35</span> : null}
                    ₹{deliveryFee}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Platform Fee</span>
                  <span className="font-mono font-semibold text-slate-900">₹{platformFee}</span>
                </div>

                <div className="border-t border-slate-100 pt-2 flex justify-between font-extrabold text-sm text-slate-900">
                  <span>To Pay</span>
                  <span className="font-mono text-emerald-800">₹{total.toFixed(0)}</span>
                </div>
              </div>
            </>
          ) : (
            /* Swiggy/Zomato style Address & Payment Checkout */
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              {/* Delivery Address */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-xs">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>Delivering to Your Doorstep</span>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">Receiver Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-500 mb-1">Mobile (for OTP & Delivery)</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={e => setPincode(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">House / Flat No., Building</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">Area / Locality</label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">Harvest Delivery Slot</label>
                  <select
                    value={deliverySlot}
                    onChange={e => setDeliverySlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="⚡ Express Morning Slot (6:30 AM - 8:00 AM)">⚡ Express Morning Slot (6:30 AM - 8:00 AM)</option>
                    <option value="🌿 Afternoon Farm Route (1:00 PM - 3:00 PM)">🌿 Afternoon Farm Route (1:00 PM - 3:00 PM)</option>
                    <option value="🌅 Tomorrow Sunrise Harvest Pluck (6:00 AM)">🌅 Tomorrow Sunrise Harvest Pluck (6:00 AM)</option>
                  </select>
                </div>
              </div>

              {/* Payment Mode (UPI / COD / Cards) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5 shadow-2xs">
                <span className="font-bold text-slate-800 text-xs">Payment Method</span>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-700" />
                    <span className="text-[11px]">UPI (GPay/PhonePe)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'cod'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-700" />
                    <span className="text-[11px]">Cash on Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <span className="text-[11px]">Debit / Cards</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer CTA */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 uppercase block font-semibold">Total Bill</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono">₹{total.toFixed(0)}</span>
              </div>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                ₹{kisanPayoutTotal.toFixed(0)} to kisan
              </span>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                <span>Select Address & Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 uppercase tracking-wide"
                >
                  {isSubmitting ? 'Placing with Khet...' : `Pay ₹${total.toFixed(0)} · Place Order`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
