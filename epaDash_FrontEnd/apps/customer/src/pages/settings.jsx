import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
function SettingsPage() {
  const navigate = useNavigate();
  return <div className="space-y-6 max-w-xl mx-auto"><button
    onClick={() => navigate(-1)}
    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"
  ><ArrowLeft className="h-4 w-4" /> Back
      </button><h1 className="text-2xl font-bold text-gray-900">App Settings</h1><div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4"><div className="flex items-center justify-between py-2 border-b border-gray-100"><div><h4 className="text-sm font-semibold text-gray-900">Push Notifications</h4><p className="text-xs text-gray-500">Get live status updates when rider is near</p></div><input type="checkbox" defaultChecked className="h-4 w-4 text-emerald-600 rounded" /></div><div className="flex items-center justify-between py-2 border-b border-gray-100"><div><h4 className="text-sm font-semibold text-gray-900">SMS Alerts</h4><p className="text-xs text-gray-500">Receive delivery receipts via SMS</p></div><input type="checkbox" defaultChecked className="h-4 w-4 text-emerald-600 rounded" /></div><div className="flex items-center justify-between py-2"><div><h4 className="text-sm font-semibold text-gray-900">Language</h4><p className="text-xs text-gray-500">English (Ghana)</p></div><span className="text-xs font-semibold text-emerald-600">Default</span></div></div></div>;
}
export {
  SettingsPage as default
};
