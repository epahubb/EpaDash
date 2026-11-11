import { formatCurrency } from "@epadash/shared";
function AnalyticsPage() {
  const topDishes = [
    { name: "Signature Assorted Meat Jollof", sales: 142, revenue: 9230 },
    { name: "Banku with Fresh Tilapia & Hot Pepper", sales: 98, revenue: 7350 },
    { name: "Special Waakye Platter", sales: 84, revenue: 4620 },
    { name: "Chilled Hibiscus Sobolo", sales: 110, revenue: 1980 }
  ];
  return <div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Sales & Kitchen Analytics</h1><p className="text-xs text-gray-500">Track dish velocity, gross margins, and prep performance</p></div></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"><span className="text-xs text-gray-400 font-medium">30-Day Gross Revenue</span><div className="text-2xl font-extrabold text-gray-900 mt-1">{formatCurrency(48250)}</div><span className="text-xs text-emerald-600 font-semibold mt-1 block">+22% month-on-month</span></div><div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"><span className="text-xs text-gray-400 font-medium">Monthly Orders Fulfilled</span><div className="text-2xl font-extrabold text-gray-900 mt-1">682 orders</div><span className="text-xs text-emerald-600 font-semibold mt-1 block">99.2% fulfillment rate</span></div><div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"><span className="text-xs text-gray-400 font-medium">Average Order Value</span><div className="text-2xl font-extrabold text-gray-900 mt-1">{formatCurrency(70.75)}</div><span className="text-xs text-gray-400 mt-1 block">Across all times of day</span></div></div><div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4"><h3 className="font-bold text-gray-900 text-sm">Top Selling Dishes (Last 30 Days)</h3><div className="divide-y divide-gray-100">{topDishes.map((dish, i) => <div key={dish.name} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between"><div className="flex items-center gap-3"><span className="text-xs font-bold text-emerald-700 bg-emerald-50 h-6 w-6 rounded-full flex items-center justify-center">
                  #{i + 1}</span><div><h4 className="text-sm font-semibold text-gray-900">{dish.name}</h4><p className="text-xs text-gray-500">{dish.sales} orders placed</p></div></div><span className="text-sm font-bold text-gray-900">{formatCurrency(dish.revenue)}</span></div>)}</div></div></div>;
}
export {
  AnalyticsPage as default
};
