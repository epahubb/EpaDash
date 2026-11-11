import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '@epadash/shared';
import { Star, ShieldCheck, CheckCircle } from 'lucide-react';

const mockMerchantsList = [
  {
    id: 'm1',
    name: 'Buka Restaurant Osu',
    category: 'Local & Ghanaian Specialties',
    status: 'approved',
    rating: 4.9,
    orders: 1480,
    image: '/images/delicious.jpg',
    specialty: 'Party Jollof & Charcoal Tilapia',
  },
  {
    id: 'm2',
    name: 'Starbites Food Bar',
    category: 'Continental & Burgers',
    status: 'approved',
    rating: 4.7,
    orders: 980,
    image: '/images/cheese.webp',
    specialty: 'Cheesy Burgers & Wings',
  },
  {
    id: 'm3',
    name: 'Mama Lit Kitchen Labone',
    category: 'Local Soups & Banku',
    status: 'approved',
    rating: 4.9,
    orders: 640,
    image: '/images/banku.webp',
    specialty: 'Banku & Steaming Light Soup',
  },
  {
    id: 'm4',
    name: 'Chopbox Grills East Legon',
    category: 'BBQ & Street Indomie',
    status: 'pending',
    rating: 4.6,
    orders: 42,
    image: '/images/zizard.webp',
    specialty: 'Spicy Gizzard & Indomie',
  },
];

export default function MerchantsPage() {
  const navigate = useNavigate();
  const [merchants, setMerchants] = useState(mockMerchantsList);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const handleApprove = (id, name) => {
    setMerchants(merchants.map((m) => (m.id === id ? { ...m, status: 'approved' } : m)));
    addNotification({
      type: 'success',
      title: 'Merchant Approved',
      message: `${name} is now approved to receive live customer orders.`,
    });
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Merchants & Restaurant Approvals</h1>
          <p className="text-xs text-gray-500">
            Review restaurant onboarding applications, menus, hygiene verification, and operating health
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-5 font-semibold">Restaurant & Kitchen</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Rating</th>
                <th className="py-3.5 px-4 font-semibold">Fulfillment</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {merchants.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                        <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{m.name}</div>
                        <div className="text-[11px] text-gray-400">{m.specialty}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 font-medium">{m.category}</td>
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1 font-bold text-gray-800">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {m.rating}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-700 font-bold">{m.orders} orders</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                        m.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right space-x-2">
                    {m.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(m.id, m.name)}
                        className="px-3 py-1.5 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-bold transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/merchants/${m.id}`)}
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
