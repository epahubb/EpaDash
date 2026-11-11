import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatCurrency, Button, useNotificationStore } from '@epadash/shared';
import {
  ArrowLeft,
  Phone,
  PackageCheck,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

export default function DeliveryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [currentStep, setCurrentStep] = useState('arriving_merchant');

  const advanceStep = () => {
    if (currentStep === 'arriving_merchant') {
      setCurrentStep('picked_up');
      addNotification({
        type: 'info',
        title: 'Arrived at Merchant',
        message: 'Order verified and securely packaged from Buka Restaurant.',
      });
    } else if (currentStep === 'picked_up') {
      setCurrentStep('in_transit');
      addNotification({
        type: 'info',
        title: 'Route Started',
        message: 'Navigating to customer destination in Kokomlemle.',
      });
    } else if (currentStep === 'in_transit') {
      setCurrentStep('delivered');
      addNotification({
        type: 'success',
        title: 'Delivery Completed! 🎉',
        message: 'GH₵ 24.50 credited to your EpaDash Courier balance.',
      });
    }
  };

  const packageItems = [
    {
      name: '2x Signature Assorted Meat Jollof',
      image: '/images/jollof.webp',
      notes: 'Hot pack with goat meat & extra shito cup',
    },
    {
      name: '1x Chilled Hibiscus Sobolo (500ml)',
      image: '/images/bels.jpg',
      notes: 'Cold drink pack in separate insulation bag',
    },
  ];

  return (
    <div className="space-y-6 max-w-xl mx-auto pb-16 animate-in fade-in duration-300">
      <button
        onClick={() => navigate('/deliveries')}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to deliveries
      </button>

      {/* Main Delivery Task Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Active Delivery Run
            </span>
            <h1 className="text-xl font-bold text-gray-900 mt-0.5">Order #ORD-8492</h1>
          </div>
          <div className="text-right">
            <span className="text-xl font-extrabold text-emerald-700">
              +{formatCurrency(24.5)}
            </span>
            <p className="text-[10px] text-gray-400">Courier Payout</p>
          </div>
        </div>

        {/* Step Status Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
                Current Run Stage
              </p>
              <h3 className="text-sm font-bold text-emerald-950">
                {currentStep === 'arriving_merchant' && 'Step 1: Heading to Kitchen'}
                {currentStep === 'picked_up' && 'Step 2: Collect & Inspect Meal Package'}
                {currentStep === 'in_transit' && 'Step 3: In Transit to Customer'}
                {currentStep === 'delivered' && 'Delivered & Complete!'}
              </h3>
            </div>
          </div>
        </div>

        {/* Action Button for Next State */}
        {currentStep !== 'delivered' ? (
          <Button
            variant="primary"
            size="lg"
            className="w-full text-base font-bold shadow-lg shadow-emerald-600/20 py-3.5"
            onClick={advanceStep}
          >
            {currentStep === 'arriving_merchant' && 'Confirm Arrival at Restaurant'}
            {currentStep === 'picked_up' && 'Confirm Order Picked Up → Start Route'}
            {currentStep === 'in_transit' && 'Mark as Handed to Customer & Complete'}
          </Button>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-sm font-bold text-emerald-800">
            ✓ Delivery run successfully completed. GH₵ 24.50 credited to wallet.
          </div>
        )}
      </div>

      {/* Package Contents Checklist with Food Photos */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Package Inspection Items
          </h3>
          <span className="text-xs text-gray-400">2 items in parcel</span>
        </div>

        <div className="divide-y divide-gray-100">
          {packageItems.map((item, idx) => (
            <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.notes}</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Packed
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Merchant Pickup Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Pickup Kitchen
          </span>
          <a
            href="tel:+233244889900"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" /> Call Kitchen
          </a>
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Buka Restaurant Osu</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            10th Street, Osu RE, Accra (Near Danquah Circle)
          </p>
        </div>
      </div>

      {/* Customer Dropoff Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Customer Dropoff
          </span>
          <a
            href="tel:+233244123456"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" /> Call Customer
          </a>
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Kwame Mensah</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Plot 42, Ring Road Central, Kokomlemle, Accra
          </p>
        </div>
        <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-2xl border border-amber-200">
          <strong>Note from customer:</strong> Call when you reach the security gate; I will come down to the lobby.
        </p>
      </div>
    </div>
  );
}
