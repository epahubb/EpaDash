import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@epadash/shared';
import { ChevronRight, Clock, MapPin } from 'lucide-react';

const riderDeliveries = [
  {
    id: 'del_101',
    orderNumber: 'ORD-8492',
    merchantName: 'Buka Restaurant Osu',
    customerName: 'Kwame Mensah',
    status: 'in_progress',
    statusLabel: 'Picking Up from Merchant',
    earnings: 24.5,
    distance: '4.8 km',
    time: '12:45 PM',
    dishImage: '/images/jollof.webp',
    summary: '2x Signature Assorted Jollof, 1x Sobolo',
  },
  {
    id: 'del_100',
    orderNumber: 'ORD-8321',
    merchantName: 'Starbites Food Bar',
    customerName: 'Amina Yakubu',
    status: 'completed',
    statusLabel: 'Delivered',
    earnings: 31.0,
    distance: '5.6 km',
    time: '11:30 AM',
    dishImage: '/images/cheese.webp',
    summary: 'Gourmet Double Cheese Burger & Fries',
  },
  {
    id: 'del_099',
    orderNumber: 'ORD-8104',
    merchantName: 'Mama Lit Kitchen Labone',
    customerName: 'David Kojo',
    status: 'completed',
    statusLabel: 'Delivered',
    earnings: 22.0,
    distance: '3.1 km',
    time: '10:15 AM',
    dishImage: '/images/banku.webp',
    summary: 'Banku with Fresh Tilapia & Hot Pepper',
  },
];

export default function DeliveriesPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('active');

  const activeDeliveries = riderDeliveries.filter((d) => d.status === 'in_progress');
  const pastDeliveries = riderDeliveries.filter((d) => d.status === 'completed');
  const displayed = filter === 'active' ? activeDeliveries : pastDeliveries;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Deliveries</h1>
          <p className="text-xs text-gray-500">Active runs and completed dispatch trips</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setFilter('active')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            Active ({activeDeliveries.length})
          </button>
          <button
            onClick={() => setFilter('history')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            Completed ({pastDeliveries.length})
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {displayed.map((d) => (
          <div
            key={d.id}
            onClick={() => navigate(`/delivery/${d.id}`)}
            className="group p-4 sm:p-5 bg-white rounded-3xl border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                <img
                  src={d.dishImage}
                  alt={d.merchantName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm sm:text-base truncate">
                    {d.merchantName}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      d.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {d.statusLabel}
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">{d.summary}</p>
                <p className="text-xs text-gray-400">
                  Customer: <strong className="text-gray-700">{d.customerName}</strong> • {d.distance} • {d.time}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="font-extrabold text-emerald-700 text-base">
                +{formatCurrency(d.earnings)}
              </span>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{d.orderNumber}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
