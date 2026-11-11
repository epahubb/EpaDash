import { createBrowserRouter } from "react-router-dom";
import { AuthLayout, ProtectedRoute, DashboardLayout } from "@epadash/shared";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  BarChart3,
  Star,
  Settings
} from "lucide-react";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import DashboardPage from "./pages/dashboard";
import OrdersPage from "./pages/orders";
import OrderDetailPage from "./pages/order-detail";
import MenuPage from "./pages/menu";
import MenuItemFormPage from "./pages/menu-item-form";
import AnalyticsPage from "./pages/analytics";
import ReviewsPage from "./pages/reviews";
import SettingsPage from "./pages/settings";
import ProfilePage from "./pages/profile";
import NotFoundPage from "./pages/not-found";
const merchantSidebarItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Orders", path: "/orders", icon: ShoppingBag, badge: 3 },
  { label: "Menu Catalog", path: "/menu", icon: UtensilsCrossed },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Reviews", path: "/reviews", icon: Star },
  { label: "Store Settings", path: "/settings", icon: Settings }
];
const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/register",
        element: <RegisterPage />
      }
    ]
  },
  {
    element: <ProtectedRoute role="merchant" />,
    children: [
      {
        element: <DashboardLayout
          appName="EpaDash Merchant"
          appBadge="Partner"
          sidebarItems={merchantSidebarItems}
        />,
        children: [
          {
            path: "/",
            element: <DashboardPage />
          },
          {
            path: "/orders",
            element: <OrdersPage />
          },
          {
            path: "/orders/:id",
            element: <OrderDetailPage />
          },
          {
            path: "/menu",
            element: <MenuPage />
          },
          {
            path: "/menu/new",
            element: <MenuItemFormPage mode="create" />
          },
          {
            path: "/menu/:id/edit",
            element: <MenuItemFormPage mode="edit" />
          },
          {
            path: "/analytics",
            element: <AnalyticsPage />
          },
          {
            path: "/reviews",
            element: <ReviewsPage />
          },
          {
            path: "/settings",
            element: <SettingsPage />
          },
          {
            path: "/profile",
            element: <ProfilePage />
          }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />
  }
]);
export {
  router
};
