import { useParams, useNavigate } from 'react-router-dom';
import { formatCurrency, Button } from '@epadash/shared';
import { ArrowLeft, ShieldCheck, Clock } from 'lucide-react';

const orderDishes = [
  { name: '2x Signature Assorted Meat Jollof', price: 130, image: '/images/jollof.webp' },
  { name: '1x Chilled Hibiscus Sobolo (500ml)', price: 17, image: '/images/bels.jpg' },
];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16 animate-in fade-in duration-300">
      <button
        onClick={() => navigate('/orders')}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to orders ledger
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Audit Order Inspection
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-0.5">{id || 'ORD-8492'}</h1>
          </div>
          <span className="text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> In Transit
          </span>
        </div>

        {/* Audit Metadata */}
        <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Customer:</span>
            <span className="font-bold text-gray-900">Kwame Mensah (024 123 4567)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Merchant Kitchen:</span>
            <span className="font-bold text-gray-900">Buka Restaurant Osu (10th Street, Osu)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Assigned Courier:</span>
            <span className="font-bold text-gray-900">Kofi Annan (Motorcycle Yamaha 125)</span>
          </div>
        </div>

        {/* Itemized Dish Breakdown with Real Food Photos */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Dishes in Order</h3>
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl p-4 space-y-3">
            {orderDishes.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                    <p className="text-xs text-gray-400">Verified by kitchen</p>
                  </div>
                </div>
                <span className="text-sm font-extrabold text-gray-900">
                  {formatCurrency(item.price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Escrow and Revenue Breakdown */}
        <div className="p-4 bg-emerald-50 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-emerald-950 font-bold text-xs">
          <div>
            <span>Escrow Settlement Total: {formatCurrency(147)}</span>
            <p className="text-[11px] text-emerald-700 font-normal mt-0.5">
              Held in safe escrow until courier delivery confirmation
            </p>
          </div>
          <span className="bg-emerald-600 text-white px-3 py-1 rounded-xl text-xs font-bold">
            Platform Fee: GH₵ 22.05 (15%)
          </span>
        </div>

        <div className="pt-2 flex gap-3">
          <Button variant="outline" size="md" className="flex-1 text-red-600 border-red-200">
            Cancel & Refund Escrow
          </Button>
          <Button variant="primary" size="md" className="flex-1">
            Reassign Courier
          </Button>
        </div>
      </div>
    </div>
  );
}
