import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, Button, useNotificationStore, TestBackendService } from '@epadash/shared';
import {
  TrendingUp,
  CheckCircle2,
  Activity,
  Power,
  ArrowRight,
  Flame,
  ChefHat,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [testResult, setTestResult] = useState({ status: 'idle' });

  const runBackendTest = async () => {
    setTestResult({ status: 'loading' });
    try {
      const res = await TestBackendService.testProtected();
      setTestResult({ status: 'success', data: res.data });
    } catch (err) {
      setTestResult({ status: 'error', error: err.message || 'API test failed' });
    }
  };

  const toggleStore = () => {
    setIsOpen(!isOpen);
    addNotification({
      type: isOpen ? 'warning' : 'success',
      title: isOpen ? 'Kitchen Paused' : 'Kitchen Open',
      message: isOpen
        ? 'Your restaurant is now offline to new customer orders.'
        : 'Your restaurant is live and accepting delivery orders.',
    });
  };

  const recentOrders = [
    {
      id: 'ORD-8492',
      customer: 'Kwame Mensah',
      items: '2x Assorted Meat Jollof, 1x Chilled Sobolo',
      amount: 147,
      dishImage: '/images/jollof.webp',
      status: 'preparing',
      statusText: 'In Kitchen (12 min left)',
      time: '12:35 PM',
    },
    {
      id: 'ORD-8488',
      customer: 'Sarah Danquah',
      items: '1x Banku with Fresh Tilapia & Hot Pepper',
      amount: 75,
      dishImage: '/images/banku.webp',
      status: 'ready',
      statusText: 'Ready for Rider Pickup',
      time: '12:20 PM',
    },
    {
      id: 'ORD-8475',
      customer: 'Emmanuel K.',
      items: '1x Assorted Fried Rice Platter, 1x Spicy Gizzard',
      amount: 105,
      dishImage: '/images/firedrice.webp',
      status: 'completed',
      statusText: 'Dispatched with Rider',
      time: '11:50 AM',
    },
  ];

  const topDishes = [
    {
      name: 'Signature Assorted Meat Jollof',
      category: 'Jollof & Rice',
      ordersCount: 142,
      revenue: 9230,
      image: '/images/jollof.webp',
    },
    {
      name: 'Banku with Fresh Tilapia & Pepper',
      category: 'Soups & Swallows',
      ordersCount: 98,
      revenue: 7350,
      image: '/images/banku.webp',
    },
    {
      name: 'Special Assorted Fried Rice Platter',
      category: 'Jollof & Rice',
      ordersCount: 84,
      revenue: 5040,
      image: '/images/firedrice.webp',
    },
    {
      name: 'Spicy Peppered Gizzard Skewers',
      category: 'Grills & Sides',
      ordersCount: 65,
      revenue: 2925,
      image: '/images/zizard.webp',
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* ──────────────── Store Header & Open/Closed Switch ──────────────── */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Buka Restaurant Osu</h1>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Live Kitchen Portal
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Store ID: #MERCH-ACC-049 • Operating Hours: 10:00 AM - 10:30 PM • Accra Central
          </p>
        </div>
        <button
          onClick={toggleStore}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm ${
            isOpen
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          <Power className="h-4 w-4" />
          <span>{isOpen ? 'STORE OPEN (ACCEPTING ORDERS)' : 'STORE PAUSED (OFFLINE)'}</span>
        </button>
      </div>

      {/* ──────────────── Stats Row ──────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Today&apos;s Revenue</span>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">{formatCurrency(2450)}</div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
            <TrendingUp className="h-3 w-3" /> +16.4% vs yesterday
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Orders Today</span>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">32 orders</div>
          <span className="text-xs text-gray-400 mt-1 block">Avg GH₵ 76.50 / order</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Active Kitchen Queue</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">3 orders</div>
          <span className="text-xs text-emerald-600 mt-1 block">In preparation</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Avg Prep Time</span>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">16 mins</div>
          <span className="text-xs text-emerald-600 mt-1 block">Target: &lt; 20 mins</span>
        </div>
      </div>

      {/* ──────────────── Centralised API Service Test ──────────────── */}
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-sm">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Merchant API Service Gateway</h3>
              <p className="text-xs text-gray-600">
                Verifies merchant role-protected API endpoints and centralized token lifecycle.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            isLoading={testResult.status === 'loading'}
            onClick={runBackendTest}
            leftIcon={<Activity className="h-4 w-4" />}
          >
            Test Protected Endpoint
          </Button>
        </div>

        {testResult.status === 'success' && (
          <div className="mt-3 p-3.5 rounded-2xl bg-white border border-emerald-200 text-xs text-emerald-800 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>Merchant Communication Verified!</span>
            </div>
            <pre className="text-[11px] text-gray-600 overflow-x-auto bg-gray-50 p-2.5 rounded-xl mt-1 font-mono">
              {JSON.stringify(testResult.data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* ──────────────── Live Kitchen Orders Queue with Food Images ──────────────── */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Live Kitchen Orders</h2>
            <p className="text-xs text-gray-500">Incoming and in-preparation customer orders</p>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            View all orders <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                  <img src={order.dishImage} alt="Dish" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-0.5 rounded-lg text-gray-800">
                      {order.id}
                    </span>
                    <span className="font-bold text-gray-900 text-sm truncate">{order.customer}</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                        order.status === 'preparing'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : order.status === 'ready'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-800'
                      }`}
                    >
                      {order.statusText}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{order.items}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0">
                <span className="text-sm font-bold text-gray-900">{formatCurrency(order.amount)}</span>
                <span className="text-xs text-gray-400 font-mono">{order.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ──────────────── Top Performing Dishes with Food Images ──────────────── */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Top Selling Menu Items</h2>
            <p className="text-xs text-gray-500">Highest volume dishes ordered this week</p>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Manage Menu <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topDishes.map((dish) => (
            <div
              key={dish.name}
              className="p-3.5 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition-all flex items-center gap-3 bg-gray-50/50"
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-gray-900 truncate">{dish.name}</h4>
                <p className="text-[10px] text-gray-400">{dish.category}</p>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700">{dish.ordersCount} sold</span>
                  <span className="font-extrabold text-emerald-700">{formatCurrency(dish.revenue)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
