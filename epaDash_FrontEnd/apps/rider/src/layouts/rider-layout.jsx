import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Home, Package, Wallet, User, Bike, Power } from "lucide-react";
import { useAuthStore, cn } from "@epadash/shared";
const riderNavItems = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/deliveries", icon: Package, label: "Deliveries" },
  { to: "/earnings", icon: Wallet, label: "Earnings" },
  { to: "/profile", icon: User, label: "Profile" }
];
function RiderLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const [isOnline, setIsOnline] = useState(true);
  const isActiveRoute = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };
  return <div className="flex min-h-screen flex-col bg-gray-50">{
    /* Top Header Bar */
  }<header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-md"><div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md"><Bike className="h-5 w-5" /></div><div><div className="flex items-center gap-2"><span className="text-base font-bold text-gray-900 tracking-tight">EpaDash</span><span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  Rider
                </span></div><p className="text-xs text-gray-500 font-medium">{user?.name || "Kofi Annan"}</p></div></div>{
    /* Online/Offline status switch */
  }<div className="flex items-center gap-3"><button
    onClick={() => setIsOnline(!isOnline)}
    className={cn(
      "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm",
      isOnline ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-600 border border-gray-200"
    )}
  ><span
    className={cn(
      "h-2.5 w-2.5 rounded-full",
      isOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
    )}
  /><span>{isOnline ? "ONLINE" : "OFFLINE"}</span><Power className="h-3.5 w-3.5 ml-1" /></button></div></div></header>{
    /* Main Content Area */
  }<main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-24 pt-4 sm:px-6 sm:pb-8 sm:pt-6"><Outlet context={{ isOnline, setIsOnline }} /></main>{
    /* Bottom Navigation Tabs (Mobile) */
  }<nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-md sm:hidden"><div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">{riderNavItems.map((item) => {
    const active = isActiveRoute(item.to);
    return <NavLink
      key={item.to}
      to={item.to}
      className="flex flex-col items-center gap-0.5 px-3 py-1"
    ><div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200",
        active ? "bg-emerald-100 text-emerald-700 scale-110" : "text-gray-400"
      )}
    ><item.icon className={cn("h-5 w-5", active && "stroke-[2.5px]")} /></div><span
      className={cn(
        "text-[10px] font-medium transition-colors",
        active ? "text-emerald-700 font-bold" : "text-gray-400"
      )}
    >{item.label}</span></NavLink>;
  })}</div></nav></div>;
}
export {
  RiderLayout as default
};
