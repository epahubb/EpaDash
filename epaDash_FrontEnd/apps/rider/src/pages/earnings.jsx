import { formatCurrency, Button } from "@epadash/shared";
import { Download } from "lucide-react";
function EarningsPage() {
  const payoutHistory = [
    { id: "pay_1", date: "Yesterday, 9:00 PM", amount: 185.5, status: "Paid to MTN MoMo (024***7654)" },
    { id: "pay_2", date: "08 Nov 2026", amount: 240, status: "Paid to MTN MoMo (024***7654)" },
    { id: "pay_3", date: "07 Nov 2026", amount: 310, status: "Paid to MTN MoMo (024***7654)" }
  ];
  return <div className="space-y-6"><div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Earnings & Payouts</h1><Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
          Statements
        </Button></div>{
    /* Main Balance Hero Card */
  }<div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-md"><span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
          Available for Instant Cashout
        </span><div className="text-3xl sm:text-4xl font-extrabold mt-1">{formatCurrency(412.5)}</div><p className="text-xs text-emerald-100/80 mt-1">
          From 14 delivery trips completed this week
        </p><div className="mt-6 flex flex-col sm:flex-row gap-3"><Button variant="primary" size="md" className="bg-white text-emerald-800 hover:bg-emerald-50">
            Cash Out to Mobile Money
          </Button></div></div>{
    /* Weekly Performance Overview */
  }<div className="grid grid-cols-1 sm:grid-cols-3 gap-3"><div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"><span className="text-xs text-gray-400 font-medium">This Week</span><div className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(735.5)}</div><span className="text-xs text-emerald-600 font-semibold mt-1 block">+12% vs last week</span></div><div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"><span className="text-xs text-gray-400 font-medium">Tips Received</span><div className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(65)}</div><span className="text-xs text-gray-400 mt-1 block">100% goes to you</span></div><div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"><span className="text-xs text-gray-400 font-medium">Total Trips</span><div className="text-xl font-bold text-gray-900 mt-1">28 trips</div><span className="text-xs text-emerald-600 mt-1 block">98% satisfaction</span></div></div>{
    /* Recent Payouts */
  }<div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4"><h3 className="font-bold text-gray-900 text-sm">Recent Direct Payouts</h3><div className="divide-y divide-gray-100">{payoutHistory.map((p) => <div key={p.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between"><div><p className="text-sm font-bold text-gray-900">{formatCurrency(p.amount)}</p><p className="text-xs text-gray-500 mt-0.5">{p.status}</p></div><span className="text-xs text-gray-400 font-medium">{p.date}</span></div>)}</div></div></div>;
}
export {
  EarningsPage as default
};
