import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore, useUIStore, useNotificationStore } from "../stores";
import { cn } from "../utils";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  LogOut,
  User as UserIcon,
  ShoppingBag,
  Settings
} from "lucide-react";
const DashboardLayout = ({
  sidebarItems,
  appName,
  appBadge
}) => {
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebarCollapse } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { notifications } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return <div className="min-h-screen bg-gray-50 flex">{
    /* ──────────────── Mobile Overlay ──────────────── */
  }{mobileMenuOpen && <div
    className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity"
    onClick={() => setMobileMenuOpen(false)}
  />}{
    /* ──────────────── Sidebar ──────────────── */
  }<aside
    className={cn(
      "fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 text-white transition-all duration-300 ease-in-out border-r border-slate-800",
      sidebarCollapsed ? "w-20" : "w-64",
      mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}
  >{
    /* Sidebar Header */
  }<div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80"><div className="flex items-center gap-3 overflow-hidden"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md"><ShoppingBag className="h-5 w-5" /></div>{!sidebarCollapsed && <div className="flex flex-col truncate"><span className="font-bold text-base tracking-tight text-white">{appName}</span>{appBadge && <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">{appBadge}</span>}</div>}</div><button
    onClick={() => setMobileMenuOpen(false)}
    className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
  ><X className="h-5 w-5" /></button></div>{
    /* Navigation Items */
  }<nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">{sidebarItems.map((item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path || item.path !== "/" && location.pathname.startsWith(item.path);
    return <NavLink
      key={item.path}
      to={item.path}
      onClick={() => setMobileMenuOpen(false)}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
        isActive ? "bg-emerald-600 text-white shadow-sm" : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
      )}
      title={sidebarCollapsed ? item.label : void 0}
    ><Icon className={cn("h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-400")} />{!sidebarCollapsed && <span className="truncate flex-1">{item.label}</span>}{!sidebarCollapsed && item.badge !== void 0 && <span className={cn(
      "ml-auto text-xs font-semibold px-2 py-0.5 rounded-full",
      isActive ? "bg-white/20 text-white" : "bg-emerald-500/20 text-emerald-400"
    )}>{item.badge}</span>}</NavLink>;
  })}</nav>{
    /* Sidebar Footer & Collapse Toggle */
  }<div className="p-3 border-t border-slate-800/80"><button
    onClick={toggleSidebarCollapse}
    className="hidden lg:flex w-full items-center justify-center gap-2 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
  >{sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /><span>Collapse Sidebar</span></>}</button></div></aside>{
    /* ──────────────── Main Content Area ──────────────── */
  }<div
    className={cn(
      "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
      sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
    )}
  >{
    /* Top Header Bar */
  }<header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-4 sm:px-6"><div className="flex items-center gap-3"><button
    onClick={() => setMobileMenuOpen(true)}
    className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
    aria-label="Open sidebar"
  ><Menu className="h-5 w-5" /></button>{
    /* Quick Search Bar */
  }<div className="hidden sm:flex items-center relative w-64 md:w-80"><Search className="h-4 w-4 text-gray-400 absolute left-3 pointer-events-none" /><input
    type="text"
    placeholder="Search orders, items, users..."
    className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 placeholder:text-gray-400"
  /></div></div><div className="flex items-center gap-3">{
    /* Notification Bell */
  }<button
    className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
    aria-label="Notifications"
  ><Bell className="h-5 w-5" />{notifications.length > 0 && <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-emerald-500" />}</button>{
    /* User Avatar & Dropdown */
  }<div className="relative"><button
    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
    className="flex items-center gap-2.5 p-1 rounded-full hover:bg-gray-100 transition-colors"
  ><div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center justify-center border border-emerald-200">{user?.name ? user.name.slice(0, 2).toUpperCase() : "EP"}</div><div className="hidden md:block text-left pr-2"><div className="text-xs font-semibold text-gray-900 leading-tight">{user?.name || "Administrator"}</div><div className="text-[10px] text-gray-500 capitalize">{user?.role || "Guest"}</div></div></button>{userDropdownOpen && <><div
    className="fixed inset-0 z-30"
    onClick={() => setUserDropdownOpen(false)}
  /><div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-40 text-sm animate-in fade-in zoom-in-95"><div className="px-4 py-2 border-b border-gray-100"><p className="font-semibold text-gray-900 truncate">{user?.name || "User"}</p><p className="text-xs text-gray-500 truncate">{user?.email || "user@epadash.com"}</p></div><NavLink
    to="/profile"
    onClick={() => setUserDropdownOpen(false)}
    className="flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-gray-50"
  ><UserIcon className="h-4 w-4 text-gray-400" /> Profile
                    </NavLink><NavLink
    to="/settings"
    onClick={() => setUserDropdownOpen(false)}
    className="flex items-center gap-2.5 px-4 py-2 text-gray-700 hover:bg-gray-50"
  ><Settings className="h-4 w-4 text-gray-400" /> Settings
                    </NavLink><div className="border-t border-gray-100 my-1" /><button
    onClick={handleLogout}
    className="w-full flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 text-left"
  ><LogOut className="h-4 w-4 text-red-500" /> Sign out
                    </button></div></>}</div></div></header>{
    /* Main Content Body */
  }<main className="flex-1 p-4 sm:p-6 lg:p-8"><Outlet /></main></div></div>;
};
export {
  DashboardLayout
};
