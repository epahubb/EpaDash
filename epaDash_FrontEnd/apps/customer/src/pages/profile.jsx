import { useNavigate } from "react-router-dom";
import { useAuthStore, Button } from "@epadash/shared";
import {
  MapPin,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight
} from "lucide-react";
function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const menuSections = [
    {
      title: "Account & Addresses",
      items: [
        { label: "Saved Addresses", icon: MapPin, desc: "Home, Office, Pickup points" },
        { label: "Payment Methods", icon: CreditCard, desc: "MTN Mobile Money, Visa, Telecel" },
        { label: "Notifications", icon: Bell, desc: "Push, SMS, Order alerts" }
      ]
    },
    {
      title: "Preferences & Security",
      items: [
        { label: "Privacy & Security", icon: Shield, desc: "Password, Biometric login" },
        { label: "Help & Customer Support", icon: HelpCircle, desc: "Live chat, FAQ, Call center" }
      ]
    }
  ];
  return <div className="space-y-6 max-w-xl mx-auto pb-12"><h1 className="text-2xl font-bold text-gray-900">Your Account</h1>{
    /* User Info Header Card */
  }<div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-4"><div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xl flex items-center justify-center border-2 border-emerald-200">{user?.name ? user.name.slice(0, 2).toUpperCase() : "CU"}</div><div className="flex-1 min-w-0"><h2 className="text-lg font-bold text-gray-900 truncate">{user?.name || "Customer"}</h2><p className="text-xs text-gray-500 truncate">{user?.email || "customer@example.com"}</p><p className="text-xs text-emerald-600 font-medium mt-1">Ghana • Verified Account</p></div></div>{
    /* Menu Sections */
  }{menuSections.map((sec) => <div key={sec.title} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"><div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50"><span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{sec.title}</span></div><div className="divide-y divide-gray-50">{sec.items.map((item) => <div
    key={item.label}
    className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
  ><div className="flex items-center gap-3.5"><div className="p-2 rounded-xl bg-gray-100 text-gray-600"><item.icon className="h-4 w-4" /></div><div><h4 className="text-sm font-semibold text-gray-900">{item.label}</h4><p className="text-xs text-gray-400">{item.desc}</p></div></div><ChevronRight className="h-4 w-4 text-gray-400" /></div>)}</div></div>)}{
    /* Logout button */
  }<Button
    variant="outline"
    size="lg"
    className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
    leftIcon={<LogOut className="h-4 w-4" />}
    onClick={handleLogout}
  >
        Sign Out
      </Button></div>;
}
export {
  ProfilePage as default
};
