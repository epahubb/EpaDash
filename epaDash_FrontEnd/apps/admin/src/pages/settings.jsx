import { useState } from "react";
import { Button, TextInput, useNotificationStore, TestBackendService } from "@epadash/shared";
import { Save, Activity, CheckCircle2 } from "lucide-react";
function SettingsPage() {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [commission, setCommission] = useState("15");
  const [baseDelivery, setBaseDelivery] = useState("10.00");
  const [perKm, setPerKm] = useState("2.50");
  const [maxRadius, setMaxRadius] = useState("15");
  const [saving, setSaving] = useState(false);
  const [apiTest, setApiTest] = useState({ status: "idle" });
  const handleRunHealthCheck = async () => {
    setApiTest({ status: "loading" });
    try {
      const res = await TestBackendService.checkHealth();
      setApiTest({ status: "success", data: res.data });
      addNotification({
        type: "success",
        title: "Backend Health Check OK",
        message: "Centralised API Gateway responded with status: online."
      });
    } catch (err) {
      setApiTest({ status: "error", error: err.message || "Health check failed" });
      addNotification({
        type: "error",
        title: "API Gateway Offline",
        message: err.message || "Could not connect to backend endpoint."
      });
    }
  };
  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addNotification({
        type: "success",
        title: "Platform Config Updated",
        message: "Global commission rates and dispatch fees deployed successfully."
      });
    }, 500);
  };
  return <div className="space-y-6 max-w-2xl mx-auto pb-12"><div><h1 className="text-2xl font-bold text-gray-900">Platform System Configuration</h1><p className="text-xs text-gray-500">Configure global platform economics, pricing algorithms, and API gateway</p></div>{
    /* ──────────────── Centralised API Gateway Live Health Checker ──────────────── */
  }<div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-3"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="p-2.5 rounded-xl bg-emerald-600 text-white"><Activity className="h-5 w-5" /></div><div><h3 className="text-sm font-bold text-gray-900">API Gateway Communication & Diagnostics</h3><p className="text-xs text-gray-600">
                Ping live backend endpoints through the centralized API client layer.
              </p></div></div><Button
    size="sm"
    variant="primary"
    isLoading={apiTest.status === "loading"}
    onClick={handleRunHealthCheck}
  >
            Run Health Ping
          </Button></div>{apiTest.status === "success" && <div className="p-3 bg-white border border-emerald-200 rounded-xl text-xs space-y-1"><div className="flex items-center gap-1.5 font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Gateway Online & Healthy
            </div><pre className="text-[11px] text-gray-600 overflow-x-auto bg-gray-50 p-2 rounded font-mono">{JSON.stringify(apiTest.data, null, 2)}</pre></div>}{apiTest.status === "error" && <div className="p-3 bg-white border border-red-200 rounded-xl text-xs text-red-700"><span className="font-bold">Backend Communication Error: </span> {apiTest.error}</div>}</div>{
    /* Global Economics Form */
  }<div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"><form onSubmit={handleSave} className="space-y-4"><div className="grid grid-cols-2 gap-4"><TextInput
    label="Standard Merchant Commission (%)"
    type="number"
    value={commission}
    onChange={(e) => setCommission(e.target.value)}
    required
  /><TextInput
    label="Base Delivery Fee (GH₵)"
    type="number"
    step="0.5"
    value={baseDelivery}
    onChange={(e) => setBaseDelivery(e.target.value)}
    required
  /></div><div className="grid grid-cols-2 gap-4"><TextInput
    label="Per-Kilometre Surcharge (GH₵)"
    type="number"
    step="0.1"
    value={perKm}
    onChange={(e) => setPerKm(e.target.value)}
    required
  /><TextInput
    label="Maximum Dispatch Radius (km)"
    type="number"
    value={maxRadius}
    onChange={(e) => setMaxRadius(e.target.value)}
    required
  /></div><Button
    type="submit"
    variant="primary"
    size="lg"
    className="w-full mt-2"
    isLoading={saving}
    leftIcon={<Save className="h-4 w-4" />}
  >
            Deploy Updated Platform Parameters
          </Button></form></div></div>;
}
export {
  SettingsPage as default
};
