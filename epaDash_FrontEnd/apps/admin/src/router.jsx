import { createBrowserRouter } from "react-router-dom";
import {
  AuthLayout,
  DashboardLayout,
  ProtectedRoute
} from "@epadash/shared";
import {
  LayoutDashboard,
  Users,
  Store,
  Bike,
  ShoppingBag,
  BarChart3,
  Settings
} from "lucide-react";
import LoginPage from "./pages/auth/login";
import DashboardPage from "./pages/dashboard";
import UsersPage from "./pages/users";
import UserDetailPage from "./pages/user-detail";
import MerchantsPage from "./pages/merchants";
import MerchantDetailPage from "./pages/merchant-detail";
import RidersPage from "./pages/riders";
import RiderDetailPage from "./pages/rider-detail";
import OrdersPage from "./pages/orders";
import OrderDetailPage from "./pages/order-detail";
import AnalyticsPage from "./pages/analytics";
import SettingsPage from "./pages/settings";
import NotFoundPage from "./pages/not-found";
const sidebarItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Users", path: "/users", icon: Users },
  { label: "Merchants", path: "/merchants", icon: Store },
  { label: "Riders", path: "/riders", icon: Bike },
  { label: "Orders", path: "/orders", icon: ShoppingBag },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Settings", path: "/settings", icon: Settings }
];
const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> }
    ]
  },
  {
    element: <ProtectedRoute role="admin" />,
    children: [
      {
        element: <DashboardLayout
          appName="EpaDash Admin"
          appBadge="Master Console"
          sidebarItems={sidebarItems}
        />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "users", element: <UsersPage /> },
          { path: "users/:id", element: <UserDetailPage /> },
          { path: "merchants", element: <MerchantsPage /> },
          { path: "merchants/:id", element: <MerchantDetailPage /> },
          { path: "riders", element: <RidersPage /> },
          { path: "riders/:id", element: <RiderDetailPage /> },
          { path: "orders", element: <OrdersPage /> },
          { path: "orders/:id", element: <OrderDetailPage /> },
          { path: "analytics", element: <AnalyticsPage /> },
          { path: "settings", element: <SettingsPage /> }
        ]
      }
    ]
  },
  { path: "*", element: <NotFoundPage /> }
]);
export {
  router
};
