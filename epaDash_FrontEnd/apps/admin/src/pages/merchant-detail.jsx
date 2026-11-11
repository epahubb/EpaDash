import { useParams, useNavigate } from 'react-router-dom';
import { Button, formatCurrency } from '@epadash/shared';
import { ArrowLeft, Star, MapPin, Phone, ShieldCheck } from 'lucide-react';

const topDishes = [
  { name: 'Signature Assorted Meat Jollof', price: 65, image: '/images/jollof.webp', orders: 480 },
  { name: 'Banku with Fresh Tilapia & Hot Pepper', price: 75, image: '/images/banku.webp', orders: 340 },
  { name: 'Special Assorted Fried Rice Platter', price: 60, image: '/images/firedrice.webp', orders: 290 },
];

export default function MerchantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16 animate-in fade-in duration-300">
      <button
        onClick={() => navigate('/merchants')}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to merchants
      </button>

      {/* Main Merchant Banner Card */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="relative h-44 w-full bg-gray-900">
          <img
            src="/images/delicious.jpg"
            alt="Merchant Banner"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent" />
          <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Active & Verified
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3 text-white">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white shrink-0">
              <img src="/images/jollof.webp" alt="Thumb" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Buka Restaurant Osu</h1>
              <p className="text-xs text-gray-300 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                10th Street, Osu RE, Accra (Store ID: #MERCH-ACC-049)
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-gray-50 rounded-2xl">
              <span className="text-gray-400">Total GMV</span>
              <p className="font-extrabold text-gray-900 text-base mt-0.5">
                {formatCurrency(98400)}
              </p>
            </div>
            <div className="p-3.5 bg-gray-50 rounded-2xl">
              <span className="text-gray-400">Commission</span>
              <p className="font-extrabold text-emerald-700 text-base mt-0.5">15% Standard</p>
            </div>
            <div className="p-3.5 bg-gray-50 rounded-2xl">
              <span className="text-gray-400">Orders Fulfilled</span>
              <p className="font-extrabold text-gray-900 text-base mt-0.5">1,480</p>
            </div>
            <div className="p-3.5 bg-gray-50 rounded-2xl">
              <span className="text-gray-400">Customer Rating</span>
              <p className="font-extrabold text-gray-900 text-base mt-0.5 flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.9 (482)
              </p>
            </div>
          </div>

          {/* Top Selling Dishes with Real Photos */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Top Selling Menu Items</h3>
            <div className="space-y-2.5">
              {topDishes.map((dish) => (
                <div
                  key={dish.name}
                  className="p-3 rounded-2xl border border-gray-100 flex items-center justify-between gap-3 bg-gray-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{dish.name}</h4>
                      <p className="text-[11px] text-gray-400">{dish.orders} total sales</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700">
                    {formatCurrency(dish.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Button variant="outline" size="md" className="flex-1 text-red-600 border-red-200">
              Pause Store
            </Button>
            <Button variant="primary" size="md" className="flex-1">
              Update Commission
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
