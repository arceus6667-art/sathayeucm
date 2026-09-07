import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Coffee, Utensils, Clock, CheckCircle2, ShoppingBag, 
  Plus, Minus, Trash2, ArrowRight, Sparkles, Navigation, AlertCircle, ShieldCheck,
  CreditCard, Smartphone, Wallet, X, ChevronDown, ChevronUp,
  QrCode, Timer, Package, History, RefreshCw, MapPin, Users, XCircle, Loader2
} from 'lucide-react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { campusStore } from '../services/campusStore';

// ── Types ─────────────────────────────────────────────────────────
interface MenuItem {
  id: string; name: string; category: string; price: number; isAvailable: boolean;
  prepTimeMinutes: number; calories: number; isVeg: boolean; description: string;
  image: string; stock: number; rating: number;
}

interface OrderItem { itemId: string; name: string; price: number; quantity: number; }

interface Order {
  id: string; orderNumber: string; userEmail: string;
  items: OrderItem[]; subtotal: number; convenienceFee: number; totalAmount: number;
  status: string; paymentStatus: string; paymentMethod: string;
  pickupSlot: string; customerNote: string; tokenCode: string;
  createdAt: string; updatedAt: string;
}

interface MealToken {
  id: string; orderId: string; orderNumber: string; tokenCode: string;
  status: string; validFrom: string; validUntil: string;
  scannedBy: string | null; scannedAt: string | null; createdAt: string;
}

interface Payment {
  id: string; orderId: string; transactionReference: string;
  paymentMethod: string; amount: number; status: string;
  paidAt: string | null; createdAt: string;
}

interface QueueInfo { queueLength: number; estimatedWaitMins: number; status: string; updatedAt: string; }

type AppView = 'menu' | 'checkout' | 'payment' | 'processing' | 'success' | 'failure' | 'token' | 'history' | 'tracking';

// ── Pickup Slots ──────────────────────────────────────────────────
function getPickupSlots(): { label: string; value: string; disabled: boolean }[] {
  const now = new Date();
  const result: { label: string; value: string; disabled: boolean }[] = [
    { label: '⚡ Immediate Pickup (Next 10–15 mins)', value: 'Immediate (10-15 mins)', disabled: false }
  ];

  // Generate the next 8 upcoming 15-minute intervals from right now
  const currentMinutes = now.getMinutes();
  const roundedMinutes = Math.ceil((currentMinutes + 2) / 15) * 15;
  const startTime = new Date(now);
  startTime.setMinutes(roundedMinutes);
  startTime.setSeconds(0);
  startTime.setMilliseconds(0);

  const formatTime = (d: Date) => {
    let h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    return `${hh}:${mm} ${ampm}`;
  };

  for (let i = 0; i < 8; i++) {
    const slotStart = new Date(startTime.getTime() + i * 15 * 60000);
    const slotEnd = new Date(slotStart.getTime() + 15 * 60000);
    const label = `${formatTime(slotStart)} – ${formatTime(slotEnd)}`;
    result.push({
      label,
      value: label,
      disabled: false
    });
  }

  return result;
}

// ── QR Code Component (SVG-based, no external lib needed at runtime) ───
function QRCodeDisplay({ value, size = 200 }: { value: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    // Simple QR-like visual using canvas - creates a unique pattern from the token
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const modules = 21; // QR version 1
    canvas.width = size;
    canvas.height = size;
    const cellSize = size / (modules + 2);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000000';

    // Generate deterministic pattern from value
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
    }

    // Draw finder patterns (corners)
    const drawFinder = (x: number, y: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          const isOuter = i === 0 || i === 6 || j === 0 || j === 6;
          const isInner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
          if (isOuter || isInner) {
            ctx.fillRect((x + j + 1) * cellSize, (y + i + 1) * cellSize, cellSize, cellSize);
          }
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(modules - 7, 0);
    drawFinder(0, modules - 7);

    // Draw data modules based on hash
    const seed = Math.abs(hash);
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        // Skip finder pattern areas
        if ((row < 8 && col < 8) || (row < 8 && col > modules - 9) || (row > modules - 9 && col < 8)) continue;
        const val = ((seed * (row * modules + col + 1) * 31) >> 4) & 1;
        if (val) {
          ctx.fillRect((col + 1) * cellSize, (row + 1) * cellSize, cellSize, cellSize);
        }
      }
    }

    setDataUrl(canvas.toDataURL());
  }, [value, size]);

  return (
    <div className="inline-block bg-white p-3 rounded-xl border-2 border-gray-200 shadow-sm">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {dataUrl ? (
        <img src={dataUrl} alt="Meal Token QR Code" width={size} height={size} className="block" />
      ) : (
        <div style={{ width: size, height: size }} className="bg-gray-100 flex items-center justify-center">
          <QrCode size={48} className="text-gray-300" />
        </div>
      )}
    </div>
  );
}

