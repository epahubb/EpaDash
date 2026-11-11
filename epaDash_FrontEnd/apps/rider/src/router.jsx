import { createBrowserRouter } from "react-router-dom";
import { AuthLayout, ProtectedRoute } from "@epadash/shared";
import RiderLayout from "./layouts/rider-layout";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import DashboardPage from "./pages/dashboard";
import DeliveriesPage from "./pages/deliveries";
import DeliveryDetailPage from "./pages/delivery-detail";
import EarningsPage from "./pages/earnings";
import ProfilePage from "./pages/profile";
import NotFoundPage from "./pages/not-found";
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
    element: <ProtectedRoute role="rider" />,
    children: [
      {
        element: <RiderLayout />,
        children: [
          {
            path: "/",
            element: <DashboardPage />
          },
          {
            path: "/deliveries",
            element: <DeliveriesPage />
          },
          {
            path: "/delivery/:id",
            element: <DeliveryDetailPage />
          },
          {
            path: "/earnings",
            element: <EarningsPage />
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
