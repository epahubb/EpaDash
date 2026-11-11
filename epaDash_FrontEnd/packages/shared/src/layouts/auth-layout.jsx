import { Outlet, Link } from "react-router-dom";
import { ShoppingBag, ShieldCheck, Zap, HeartHandshake } from "lucide-react";
const AuthLayout = () => {
  return <div className="min-h-screen flex flex-col lg:flex-row bg-white">{
    /* Brand Hero Panel (Desktop) */
  }<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">{
    /* Background Decorative Circles */
  }<div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" /><div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />{
    /* Brand Header */
  }<div className="relative z-10"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"><ShoppingBag className="h-6 w-6" /></div><span className="text-2xl font-bold tracking-tight">EpaDash</span></div><p className="mt-2 text-sm text-emerald-200/80">Everyday Delivery, Elevated.</p></div>{
    /* Value Proposition Highlights */
  }<div className="relative z-10 max-w-lg space-y-8 my-auto"><div className="space-y-3"><span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"><Zap className="h-3.5 w-3.5" /> Next-Gen Logistics Platform
            </span><h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
              Hyper-local commerce for Ghana and beyond.
            </h1><p className="text-base text-gray-300 leading-relaxed">
              Unified real-time logistics connecting customers, independent merchants, and professional riders seamlessly.
            </p></div><div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-800/40"><div className="flex items-start gap-3"><div className="p-2 rounded-lg bg-emerald-800/40 text-emerald-300"><ShieldCheck className="h-5 w-5" /></div><div><h4 className="text-sm font-semibold">Secure & Reliable</h4><p className="text-xs text-gray-400">End-to-end tokenized transactions and escrow.</p></div></div><div className="flex items-start gap-3"><div className="p-2 rounded-lg bg-emerald-800/40 text-emerald-300"><HeartHandshake className="h-5 w-5" /></div><div><h4 className="text-sm font-semibold">Fair Partnerships</h4><p className="text-xs text-gray-400">Competitive payouts and merchant tools.</p></div></div></div></div>{
    /* Footer */
  }<div className="relative z-10 text-xs text-gray-400">
          © {(/* @__PURE__ */ new Date()).getFullYear()} EpaDash Technologies Ltd. All rights reserved.
        </div></div>{
    /* Auth Content Panel */
  }<div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16"><div className="w-full max-w-md">{
    /* Mobile Brand Logo */
  }<div className="lg:hidden flex items-center justify-center gap-2.5 mb-8"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md"><ShoppingBag className="h-5 w-5" /></div><span className="text-2xl font-bold tracking-tight text-gray-900">EpaDash</span></div><Outlet /><p className="mt-8 text-center text-xs text-gray-500">
            By continuing, you agree to our{" "}<Link to="/terms" className="underline hover:text-gray-900">Terms of Service</Link>{" "}and{" "}<Link to="/privacy" className="underline hover:text-gray-900">Privacy Policy</Link>.
          </p></div></div></div>;
};
export {
  AuthLayout
};