// ── Status Badge Component ────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'PENDING_PAYMENT': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'PAID': 'bg-blue-100 text-blue-800 border-blue-300',
    'CONFIRMED': 'bg-indigo-100 text-indigo-800 border-indigo-300',
    'PREPARING': 'bg-orange-100 text-orange-800 border-orange-300',
    'READY': 'bg-green-100 text-green-800 border-green-300 animate-pulse',
    'COMPLETED': 'bg-gray-100 text-gray-700 border-gray-300',
    'CANCELLED': 'bg-red-100 text-red-700 border-red-300',
    'ACTIVE': 'bg-green-100 text-green-800 border-green-300',
    'USED': 'bg-gray-100 text-gray-600 border-gray-300',
    'EXPIRED': 'bg-red-100 text-red-700 border-red-300',
    'SUCCESS': 'bg-green-100 text-green-800 border-green-300',
    'FAILED': 'bg-red-100 text-red-700 border-red-300',
    'REFUNDED': 'bg-purple-100 text-purple-700 border-purple-300',
  };
  return (
    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${colors[status] || 'bg-gray-100 text-gray-600 border-gray-300'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

// ── Main Canteen Component ────────────────────────────────────────
export default function Canteen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [view, setView] = useState<AppView>('menu');
  const [activeCategory, setActiveCategory] = useState('All');
  const [pickupSlot, setPickupSlot] = useState('Immediate (10-15 mins)');
  const [customerNote, setCustomerNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Demo Card');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [currentToken, setCurrentToken] = useState<MealToken | null>(null);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [queue, setQueue] = useState<QueueInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCart, setShowCart] = useState(false);

  const { id: routeOrderId } = useParams<{ id: string }>();
  const location = useLocation();

  // Load menu from server or fallback to campusStore
  const loadMenu = useCallback(async () => {
    try {
      const res = await fetch('/api/canteen/menu');
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setMenuItems(data.items);
          return;
        }
      }
    } catch { /* fallback handled below */ }
    const storeItems = campusStore.getCanteenItems();
    if (storeItems && storeItems.length > 0) {
      setMenuItems(storeItems.map(i => ({
        id: i.id,
        name: i.name,
        category: i.category,
        price: i.price,
        isAvailable: i.isAvailable,
        prepTimeMinutes: i.prepTimeMinutes,
        calories: i.calories || 250,
        isVeg: i.isVeg,
        description: i.description || '',
        image: i.image || '',
        stock: i.stock ?? 50,
        rating: i.rating || 4.8
      })));
    }
  }, []);

  const loadQueue = useCallback(async () => {
    try {
      const res = await fetch('/api/canteen/queue');
      if (res.ok) {
        const data = await res.json();
        if (data.queue) {
          setQueue(data.queue);
          return;
        }
      }
    } catch { /* ignore */ }
    const q = campusStore.getCanteenQueue();
    setQueue(q);
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const user = campusStore.getCurrentUser();
      const email = user?.email || 'student@sathaye.edu';
      const res = await fetch(`/api/canteen/orders?email=${encodeURIComponent(email)}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        if (data.orders && data.orders.length > 0) {
          setOrderHistory(data.orders);
          return;
        }
      }
    } catch { /* ignore */ }
    // Fallback to campusStore orders
    const storeOrders = campusStore.getCanteenOrders();
    setOrderHistory(storeOrders.map(o => ({
      id: o.id,
      orderNumber: o.orderNumber || 'SC-2026-000101',
      userEmail: o.studentId + '@sathaye.edu',
      items: o.items,
      subtotal: o.totalAmount,
      convenienceFee: 0,
      totalAmount: o.totalAmount,
      status: o.status,
      paymentStatus: o.paymentStatus || 'PAID_SANDBOX',
      paymentMethod: o.paymentMethod || 'Demo Card',
      pickupSlot: o.pickupSlot || 'Counter 1',
      customerNote: o.customerNote || '',
      tokenCode: o.tokenCode || o.token || 'SC-DEMO-01',
      createdAt: o.createdAt,
      updatedAt: o.updatedAt || o.createdAt
    })));
  }, []);

  useEffect(() => {
    loadMenu();
    loadQueue();
    loadHistory();
    const interval = setInterval(() => { loadQueue(); }, 30000);
    return () => clearInterval(interval);
  }, [loadMenu, loadQueue, loadHistory]);

  // Handle URL deep linking
  useEffect(() => {
    if (location.pathname.endsWith('/history')) {
      setView('history');
    } else if (routeOrderId) {
      (async () => {
        try {
          const res = await fetch(`/api/canteen/order/${routeOrderId}/token`);
          if (res.ok) {
            const data = await res.json();
            if (data.order) setCurrentOrder(data.order);
            if (data.token) setCurrentToken(data.token);
            setView('token');
          }
        } catch { /* ignore */ }
      })();
    }
  }, [routeOrderId, location.pathname]);

  // Polling for active order status
  useEffect(() => {
    if (!currentOrder || ['COMPLETED', 'CANCELLED'].includes(currentOrder.status)) return;
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/canteen/orders?email=${encodeURIComponent(currentOrder.userEmail)}&limit=1`);
        if (res.ok) {
          const data = await res.json();
          const updated = data.orders?.find((o: Order) => o.id === currentOrder.id);
          if (updated && updated.status !== currentOrder.status) {
            setCurrentOrder(updated);
            // Notify via campusStore
            if (updated.status === 'READY') {
              campusStore.addNotification({
                userId: campusStore.getCurrentUser()?.id,
                targetRole: 'STUDENT',
                title: `Food Ready for Pickup! (${updated.orderNumber})`,
                message: `Your order is ready at the counter. Please collect your tray.`,
                type: 'canteen',
                linkUrl: '/canteen'
              });
            }
          }
        }
      } catch { /* ignore */ }
    }, 5000);
    return () => clearInterval(poll);
  }, [currentOrder]);

  const categories = ['All', 'Breakfast', 'Snacks', 'Meals', 'Beverages', 'Healthy'];

  const filteredItems = menuItems.filter(item =>
    activeCategory === 'All' || item.category === activeCategory
  );

  const addToCart = (itemId: string) => setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  const removeFromCart = (itemId: string) => setCart(prev => {
    const next = { ...prev };
    if (next[itemId] > 1) next[itemId]--;
    else delete next[itemId];
    return next;
  });
  const clearCart = () => setCart({});

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const item = menuItems.find(i => i.id === id);
    return item ? { ...item, qty } : null;
  }).filter(Boolean) as (MenuItem & { qty: number })[];

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  // ── Checkout Handler ──
  const handleCheckout = async () => {
    if (cartCount === 0 || !pickupSlot) return;
    setLoading(true); setError('');
    try {
      const user = campusStore.getCurrentUser();
      const res = await fetch('/api/canteen/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(i => ({ itemId: i.id, name: i.name, price: i.price, quantity: i.qty })),
          userEmail: user?.email || 'student@sathaye.edu',
          pickupSlot,
          customerNote
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentOrder(data.order);
        setView('payment');
      } else {
        setError(data.error || 'Failed to place order.');
      }
    } catch (e: any) {
      // Local fallback for offline/client-only demonstration
      const user = campusStore.getCurrentUser();
      const orderNum = 'SC-2026-' + Math.floor(100000 + Math.random() * 900000);
      const newOrd: Order = {
        id: 'ord-' + Date.now(),
        orderNumber: orderNum,
        userEmail: user?.email || 'student@sathaye.edu',
        items: cartItems.map(i => ({ itemId: i.id, name: i.name, price: i.price, quantity: i.qty })),
        subtotal: cartTotal,
        convenienceFee: 0,
        totalAmount: cartTotal,
        status: 'PENDING_PAYMENT',
        paymentStatus: 'PENDING',
        paymentMethod: paymentMethod || 'Demo Card',
        pickupSlot,
        customerNote,
        tokenCode: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setCurrentOrder(newOrd);
      setView('payment');
    }
    setLoading(false);
  };

  // ── Payment Handler ──
  const handlePayment = async () => {
    if (!currentOrder) return;
    setView('processing');
    setError('');

    // Simulate processing delay
    await new Promise(r => setTimeout(r, 1600));

    try {
      const res = await fetch('/api/canteen/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: currentOrder.id,
          paymentMethod,
          simulateFailure: false // Set true to test failure
        })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentOrder(data.order);
        setCurrentPayment(data.payment);
        setCurrentToken(data.token);
        setCart({});
        setView('success');
        // Add notification
        campusStore.addNotification({
          userId: campusStore.getCurrentUser()?.id,
          targetRole: 'STUDENT',
          title: `Payment Successful (${data.order.orderNumber})`,
          message: `₹${data.order.totalAmount} paid. Meal token: ${data.token.tokenCode}`,
          type: 'canteen',
          linkUrl: '/canteen'
        });
        loadHistory();
      } else {
        setError(data.error || 'Payment failed.');
        setView('failure');
      }
    } catch {
      // Offline / dev fallback: generate valid demo payment & token
      const tokenCode = 'TK-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      const mockPayment: Payment = {
        id: 'pay-' + Date.now(),
        orderId: currentOrder.id,
        transactionReference: 'DEMO-TXN-2026-' + Math.floor(100000 + Math.random() * 900000),
        paymentMethod,
        amount: currentOrder.totalAmount,
        status: 'SUCCESS',
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      const mockToken: MealToken = {
        id: 'tk-' + Date.now(),
        orderId: currentOrder.id,
        orderNumber: currentOrder.orderNumber || 'SC-2026-000101',
        tokenCode,
        status: 'ACTIVE',
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 2 * 3600000).toISOString(),
        scannedBy: null,
        scannedAt: null,
        createdAt: new Date().toISOString()
      };
      const updatedOrder = {
        ...currentOrder,
        status: 'CONFIRMED',
        paymentStatus: 'PAID_SANDBOX',
        paymentMethod,
        tokenCode
      };
      setCurrentOrder(updatedOrder);
      setCurrentPayment(mockPayment);
      setCurrentToken(mockToken);
      setCart({});
      setView('success');
      campusStore.addNotification({
        userId: campusStore.getCurrentUser()?.id,
        targetRole: 'STUDENT',
        title: `Payment Successful (${updatedOrder.orderNumber})`,
        message: `₹${updatedOrder.totalAmount} paid. Meal token: ${tokenCode}`,
        type: 'canteen',
        linkUrl: '/canteen'
      });
      loadHistory();
    }
  };

  // ── Cancel Handler ──
  const handleCancel = async (orderId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/canteen/order/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: campusStore.getCurrentUser()?.email })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentOrder(null);
        setView('menu');
        loadHistory();
        campusStore.addNotification({
          userId: campusStore.getCurrentUser()?.id,
          targetRole: 'STUDENT',
          title: 'Order Cancelled',
          message: data.refund ? `Refund processed: ${data.refund.transactionReference}` : 'Your order has been cancelled.',
          type: 'canteen'
        });
      } else {
        setError(data.error || 'Cannot cancel order.');
      }
    } catch {
      setError('Network error.');
    }
    setLoading(false);
  };

  // ── Render ──────────────────────────────────────────────────────
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
              <span className="bg-red-500/20 text-red-200 text-[10px] font-bold px-2 py-0.5 rounded border border-red-400/30 uppercase">
                Demo Mode
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight">
              Sathaye Central Canteen
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-1">
              Hygienic subsidized meals, snacks & beverages. Digital token pickup system.
            </p>
          </div>

          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            {/* Queue indicator */}
            {queue && (
              <div className="bg-white/10 px-3 py-2 rounded-lg border border-white/20 text-center">
                <span className="block text-[10px] text-gray-300 uppercase tracking-wider font-semibold">Queue</span>
                <span className="text-sm font-extrabold text-yellow-400 flex items-center justify-center">
                  <Users size={12} className="mr-1" /> {queue.queueLength} • ~{queue.estimatedWaitMins}m
                </span>
              </div>
            )}

            <Link
              to="/map?target=loc-canteen-counter"
              className="inline-flex items-center bg-blue-900/80 hover:bg-blue-800 text-yellow-400 border border-blue-700 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors"
            >
              <Navigation size={14} className="mr-1.5" /> View on Map
            </Link>

            {/* Nav tabs */}
            <div className="flex space-x-1">
              <button onClick={() => { setView('menu'); }} className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${view === 'menu' || view === 'checkout' ? 'bg-yellow-500 text-[#003366]' : 'bg-blue-900/60 text-white hover:bg-blue-800'}`}>
                <Utensils size={14} className="inline mr-1" />Menu
              </button>
              {currentOrder && !['COMPLETED', 'CANCELLED'].includes(currentOrder.status) && (
                <button onClick={() => setView('token')} className="px-3 py-2 rounded-lg text-xs font-bold bg-green-600 text-white hover:bg-green-700 transition-colors animate-pulse">
                  <QrCode size={14} className="inline mr-1" />Token
                </button>
              )}
              <button onClick={() => { setView('history'); loadHistory(); }} className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${view === 'history' ? 'bg-yellow-500 text-[#003366]' : 'bg-blue-900/60 text-white hover:bg-blue-800'}`}>
                <History size={14} className="inline mr-1" />History
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
            <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-800">{error}</p>
              <button onClick={() => setError('')} className="text-xs text-red-600 underline mt-1">Dismiss</button>
            </div>
          </div>
        )}

        {/* ═══════════════ MENU VIEW ═══════════════ */}
        {(view === 'menu' || view === 'checkout') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Menu Items List */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Active order banner */}
              {currentOrder && !['COMPLETED', 'CANCELLED'].includes(currentOrder.status) && (
                <div className="bg-white rounded-xl shadow-md border-2 border-yellow-500 p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 bg-yellow-100 text-yellow-800 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 border border-yellow-300 shadow-sm">
                        <QrCode size={24} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Order</span>
                          <StatusBadge status={currentOrder.status} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mt-0.5">
                          {currentOrder.orderNumber}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Pickup: <strong>{currentOrder.pickupSlot}</strong> • ₹{currentOrder.totalAmount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => setView('token')} className="bg-[#003366] hover:bg-blue-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg uppercase tracking-wider transition-colors shadow">
                        View Token
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
              {menuItems.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <Loader2 size={36} className="mx-auto mb-3 animate-spin" />
                  <p className="font-semibold">Loading menu...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredItems.map((item) => {
                    const inCartQty = cart[item.id] || 0;
                    const isOutOfStock = !item.isAvailable || item.stock <= 0;
                    return (
                      <div
                        key={item.id}
                        className={`bg-white rounded-xl shadow-xs border overflow-hidden hover:border-[#003366] transition-all flex flex-col justify-between ${isOutOfStock ? 'opacity-60 border-gray-200' : 'border-gray-200'}`}
                      >
                        <div>
                          <div className="relative h-44 overflow-hidden bg-gray-100">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2.5 left-2.5 flex space-x-1.5">
                              <span className="w-5 h-5 bg-white rounded border border-green-600 flex items-center justify-center">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span>
                              </span>
                              <span className="bg-[#003366]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                                {item.category}
                              </span>
                            </div>
                            {item.stock > 0 && item.stock <= 5 && (
                              <span className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                Only {item.stock} left
                              </span>
                            )}
                            {isOutOfStock && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-lg">Out of Stock</span>
                              </div>
                            )}
                            {item.calories > 0 && (
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
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-gray-100">
                          <div className="flex items-center space-x-3">
                            <span className="text-[11px] text-gray-500 flex items-center">
                              <Clock size={12} className="mr-1 text-yellow-600" /> ~{item.prepTimeMinutes}m
                            </span>
                            {item.stock > 0 && (
                              <span className="text-[11px] text-gray-400">
                                Stock: {item.stock}
                              </span>
                            )}
                          </div>

                          {!isOutOfStock ? (
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
                                  disabled={inCartQty >= item.stock}
                                  className="w-6 h-6 rounded bg-[#003366] text-white flex items-center justify-center font-bold text-sm shadow-xs hover:bg-blue-800 disabled:opacity-50"
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
                            <span className="text-xs font-bold text-red-500">Unavailable</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart & Checkout Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                  <h3 className="font-extrabold text-[#003366] uppercase tracking-wide flex items-center">
                    <ShoppingBag size={18} className="mr-2 text-yellow-500" /> Canteen Tray ({cartCount})
                  </h3>
                  {cartCount > 0 && (
                    <button onClick={clearCart} className="text-xs text-red-600 hover:text-red-700 font-bold">
                      Clear
                    </button>
                  )}
                </div>

                {cartCount === 0 ? (
                  <div className="py-12 text-center text-gray-400">
                    <Utensils size={36} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm font-semibold text-gray-500">Your food tray is empty</p>
                    <p className="text-xs text-gray-400 mt-1">Select items from the menu to pre-order.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <div className="flex-grow pr-2">
                            <h5 className="font-bold text-gray-800 leading-snug">{item.name}</h5>
                            <span className="text-xs text-gray-400">₹{item.price} × {item.qty}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600"><Minus size={14} /></button>
                            <span className="text-xs font-bold text-gray-700 w-4 text-center">{item.qty}</span>
                            <button onClick={() => addToCart(item.id)} className="text-[#003366] hover:text-blue-700"><Plus size={14} /></button>
                            <span className="font-bold text-sm text-gray-900 w-14 text-right">₹{item.price * item.qty}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pickup Slot */}
                    <div className="pt-2 border-t border-gray-100">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Pickup Slot</label>
                      <select 
                        value={pickupSlot} 
                        onChange={e => setPickupSlot(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none"
                      >
                        {getPickupSlots().map(slot => (
                          <option key={slot.value} value={slot.value} disabled={slot.disabled}>
                            {slot.label} {slot.disabled ? '(Past)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Note */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Special Request (Optional)</label>
                      <input 
                        type="text" value={customerNote} onChange={e => setCustomerNote(e.target.value)} 
                        placeholder="e.g. Extra spicy, no onions..."
                        className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:border-[#003366] outline-none"
                      />
                    </div>

                    {/* Totals */}
                    <div className="pt-3 border-t border-gray-100 space-y-1.5">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Subtotal</span><span>₹{cartTotal}</span>
                      </div>
                      <div className="flex justify-between text-xs text-green-700 font-medium">
                        <span>College Subsidy</span><span>Included</span>
                      </div>
                      <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                        <span>Total</span><span className="text-[#003366]">₹{cartTotal}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={loading || !pickupSlot}
                      className="w-full py-3 bg-[#003366] hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow flex items-center justify-center space-x-2"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Proceed to Payment</span><ArrowRight size={16} /></>}
                    </button>
                  </div>
                )}
              </div>

              {/* Guidelines */}
              <div className="bg-yellow-50/70 p-4 rounded-xl border border-yellow-200 text-xs text-gray-700 space-y-2">
                <div className="flex items-center space-x-1.5 font-bold text-[#003366] uppercase tracking-wide">
                  <ShieldCheck size={16} /><span>Canteen Guidelines</span>
                </div>
                <p>Breakfast: 07:30 AM - 11:30 AM. Lunch: 12:00 PM - 03:00 PM.</p>
                <p>Digital pre-order tokens are valid for 2 hours from payment.</p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ PAYMENT VIEW ═══════════════ */}
        {view === 'payment' && currentOrder && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-[#003366] text-white p-6 text-center">
                <span className="bg-red-500/20 text-red-200 text-[10px] font-bold px-2 py-0.5 rounded border border-red-400/30 uppercase inline-block mb-2">
                  Demo Payment
                </span>
                <h2 className="text-xl font-extrabold">Payment Summary</h2>
                <p className="text-xs text-blue-200 mt-1">Order: {currentOrder.orderNumber}</p>
              </div>

              <div className="p-6 space-y-5">
                {/* Items */}
                <div className="space-y-2">
                  {currentOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.quantity}× {item.name}</span>
                      <span className="font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-bold">
                    <span>Total</span>
                    <span className="text-[#003366] text-lg">₹{currentOrder.totalAmount}</span>
                  </div>
                </div>

                {/* Pickup */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <span className="text-[10px] font-bold uppercase text-gray-500">Pickup Slot</span>
                  <p className="text-sm font-bold text-[#003366]">{currentOrder.pickupSlot}</p>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Select Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Demo Card', icon: CreditCard, label: 'Demo Card' },
                      { id: 'Demo UPI', icon: Smartphone, label: 'Demo UPI' },
                      { id: 'Demo Wallet', icon: Wallet, label: 'Demo Wallet' }
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          paymentMethod === m.id 
                            ? 'border-[#003366] bg-blue-50 text-[#003366] shadow-sm' 
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <m.icon size={20} className="mx-auto mb-1" />
                        <span className="text-[10px] font-bold">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full py-3.5 bg-[#003366] hover:bg-blue-800 text-white rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <CreditCard size={18} />
                  <span>Pay ₹{currentOrder.totalAmount}</span>
                </button>

                <button
                  onClick={() => { handleCancel(currentOrder.id); }}
                  className="w-full py-2 text-xs text-red-600 font-bold hover:text-red-700 transition-colors"
                >
                  Cancel Order
                </button>

                <p className="text-center text-[10px] text-gray-400 uppercase">
                  This is a simulated demo payment. No real money is charged.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ PROCESSING VIEW ═══════════════ */}
        {view === 'processing' && (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-[#003366] rounded-full flex items-center justify-center">
              <Loader2 size={36} className="text-yellow-400 animate-spin" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Processing Payment...</h2>
            <p className="text-sm text-gray-500">Please wait while we process your demo payment.</p>
            <p className="text-[10px] text-gray-400 mt-3 uppercase">Demo Mode — No real transaction</p>
          </div>
        )}

        {/* ═══════════════ SUCCESS VIEW ═══════════════ */}
        {view === 'success' && currentOrder && currentToken && currentPayment && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-green-200 overflow-hidden">
              <div className="bg-green-600 text-white p-6 text-center">
                <CheckCircle2 size={48} className="mx-auto mb-3" />
                <h2 className="text-xl font-extrabold">Payment Successful!</h2>
                <p className="text-xs text-green-100 mt-1">{currentPayment.transactionReference}</p>
              </div>

              <div className="p-6 space-y-5">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Your Meal Token</p>
                  <p className="text-2xl font-mono font-extrabold text-[#003366] tracking-widest">
                    {currentToken.tokenCode}
                  </p>
                </div>

                <div className="flex justify-center">
                  <QRCodeDisplay value={currentToken.tokenCode} size={180} />
                </div>

                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-xs font-bold text-[#003366] uppercase mb-1">
                    Show this code at the canteen counter
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Valid until {new Date(currentToken.validUntil).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Order</span><span className="font-bold">{currentOrder.orderNumber}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Pickup</span><span className="font-bold">{currentOrder.pickupSlot}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-[#003366]">₹{currentOrder.totalAmount}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="font-bold">{currentPayment.paymentMethod}</span></div>
                  <div className="flex justify-between items-center"><span className="text-gray-500">Status</span><StatusBadge status={currentOrder.status} /></div>
                </div>

                <div className="flex space-x-3">
                  <button onClick={() => setView('token')} className="flex-1 py-2.5 bg-[#003366] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-blue-800 transition-colors">
                    View Token
                  </button>
                  <button onClick={() => { setView('menu'); }} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors">
                    Back to Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ FAILURE VIEW ═══════════════ */}
        {view === 'failure' && currentOrder && (
          <div className="max-w-md mx-auto text-center py-10">
            <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8">
              <XCircle size={56} className="mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Payment Failed</h2>
              <p className="text-sm text-gray-500 mb-6">{error || 'The demo payment could not be processed. Please try again.'}</p>
              
              <div className="space-y-3">
                <button onClick={() => { setView('payment'); setError(''); }} className="w-full py-3 bg-[#003366] text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-blue-800 transition-colors">
                  Retry Payment
                </button>
                <button onClick={() => handleCancel(currentOrder.id)} className="w-full py-2 text-xs text-red-600 font-bold hover:text-red-700">
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ TOKEN VIEW ═══════════════ */}
        {view === 'token' && currentOrder && currentToken && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-[#003366] text-white p-6 text-center">
                <h2 className="text-lg font-extrabold uppercase tracking-wide">Sathaye Campus Canteen</h2>
                <p className="text-xs text-blue-200 mt-1">Meal Token</p>
              </div>

              <div className="p-6 space-y-5">
                {/* Order & Token */}
                <div className="text-center space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">Order Number</p>
                  <p className="text-lg font-extrabold text-gray-900">{currentOrder.orderNumber}</p>
                </div>

                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Meal Token</p>
                  <p className="text-3xl font-mono font-extrabold text-[#003366] tracking-[0.2em]">
                    {currentToken.tokenCode}
                  </p>
                </div>

                <div className="flex justify-center">
                  <QRCodeDisplay value={currentToken.tokenCode} size={220} />
                </div>

                <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-200">
                  <p className="text-xs font-bold text-yellow-800">
                    📱 Show this code at the canteen counter for pickup
                  </p>
                </div>

                {/* Order Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-[10px] text-gray-500 uppercase">Pickup</span>
                    <p className="text-sm font-bold text-gray-900">{currentOrder.pickupSlot}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-[10px] text-gray-500 uppercase">Total Paid</span>
                    <p className="text-sm font-bold text-[#003366]">₹{currentOrder.totalAmount}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-[10px] text-gray-500 uppercase">Order Status</span>
                    <div className="mt-0.5"><StatusBadge status={currentOrder.status} /></div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-[10px] text-gray-500 uppercase">Token Status</span>
                    <div className="mt-0.5"><StatusBadge status={currentToken.status} /></div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Items</p>
                  {currentOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1">
                      <span className="text-gray-700">{item.quantity}× {item.name}</span>
                      <span className="font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Status progress */}
                <div className="pt-2">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-3">Order Progress</p>
                  <div className="flex items-center justify-between">
                    {['CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'].map((step, i) => {
                      const stepOrder = ['CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];
                      const currentIdx = stepOrder.indexOf(currentOrder.status);
                      const isActive = i <= currentIdx;
                      const isCurrent = step === currentOrder.status;
                      return (
                        <React.Fragment key={step}>
                          <div className={`flex flex-col items-center ${isCurrent ? 'scale-110' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                              isActive ? 'bg-[#003366] text-white border-[#003366]' : 'bg-gray-100 text-gray-400 border-gray-200'
                            } ${isCurrent ? 'ring-2 ring-yellow-400 ring-offset-1' : ''}`}>
                              {isActive ? <CheckCircle2 size={14} /> : i + 1}
                            </div>
                            <span className={`text-[9px] mt-1 font-bold ${isActive ? 'text-[#003366]' : 'text-gray-400'}`}>
                              {step === 'CONFIRMED' ? 'Confirmed' : step === 'PREPARING' ? 'Preparing' : step === 'READY' ? 'Ready' : 'Done'}
                            </span>
                          </div>
                          {i < 3 && (
                            <div className={`flex-1 h-0.5 mx-1 ${i < currentIdx ? 'bg-[#003366]' : 'bg-gray-200'}`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                <button onClick={() => setView('menu')} className="w-full py-2.5 border border-gray-200 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-50">
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ HISTORY VIEW ═══════════════ */}
        {view === 'history' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-gray-900">Order History</h2>
              <button onClick={loadHistory} className="text-xs text-[#003366] font-bold flex items-center hover:underline">
                <RefreshCw size={12} className="mr-1" /> Refresh
              </button>
            </div>

            {orderHistory.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-gray-400">
                <Package size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="font-semibold text-gray-500">No orders yet</p>
                <p className="text-xs mt-1">Place your first order from the menu!</p>
              </div>
            ) : (
              orderHistory.map(order => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • {order.pickupSlot}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {order.items.map(i => `${i.quantity}× ${i.name}`).join(', ')}
                      </p>
                    </div>
                    <div className="text-right flex sm:flex-col items-center sm:items-end space-x-3 sm:space-x-0 sm:space-y-1">
                      <span className="text-lg font-extrabold text-[#003366]">₹{order.totalAmount}</span>
                      <StatusBadge status={order.paymentStatus === 'PAID_SANDBOX' ? 'SUCCESS' : order.paymentStatus} />
                      {order.tokenCode && !['CANCELLED', 'COMPLETED'].includes(order.status) && (
                        <button 
                          onClick={() => { setCurrentOrder(order); /* Find token */ fetch(`/api/canteen/order/${order.id}/token`).then(r => r.json()).then(d => { if (d.token) { setCurrentToken(d.token); setView('token'); } }); }}
                          className="text-xs text-[#003366] font-bold hover:underline"
                        >
                          View Token
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Mobile Cart Floating Button */}
      {cartCount > 0 && view === 'menu' && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-30">
          <button
            onClick={() => {
              const cartEl = document.querySelector('.lg\\:col-span-4');
              if (cartEl) cartEl.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full bg-[#003366] text-white py-3.5 rounded-xl shadow-lg flex items-center justify-between px-5 font-bold"
          >
            <span className="flex items-center space-x-2">
              <ShoppingBag size={18} />
              <span>{cartCount} items</span>
            </span>
            <span>₹{cartTotal} →</span>
          </button>
        </div>
      )}
    </div>
  );
}
