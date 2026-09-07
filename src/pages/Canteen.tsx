import React, { useState, useEffect } from 'react';
import { 
  Coffee, Utensils, Clock, CheckCircle2, ShoppingBag, 
  Plus, Minus, Trash2, ArrowRight, Sparkles, Navigation, AlertCircle, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  CanteenItem, CanteenOrder, campusStore 
} from '../services/campusStore';

export default function Canteen() {
  const [items, setItems] = useState<CanteenItem[]>([]);
  const [orders, setOrders] = useState<CanteenOrder[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI' | 'CASH'>('CARD');
  const [placedOrder, setPlacedOrder] = useState<CanteenOrder | null>(null);

  useEffect(() => {
    const updateData = () => {
      setItems(campusStore.getCanteenItems());
      const user = campusStore.getCurrentUser();
      if (user) {
        setOrders(campusStore.getOrdersForStudent(user.id));
      }
    };

    updateData();
    return campusStore.subscribe(updateData);
  }, []);

  const categories = ['All', 'Breakfast', 'Snacks', 'Meals', 'Beverages', 'Healthy'];

  const filteredItems = items.filter(item => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  const addToCart = (itemId: string) => {
    setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const next = { ...prev };
      if (next[itemId] > 1) {
        next[itemId]--;
      } else {
        delete next[itemId];
      }
      return next;
    });
  };

  const cartTotal = (Object.entries(cart) as [string, number][]).reduce((sum: number, [itemId, qty]: [string, number]) => {
    const item = items.find(i => i.id === itemId);
    return sum + (item ? item.price * Number(qty) : 0);
  }, 0);

  const cartCount = (Object.values(cart) as number[]).reduce((sum: number, q: number) => sum + Number(q), 0);

  const handleCheckout = () => {
    if (cartCount === 0) return;

    const orderItems = (Object.entries(cart) as [string, number][]).map(([itemId, qty]) => {
      const item = items.find(i => i.id === itemId)!;
      return {
        itemId,
        name: item.name,
        price: item.price,
        quantity: Number(qty)
      };
    });

    const newOrder = campusStore.placeCanteenOrder(orderItems);
    setPlacedOrder(newOrder);
    setCart({});
    setIsCheckingOut(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-16">
      
      {/* Header Banner */}
      <div className="bg-[#003366] text-white py-8 border-b-4 border-yellow-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="bg-yellow-500 text-[#003366] text-xs font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                Smart Food Court
              </span>
              <span className="text-xs text-blue-200">Express Pre-Order & Digital Dining</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight">
              Sathaye Central Canteen
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-1">
              Hygienic subsidized meals, snacks & beverages. Avoid counter rush with digital token pickup.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/map?target=loc-canteen-counter"
              className="inline-flex items-center bg-blue-900/80 hover:bg-blue-800 text-yellow-400 border border-blue-700 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors"
            >
              <Navigation size={14} className="mr-1.5" /> Navigate to Canteen
            </Link>

            <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20 text-center">
              <span className="block text-[10px] text-gray-300 uppercase tracking-wider font-semibold">Avg. Prep Time</span>
              <span className="text-sm font-extrabold text-yellow-400 flex items-center justify-center">
                <Clock size={12} className="mr-1" /> 6-8 Mins
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Active Order Banner if Placed or Preparing */}
        {orders.length > 0 && orders[0].status !== 'COMPLETED' && (
          <div className="mb-8 bg-white rounded-xl shadow-md border-2 border-yellow-500 p-5 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="w-14 h-14 bg-yellow-100 text-yellow-800 rounded-xl flex items-center justify-center font-extrabold text-xl shrink-0 border border-yellow-300 shadow-sm">
                  #{orders[0].tokenNumber}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Live Active Order</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      orders[0].status === 'READY' 
                        ? 'bg-green-600 text-white animate-pulse' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {orders[0].status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-0.5">
                    {orders[0].items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Pickup: <strong>{orders[0].pickupSlot || 'Counter 1'}</strong> • Est: {orders[0].estimatedTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  to="/map?target=loc-canteen-counter"
                  className="bg-[#003366] hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg uppercase tracking-wider transition-colors shadow"
                >
                  Pickup Route
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Menu Items List */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Category Filter Pills */}
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-[#003366] text-yellow-400 shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Food Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const inCartQty = cart[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden hover:border-[#003366] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 flex space-x-1.5">
                          <span className="w-5 h-5 bg-white rounded border border-green-600 flex items-center justify-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span>
                          </span>
                          <span className="bg-[#003366]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                            {item.category}
                          </span>
                        </div>
                        {item.calories && (
                          <span className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                            {item.calories} kcal
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-gray-900 text-base leading-snug">{item.name}</h4>
                          <span className="font-extrabold text-lg text-[#003366]">₹{item.price}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-gray-100">
                      <span className="text-[11px] text-gray-500 flex items-center">
                        <Clock size={12} className="mr-1 text-yellow-600" /> ~{item.prepTimeMinutes}m
                      </span>

                      {item.isAvailable ? (
                        inCartQty > 0 ? (
                          <div className="flex items-center space-x-2 bg-blue-50 px-2 py-1 rounded-lg border border-[#003366]/20">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-6 h-6 rounded bg-white text-[#003366] flex items-center justify-center font-bold text-sm shadow-xs hover:bg-gray-100"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-xs font-bold text-[#003366] px-1">{inCartQty}</span>
                            <button
                              onClick={() => addToCart(item.id)}
                              className="w-6 h-6 rounded bg-[#003366] text-white flex items-center justify-center font-bold text-sm shadow-xs hover:bg-blue-800"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item.id)}
                            className="bg-[#003366] hover:bg-blue-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors shadow-xs"
                          >
                            Add +
                          </button>
                        )
                      ) : (
                        <span className="text-xs font-bold text-gray-400">Sold Out</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart & Checkout Panel */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <h3 className="font-extrabold text-[#003366] uppercase tracking-wide flex items-center">
                  <ShoppingBag size={18} className="mr-2 text-yellow-500" /> Canteen Tray ({cartCount})
                </h3>
                {cartCount > 0 && (
                  <button 
                    onClick={() => setCart({})}
                    className="text-xs text-red-600 hover:text-red-700 font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {cartCount === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Utensils size={36} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-semibold text-gray-500">Your food tray is empty</p>
                  <p className="text-xs text-gray-400 mt-1">Select breakfast or meals from the menu to pre-order.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {(Object.entries(cart) as [string, number][]).map(([itemId, qty]) => {
                      const item = items.find(i => i.id === itemId);
                      if (!item) return null;
                      return (
                        <div key={itemId} className="flex justify-between items-center text-sm">
                          <div className="flex-grow pr-2">
                            <h5 className="font-bold text-gray-800 leading-snug">{item.name}</h5>
                            <span className="text-xs text-gray-400">₹{item.price} each</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-gray-700">{qty}x</span>
                            <span className="font-bold text-sm text-gray-900 w-12 text-right">₹{item.price * Number(qty)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Subtotal</span>
                      <span>₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-xs text-green-700 font-medium">
                      <span>College Subsidy Benefit</span>
                      <span>Included</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total Due</span>
                      <span className="text-[#003366]">₹{cartTotal}</span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Simulated Campus Payment</label>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                      <button
                        onClick={() => setPaymentMethod('CARD')}
                        className={`p-2 rounded-lg border transition-all ${paymentMethod === 'CARD' ? 'border-[#003366] bg-blue-50 text-[#003366]' : 'border-gray-200 text-gray-600'}`}
                      >
                        Student ID
                      </button>
                      <button
                        onClick={() => setPaymentMethod('UPI')}
                        className={`p-2 rounded-lg border transition-all ${paymentMethod === 'UPI' ? 'border-[#003366] bg-blue-50 text-[#003366]' : 'border-gray-200 text-gray-600'}`}
                      >
                        UPI Pay
                      </button>
                      <button
                        onClick={() => setPaymentMethod('CASH')}
                        className={`p-2 rounded-lg border transition-all ${paymentMethod === 'CASH' ? 'border-[#003366] bg-blue-50 text-[#003366]' : 'border-gray-200 text-gray-600'}`}
                      >
                        Cash Counter
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-[#003366] hover:bg-blue-800 text-white rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow flex items-center justify-center space-x-2"
                  >
                    <span>Confirm & Generate Token</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Timing & Rules Card */}
            <div className="bg-yellow-50/70 p-4 rounded-xl border border-yellow-200 text-xs text-gray-700 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-[#003366] uppercase tracking-wide">
                <ShieldCheck size={16} />
                <span>Canteen Guidelines</span>
              </div>
              <p>Breakfast served 07:30 AM - 11:30 AM. Lunch thali counter opens 12:00 PM - 03:00 PM.</p>
              <p>Digital pre-order tokens are valid for 20 minutes from preparation announcement.</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
