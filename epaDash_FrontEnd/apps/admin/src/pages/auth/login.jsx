import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useNotificationStore, Button, TextInput, loginSchema, validateWithZod } from "@epadash/shared";
import { Shield, ArrowRight, ShieldCheck } from "lucide-react";
function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [formData, setFormData] = useState({ email: "admin@epadash.com", password: "password123" });
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
      const mockAdmin = {
        id: "usr_admin_master",
        name: "Chief Operations Officer",
        email: formData.email,
        phone: "+233240001122",
        role: "admin",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const mockTokens = {
        accessToken: `admin_token_${Date.now()}`,
        refreshToken: `admin_refresh_${Date.now()}`,
        expiresAt: Date.now() + 86400 * 1e3
      };
      login(mockAdmin, mockTokens);
      addNotification({
        type: "success",
        title: "Master Console Authorized",
        message: "Welcome, Administrator. Full platform controls activated."
      });
      navigate("/", { replace: true });
      setLoading(false);
    }, 600);
  };
  return <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm"><div className="mb-6"><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold mb-3"><Shield className="h-3.5 w-3.5 text-emerald-400" /> Administrative Access Only
        </div><h2 className="text-2xl font-bold tracking-tight text-gray-900">EpaDash Admin Console</h2><p className="mt-1 text-sm text-gray-500">
          Sign in with your master administrative credentials to access platform controls.
        </p></div><form onSubmit={handleSubmit} className="space-y-4"><TextInput
    label="Administrator Email"
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    placeholder="admin@epadash.com"
    error={errors.email}
    required
  /><TextInput
    label="Security Password"
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
    className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white"
    isLoading={loading}
    rightIcon={<ArrowRight className="h-4 w-4" />}
  >
          Authenticate to Master Console
        </Button></form><div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
        Internal administrative credentials are restricted and monitored under audit log protocol.
      </div><div className="mt-4 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" /><span>Pre-filled with master administrator demo credentials.</span></div></div>;
}
export {
  LoginPage as default
};
