import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { formatCurrency, Button, useNotificationStore, TestBackendService } from '@epadash/shared';
import {
  Bike,
  MapPin,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Activity,
  Flame,
  Check,
  X,
} from 'lucide-react';

const initialAvailableTrips = [
  {
    id: 'req_101',
    orderNumber: 'ORD-8492',
    merchantName: 'Buka Restaurant Osu',
    pickupAddress: '10th Street, Osu RE, Accra',
    dropoffAddress: 'Plot 42, Ring Road Central, Kokomlemle',
    estimatedEarnings: 24.5,
    distanceKm: 4.8,
    estMinutes: 22,
    itemsSummary: '2x Assorted Meat Jollof, 1x Chilled Sobolo',
    dishImage: '/images/jollof.webp',
  },
  {
    id: 'req_102',
    orderNumber: 'ORD-9104',
    merchantName: 'Starbites Food Bar',
    pickupAddress: 'Airport Residential Area, Accra',
    dropoffAddress: 'East Legon, near American House',
    estimatedEarnings: 32.0,
    distanceKm: 6.2,
    estMinutes: 28,
    itemsSummary: 'Gourmet Double Burger, 2x Chilled Soda',
    dishImage: '/images/cheese.webp',
  },
  {
    id: 'req_103',
    orderNumber: 'ORD-9118',
    merchantName: 'Mama Lit Kitchen Labone',
    pickupAddress: 'Labone Crescent, Accra',
    dropoffAddress: 'Cantonments, 5th Avenue',
    estimatedEarnings: 19.5,
    distanceKm: 3.4,
    estMinutes: 16,
    itemsSummary: 'Banku with Grilled Tilapia & Pepper',
    dishImage: '/images/banku.webp',
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isOnline } = useOutletContext();
  const [trips, setTrips] = useState(initialAvailableTrips);
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

  const handleAccept = (trip) => {
    setTrips(trips.filter((t) => t.id !== trip.id));
    addNotification({
      type: 'success',
      title: 'Delivery Run Accepted!',
      message: `Navigating to pick up order from ${trip.merchantName}.`,
    });
    navigate(`/delivery/${trip.id}`);
  };

  const handleDecline = (tripId) => {
    setTrips(trips.filter((t) => t.id !== tripId));
    addNotification({
      type: 'info',
      title: 'Delivery Skipped',
      message: 'Searching for other nearby orders.',
    });
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* ──────────────── Quick Stats Row ──────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Today&apos;s Earnings</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{formatCurrency(185.5)}</div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
            <TrendingUp className="h-3 w-3" /> 8 completed trips
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Distance Covered</span>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">38.4 km</div>
          <span className="text-xs text-gray-400 mt-1 block">Accra Metro Zone</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Acceptance Rate</span>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">96.5%</div>
          <span className="text-xs text-emerald-600 mt-1 block">Tier: Gold Courier</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Customer Rating</span>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">⭐ 4.92</div>
          <span className="text-xs text-gray-400 mt-1 block">420 total trips</span>
        </div>
      </div>

      {/* ──────────────── Backend API Health ──────────────── */}
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-sm">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Rider Centralised API Gateway</h3>
              <p className="text-xs text-gray-600">
                Verifies rider JWT bearer tokens, active GPS ping telemetry, and error normalization.
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
            Verify Courier Token
          </Button>
        </div>

        {testResult.status === 'success' && (
          <div className="mt-3 p-3.5 rounded-2xl bg-white border border-emerald-200 text-xs text-emerald-800 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>Courier Endpoint Verified!</span>
            </div>
            <pre className="text-[11px] text-gray-600 overflow-x-auto bg-gray-50 p-2.5 rounded-xl mt-1 font-mono">
              {JSON.stringify(testResult.data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* ──────────────── Available Delivery Runs with Food Photos ──────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Nearby Delivery Offers</h2>
            <p className="text-xs text-gray-500">
              {isOnline
                ? `${trips.length} active delivery requests available near Osu & Labone`
                : 'You are currently OFFLINE. Toggle online to accept requests.'}
            </p>
          </div>
          {isOnline && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-pulse">
              <Bike className="h-3.5 w-3.5" /> GPS Active
            </span>
          )}
        </div>

        {!isOnline && (
          <div className="p-8 text-center bg-gray-50 rounded-3xl border border-gray-200 space-y-2">
            <Bike className="h-10 w-10 text-gray-400 mx-auto" />
            <h3 className="text-sm font-bold text-gray-700">Courier Mode Paused</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Switch your status toggle to ONLINE in the top navigation bar to receive order pickup offers.
            </p>
          </div>
        )}

        {isOnline && trips.length === 0 && (
          <div className="p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">All current requests cleared</h3>
            <p className="text-xs text-gray-500">Waiting for next kitchen preparation to complete...</p>
          </div>
        )}

        {isOnline && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="group p-5 bg-white rounded-3xl border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                    <img
                      src={trip.dishImage}
                      alt="Order food"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                        {trip.orderNumber}
                      </span>
                      <span className="font-extrabold text-emerald-700 text-base">
                        +{formatCurrency(trip.estimatedEarnings)}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm truncate">{trip.merchantName}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{trip.itemsSummary}</p>

                    <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
                      <span className="flex items-center gap-1 font-medium text-gray-600">
                        <MapPin className="h-3 w-3 text-emerald-600" /> {trip.distanceKm} km
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium text-gray-600">
                        <Clock className="h-3 w-3 text-emerald-600" /> ~{trip.estMinutes} mins
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pickup & Dropoff Addresses */}
                <div className="p-3 bg-gray-50 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    <span className="truncate"><strong>Pickup:</strong> {trip.pickupAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                    <span className="truncate"><strong>Dropoff:</strong> {trip.dropoffAddress}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    onClick={() => handleDecline(trip.id)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAccept(trip)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Accept Run</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
