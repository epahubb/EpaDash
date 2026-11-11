import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '@epadash/shared';
import { Clock, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';

const mockOrders = [
  {
    id: 'ORD-8492',
    merchantName: 'Buka Restaurant Osu',
    status: 'preparing',
    statusLabel: 'Kitchen Preparing Meal',
    itemsCount: 2,
    total: 147,
    dishImage: '/images/jollof.webp',
    summary: '2x Assorted Jollof, 1x Chilled Sobolo',
    placedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    estimatedMinutes: '18 mins',
  },
  {
    id: 'ORD-7719',
    merchantName: 'Starbites Food Bar',
    status: 'delivered',
    statusLabel: 'Delivered',
    itemsCount: 3,
    total: 185,
    dishImage: '/images/cheese.webp',
    summary: '2x Supreme Cheese Burger, 1x Crispy Wings',
    placedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'ORD-6104',
    merchantName: 'Mama Lit Kitchen Labone',
    status: 'delivered',
    statusLabel: 'Delivered',
    itemsCount: 1,
    total: 75,
    dishImage: '/images/banku.webp',
    summary: '1x Banku with Fresh Tilapia & Hot Pepper',
    placedAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
  },
  {
    id: 'ORD-5520',
    merchantName: 'Starbites Food Bar',
    status: 'delivered',
    statusLabel: 'Delivered',
    itemsCount: 2,
    total: 84,
    dishImage: '/images/firedrice.webp',
    summary: '1x Assorted Fried Rice, 2x Beef Meat Pie',
    placedAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
  },
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('active');

  const activeOrders = mockOrders.filter((o) => o.status !== 'delivered');
  const pastOrders = mockOrders.filter((o) => o.status === 'delivered');
  const displayedOrders = filter === 'active' ? activeOrders : pastOrders;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
          <p className="text-xs text-gray-500">Track current meal deliveries and past order history</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setFilter('active')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Active ({activeOrders.length})
          </button>
          <button
            onClick={() => setFilter('history')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Past Orders ({pastOrders.length})
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {displayedOrders.map((order) => (
          <div
            key={order.id}
            onClick={() => navigate(`/orders/${order.id}`)}
            className="group p-4 sm:p-5 bg-white rounded-3xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
              <img
                src={order.dishImage}
                alt={order.merchantName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-sm sm:text-base truncate">
                  {order.merchantName}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    order.status === 'delivered'
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-emerald-100 text-emerald-800 animate-pulse'
                  }`}
                >
                  {order.statusLabel}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-1">{order.summary}</p>
              <p className="text-xs text-gray-400">
                {order.itemsCount} items • <strong className="text-gray-800">{formatCurrency(order.total)}</strong> • {formatDate(order.placedAt)}
              </p>
              {order.estimatedMinutes && (
                <p className="text-xs font-medium text-emerald-600 flex items-center gap-1 pt-0.5">
                  <Clock className="h-3.5 w-3.5" /> Est. arrival in {order.estimatedMinutes}
                </p>
              )}
            </div>

            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
