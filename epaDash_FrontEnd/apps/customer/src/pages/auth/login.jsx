import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore, useNotificationStore, Button, TextInput, loginSchema, validateWithZod } from "@epadash/shared";
import { ArrowRight, ShieldCheck } from "lucide-react";
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [formData, setFormData] = useState({ email: "kwame@example.com", password: "password123" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = validateWithZod(loginSchema, formData);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const mockUser = {
        id: "usr_cust_01",
        name: "Kwame Mensah",
        firstName: "Kwame",
        lastName: "Mensah",
        email: formData.email,
        phone: "+233244123456",
        role: "customer",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const mockTokens = {
        accessToken: `access_token_demo_${Date.now()}`,
        refreshToken: `refresh_token_demo_${Date.now()}`,
        expiresAt: Date.now() + 86400 * 1e3
      };
      login(mockUser, mockTokens);
      addNotification({
        type: "success",
        title: "Welcome back!",
        message: `Signed in as ${mockUser.name}`
      });
      const destination = location.state?.from?.pathname || "/";
      navigate(destination, { replace: true });
    } catch (err) {
      setErrors({ form: err.message || "Failed to sign in" });
      addNotification({
        type: "error",
        title: "Authentication Failed",
        message: err.message || "Please check your credentials"
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm"><div className="mb-6"><h2 className="text-2xl font-bold tracking-tight text-gray-900">Sign in to your account</h2><p className="mt-1 text-sm text-gray-500">
          Order meals, groceries, and parcels across Ghana in minutes.
        </p></div>{errors.form && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{errors.form}</div>}<form onSubmit={handleSubmit} className="space-y-4"><div><TextInput
    label="Email address"
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    placeholder="you@example.com"
    error={errors.email}
    required
  /></div><div><div className="flex items-center justify-between mb-1.5"><span className="text-xs text-transparent select-none">.</span><Link
    to="/forgot-password"
    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
  >
              Forgot password?
            </Link></div><TextInput
    label="Password"
    type="password"
    value={formData.password}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    placeholder="••••••••"
    error={errors.password}
    required
  /></div><Button
    type="submit"
    variant="primary"
    size="lg"
    className="w-full mt-2"
    isLoading={loading}
    rightIcon={<ArrowRight className="h-4 w-4" />}
  >
          Sign In
        </Button></form><div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}<Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
          Create one now
        </Link></div><div className="mt-4 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" /><span>Pre-filled with customer demo credentials for quick preview.</span></div></div>;
}
export {
  LoginPage as default
};
