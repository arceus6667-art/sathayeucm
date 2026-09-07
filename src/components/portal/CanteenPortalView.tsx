import React, { useState, useEffect, useRef } from 'react';
import { 
  Utensils, Coffee, Clock, CheckCircle2, TrendingUp, 
  AlertCircle, Plus, Check, Trash2, ArrowRight, ShieldCheck,
  QrCode, ScanLine, Camera, RefreshCw, XCircle, AlertTriangle, 
  Users, Flame, Search, ChevronRight, Edit3, DollarSign,
  PackageCheck, Smartphone, CheckCheck
} from 'lucide-react';
import { 
  CanteenItem, CanteenOrder, campusStore 
} from '../../services/campusStore';

type TabType = 'orders' | 'scanner' | 'inventory' | 'queue' | 'stats';
type OrderStatusFilter = 'ALL' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

interface TokenVerificationResult {
  valid: boolean;
  reason?: string;
  order?: {
    id: string;
    orderNumber: string;
    userEmail?: string;
    studentName?: string;
    studentId?: string;
    items: Array<{ itemId: string; name: string; quantity: number; price: number }>;
    totalAmount: number;
    pickupSlot?: string;
    status: string;
    paymentStatus?: string;
    tokenCode?: string;
    createdAt?: string;
  };
  token?: {
    id: string;
    tokenCode: string;
    status: string;
    validUntil: string;
    scannedAt?: string | null;
    scannedBy?: string | null;
  };
}

