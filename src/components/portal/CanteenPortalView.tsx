import React, { useState, useEffect } from 'react';
import { 
  Utensils, Coffee, Clock, CheckCircle2, TrendingUp, 
  AlertCircle, Plus, Check, Trash2, ArrowRight, ShieldCheck
} from 'lucide-react';
import { 
  CanteenItem, CanteenOrder, campusStore 
} from '../../services/campusStore';

export default function CanteenPortalView() {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'stats'>('orders');
  const [orders, setOrders] = useState<CanteenOrder[]>([]);
  const [items, setItems] = useState<CanteenItem[]>([]);

  // Add Item Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('40');
  const [newItemCat, setNewItemCat] = useState('Snacks');
  const [newItemPrep, setNewItemPrep] = useState('5');
  const [newItemDesc, setNewItemDesc] = useState('');

  useEffect(() => {
    const update = () => {
      setOrders(campusStore.getCanteenOrders());
      setItems(campusStore.getCanteenItems());
    };
    update();
    return campusStore.subscribe(update);
  }, []);

  const advanceOrderStatus = (orderId: string, currentStatus: CanteenOrder['status']) => {
    const nextStatusMap: Record<CanteenOrder['status'], CanteenOrder['status']> = {
      'CART': 'PENDING_PAYMENT',
      'PENDING_PAYMENT': 'CONFIRMED',
      'PAID': 'CONFIRMED',
      'CONFIRMED': 'PREPARING',
      'PREPARING': 'READY',
      'READY': 'COMPLETED',
      'COMPLETED': 'COMPLETED',
      'CANCELLED': 'CANCELLED'
    };

    const nextStatus = nextStatusMap[currentStatus];
    if (nextStatus) {
      campusStore.updateCanteenOrderStatus(orderId, nextStatus);
    }
  };

  const toggleItemAvailability = (itemId: string, current: boolean) => {
    campusStore.toggleCanteenItemAvailability(itemId, !current);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    campusStore.addCanteenItem({
      name: newItemName,
      category: newItemCat,
      price: Number(newItemPrice) || 30,
      description: newItemDesc || 'Freshly prepared at Sathaye Canteen.',
      isAvailable: true,
      isVeg: true,
      prepTimeMinutes: Number(newItemPrep) || 5,
      calories: 220,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300'
    });

    setShowAddModal(false);
    setNewItemName('');
    setNewItemDesc('');
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const completedOrders = orders.filter(o => o.status === 'COMPLETED').length;
  const activeOrders = orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-[#003366] text-white rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-4 border-yellow-500 shadow-sm">
        <div>
          <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider block mb-1">
            Kitchen & Counter Operations
          </span>
          <h2 className="text-2xl font-extrabold">Sathaye Canteen Management Desk</h2>
          <p className="text-xs text-blue-200">Terminal ID: CANTEEN-MGR-01 • Real-time order dispatch</p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'orders' ? 'bg-yellow-500 text-[#003366] shadow' : 'bg-blue-900/80 text-white hover:bg-blue-800'
            }`}
          >
            Live Orders ({activeOrders})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'inventory' ? 'bg-yellow-500 text-[#003366] shadow' : 'bg-blue-900/80 text-white hover:bg-blue-800'
            }`}
          >
            Menu Stock ({items.length})
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-xs font-bold uppercase text-gray-400">Total Today's Sales</p>
          <h3 className="text-2xl font-extrabold text-[#003366] mt-1">₹{totalRevenue}</h3>
          <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded mt-1 inline-block">
            Autonomous Subsidy Settled
          </span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-xs font-bold uppercase text-gray-400">Orders In Kitchen</p>
          <h3 className="text-2xl font-extrabold text-yellow-600 mt-1">{activeOrders}</h3>
          <span className="text-[10px] text-gray-500 font-medium mt-1 inline-block">
            Estimated queue wait: ~6 mins
          </span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-xs font-bold uppercase text-gray-400">Tokens Dispatched</p>
          <h3 className="text-2xl font-extrabold text-green-700 mt-1">{completedOrders}</h3>
          <span className="text-[10px] text-gray-500 font-medium mt-1 inline-block">
            100% On-time pickup record
          </span>
        </div>
      </div>

      {/* TAB 1: LIVE ORDERS QUEUE */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-extrabold text-[#003366] uppercase tracking-wide text-sm">
              Live Token Dispatch Board
            </h3>
            <span className="text-xs font-bold text-gray-500">Auto-refreshing stream</span>
          </div>

          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <div key={order.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-[#003366] text-yellow-400 font-black text-xl rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                    #{order.tokenNumber}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900 text-base">{order.studentName}</span>
                      <span className="text-xs text-gray-400 font-mono">({order.studentRollNo || order.studentId})</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                        order.status === 'READY' ? 'bg-green-600 text-white animate-pulse' :
                        order.status === 'PREPARING' ? 'bg-yellow-500 text-[#003366]' :
                        order.status === 'COMPLETED' ? 'bg-gray-200 text-gray-700' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-gray-700 font-semibold space-x-2">
                      {order.items.map((it, idx) => (
                        <span key={idx} className="inline-block bg-gray-100 px-2 py-0.5 rounded mr-1">
                          {it.quantity}x {it.name}
                        </span>
                      ))}
                    </div>

                    <p className="text-[11px] text-gray-500 mt-1">
                      Ordered at: {order.createdAt} • Pickup: <strong>{order.pickupSlot || 'Counter 1'}</strong> • Paid: ₹{order.totalAmount}
                    </p>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="flex items-center space-x-2 self-end md:self-center">
                  {order.status !== 'COMPLETED' && (
                    <button
                      onClick={() => advanceOrderStatus(order.id, order.status)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center ${
                        order.status === 'CONFIRMED' ? 'bg-yellow-500 hover:bg-yellow-600 text-[#003366]' :
                        order.status === 'PREPARING' ? 'bg-green-600 hover:bg-green-700 text-white animate-pulse' :
                        'bg-[#003366] hover:bg-blue-800 text-white'
                      }`}
                    >
                      <span>
                        {order.status === 'CONFIRMED' ? 'Start Preparing' :
                         order.status === 'PREPARING' ? 'Mark Ready for Pickup' :
                         order.status === 'READY' ? 'Complete Handover' : 'Advance Status'}
                      </span>
                      <ArrowRight size={14} className="ml-1" />
                    </button>
                  )}
                  {order.status === 'COMPLETED' && (
                    <span className="text-xs font-bold text-gray-400 flex items-center">
                      <Check size={14} className="mr-1 text-green-600" /> Dispatched
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & MENU */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-[#003366] uppercase tracking-wide text-base">Menu Item Availability</h3>
              <p className="text-xs text-gray-500">Toggle live availability for students or add today's special dishes</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#003366] hover:bg-blue-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow flex items-center"
            >
              <Plus size={14} className="mr-1" /> Add Special Item
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  item.isAvailable ? 'border-gray-200 bg-white' : 'border-red-200 bg-red-50/50 opacity-75'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.category} • ~{item.prepTimeMinutes} mins</p>
                  </div>
                  <span className="font-extrabold text-base text-[#003366]">₹{item.price}</span>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                    item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.isAvailable ? 'In Stock' : 'Sold Out'}
                  </span>

                  <button
                    onClick={() => toggleItemAvailability(item.id, item.isAvailable)}
                    className={`text-xs font-bold px-3 py-1 rounded transition-colors ${
                      item.isAvailable
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    Set {item.isAvailable ? 'Sold Out' : 'Available'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Special Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border-t-4 border-[#003366]">
            <h3 className="text-lg font-bold text-[#003366] mb-3 uppercase">Add Special Canteen Item</h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schezwan Fried Rice / Kanda Poha"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={newItemCat}
                    onChange={(e) => setNewItemCat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Meals">Meals</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Healthy">Healthy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Fresh ingredients, served hot"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#003366] hover:bg-blue-800 rounded-lg uppercase"
                >
                  Publish to Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
