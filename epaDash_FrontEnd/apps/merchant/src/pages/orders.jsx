import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, Button, useNotificationStore } from '@epadash/shared';
import { ChevronRight, Clock, CheckCircle2, Bike } from 'lucide-react';

const mockMerchantOrders = [
  {
    id: 'ORD-8492',
    customer: 'Kwame Mensah',
    phone: '024 123 4567',
    items: '2x Signature Assorted Meat Jollof, 1x Chilled Sobolo',
    amount: 147,
    dishImage: '/images/jollof.webp',
    status: 'preparing',
    time: '12:35 PM',
  },
  {
    id: 'ORD-8488',
    customer: 'Sarah Danquah',
    phone: '020 987 6543',
    items: '1x Banku with Fresh Tilapia & Hot Pepper',
    amount: 75,
    dishImage: '/images/banku.webp',
    status: 'ready',
    time: '12:20 PM',
  },
  {
    id: 'ORD-8481',
    customer: 'Kweku Baah',
    phone: '055 332 1144',
    items: '2x Special Assorted Fried Rice, 2x Beef Meat Pie',
    amount: 168,
    dishImage: '/images/firedrice.webp',
    status: 'new',
    time: '12:44 PM',
  },
  {
    id: 'ORD-8475',
    customer: 'Emmanuel K.',
    phone: '024 555 6677',
    items: '1x Spicy Peppered Gizzard, 1x Chilled Sobolo',
    amount: 63,
    dishImage: '/images/zizard.webp',
    status: 'completed',
    time: '11:50 AM',
  },
];

export default function OrdersPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState(mockMerchantOrders);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const handleUpdateStatus = (id, newStatus, e) => {
    e.stopPropagation();
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    addNotification({
      type: 'success',
      title: 'Order Status Updated',
      message: `Order ${id} is now ${newStatus}.`,
    });
  };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kitchen Orders</h1>
          <p className="text-xs text-gray-500">Live order queue and dish preparation status</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto">
          {['all', 'new', 'preparing', 'ready', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                filter === status
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((order) => (
          <div
            key={order.id}
            onClick={() => navigate(`/orders/${order.id}`)}
            className="group p-4 sm:p-5 bg-white rounded-3xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                <img
                  src={order.dishImage}
                  alt="Order dish"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-800">
                    {order.id}
                  </span>
                  <span className="font-bold text-gray-900 text-sm truncate">{order.customer}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                      order.status === 'new'
                        ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
                        : order.status === 'preparing'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : order.status === 'ready'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-1">{order.items}</p>
                <p className="text-xs text-gray-400">
                  Customer Phone: <span className="text-gray-700 font-medium">{order.phone}</span> •{' '}
                  {order.time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
              <span className="text-base font-extrabold text-gray-900">
                {formatCurrency(order.amount)}
              </span>

              {order.status === 'new' && (
                <button
                  onClick={(e) => handleUpdateStatus(order.id, 'preparing', e)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-sm"
                >
                  Accept & Cook
                </button>
              )}
              {order.status === 'preparing' && (
                <button
                  onClick={(e) => handleUpdateStatus(order.id, 'ready', e)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Mark Ready
                </button>
              )}

              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
