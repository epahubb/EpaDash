import { useNavigate } from "react-router-dom";
import { useAuthStore, Button } from "@epadash/shared";
import { CreditCard, LogOut } from "lucide-react";
function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return <div className="space-y-6 max-w-xl mx-auto pb-12"><h1 className="text-2xl font-bold text-gray-900">Merchant Account</h1><div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-4"><div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xl flex items-center justify-center border-2 border-emerald-200">
          BR
        </div><div className="flex-1 min-w-0"><h2 className="text-lg font-bold text-gray-900 truncate">{user?.name || "Buka Restaurant Osu"}</h2><p className="text-xs text-gray-500 truncate">{user?.email || "manager@bukarestaurant.com"}</p><span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1">
            Verified Partner Merchant
          </span></div></div><div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3"><h3 className="font-bold text-sm text-gray-900">Payout Settlement</h3><p className="text-xs text-gray-500 leading-relaxed">
          Daily sales are automatically settled to your verified merchant account every business day at 11:00 PM GMT.
        </p><div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 flex items-center gap-2"><CreditCard className="h-4 w-4 text-emerald-600" /><span>Stanbic Bank Ghana • Acc ending in ****8921</span></div></div><Button
    variant="outline"
    size="lg"
    className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
    leftIcon={<LogOut className="h-4 w-4" />}
    onClick={handleLogout}
  >
        Sign Out of Merchant Portal
      </Button></div>;
}
export {
  ProfilePage as default
};
