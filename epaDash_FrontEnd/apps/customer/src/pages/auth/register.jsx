import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore, useNotificationStore, Button, TextInput, registerSchema, validateWithZod } from "@epadash/shared";
import { ArrowRight } from "lucide-react";
function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer"
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = validateWithZod(registerSchema, formData);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const mockUser = {
        id: `usr_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: "customer",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const mockTokens = {
        accessToken: `token_${Date.now()}`,
        refreshToken: `refresh_${Date.now()}`,
        expiresAt: Date.now() + 86400 * 1e3
      };
      login(mockUser, mockTokens);
      addNotification({
        type: "success",
        title: "Account Created",
        message: "Welcome to EpaDash! Your account is ready."
      });
      navigate("/", { replace: true });
    } catch (err) {
      setErrors({ form: err.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };
  return <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm"><div className="mb-6"><h2 className="text-2xl font-bold tracking-tight text-gray-900">Create an account</h2><p className="mt-1 text-sm text-gray-500">
          Join thousands ordering from top restaurants and stores in Ghana.
        </p></div>{errors.form && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{errors.form}</div>}<form onSubmit={handleSubmit} className="space-y-4"><TextInput
    label="Full name"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    placeholder="e.g. Abena Serwaa"
    error={errors.name}
    required
  /><TextInput
    label="Email address"
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    placeholder="abena@example.com"
    error={errors.email}
    required
  /><TextInput
    label="Phone number (Ghana)"
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
          Create Account
        </Button></form><div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
        Already have an account?{" "}<Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
          Sign in
        </Link></div></div>;
}
export {
  RegisterPage as default
};
