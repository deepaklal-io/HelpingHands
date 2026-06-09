import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("requests");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, usersRes] = await Promise.all([
        api.get("/requests"),
        api.get("/admin/users"),
      ]);
      setRequests(reqRes.data);
      setUsers(usersRes.data);
    } catch {
      setError("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const flash = (msg) => { setActionMsg(msg); setTimeout(() => setActionMsg(""), 3000); };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/requests/${id}/approve`);
      flash("Request approved.");
      fetchData();
    } catch { setError("Failed to approve request."); }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/requests/${id}/reject`);
      flash("Request rejected.");
      fetchData();
    } catch { setError("Failed to reject request."); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      flash("User deleted.");
    } catch { setError("Failed to delete user."); }
  };

  // Computed stats from live data
  const stats = [
    { label: "Total Users", value: users.length },
    { label: "Total Requests", value: requests.length },
    { label: "Pending Review", value: requests.filter(r => r.status === "pending").length },
    { label: "Approved", value: requests.filter(r => r.status === "approved").length },
  ];

  const statusBadge = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-emerald-100 text-emerald-700",
      rejected: "bg-red-100 text-red-700",
      completed: "bg-blue-100 text-blue-700",
    };
    return `text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${map[status] || "bg-gray-100 text-gray-600"}`;
  };

  const roleBadge = (role) => {
    const map = { admin: "bg-purple-100 text-purple-700", donor: "bg-sky-100 text-sky-700", student: "bg-emerald-100 text-emerald-700" };
    return `text-xs px-2 py-0.5 rounded-full font-medium capitalize ${map[role] || "bg-gray-100 text-gray-600"}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage platform data and users</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}
        {actionMsg && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">{actionMsg}</div>}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          {[{ key: "requests", label: "Requests" }, { key: "users", label: "Users" }].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2 text-sm font-medium rounded-md transition ${
                tab === t.key ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : tab === "requests" ? (
          <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-gray-600 font-medium">Title</th>
                  <th className="text-left px-5 py-3 text-gray-600 font-medium">Student</th>
                  <th className="text-right px-5 py-3 text-gray-600 font-medium">Amount Needed</th>
                  <th className="text-center px-5 py-3 text-gray-600 font-medium">Status</th>
                  <th className="text-center px-5 py-3 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r, i) => (
                  <tr key={r._id} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                    <td className="px-5 py-3 text-gray-800 font-medium max-w-[180px] truncate">{r.title}</td>
                    <td className="px-5 py-3 text-gray-500">{r.studentId?.name || "—"}</td>
                    <td className="px-5 py-3 text-right text-gray-700">PKR {r.amountNeeded?.toLocaleString()}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={statusBadge(r.status)}>{r.status}</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      {r.status === "pending" ? (
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleApprove(r._id)} className="px-3 py-1 text-xs bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition">Approve</button>
                          <button onClick={() => handleReject(r._id)} className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition">Reject</button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-400">No requests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-gray-600 font-medium">Name</th>
                  <th className="text-left px-5 py-3 text-gray-600 font-medium">Email</th>
                  <th className="text-center px-5 py-3 text-gray-600 font-medium">Role</th>
                  <th className="text-center px-5 py-3 text-gray-600 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                    <td className="px-5 py-3 text-gray-800 font-medium">{u.name}</td>
                    <td className="px-5 py-3 text-gray-500">{u.email}</td>
                    <td className="px-5 py-3 text-center"><span className={roleBadge(u.role)}>{u.role}</span></td>
                    <td className="px-5 py-3 text-center">
                      {u.role !== "admin" && (
                        <button onClick={() => handleDeleteUser(u._id)} className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
