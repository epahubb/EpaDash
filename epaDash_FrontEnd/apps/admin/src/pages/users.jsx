import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@epadash/shared";
import { Search } from "lucide-react";
const mockUsersList = [
  { id: "usr_01", name: "Kwame Mensah", email: "kwame@example.com", role: "customer", status: "active", joined: "2026-01-12" },
  { id: "usr_02", name: "Buka Restaurant Osu", email: "manager@bukarestaurant.com", role: "merchant", status: "active", joined: "2026-02-04" },
  { id: "usr_03", name: "Kofi Annan", email: "kofi.rider@epadash.com", role: "rider", status: "active", joined: "2026-02-18" },
  { id: "usr_04", name: "Abena Serwaa", email: "abena@gmail.com", role: "customer", status: "active", joined: "2026-03-01" },
  { id: "usr_05", name: "Auntie Muni Waakye", email: "auntiemuni@waakye.com", role: "merchant", status: "pending", joined: "2026-03-10" },
  { id: "usr_06", name: "Yaw Boateng", email: "yaw.b@epadash.com", role: "rider", status: "suspended", joined: "2026-01-25" }
];
function UsersPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const filtered = mockUsersList.filter((u) => {
    const matchesQuery = u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });
  return <div className="space-y-6"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-gray-900">User Management</h1><p className="text-xs text-gray-500">Monitor all customers, merchants, riders, and platform admins</p></div><div className="flex items-center gap-2"><div className="relative"><Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" /><input
    type="text"
    placeholder="Search users by name or email..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
  /></div><select
    value={roleFilter}
    onChange={(e) => setRoleFilter(e.target.value)}
    className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold bg-white text-gray-700"
  ><option value="all">All Roles</option><option value="customer">Customers</option><option value="merchant">Merchants</option><option value="rider">Riders</option></select></div></div>{
    /* Users Table */
  }<div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider border-b border-gray-100"><tr><th className="py-3 px-4 font-semibold">User</th><th className="py-3 px-4 font-semibold">Role</th><th className="py-3 px-4 font-semibold">Status</th><th className="py-3 px-4 font-semibold">Registered</th><th className="py-3 px-4 font-semibold text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100 text-gray-700">{filtered.map((u) => <tr key={u.id} className="hover:bg-gray-50/60 transition-colors"><td className="py-3.5 px-4"><div className="flex items-center gap-3"><div className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">{u.name.slice(0, 2).toUpperCase()}</div><div><p className="font-bold text-gray-900">{u.name}</p><p className="text-gray-400">{u.email}</p></div></div></td><td className="py-3.5 px-4"><span className="font-semibold capitalize">{u.role}</span></td><td className="py-3.5 px-4"><span
    className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${u.status === "active" ? "bg-emerald-50 text-emerald-800" : u.status === "pending" ? "bg-amber-50 text-amber-800" : "bg-red-50 text-red-800"}`}
  >{u.status}</span></td><td className="py-3.5 px-4 text-gray-500">{formatDate(u.joined)}</td><td className="py-3.5 px-4 text-right"><button
    onClick={() => navigate(`/users/${u.id}`)}
    className="px-3 py-1 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold transition-colors"
  >
                      Inspect
                    </button></td></tr>)}</tbody></table></div></div></div>;
}
export {
  UsersPage as default
};
