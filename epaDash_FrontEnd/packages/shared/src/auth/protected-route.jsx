import { Navigate, Outlet, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "./auth-store";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "../components";
const ProtectedRoute = ({
  role,
  allowedRoles,
  redirectPath = "/login",
  children
}) => {
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuthStore();
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="flex flex-col items-center gap-3"><div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" /><p className="text-sm font-medium text-gray-600">Verifying session...</p></div></div>;
  }
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  const expectedRoles = allowedRoles || (role ? [role] : void 0);
  if (expectedRoles && !expectedRoles.includes(user.role)) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4"><div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 mb-4"><ShieldAlert className="h-7 w-7" /></div><h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2><p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Your current account ({user.email}) has the role <strong className="font-semibold text-gray-800">{user.role}</strong> and does not have permission to access this area.
          </p><div className="flex flex-col sm:flex-row gap-3 justify-center"><Link to={redirectPath}><Button variant="outline" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Switch Account
              </Button></Link></div></div></div>;
  }
  return children ? <>{children}</> : <Outlet />;
};
export {
  ProtectedRoute
};
