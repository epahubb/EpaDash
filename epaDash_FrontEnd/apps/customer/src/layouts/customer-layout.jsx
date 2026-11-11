import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Package,
  User,
  ShoppingCart,
  MapPin
} from "lucide-react";
import { useAuthStore, cn } from "@epadash/shared";
import { useCartStore } from "@/stores/cart-store";
const bottomNavItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/orders", icon: Package, label: "Orders" },
  { to: "/profile", icon: User, label: "Profile" }
];
function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const totalItems = useCartStore((s) => s.totalItems());
  const isActiveRoute = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };
  return <div className="flex min-h-screen flex-col bg-gray-50">{
    /* Top Header Bar */
  }<header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur-md"><div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 lg:h-16 lg:max-w-6xl lg:px-6">{
    /* Logo + Location */
  }<div className="flex items-center gap-3"><button
    onClick={() => navigate("/")}
    className="flex items-center gap-1.5"
  ><span className="text-xl font-extrabold tracking-tight text-primary-600">
                Epa
              </span><span className="text-xl font-extrabold tracking-tight text-gray-900">
                Dash
              </span></button><div className="hidden h-6 w-px bg-gray-200 sm:block" /><button className="hidden items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 sm:flex"><MapPin className="h-3.5 w-3.5 text-primary-600" /><span className="max-w-[140px] truncate font-medium">{user?.firstName ? `${user.firstName}'s Location` : "Set location"}</span></button></div>{
    /* Desktop Nav (visible lg+) */
  }<nav className="hidden items-center gap-1 lg:flex">{bottomNavItems.map((item) => {
    const active = isActiveRoute(item.to);
    return <NavLink
      key={item.to}
      to={item.to}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
        active ? "bg-primary-50 text-primary-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      )}
    ><item.icon className="h-4.5 w-4.5" />{item.label}</NavLink>;
  })}</nav>{
    /* Cart Button */
  }<button
    onClick={() => navigate("/cart")}
    className="relative flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md active:scale-95"
  ><ShoppingCart className="h-4 w-4" /><span className="hidden sm:inline">Cart</span>{totalItems > 0 && <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-primary-700">{totalItems}</span>}</button></div></header>{
    /* Main Content */
  }<main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-4 lg:max-w-6xl lg:px-6 lg:pb-8 lg:pt-6"><Outlet /></main>{
    /* Bottom Tab Navigation (mobile only) */
  }<nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-md lg:hidden"><div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">{bottomNavItems.map((item) => {
    const active = isActiveRoute(item.to);
    return <NavLink
      key={item.to}
      to={item.to}
      className="flex flex-col items-center gap-0.5 px-3 py-1"
    ><div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200",
        active ? "bg-primary-100 text-primary-700 scale-110" : "text-gray-400"
      )}
    ><item.icon
      className={cn("h-5 w-5", active && "stroke-[2.5px]")}
    /></div><span
      className={cn(
        "text-[10px] font-medium transition-colors",
        active ? "text-primary-700" : "text-gray-400"
      )}
    >{item.label}</span></NavLink>;
  })}</div>{
    /* Safe area spacer for iOS */
  }<div className="h-[env(safe-area-inset-bottom)]" /></nav></div>;
}
export {
  CustomerLayout as default
};
