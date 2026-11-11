import { useNavigate } from "react-router-dom";
import { cn, formatCurrency } from "@epadash/shared";
import {
  Users,
  Store,
  Bike,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  Clock,
  ArrowRight,
  UserPlus,
  ShieldCheck,
  BarChart3,
  Settings
} from "lucide-react";
const statsCards = [
  {
    label: "Total Users",
    value: "12,847",
    change: 12.5,
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    label: "Total Merchants",
    value: "384",
    change: 8.2,
    icon: Store,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    label: "Active Riders",
    value: "156",
    change: -3.1,
    icon: Bike,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600"
  },
  {
    label: "Today's Orders",
    value: "1,243",
    change: 18.7,
    icon: ShoppingBag,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600"
  },
  {
    label: "Today's Revenue",
    value: formatCurrency(48750),
    change: 22.3,
    icon: DollarSign,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600"
  }
];
const recentActivity = [
  {
    id: "1",
    type: "merchant",
    message: `New merchant "Auntie Muni's Kitchen" registered and is pending approval`,
    timestamp: "2 minutes ago",
    icon: Store,
    iconColor: "text-purple-500"
  },
  {
    id: "2",
    type: "order",
    message: "Order #EP-8834 completed successfully \u2014 GH\u20B5 67.50",
    timestamp: "5 minutes ago",
    icon: CheckCircle,
    iconColor: "text-emerald-500"
  },
  {
    id: "3",
    type: "rider",
    message: "Rider Kwame Asante went online in Osu area",
    timestamp: "8 minutes ago",
    icon: Bike,
    iconColor: "text-amber-500"
  },
  {
    id: "4",
    type: "user",
    message: "New user Abena Mensah signed up via mobile app",
    timestamp: "12 minutes ago",
    icon: UserPlus,
    iconColor: "text-blue-500"
  },
  {
    id: "5",
    type: "order",
    message: "Order #EP-8831 assigned to rider Yaw Boateng",
    timestamp: "15 minutes ago",
    icon: Clock,
    iconColor: "text-orange-500"
  },
  {
    id: "6",
    type: "merchant",
    message: 'Merchant "Papaye" updated their menu \u2014 5 new items added',
    timestamp: "22 minutes ago",
    icon: Store,
    iconColor: "text-purple-500"
  },
  {
    id: "7",
    type: "order",
    message: "Order #EP-8828 cancelled by customer \u2014 refund initiated",
    timestamp: "30 minutes ago",
    icon: Activity,
    iconColor: "text-red-500"
  },
  {
    id: "8",
    type: "rider",
    message: "Rider Ama Darko completed 50th delivery this week \u2014 milestone reached",
    timestamp: "45 minutes ago",
    icon: CheckCircle,
    iconColor: "text-emerald-500"
  }
];
const quickActions = [
  {
    label: "Approve Merchants",
    description: "3 merchants awaiting approval",
    icon: ShieldCheck,
    path: "/merchants?filter=pending",
    color: "text-purple-600",
    bg: "bg-purple-50 hover:bg-purple-100"
  },
  {
    label: "Manage Users",
    description: "View and manage all platform users",
    icon: Users,
    path: "/users",
    color: "text-blue-600",
    bg: "bg-blue-50 hover:bg-blue-100"
  },
  {
    label: "View Reports",
    description: "Platform analytics and insights",
    icon: BarChart3,
    path: "/analytics",
    color: "text-emerald-600",
    bg: "bg-emerald-50 hover:bg-emerald-100"
  },
  {
    label: "System Settings",
    description: "Platform configuration and fees",
    icon: Settings,
    path: "/settings",
    color: "text-gray-600",
    bg: "bg-gray-50 hover:bg-gray-100"
  }
];
function DashboardPage() {
  const navigate = useNavigate();
  const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return <div className="space-y-8">{
    /* Header */
  }<div><h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1><p className="mt-1 text-sm text-gray-500">{today}</p></div>{
    /* Stats Cards */
  }<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">{statsCards.map((stat) => {
    const Icon = stat.icon;
    const isPositive = stat.change >= 0;
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;
    return <div key={stat.label} className="stat-card"><div className="flex items-start justify-between"><div
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-lg",
        stat.iconBg
      )}
    ><Icon className={cn("w-5 h-5", stat.iconColor)} /></div><div
      className={cn(
        "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
        isPositive ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"
      )}
    ><TrendIcon className="w-3 h-3" /><span>{Math.abs(stat.change)}%</span></div></div><div className="mt-4"><p className="text-2xl font-bold text-gray-900">{stat.value}</p><p className="text-sm text-gray-500 mt-0.5">{stat.label}</p></div></div>;
  })}</div>{
    /* Main Content Grid */
  }<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">{
    /* Recent Activity */
  }<div className="xl:col-span-2 admin-card"><div className="px-6 py-4 border-b border-gray-100"><div className="flex items-center justify-between"><h2 className="text-base font-semibold text-gray-900">
                Recent Activity
              </h2><div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
                Live
              </div></div></div><div className="divide-y divide-gray-50">{recentActivity.map((event) => {
    const Icon = event.icon;
    return <div
      key={event.id}
      className="px-6 py-3.5 flex items-start gap-3.5 hover:bg-gray-50/50 transition-colors"
    ><div
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 flex-shrink-0 mt-0.5"
      )}
    ><Icon className={cn("w-4 h-4", event.iconColor)} /></div><div className="flex-1 min-w-0"><p className="text-sm text-gray-700 leading-snug">{event.message}</p><p className="text-xs text-gray-400 mt-1">{event.timestamp}</p></div></div>;
  })}</div></div>{
    /* Quick Actions */
  }<div className="space-y-4"><h2 className="text-base font-semibold text-gray-900">
            Quick Actions
          </h2><div className="grid grid-cols-1 gap-3">{quickActions.map((action) => {
    const Icon = action.icon;
    return <button
      key={action.label}
      onClick={() => navigate(action.path)}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border border-gray-200 text-left transition-all duration-200 group",
        "hover:shadow-sm hover:border-gray-300"
      )}
    ><div
      className={cn(
        "flex items-center justify-center w-11 h-11 rounded-lg transition-colors",
        action.bg
      )}
    ><Icon className={cn("w-5 h-5", action.color)} /></div><div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-900">{action.label}</p><p className="text-xs text-gray-500 mt-0.5">{action.description}</p></div><ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" /></button>;
  })}</div></div></div></div>;
}
export {
  DashboardPage as default
};
