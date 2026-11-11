import { useState } from "react";
import { Button, TextInput, useNotificationStore } from "@epadash/shared";
import { Save } from "lucide-react";
function SettingsPage() {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [storeName, setStoreName] = useState("Buka Restaurant Osu");
  const [phone, setPhone] = useState("+233 24 488 9900");
  const [address, setAddress] = useState("10th Street, Osu RE, Accra");
  const [avgPrepTime, setAvgPrepTime] = useState("20");
  const [loading, setLoading] = useState(false);
  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addNotification({
        type: "success",
        title: "Settings Saved",
        message: "Your kitchen profile information has been updated."
      });
    }, 500);
  };
  return <div className="space-y-6 max-w-xl mx-auto pb-12"><div><h1 className="text-2xl font-bold text-gray-900">Store Settings</h1><p className="text-xs text-gray-500">Configure your store details, contact numbers, and dispatch settings</p></div><div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"><form onSubmit={handleSave} className="space-y-4"><TextInput
    label="Display Restaurant Name"
    value={storeName}
    onChange={(e) => setStoreName(e.target.value)}
    required
  /><TextInput
    label="Kitchen Dispatch Phone"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    required
  /><TextInput
    label="Physical Pickup Address"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    required
  /><TextInput
    label="Default Kitchen Preparation Target (mins)"
    type="number"
    value={avgPrepTime}
    onChange={(e) => setAvgPrepTime(e.target.value)}
    required
  /><Button
    type="submit"
    variant="primary"
    size="lg"
    className="w-full mt-2"
    isLoading={loading}
    leftIcon={<Save className="h-4 w-4" />}
  >
            Save Store Settings
          </Button></form></div></div>;
}
export {
  SettingsPage as default
};
