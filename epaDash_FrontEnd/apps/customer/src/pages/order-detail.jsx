import { useParams, useNavigate } from 'react-router-dom';
import { formatCurrency } from '@epadash/shared';
import {
  ArrowLeft,
  CheckCircle2,
  Phone,
  MessageSquare,
  Clock,
  MapPin,
  Bike,
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Order Confirmed', time: '12:30 PM', completed: true },
  { id: 2, title: 'Kitchen Preparing Meal', time: '12:35 PM', completed: true },
  { id: 3, title: 'Rider Picked Up', time: '12:48 PM', completed: false, current: true },
  { id: 4, title: 'In Transit to You', time: 'Est. 1:05 PM', completed: false },
  { id: 5, title: 'Delivered to Doorstep', time: 'Est. 1:15 PM', completed: false },
];

const orderItems = [
  {
    id: 'item_1',
    name: 'Signature Assorted Meat Jollof',
    quantity: 2,
    price: 65,
    image: '/images/jollof.webp',
  },
  {
    id: 'item_12',
    name: 'Chilled Hibiscus Sobolo (500ml)',
    quantity: 1,
    price: 17,
    image: '/images/bels.jpg',
  },
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
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </button>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Live Order Tracking
            </span>
            <h1 className="text-xl font-bold text-gray-900 mt-0.5">Order #{id || 'ORD-8492'}</h1>
            <p className="text-xs text-gray-500">Merchant: Buka Restaurant Osu</p>
          </div>
          <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5 self-start sm:self-auto">
            <Clock className="h-3.5 w-3.5 text-emerald-600" />
            Estimated Arrival: 18 mins
          </span>
        </div>

        {/* Step Progress Timeline */}
        <div className="py-6">
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step.completed
                        ? 'bg-emerald-600 text-white'
                        : step.current
                        ? 'bg-emerald-100 border-2 border-emerald-600 text-emerald-700 animate-pulse'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                  </div>
                  {step.id !== steps.length && (
                    <div
                      className={`w-0.5 h-8 my-1 ${
                        step.completed ? 'bg-emerald-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pt-0.5 flex items-center justify-between">
                  <div>
                    <h4
                      className={`text-sm font-semibold ${
                        step.completed || step.current ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </h4>
                    {step.current && (
                      <p className="text-xs text-emerald-600 font-medium">
                        Rider Kofi has picked up from Buka Restaurant and is in transit.
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{step.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rider Info Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200">
            KA
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Kofi Annan (Rider)</h4>
            <p className="text-xs text-gray-500">Yamaha 125 • Royal Red • ⭐ 4.92 (420 trips)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="tel:+233244112233"
            className="p-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <Phone className="h-4 w-4" />
          </a>
          <button className="p-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Order Items with Real Images */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-sm">Dishes in this Order</h3>
        <div className="divide-y divide-gray-100">
          {orderItems.map((item) => (
            <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-bold text-gray-900 text-sm">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing breakdown */}
        <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-gray-800">{formatCurrency(147)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee (4.8 km)</span>
            <span className="font-semibold text-gray-800">{formatCurrency(12)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service Fee</span>
            <span className="font-semibold text-gray-800">{formatCurrency(5)}</span>
          </div>
          <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-extrabold text-gray-900">
            <span>Total Paid (MTN MoMo)</span>
            <span className="text-emerald-700">{formatCurrency(164)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
