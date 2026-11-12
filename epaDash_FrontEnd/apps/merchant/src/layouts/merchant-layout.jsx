import { Outlet } from "react-router-dom";
import { DashboardLayout } from "@epadash/shared";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  BarChart3,
  Star,
  Settings,
  User,
} from "lucide-react";

/**
 * MerchantLayout — thin wrapper around the shared DashboardLayout
 * with merchant-specific sidebar items baked in.
 *
 * Used when you need a layout component reference at the app level
 * rather than inlining config in the router.
 */
const merchantSidebarItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Orders", path: "/orders", icon: ShoppingBag, badge: 0 },
  { label: "Menu Catalog", path: "/menu", icon: UtensilsCrossed },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Reviews", path: "/reviews", icon: Star },
  { label: "Profile", path: "/profile", icon: User },
  { label: "Store Settings", path: "/settings", icon: Settings },
];

function MerchantLayout() {
  return (
    <DashboardLayout
      appName="EpaDash Merchant"
      appBadge="Partner Portal"
      sidebarItems={merchantSidebarItems}
    />
  );
}

export { MerchantLayout, merchantSidebarItems };

