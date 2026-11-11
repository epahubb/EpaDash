import { createBrowserRouter } from "react-router-dom";
import { AuthLayout, ProtectedRoute } from "@epadash/shared";
import CustomerLayout from "./layouts/customer-layout";
import HomePage from "./pages/home";
import SearchPage from "./pages/search";
import MerchantPage from "./pages/merchant";
import CartPage from "./pages/cart";
import OrdersPage from "./pages/orders";
import OrderDetailPage from "./pages/order-detail";
import ProfilePage from "./pages/profile";
import SettingsPage from "./pages/settings";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ForgotPasswordPage from "./pages/auth/forgot-password";
import NotFoundPage from "./pages/not-found";
const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> }
    ]
  },
  {
    element: <ProtectedRoute role="customer" />,
    children: [
      {
        element: <CustomerLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "/search", element: <SearchPage /> },
          { path: "/merchant/:id", element: <MerchantPage /> },
          { path: "/cart", element: <CartPage /> },
          { path: "/orders", element: <OrdersPage /> },
          { path: "/orders/:id", element: <OrderDetailPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/settings", element: <SettingsPage /> }
        ]
      }
    ]
  },
  { path: "*", element: <NotFoundPage /> }
]);
export {
  router
};
