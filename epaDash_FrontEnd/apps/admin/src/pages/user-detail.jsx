import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@epadash/shared";
import { ArrowLeft } from "lucide-react";
function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <div className="space-y-6 max-w-xl mx-auto pb-12"><button
    onClick={() => navigate("/users")}
    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"
  ><ArrowLeft className="h-4 w-4" /> Back to users
      </button><div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6"><div className="flex items-center justify-between border-b border-gray-100 pb-4"><div className="flex items-center gap-4"><div className="h-14 w-14 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-lg">
              KM
            </div><div><h1 className="text-xl font-bold text-gray-900">Kwame Mensah</h1><span className="text-xs font-semibold text-emerald-600">Verified Customer</span></div></div><span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full">
            Active
          </span></div><div className="space-y-3 text-xs"><div className="flex items-center justify-between py-2 border-b border-gray-100"><span className="text-gray-400">User ID</span><span className="font-mono text-gray-700">{id || "usr_01"}</span></div><div className="flex items-center justify-between py-2 border-b border-gray-100"><span className="text-gray-400">Email</span><span className="font-semibold text-gray-900">kwame@example.com</span></div><div className="flex items-center justify-between py-2 border-b border-gray-100"><span className="text-gray-400">Phone</span><span className="font-semibold text-gray-900">+233 24 412 3456</span></div><div className="flex items-center justify-between py-2 border-b border-gray-100"><span className="text-gray-400">Lifetime Orders</span><span className="font-bold text-emerald-700">18 orders (GH₵ 1,420 total)</span></div></div><div className="pt-2 flex gap-3"><Button variant="outline" size="md" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
            Suspend User
          </Button><Button variant="primary" size="md" className="flex-1">
            Send Message
          </Button></div></div></div>;
}
export {
  UserDetailPage as default
};
