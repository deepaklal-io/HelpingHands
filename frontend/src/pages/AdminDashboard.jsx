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
  const [selectedRequest, setSelectedRequest] = useState(null); // for modal

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
      flash("✅ Request approved.");
      setSelectedRequest(null);
      fetchData();
    } catch { setError("Failed to approve request."); }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/requests/${id}/reject`);
      flash("❌ Request rejected.");
      setSelectedRequest(null);
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
                  <th className="text-right px-5 py-3 text-gray-600 font-medium">Amount</th>
                  <th className="text-center px-5 py-3 text-gray-600 font-medium">Challan</th>
                  <th className="text-center px-5 py-3 text-gray-600 font-medium">Status</th>
                  <th className="text-center px-5 py-3 text-gray-600 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r, i) => (
                  <tr key={r._id} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                    <td className="px-5 py-3 text-gray-800 font-medium max-w-[160px] truncate">{r.title}</td>
                    <td className="px-5 py-3">
                      <p className="text-gray-800 text-xs font-medium">{r.studentId?.name || "—"}</p>
                      <p className="text-gray-400 text-xs">{r.studentId?.email || ""}</p>
                    </td>
                    <td className="px-5 py-3 text-right text-gray-700">PKR {r.amountNeeded?.toLocaleString()}</td>
                    <td className="px-5 py-3 text-center">
                      {r.challanImage ? (
                        <button
                          onClick={() => setSelectedRequest(r)}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                        >
                          👁 View
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">No challan</span>
                      )}
                    </td>
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
                        <button
                          onClick={() => setSelectedRequest(r)}
                          className="px-3 py-1 text-xs border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 transition"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-gray-400">No requests found.</td></tr>
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

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 py-8">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{selectedRequest.title}</h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize mt-1 inline-block ${
                  selectedRequest.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  selectedRequest.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                  selectedRequest.status === "rejected" ? "bg-red-100 text-red-700" :
                  "bg-blue-100 text-blue-700"
                }`}>{selectedRequest.status}</span>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">✕</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Student Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
                  {selectedRequest.studentId?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{selectedRequest.studentId?.name}</p>
                  <p className="text-xs text-gray-500">{selectedRequest.studentId?.email}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedRequest.description}</p>
              </div>

              {/* Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Amount Needed</p>
                  <p className="font-bold text-emerald-600">PKR {selectedRequest.amountNeeded?.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Amount Received</p>
                  <p className="font-bold text-blue-600">PKR {(selectedRequest.receivedAmount || 0).toLocaleString()}</p>
                </div>
              </div>

              {/* Bank Account */}
              {selectedRequest.bankAccount?.accountNumber && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">🏦 Bank Account Details</p>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Account Title</p>
                      <p className="font-medium text-gray-800">{selectedRequest.bankAccount.accountTitle || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Account Number</p>
                      <p className="font-medium text-gray-800">{selectedRequest.bankAccount.accountNumber || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Bank Name</p>
                      <p className="font-medium text-gray-800">{selectedRequest.bankAccount.bankName || "—"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Challan Image */}
              {selectedRequest.challanImage ? (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">📄 Fee Challan</p>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={selectedRequest.challanImage}
                      alt="Fee Challan"
                      className="w-full object-contain max-h-80"
                    />
                  </div>
                  <a
                    href={selectedRequest.challanImage}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-xs text-blue-600 hover:underline"
                  >
                    🔗 Open full image in new tab
                  </a>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                  ⚠️ No fee challan uploaded for this request.
                </div>
              )}

              {/* Action Buttons */}
              {selectedRequest.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleApprove(selectedRequest._id)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition"
                  >
                    ✅ Approve Request
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest._id)}
                    className="flex-1 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-semibold text-sm rounded-lg transition"
                  >
                    ❌ Reject Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
