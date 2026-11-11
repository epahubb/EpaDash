import { useParams, useNavigate } from "react-router-dom";
import { Button, formatCurrency } from "@epadash/shared";
import { ArrowLeft } from "lucide-react";
function RiderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <div className="space-y-6 max-w-xl mx-auto pb-12"><button
    onClick={() => navigate("/riders")}
    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900"
  ><ArrowLeft className="h-4 w-4" /> Back to riders
      </button><div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6"><div className="flex items-center justify-between border-b border-gray-100 pb-4"><div className="flex items-center gap-4"><div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-lg">
              KA
            </div><div><h1 className="text-xl font-bold text-gray-900">Kofi Annan</h1><p className="text-xs text-gray-500">Yamaha 125 • License Class A Verified</p></div></div><span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full">
            Online (Dispatch Ready)
          </span></div><div className="grid grid-cols-2 gap-3 text-xs"><div className="p-3 bg-gray-50 rounded-xl"><span className="text-gray-400">Total Lifetime Trips</span><p className="font-bold text-gray-900 text-sm mt-0.5">420 deliveries</p></div><div className="p-3 bg-gray-50 rounded-xl"><span className="text-gray-400">Total Payouts Received</span><p className="font-bold text-emerald-700 text-sm mt-0.5">{formatCurrency(10290)}</p></div></div><div className="pt-2 flex gap-3"><Button variant="outline" size="md" className="flex-1 text-red-600 border-red-200">
            Suspend Rider
          </Button><Button variant="primary" size="md" className="flex-1">
            Dispatch Override
          </Button></div></div></div>;
}
export {
  RiderDetailPage as default
};
