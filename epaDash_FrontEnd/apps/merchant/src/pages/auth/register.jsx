import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore, useNotificationStore, Button, TextInput, registerSchema, validateWithZod } from "@epadash/shared";
import { Store, ArrowRight } from "lucide-react";
function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    password: "",
    role: "merchant"
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
      const mockMerchant = {
        id: `usr_merch_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        businessName: formData.businessName || formData.name,
        role: "merchant",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const mockTokens = {
        accessToken: `merch_token_${Date.now()}`,
        refreshToken: `merch_refresh_${Date.now()}`,
        expiresAt: Date.now() + 86400 * 1e3
      };
      login(mockMerchant, mockTokens);
      addNotification({
        type: "success",
        title: "Merchant Registration Complete",
        message: "Your kitchen profile has been created!"
      });
      navigate("/", { replace: true });
      setLoading(false);
    }, 600);
  };
  return <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm"><div className="mb-6"><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3"><Store className="h-3.5 w-3.5" /> Partner Network
        </div><h2 className="text-2xl font-bold tracking-tight text-gray-900">Grow Your Restaurant Sales</h2><p className="mt-1 text-sm text-gray-500">
          Reach thousands of hungry diners across Ghana with EpaDash delivery.
        </p></div><form onSubmit={handleSubmit} className="space-y-4"><TextInput
    label="Restaurant / Store Brand Name"
    value={formData.businessName}
    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
    placeholder="e.g. Asanka Local Eatery"
    required
  /><TextInput
    label="Manager / Contact Person Name"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    placeholder="e.g. Charles Addo"
    error={errors.name}
    required
  /><TextInput
    label="Business email address"
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    placeholder="contact@asanka.com"
    error={errors.email}
    required
  /><TextInput
    label="Business phone number"
    type="tel"
    value={formData.phone}
    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
    placeholder="024 123 4567"
    error={errors.phone}
    required
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
          Register Store
        </Button></form><div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
        Already registered?{" "}<Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
          Sign in
        </Link></div></div>;
}
export {
  RegisterPage as default
};