export default function CanteenPortalView() {
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('ALL');
  const [orders, setOrders] = useState<CanteenOrder[]>([]);
  const [items, setItems] = useState<CanteenItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Queue state
  const [queueLength, setQueueLength] = useState<number>(14);
  const [estimatedWaitMins, setEstimatedWaitMins] = useState<number>(10);
  const [queueStatus, setQueueStatus] = useState<'NORMAL' | 'BUSY' | 'CLOSED'>('NORMAL');
  const [queueUpdating, setQueueUpdating] = useState(false);
  const [queueSuccessMsg, setQueueSuccessMsg] = useState('');

  // Scanner state
  const [tokenInput, setTokenInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<TokenVerificationResult | null>(null);
  const [handoverInProgress, setHandoverInProgress] = useState(false);
  const [handoverSuccess, setHandoverSuccess] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Add Item Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('40');
  const [newItemStock, setNewItemStock] = useState('40');
  const [newItemCat, setNewItemCat] = useState<'Breakfast' | 'Snacks' | 'Meals' | 'Beverages' | 'Healthy'>('Snacks');
  const [newItemPrep, setNewItemPrep] = useState('5');
  const [newItemDesc, setNewItemDesc] = useState('');

  // Quick edit stock state
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editingStockVal, setEditingStockVal] = useState<number>(0);

  // Sync with store and server
  const refreshData = async () => {
    // 1. Try server orders & menu first
    try {
      const ordRes = await fetch('/api/canteen/orders');
      if (ordRes.ok) {
        const data = await ordRes.json();
        if (data.orders && Array.isArray(data.orders)) {
          // Map server order format to CanteenOrder format if needed
          const mapped: CanteenOrder[] = data.orders.map((o: any) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            studentId: o.studentId || o.userEmail?.split('@')[0] || 'stu-demo',
            studentName: o.studentName || o.userEmail?.split('@')[0]?.toUpperCase() || 'Student',
            items: o.items || [],
            totalAmount: o.totalAmount || 0,
            subtotal: o.subtotal,
            convenienceFee: o.convenienceFee,
            status: o.status,
            tokenNumber: o.orderNumber ? parseInt(o.orderNumber.slice(-4)) || 10 : 10,
            token: o.tokenCode,
            tokenCode: o.tokenCode,
            estimatedTime: '8-10 mins',
            createdAt: o.createdAt || new Date().toISOString(),
            pickupSlot: o.pickupSlot || 'Counter 1',
            paymentStatus: o.paymentStatus || 'PAID_SANDBOX',
            paymentMethod: o.paymentMethod || 'Demo Card',
            customerNote: o.customerNote || ''
          }));
          setOrders(mapped);
        }
      } else {
        setOrders(campusStore.getCanteenOrders());
      }
    } catch {
      setOrders(campusStore.getCanteenOrders());
    }

    // 2. Menu Items
    try {
      const menuRes = await fetch('/api/canteen/menu');
      if (menuRes.ok) {
        const data = await menuRes.json();
        if (data.items) setItems(data.items);
      } else {
        setItems(campusStore.getCanteenItems());
      }
    } catch {
      setItems(campusStore.getCanteenItems());
    }

    // 3. Queue
    try {
      const qRes = await fetch('/api/canteen/queue');
      if (qRes.ok) {
        const data = await qRes.json();
        if (data.queue) {
          setQueueLength(data.queue.queueLength);
          setEstimatedWaitMins(data.queue.estimatedWaitMins);
          setQueueStatus(data.queue.status);
        }
      }
    } catch {
      const q = campusStore.getCanteenQueue();
      setQueueLength(q.queueLength);
      setEstimatedWaitMins(q.estimatedWaitMins);
      setQueueStatus(q.status);
    }
  };

  useEffect(() => {
    refreshData();
    const unsub = campusStore.subscribe(refreshData);
    const interval = setInterval(refreshData, 12000);
    return () => {
      unsub();
      clearInterval(interval);
      stopCamera();
    };
  }, []);

  // Status advancement handler
  const advanceOrderStatus = async (orderId: string, currentStatus: CanteenOrder['status']) => {
    const nextStatusMap: Partial<Record<CanteenOrder['status'], CanteenOrder['status']>> = {
      'CONFIRMED': 'PREPARING',
      'PREPARING': 'READY',
      'READY': 'COMPLETED'
    };

    const nextStatus = nextStatusMap[currentStatus];
    if (!nextStatus) return;

    try {
      const res = await fetch(`/api/canteen/order/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, staffEmail: 'canteen@sathaye.edu' })
      });
      if (res.ok) {
        refreshData();
      } else {
        campusStore.updateCanteenOrderStatus(orderId, nextStatus);
      }
    } catch {
      campusStore.updateCanteenOrderStatus(orderId, nextStatus);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order and process a demo refund?')) return;
    try {
      const res = await fetch(`/api/canteen/order/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Cancelled by kitchen operator' })
      });
      if (res.ok) {
        refreshData();
      } else {
        campusStore.updateCanteenOrderStatus(orderId, 'CANCELLED');
      }
    } catch {
      campusStore.updateCanteenOrderStatus(orderId, 'CANCELLED');
    }
  };

  // Toggle item availability
  const toggleItemAvailability = async (item: CanteenItem) => {
    const next = !item.isAvailable;
    try {
      await fetch(`/api/canteen/menu/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: next, staffEmail: 'canteen@sathaye.edu' })
      });
    } catch { /* ignore */ }
    campusStore.toggleCanteenItemAvailability(item.id, next);
    refreshData();
  };

  // Update item stock
  const saveItemStock = async (itemId: string, newStock: number) => {
    try {
      await fetch(`/api/canteen/menu/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock, isAvailable: newStock > 0, staffEmail: 'canteen@sathaye.edu' })
      });
    } catch { /* ignore */ }
    campusStore.updateCanteenItemStock(itemId, newStock);
    setEditingStockId(null);
    refreshData();
  };

  // Update Queue Settings
  const handleUpdateQueue = async () => {
    setQueueUpdating(true);
    setQueueSuccessMsg('');
    try {
      const res = await fetch('/api/canteen/queue', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queueLength,
          estimatedWaitMins,
          status: queueStatus,
          staffEmail: 'canteen@sathaye.edu'
        })
      });
      if (res.ok) {
        setQueueSuccessMsg('Queue parameters updated live for all campus students!');
        setTimeout(() => setQueueSuccessMsg(''), 3500);
      }
    } catch {
      setQueueSuccessMsg('Updated locally in memory.');
      setTimeout(() => setQueueSuccessMsg(''), 3500);
    }
    setQueueUpdating(false);
  };

  // Scanner & Token Verification
  const verifyToken = async (codeToVerify?: string) => {
    const code = (codeToVerify || tokenInput).trim().toUpperCase();
    if (!code) return;
    setVerifying(true);
    setVerificationResult(null);
    setHandoverSuccess(false);

    try {
      const res = await fetch('/api/canteen/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenCode: code, staffEmail: 'canteen@sathaye.edu' })
      });
      const data = await res.json();
      setVerificationResult(data);
    } catch {
      // Fallback local search
      const order = orders.find(o => o.tokenCode?.toUpperCase() === code || o.token === code);
      if (order) {
        if (order.status === 'COMPLETED') {
          setVerificationResult({
            valid: false,
            reason: 'This meal token has already been used and collected.',
            order
          });
        } else if (order.status === 'CANCELLED') {
          setVerificationResult({
            valid: false,
            reason: 'This order has been cancelled and refunded.',
            order
          });
        } else {
          setVerificationResult({
            valid: true,
            order,
            token: {
              id: 'tk-' + order.id,
              tokenCode: code,
              status: 'ACTIVE',
              validUntil: new Date(Date.now() + 3600000).toISOString()
            }
          });
        }
      } else {
        setVerificationResult({
          valid: false,
          reason: `No active order found for token code "${code}". Please check token again.`
        });
      }
    }
    setVerifying(false);
  };

  // Confirm Handover
  const confirmHandover = async () => {
    const code = verificationResult?.token?.tokenCode || verificationResult?.order?.tokenCode || tokenInput.trim().toUpperCase();
    if (!code) return;
    setHandoverInProgress(true);

    try {
      const res = await fetch('/api/canteen/handover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenCode: code, staffEmail: 'canteen@sathaye.edu' })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setHandoverSuccess(true);
        if (verificationResult?.order?.id) {
          campusStore.updateCanteenOrderStatus(verificationResult.order.id, 'COMPLETED');
        }
        refreshData();
      } else {
        alert(data.error || 'Failed to complete handover.');
      }
    } catch {
      // Fallback local complete
      if (verificationResult?.order?.id) {
        campusStore.updateCanteenOrderStatus(verificationResult.order.id, 'COMPLETED');
      }
      setHandoverSuccess(true);
      refreshData();
    }
    setHandoverInProgress(false);
  };

  // Camera QR scanner integration
  const startCamera = async () => {
    setScannerError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);

      // Simple browser-native BarcodeDetector if supported
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        const scanInterval = setInterval(async () => {
          if (!videoRef.current || !streamRef.current) {
            clearInterval(scanInterval);
            return;
          }
          try {
            const barcodes = await barcodeDetector.detect(videoRef.current);
            if (barcodes.length > 0) {
              const rawValue = barcodes[0].rawValue;
              stopCamera();
              setTokenInput(rawValue);
              verifyToken(rawValue);
              clearInterval(scanInterval);
            }
          } catch { /* continue scanning */ }
        }, 600);
      }
    } catch (err: any) {
      setScannerError('Camera permission denied or camera not accessible. Please enter token code manually below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Add Item Handler
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    campusStore.addCanteenItem({
      name: newItemName,
      category: newItemCat,
      price: Number(newItemPrice) || 30,
      stock: Number(newItemStock) || 40,
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
    refreshData();
  };

  // Metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const completedOrders = orders.filter(o => o.status === 'COMPLETED').length;
  const activeOrders = orders.filter(o => ['CONFIRMED', 'PREPARING', 'READY'].includes(o.status)).length;
  const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length;
  const lowStockItems = items.filter(i => (i.stock ?? 50) < 15);

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesSearch = !searchQuery || 
      order.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.orderNumber && order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.tokenCode && order.tokenCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      String(order.tokenNumber).includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4 font-sans">
      
      {/* Top Banner - Compact for laptop viewports */}
      <div className="bg-[#003366] text-white rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-l-4 border-yellow-500 shadow-md">
        <div>
          <div className="flex items-center space-x-2 mb-0.5">
            <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full">
              Kitchen & Meal Token Dispatch
            </span>
            <span className="text-[11px] text-blue-200">• Terminal #CAN-POS-01</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">Sathaye Canteen Management Portal</h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Real-time digital token validation, order preparation pipeline & stock control.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === 'orders' ? 'bg-yellow-500 text-[#003366] shadow-md font-extrabold' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Utensils size={13} />
            <span>Orders ({activeOrders})</span>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === 'scanner' ? 'bg-yellow-500 text-[#003366] shadow-md font-extrabold' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <ScanLine size={13} />
            <span>Token Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === 'inventory' ? 'bg-yellow-500 text-[#003366] shadow-md font-extrabold' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Coffee size={13} />
            <span>Menu & Stock ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === 'queue' ? 'bg-yellow-500 text-[#003366] shadow-md font-extrabold' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Users size={13} />
            <span>Queue Display</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              activeTab === 'stats' ? 'bg-yellow-500 text-[#003366] shadow-md font-extrabold' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <TrendingUp size={13} />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase text-gray-400">Today's Revenue</p>
          <h3 className="text-xl sm:text-2xl font-black text-[#003366] mt-0.5">₹{totalRevenue}</h3>
          <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded mt-1 inline-block">
            Autonomous Subsidy Active
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase text-gray-400">Kitchen Pipeline</p>
          <h3 className="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">{activeOrders} Active</h3>
          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded mt-1 inline-block">
            Est. Wait: ~{estimatedWaitMins} mins
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase text-gray-400">Completed Orders</p>
          <h3 className="text-xl sm:text-2xl font-black text-green-700 mt-0.5">{completedOrders} Tokens</h3>
          <span className="text-[10px] text-gray-500 font-medium mt-1 inline-block">
            {cancelledOrders} cancelled
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <p className="text-[11px] font-bold uppercase text-gray-400">Low Stock Alert</p>
          <h3 className={`text-xl sm:text-2xl font-black mt-0.5 ${lowStockItems.length > 0 ? 'text-red-600' : 'text-gray-700'}`}>
            {lowStockItems.length} Items
          </h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block ${
            lowStockItems.length > 0 ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {lowStockItems.length > 0 ? 'Action needed' : 'All items in stock'}
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: LIVE ORDERS QUEUE
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
          {/* Filter Bar */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h3 className="font-extrabold text-[#003366] uppercase tracking-wide text-sm">
                Kitchen Order Preparation Board
              </h3>
              <p className="text-xs text-gray-500">Advance order states or scan tokens to hand over meals</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search token / student..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as OrderStatusFilter)}
                className="text-xs font-bold py-1.5 px-3 rounded-lg border border-gray-300 bg-white text-[#003366]"
              >
                <option value="ALL">All Statuses ({orders.length})</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PREPARING">Preparing</option>
                <option value="READY">Ready for Pickup</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <button
                onClick={refreshData}
                className="p-1.5 text-gray-500 hover:text-[#003366] bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                title="Refresh"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="divide-y divide-gray-100 max-h-[calc(100vh-310px)] overflow-y-auto pr-1">
            {filteredOrders.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <PackageCheck size={36} className="mx-auto text-gray-300 mb-2" />
                <p className="font-bold text-gray-700">No orders match this filter.</p>
                <p className="text-xs mt-1">Try selecting another status tab or clear your search query.</p>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div 
                  key={order.id} 
                  className={`p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 transition-colors ${
                    order.status === 'READY' ? 'bg-green-50/40' :
                    order.status === 'PREPARING' ? 'bg-amber-50/30' :
                    order.status === 'CANCELLED' ? 'bg-gray-50/80 opacity-60' : 'hover:bg-gray-50/60'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Token Box */}
                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-xs border ${
                      order.status === 'READY' ? 'bg-green-600 text-white border-green-700 animate-pulse' :
                      order.status === 'PREPARING' ? 'bg-amber-500 text-white border-amber-600' :
                      order.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600 border-gray-300' :
                      order.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-200' :
                      'bg-[#003366] text-yellow-400 border-blue-900'
                    }`}>
                      <span className="text-[9px] font-bold uppercase leading-none">Token</span>
                      <span className="font-black text-lg leading-tight">#{order.tokenNumber || order.orderNumber?.slice(-3) || '00'}</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-gray-900 text-base">{order.studentName}</span>
                        {order.orderNumber && (
                          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            {order.orderNumber}
                          </span>
                        )}
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          order.status === 'READY' ? 'bg-green-100 text-green-800 border border-green-300' :
                          order.status === 'PREPARING' ? 'bg-orange-100 text-orange-800 border border-orange-300' :
                          order.status === 'CONFIRMED' ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' :
                          order.status === 'COMPLETED' ? 'bg-gray-100 text-gray-700 border border-gray-300' :
                          'bg-red-100 text-red-700 border border-red-300'
                        }`}>
                          {order.status}
                        </span>

                        {order.tokenCode && (
                          <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            Code: {order.tokenCode}
                          </span>
                        )}
                      </div>

                      {/* Items */}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {order.items.map((it, idx) => (
                          <span key={idx} className="text-xs bg-white border border-gray-200 px-2.5 py-1 rounded-lg font-medium text-gray-800 shadow-2xs">
                            <strong className="text-[#003366] font-bold">{it.quantity}×</strong> {it.name}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-gray-500">
                        <span>Pickup Slot: <strong className="text-gray-800">{order.pickupSlot || 'Counter 1'}</strong></span>
                        <span>Total Paid: <strong className="text-green-700 font-bold">₹{order.totalAmount}</strong></span>
                        {order.customerNote && (
                          <span className="text-amber-700 italic">Note: "{order.customerNote}"</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                    {order.status === 'CONFIRMED' && (
                      <>
                        <button
                          onClick={() => advanceOrderStatus(order.id, 'CONFIRMED')}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-[#003366] font-extrabold text-xs rounded-xl shadow-xs flex items-center space-x-1"
                        >
                          <Flame size={14} />
                          <span>Start Preparing</span>
                        </button>
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl"
                          title="Cancel order"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => advanceOrderStatus(order.id, 'PREPARING')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center space-x-1 animate-pulse"
                      >
                        <CheckCircle2 size={14} />
                        <span>Mark Ready for Pickup</span>
                      </button>
                    )}

                    {order.status === 'READY' && (
                      <button
                        onClick={() => {
                          setActiveTab('scanner');
                          if (order.tokenCode) {
                            setTokenInput(order.tokenCode);
                            verifyToken(order.tokenCode);
                          }
                        }}
                        className="px-4 py-2 bg-[#003366] hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center space-x-1.5"
                      >
                        <ScanLine size={14} />
                        <span>Verify & Hand Over</span>
                      </button>
                    )}

                    {order.status === 'COMPLETED' && (
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg flex items-center">
                        <CheckCheck size={14} className="mr-1 text-green-600" /> Collected
                      </span>
                    )}

                    {order.status === 'CANCELLED' && (
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg flex items-center">
                        <XCircle size={14} className="mr-1" /> Refunded
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: TOKEN SCANNER & VERIFICATION
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scanner Input Column */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6 space-y-4">
              <div>
                <h3 className="font-extrabold text-[#003366] text-lg uppercase tracking-wide flex items-center space-x-2">
                  <ScanLine className="text-yellow-500" />
                  <span>Meal Token Verification Counter</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Scan the student's meal token QR code or manually enter the 12-character token code.
                </p>
              </div>

              {/* Camera Scanner Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50">
                {cameraActive ? (
                  <div className="space-y-3">
                    <div className="relative max-w-sm mx-auto overflow-hidden rounded-xl border-2 border-yellow-500 shadow-md aspect-video bg-black flex items-center justify-center">
                      <video ref={videoRef} playsInline autoPlay className="w-full h-full object-cover" />
                      <div className="absolute inset-0 border-2 border-green-400 opacity-70 pointer-events-none animate-pulse m-8 rounded-lg" />
                    </div>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg"
                    >
                      Stop Camera
                    </button>
                  </div>
                ) : (
                  <div className="py-6 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-[#003366] mx-auto flex items-center justify-center">
                      <Camera size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Camera QR Scanner</p>
                      <p className="text-xs text-gray-500 mt-0.5">Use device camera to instantly scan token</p>
                    </div>
                    <button
                      onClick={startCamera}
                      className="px-5 py-2.5 bg-[#003366] hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs uppercase tracking-wider"
                    >
                      Start Camera Scanner
                    </button>
                    {scannerError && (
                      <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg mt-2">{scannerError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Manual Entry Fallback */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-extrabold text-gray-700 uppercase">
                  Manual Token Code Input
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. A1B2-C3D4-E5F6"
                    value={tokenInput}
                    onChange={e => setTokenInput(e.target.value.toUpperCase())}
                    onKeyDown={e => { if (e.key === 'Enter') verifyToken(); }}
                    className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-mono uppercase tracking-wider focus:ring-2 focus:ring-[#003366] outline-none"
                  />
                  <button
                    onClick={() => verifyToken()}
                    disabled={verifying || !tokenInput.trim()}
                    className="px-5 py-2.5 bg-[#003366] hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl uppercase tracking-wider shadow-xs"
                  >
                    {verifying ? 'Checking...' : 'Verify'}
                  </button>
                </div>
              </div>

              {/* Quick test buttons */}
              <div className="pt-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase mb-1.5">Quick Demo Verification:</p>
                <div className="flex flex-wrap gap-1.5">
                  {orders.filter(o => o.tokenCode).slice(0, 3).map(o => (
                    <button
                      key={o.id}
                      onClick={() => {
                        setTokenInput(o.tokenCode || '');
                        verifyToken(o.tokenCode || '');
                      }}
                      className="text-[11px] font-mono bg-gray-100 hover:bg-blue-50 hover:text-[#003366] px-2.5 py-1 rounded-lg border border-gray-200"
                    >
                      {o.tokenCode} ({o.status})
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setTokenInput('DEMO-USED-1');
                      verifyToken('DEMO-USED-1');
                    }}
                    className="text-[11px] font-mono bg-red-50 text-red-700 hover:bg-red-100 px-2.5 py-1 rounded-lg border border-red-200"
                  >
                    DEMO-USED-1 (Test Double-Scan)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Result Column */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6 space-y-4">
              <h3 className="font-extrabold text-[#003366] text-sm uppercase tracking-wide border-b border-gray-100 pb-3">
                Token Status & Order Details
              </h3>

              {!verificationResult && !handoverSuccess ? (
                <div className="p-12 text-center text-gray-400">
                  <QrCode size={48} className="mx-auto text-gray-200 mb-2" />
                  <p className="font-bold text-gray-600">Waiting for token scan or input...</p>
                  <p className="text-xs mt-1">Scanned order details will be displayed here immediately.</p>
                </div>
              ) : null}

              {/* SUCCESSFUL HANDOVER MESSAGE */}
              {handoverSuccess && (
                <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCheck size={26} />
                  </div>
                  <div>
                    <h4 className="font-black text-green-900 text-lg">Order Successfully Handed Over!</h4>
                    <p className="text-xs text-green-700 mt-1">
                      Token has been consumed (marked USED). Order marked COMPLETED.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setHandoverSuccess(false);
                      setVerificationResult(null);
                      setTokenInput('');
                    }}
                    className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl"
                  >
                    Scan Next Customer Token
                  </button>
                </div>
              )}

              {/* VALID TOKEN SCREEN */}
              {verificationResult && verificationResult.valid && !handoverSuccess && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
                    <CheckCircle2 className="text-green-600 shrink-0" size={24} />
                    <div>
                      <h4 className="font-black text-green-900 text-sm">VALID MEAL TOKEN</h4>
                      <p className="text-xs text-green-700">Token authenticated. Order is authorized for collection.</p>
                    </div>
                  </div>

                  {/* Order Spec */}
                  {verificationResult.order && (
                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex justify-between items-start border-b border-gray-200 pb-2">
                        <div>
                          <p className="text-xs text-gray-500 font-mono">Order #{verificationResult.order.orderNumber}</p>
                          <h4 className="font-extrabold text-gray-900 text-base">
                            {verificationResult.order.studentName || verificationResult.order.userEmail}
                          </h4>
                        </div>
                        <span className="font-black text-green-700 text-lg">
                          ₹{verificationResult.order.totalAmount} (PAID)
                        </span>
                      </div>

                      <div>
                        <p className="text-[11px] font-bold uppercase text-gray-400 mb-1">Items in Tray:</p>
                        <ul className="space-y-1">
                          {verificationResult.order.items.map((it, idx) => (
                            <li key={idx} className="flex justify-between text-xs font-medium text-gray-800 bg-white p-2 rounded-lg border border-gray-100">
                              <span><strong className="text-[#003366]">{it.quantity}×</strong> {it.name}</span>
                              <span className="font-bold">₹{it.price * it.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-[11px] text-gray-500 pt-1">
                        Pickup Slot: <strong>{verificationResult.order.pickupSlot || 'Counter 1'}</strong>
                      </div>
                    </div>
                  )}

                  {/* Confirm Button */}
                  <button
                    onClick={confirmHandover}
                    disabled={handoverInProgress}
                    className="w-full py-3.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-black text-sm rounded-xl uppercase tracking-wider shadow-md flex items-center justify-center space-x-2"
                  >
                    <PackageCheck size={18} />
                    <span>{handoverInProgress ? 'Completing Handover...' : 'Confirm Handover & Complete Order'}</span>
                  </button>
                </div>
              )}

              {/* INVALID / REJECTED TOKEN SCREEN */}
              {verificationResult && !verificationResult.valid && !handoverSuccess && (
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-start space-x-3">
                    <XCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
                    <div>
                      <h4 className="font-black text-red-900 text-base">TOKEN REJECTED</h4>
                      <p className="text-xs text-red-700 mt-1 font-medium">{verificationResult.reason}</p>
                    </div>
                  </div>

                  {verificationResult.token?.status === 'USED' && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                      <p className="text-xs font-bold text-amber-900 uppercase">Double-Scan Prevention Alert</p>
                      <p className="text-xs text-amber-800">
                        This token was already handed over and completed. 
                        {verificationResult.token.scannedAt && (
                          <span className="block mt-0.5">Scanned at: {new Date(verificationResult.token.scannedAt).toLocaleTimeString()}</span>
                        )}
                      </p>
                    </div>
                  )}

                  {verificationResult.order && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
                      <p className="text-gray-500">Related Order: <strong>{verificationResult.order.orderNumber}</strong></p>
                      <p className="text-gray-500">Order Status: <strong className="uppercase">{verificationResult.order.status}</strong></p>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setVerificationResult(null);
                      setTokenInput('');
                    }}
                    className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
                  >
                    Dismiss and Try Another Token
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: INVENTORY & STOCK MANAGEMENT
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-[#003366] uppercase tracking-wide text-base">
                Menu Item Availability & Stock Control
              </h3>
              <p className="text-xs text-gray-500">
                Adjust inventory counters, prevent overselling, or add daily specials.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#003366] hover:bg-blue-800 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow flex items-center space-x-1"
            >
              <Plus size={15} />
              <span>Add Special Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => {
              const currentStock = item.stock ?? 50;
              const isEditing = editingStockId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    !item.isAvailable || currentStock === 0
                      ? 'border-red-200 bg-red-50/40 opacity-80'
                      : currentStock < 15
                      ? 'border-amber-200 bg-amber-50/30'
                      : 'border-gray-200 bg-white shadow-2xs'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                        {item.isVeg && (
                          <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block" title="Vegetarian" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{item.category} • ~{item.prepTimeMinutes} mins prep</p>
                    </div>
                    <span className="font-black text-base text-[#003366]">₹{item.price}</span>
                  </div>

                  {/* Stock counter & Availability */}
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-600">Stock Count:</span>
                      
                      {isEditing ? (
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            min="0"
                            value={editingStockVal}
                            onChange={e => setEditingStockVal(parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-0.5 text-xs font-bold border border-blue-400 rounded text-center"
                          />
                          <button
                            onClick={() => saveItemStock(item.id, editingStockVal)}
                            className="p-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                            title="Save"
                          >
                            <Check size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                            currentStock === 0 ? 'bg-red-100 text-red-700' :
                            currentStock < 15 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {currentStock} units
                          </span>
                          <button
                            onClick={() => {
                              setEditingStockId(item.id);
                              setEditingStockVal(currentStock);
                            }}
                            className="text-gray-400 hover:text-[#003366]"
                            title="Edit stock"
                          >
                            <Edit3 size={13} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                        item.isAvailable && currentStock > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {item.isAvailable && currentStock > 0 ? 'In Stock' : 'Sold Out'}
                      </span>

                      <button
                        onClick={() => toggleItemAvailability(item)}
                        className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${
                          item.isAvailable
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        Set {item.isAvailable ? 'Sold Out' : 'Available'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: LIVE QUEUE DISPLAY CONTROL
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6 space-y-6 max-w-2xl mx-auto">
          <div>
            <h3 className="font-extrabold text-[#003366] text-lg uppercase tracking-wide flex items-center space-x-2">
              <Users className="text-yellow-500" />
              <span>Campus Queue & Waiting Time Control</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Broadcast real-time queue length and counter congestion to all student interfaces.
            </p>
          </div>

          <div className="space-y-4">
            {/* Status Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Counter Status</label>
              <div className="grid grid-cols-3 gap-3">
                {(['NORMAL', 'BUSY', 'CLOSED'] as const).map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setQueueStatus(st)}
                    className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                      queueStatus === st
                        ? st === 'NORMAL' ? 'bg-green-600 text-white border-green-700 shadow-xs'
                          : st === 'BUSY' ? 'bg-amber-500 text-[#003366] border-amber-600 shadow-xs'
                          : 'bg-red-600 text-white border-red-700 shadow-xs'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Queue Length */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                Current Queue Count (People Waiting)
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setQueueLength(prev => Math.max(0, prev - 1))}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-lg flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  value={queueLength}
                  onChange={e => setQueueLength(Math.max(0, parseInt(e.target.value) || 0))}
                  className="flex-1 py-2 text-center text-xl font-black border border-gray-300 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setQueueLength(prev => prev + 1)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-lg flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Wait Time */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                Estimated Wait Time (Minutes)
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setEstimatedWaitMins(prev => Math.max(1, prev - 2))}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-lg flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={estimatedWaitMins}
                  onChange={e => setEstimatedWaitMins(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 py-2 text-center text-xl font-black border border-gray-300 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setEstimatedWaitMins(prev => prev + 2)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-lg flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {queueSuccessMsg && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 font-bold text-center">
                ✓ {queueSuccessMsg}
              </div>
            )}

            <button
              onClick={handleUpdateQueue}
              disabled={queueUpdating}
              className="w-full py-3.5 bg-[#003366] hover:bg-blue-800 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md"
            >
              {queueUpdating ? 'Broadcasting...' : 'Broadcast Queue Status'}
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 5: STATS & ANALYTICS
         ───────────────────────────────────────────────────────────── */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <p className="text-xs font-bold uppercase text-gray-400">Total Transactions</p>
              <h3 className="text-3xl font-black text-[#003366] mt-1">{orders.length}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Completed: <strong className="text-green-700">{completedOrders}</strong> • Cancelled: <strong className="text-red-600">{cancelledOrders}</strong>
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <p className="text-xs font-bold uppercase text-gray-400">Average Order Value</p>
              <h3 className="text-3xl font-black text-[#003366] mt-1">
                ₹{orders.length > 0 ? Math.round(totalRevenue / Math.max(1, orders.length - cancelledOrders)) : 0}
              </h3>
              <p className="text-xs text-gray-500 mt-1">Subsidized student pricing</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <p className="text-xs font-bold uppercase text-gray-400">Completion Rate</p>
              <h3 className="text-3xl font-black text-green-700 mt-1">
                {orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 100}%
              </h3>
              <p className="text-xs text-gray-500 mt-1">Zero unclaimed token attrition</p>
            </div>
          </div>

          {/* Popular items breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h4 className="font-extrabold text-[#003366] text-sm uppercase tracking-wider">
              Fast Moving Dishes
            </h4>
            <div className="space-y-2">
              {items.slice(0, 5).map((item, idx) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-[#003366] text-yellow-400 text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-xs text-gray-800">{item.name}</p>
                      <p className="text-[10px] text-gray-400">{item.category} • ₹{item.price}</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
                    {item.stock ?? 40} in stock
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Special Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border-t-4 border-[#003366]">
            <h3 className="text-lg font-bold text-[#003366] mb-3 uppercase tracking-wide">
              Add Special Canteen Item
            </h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schezwan Fried Rice / Kanda Poha"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
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
                    onChange={e => setNewItemPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newItemStock}
                    onChange={e => setNewItemStock(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={newItemCat}
                    onChange={e => setNewItemCat(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Meals">Meals</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Healthy">Healthy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Prep Time (Mins)</label>
                  <input
                    type="number"
                    value={newItemPrep}
                    onChange={e => setNewItemPrep(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Fresh ingredients, served hot"
                  value={newItemDesc}
                  onChange={e => setNewItemDesc(e.target.value)}
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
                  className="px-4 py-2 text-xs font-bold text-white bg-[#003366] hover:bg-blue-800 rounded-lg uppercase tracking-wider"
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
