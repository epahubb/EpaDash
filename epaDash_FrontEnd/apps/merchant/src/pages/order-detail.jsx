import { useParams, useNavigate } from 'react-router-dom';
import { formatCurrency, Button } from '@epadash/shared';
import { ArrowLeft, Phone, Printer, CheckCircle2, Clock } from 'lucide-react';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const kitchenItems = [
    {
      name: '2x Signature Assorted Meat Jollof',
      instructions: '• Extra spicy shito in separate cup\n• Well-cooked goat meat & beef chunks',
      price: 130,
      image: '/images/jollof.webp',
    },
    {
      name: '1x Chilled Hibiscus Sobolo (500ml)',
      instructions: '• Chilled bottle with mint leaf garnish',
      price: 17,
      image: '/images/bels.jpg',
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </button>
        <Button variant="outline" size="sm" leftIcon={<Printer className="h-4 w-4" />}>
          Print Kitchen Slip
        </Button>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Kitchen Preparation Ticket
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-0.5">{id || 'ORD-8492'}</h1>
          </div>
          <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            In Preparation (12m left)
          </span>
        </div>

        {/* Customer Information */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Customer:</span>
            <span className="font-bold text-gray-900">Kwame Mensah</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Contact:</span>
            <span className="font-bold text-gray-900">024 123 4567</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery Address:</span>
            <span className="font-medium text-gray-700">Plot 42, Ring Road Central, Kokomlemle, Accra</span>
          </div>
        </div>

        {/* Itemized Recipe with Food Photos */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Kitchen Cooking Queue</h3>
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl p-4 space-y-3">
            {kitchenItems.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-gray-900">{item.name}</span>
                    <pre className="text-xs text-gray-500 mt-1 font-sans whitespace-pre-line leading-relaxed">
                      {item.instructions}
                    </pre>
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-900 shrink-0">
                  {formatCurrency(item.price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Rider */}
        <div className="border border-emerald-100 bg-emerald-50/60 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              Assigned Courier
            </span>
            <h4 className="text-sm font-bold text-gray-900">Kofi Annan</h4>
            <p className="text-xs text-gray-500">Arriving in approx 8 mins (Yamaha 125)</p>
          </div>
          <a
            href="tel:+233244112233"
            className="p-2.5 rounded-xl bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors shadow-sm"
          >
            <Phone className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
