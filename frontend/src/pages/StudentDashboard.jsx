import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RequestCard from "../components/RequestCard";
import api from "../api/axios";

const EMPTY_FORM = { title: "", description: "", amountNeeded: "", category: "" };

export default function StudentDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchRequests = async () => {
    try {
      const { data } = await api.get("/requests/my");
      setRequests(data);
    } catch {
      setError("Failed to load your requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

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
      fetchRequests();
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Dashboard</h2>
            <p className="text-gray-500 text-sm mt-0.5">Manage your funding requests</p>
          </div>
          <button
            onClick={() => { setShowForm((v) => !v); setError(""); setSuccess(""); }}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition"
          >
            {showForm ? "✕ Cancel" : "+ New Request"}
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}
        {success && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">{success}</div>}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Requests", value: stats.total },
            { label: "Approved", value: stats.approved },
            { label: "Completed", value: stats.completed },
            { label: "Total Raised", value: `PKR ${stats.totalRaised.toLocaleString()}` },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

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

        {/* Requests List */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-4">Your Requests</h3>
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
        </div>
      </div>
    </div>
  );
}
