import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore, useNotificationStore, Button, TextInput, loginSchema, validateWithZod } from "@epadash/shared";
import { ArrowRight, Bike, ShieldCheck } from "lucide-react";
function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [formData, setFormData] = useState({ email: "kofi.rider@epadash.com", password: "password123" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateWithZod(loginSchema, formData);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      const mockRider = {
        id: "usr_rider_01",
        name: "Kofi Annan",
        email: formData.email,
        phone: "+233244987654",
        role: "rider",
        vehicleType: "Motorcycle",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const mockTokens = {
        accessToken: `rider_token_${Date.now()}`,
        refreshToken: `rider_refresh_${Date.now()}`,
        expiresAt: Date.now() + 86400 * 1e3
      };
      login(mockRider, mockTokens);
      addNotification({
        type: "success",
        title: "Rider Portal Online",
        message: "Welcome back, Kofi! Ready to deliver."
      });
      navigate("/", { replace: true });
      setLoading(false);
    }, 600);
  };
  return <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm"><div className="mb-6"><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3"><Bike className="h-3.5 w-3.5" /> Rider Partner App
        </div><h2 className="text-2xl font-bold tracking-tight text-gray-900">Rider Partner Login</h2><p className="mt-1 text-sm text-gray-500">
          Sign in to view available delivery runs, track route earnings, and manage payouts.
        </p></div><form onSubmit={handleSubmit} className="space-y-4"><TextInput
    label="Email address"
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    placeholder="rider@epadash.com"
    error={errors.email}
    required
  /><TextInput
    label="Password"
    type="password"
    value={formData.password}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    placeholder="••••••••"
    error={errors.password}
    required
  /><Button
    type="submit"
    variant="primary"
    size="lg"
    className="w-full mt-2"
    isLoading={loading}
    rightIcon={<ArrowRight className="h-4 w-4" />}
  >
          Sign In to Deliver
        </Button></form><div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
        Want to become an EpaDash rider?{" "}<Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
          Apply today
        </Link></div><div className="mt-4 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" /><span>Pre-filled with verified Rider partner credentials.</span></div></div>;
}
export {
  LoginPage as default
};
