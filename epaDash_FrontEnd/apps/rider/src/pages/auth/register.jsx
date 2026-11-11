import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore, useNotificationStore, Button, TextInput, SelectInput, registerSchema, validateWithZod } from "@epadash/shared";
import { ArrowRight, Bike } from "lucide-react";
function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    vehicleType: "motorcycle",
    role: "rider"
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateWithZod(registerSchema, formData);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      const mockRider = {
        id: `usr_rider_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        vehicleType: formData.vehicleType,
        role: "rider",
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
        title: "Application Received",
        message: "Your rider account is active! You can now start taking deliveries."
      });
      navigate("/", { replace: true });
      setLoading(false);
    }, 600);
  };
  return <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm"><div className="mb-6"><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3"><Bike className="h-3.5 w-3.5" /> Fast Onboarding
        </div><h2 className="text-2xl font-bold tracking-tight text-gray-900">Become a Rider Partner</h2><p className="mt-1 text-sm text-gray-500">
          Earn competitive rates with flexible hours delivering across Ghana.
        </p></div><form onSubmit={handleSubmit} className="space-y-4"><TextInput
    label="Full legal name"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    placeholder="e.g. Samuel Osei"
    error={errors.name}
    required
  /><TextInput
    label="Email address"
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    placeholder="samuel@gmail.com"
    error={errors.email}
    required
  /><TextInput
    label="Ghana phone number (for dispatch)"
    type="tel"
    value={formData.phone}
    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
    placeholder="024 123 4567"
    error={errors.phone}
    required
  /><SelectInput
    label="Vehicle Type"
    options={[
      { label: "Motorcycle / Scooter", value: "motorcycle" },
      { label: "Bicycle / E-Bike", value: "bicycle" },
      { label: "Compact Car / Sedan", value: "car" }
    ]}
    value={formData.vehicleType}
    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
  /><TextInput
    label="Create password"
    type="password"
    value={formData.password}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    placeholder="At least 6 characters"
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
          Submit Application
        </Button></form><div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
        Already registered?{" "}<Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
          Sign in
        </Link></div></div>;
}
export {
  RegisterPage as default
};
