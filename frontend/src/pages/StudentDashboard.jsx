import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RequestCard from "../components/RequestCard";
import api from "../api/axios";

const EMPTY_FORM = { title: "", description: "", amountNeeded: "", category: "" };

export default function StudentDashboard() {
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("my");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchMyRequests = async () => {
    try {
      const { data } = await api.get("/requests/my");
      setRequests(data);
    } catch {
      setError("Failed to load your requests.");
    }
  };

  const fetchAllRequests = async () => {
    try {
      const { data } = await api.get("/requests/approved");
      // Filter out own requests
      setAllRequests(data.filter(r => {
  const requestOwnerId = r.studentId?._id?.toString() || r.studentId?.toString();
  const currentUserId = user?.id?.toString() || user?._id?.toString();
  return requestOwnerId !== currentUserId;
}));
    } catch {}
  };

  const fetchMyDonations = async () => {
    try {
      const { data } = await api.get("/donations/my");
      setDonations(data);
    } catch {}
  };

  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([fetchMyRequests(), fetchAllRequests(), fetchMyDonations()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/requests", form);
      setSuccess("Request submitted! It will be reviewed by an admin.");
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchMyRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this request?")) return;
    try {
      await api.delete(`/requests/${id}`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch {
      setError("Failed to delete request.");
    }
  };

  const stats = {
    total: requests.length,
    approved: requests.filter((r) => r.status === "approved").length,
    completed: requests.filter((r) => r.status === "completed").length,
    totalRaised: requests.reduce((s, r) => s + (r.receivedAmount || 0), 0),
    totalDonated: donations.reduce((s, d) => s + (d.amount || 0), 0),
  };

  const filtered = allRequests.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { key: "my", label: "My Requests" },
    { key: "browse", label: "Browse & Donate" },
    { key: "donated", label: "My Donations" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Student Dashboard</h2>
            <p className="text-gray-500 text-sm mt-0.5">Manage requests and support fellow students</p>
          </div>
          {tab === "my" && (
            <button
              onClick={() => { setShowForm((v) => !v); setError(""); setSuccess(""); }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition"
            >
              {showForm ? "✕ Cancel" : "+ New Request"}
            </button>
          )}
        </div>

        {/* Alerts */}
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}
        {success && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">{success}</div>}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {[
            { label: "My Requests", value: stats.total },
            { label: "Approved", value: stats.approved },
            { label: "Completed", value: stats.completed },
            { label: "Total Raised", value: `PKR ${stats.totalRaised.toLocaleString()}` },
            { label: "I Donated", value: `PKR ${stats.totalDonated.toLocaleString()}` },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-emerald-600">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                tab === t.key ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* MY REQUESTS TAB */}
        {tab === "my" && (
          <>
            {/* Create Form */}
            {showForm && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-800 mb-5">New Funding Request</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Semester fee support"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Select category</option>
                        <option value="tuition">Tuition Fee</option>
                        <option value="books">Books & Supplies</option>
                        <option value="accommodation">Accommodation</option>
                        <option value="medical">Medical</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="Explain your situation and why you need support..."
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                  <div className="sm:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount Needed (PKR)</label>
                    <input
                      type="number"
                      name="amountNeeded"
                      value={form.amountNeeded}
                      onChange={handleChange}
                      required
                      min={100}
                      placeholder="e.g. 50000"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-semibold rounded-lg transition"
                    >
                      {submitting ? "Submitting..." : "Submit Request"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* My Requests List */}
            {loading ? (
              <div className="text-center py-16 text-gray-400">Loading...</div>
            ) : requests.length === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-xl text-gray-400">
                <p className="text-lg mb-1">No requests yet</p>
                <p className="text-sm">Click "New Request" to get started</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {requests.map((r) => (
                  <RequestCard key={r._id} request={r} showActions onDelete={handleDelete} />
                ))}
              </div>
            )}
          </>
        )}

        {/* BROWSE & DONATE TAB */}
        {tab === "browse" && (
          <>
            <div className="mb-5">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search requests..."
                className="w-full sm:w-80 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-gray-400 mt-2">
                💡 You can donate to other students' approved requests
              </p>
            </div>
            {loading ? (
              <div className="text-center py-16 text-gray-400">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">No approved requests from other students.</div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {filtered.map((r) => (
                  <RequestCard key={r._id} request={r} />
                ))}
              </div>
            )}
          </>
        )}

        {/* MY DONATIONS TAB */}
        {tab === "donated" && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
            {donations.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg mb-1">No donations yet</p>
                <p className="text-sm">Go to "Browse & Donate" to support a fellow student</p>
              </div>
            ) : (
              <table className="w-full text-sm min-w-[500px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-3 text-gray-600 font-medium">Request</th>
                    <th className="text-right px-5 py-3 text-gray-600 font-medium">Amount</th>
                    <th className="text-right px-5 py-3 text-gray-600 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d, i) => (
                    <tr key={d._id} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                      <td className="px-5 py-3 text-emerald-600 font-medium">
                        {d.requestId?.title || "Request"}
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-emerald-700">
                        PKR {d.amount?.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right text-gray-400">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
