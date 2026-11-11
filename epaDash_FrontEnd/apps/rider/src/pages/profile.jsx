import { useNavigate } from "react-router-dom";
import { useAuthStore, Button } from "@epadash/shared";
import {
  ShieldCheck,
  FileText,
  CreditCard,
  LogOut,
  ChevronRight,
  Star
} from "lucide-react";
function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return <div className="space-y-6 max-w-xl mx-auto pb-12"><h1 className="text-2xl font-bold text-gray-900">Rider Profile</h1>{
    /* Profile Card */
  }<div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-4"><div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xl flex items-center justify-center border-2 border-emerald-200">
          KA
        </div><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><h2 className="text-lg font-bold text-gray-900 truncate">{user?.name || "Kofi Annan"}</h2><span className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.92
            </span></div><p className="text-xs text-gray-500 truncate">{user?.email || "kofi.rider@epadash.com"}</p><p className="text-xs text-emerald-600 font-semibold mt-1">Vehicle: Yamaha 125cc (Verified)</p></div></div>{
    /* Verification & Compliance */
  }<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"><div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50"><span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Compliance & Documents</span></div><div className="divide-y divide-gray-50 text-sm"><div className="p-4 flex items-center justify-between"><div className="flex items-center gap-3"><FileText className="h-4 w-4 text-emerald-600" /><span>Driver&apos;s License (DVLA Class A)</span></div><span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Verified
            </span></div><div className="p-4 flex items-center justify-between"><div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-emerald-600" /><span>Third Party Vehicle Insurance</span></div><span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Valid until Dec 2027
            </span></div><div className="p-4 flex items-center justify-between"><div className="flex items-center gap-3"><CreditCard className="h-4 w-4 text-emerald-600" /><span>Payout MoMo Wallet (MTN: 0244987654)</span></div><ChevronRight className="h-4 w-4 text-gray-400" /></div></div></div><Button
    variant="outline"
    size="lg"
    className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
    leftIcon={<LogOut className="h-4 w-4" />}
    onClick={handleLogout}
  >
        Sign Out of Rider Portal
      </Button></div>;
}
export {
  ProfilePage as default
};
