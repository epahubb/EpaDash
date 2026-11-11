import { useNavigate } from "react-router-dom";
const mockRiders = [
  { id: "rd_01", name: "Kofi Annan", vehicle: "Motorcycle (Yamaha 125)", status: "online", rating: 4.92, trips: 420 },
  { id: "rd_02", name: "Yaw Boateng", vehicle: "Motorcycle (Bajaj Boxer)", status: "offline", rating: 4.75, trips: 310 },
  { id: "rd_03", name: "Ama Darko", vehicle: "E-Bike", status: "online", rating: 4.88, trips: 250 },
  { id: "rd_04", name: "Kwame Asante", vehicle: "Motorcycle (Honda Ace)", status: "online", rating: 4.95, trips: 580 }
];
function RidersPage() {
  const navigate = useNavigate();
  return <div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Rider Fleet Operations</h1><p className="text-xs text-gray-500">Monitor dispatch coverage, driver ratings, and fleet safety</p></div></div><div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider border-b border-gray-100"><tr><th className="py-3 px-4 font-semibold">Rider</th><th className="py-3 px-4 font-semibold">Vehicle</th><th className="py-3 px-4 font-semibold">Rating</th><th className="py-3 px-4 font-semibold">Trips</th><th className="py-3 px-4 font-semibold">Status</th><th className="py-3 px-4 font-semibold text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100 text-gray-700">{mockRiders.map((r) => <tr key={r.id} className="hover:bg-gray-50/60 transition-colors"><td className="py-3.5 px-4 font-bold text-gray-900">{r.name}</td><td className="py-3.5 px-4 text-gray-500">{r.vehicle}</td><td className="py-3.5 px-4 font-bold text-gray-800">⭐ {r.rating}</td><td className="py-3.5 px-4 font-semibold text-emerald-700">{r.trips} runs</td><td className="py-3.5 px-4"><span
    className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${r.status === "online" ? "bg-emerald-50 text-emerald-800" : "bg-gray-100 text-gray-600"}`}
  >{r.status}</span></td><td className="py-3.5 px-4 text-right"><button
    onClick={() => navigate(`/riders/${r.id}`)}
    className="px-2.5 py-1 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold"
  >
                      Inspect
                    </button></td></tr>)}</tbody></table></div></div></div>;
}
export {
  RidersPage as default
};
