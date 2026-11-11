import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@epadash/shared';

const mockGlobalOrders = [
  {
    id: 'ORD-8492',
    customer: 'Kwame Mensah',
    merchant: 'Buka Restaurant Osu',
    rider: 'Kofi Annan',
    total: 147,
    status: 'in_transit',
    dishImage: '/images/jollof.webp',
    itemsSummary: '2x Assorted Jollof, 1x Sobolo',
  },
  {
    id: 'ORD-8488',
    customer: 'Sarah Danquah',
    merchant: 'Buka Restaurant Osu',
    rider: 'Pending Courier',
    total: 75,
    status: 'preparing',
    dishImage: '/images/banku.webp',
    itemsSummary: '1x Banku with Fresh Tilapia',
  },
  {
    id: 'ORD-8475',
    customer: 'Emmanuel K.',
    merchant: 'Starbites Food Bar',
    rider: 'Yaw Boateng',
    total: 185,
    status: 'delivered',
    dishImage: '/images/cheese.webp',
    itemsSummary: '2x Supreme Cheese Burger, Fries',
  },
  {
    id: 'ORD-8462',
    customer: 'Abena Serwaa',
    merchant: 'Mama Lit Kitchen',
    rider: 'Ama Darko',
    total: 70,
    status: 'delivered',
    dishImage: '/images/fufu.jpg',
    itemsSummary: '1x Silky Fufu with Goat Meat Light Soup',
  },
];

export default function OrdersPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Orders Ledger</h1>
          <p className="text-xs text-gray-500">
            Real-time multi-tenant view of orders across Customer, Merchant, and Courier applications
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-5 font-semibold">Order & Dish</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Merchant</th>
                <th className="py-3.5 px-4 font-semibold">Assigned Rider</th>
                <th className="py-3.5 px-4 font-semibold">Total</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {mockGlobalOrders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                        <img src={o.dishImage} alt={o.id} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-mono font-bold text-gray-900">{o.id}</div>
                        <div className="text-[11px] text-gray-500 line-clamp-1">{o.itemsSummary}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900">{o.customer}</td>
                  <td className="py-3.5 px-4 text-gray-600">{o.merchant}</td>
                  <td className="py-3.5 px-4 text-gray-600">{o.rider}</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-700">
                    {formatCurrency(o.total)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                        o.status === 'delivered'
                          ? 'bg-gray-100 text-gray-700'
                          : o.status === 'in_transit'
                          ? 'bg-blue-50 text-blue-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => navigate(`/orders/${o.id}`)}
                      className="px-3 py-1.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 font-bold transition-colors"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
