import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [request, setRequest] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [donating, setDonating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRequest = async () => {
    try {
      const { data } = await api.get(`/requests/${id}`);
      setRequest(data);
    } catch {
      setError("Request not found.");
    } finally {
      setLoading(false);
    }
  };

  const loadDonations = async () => {
    try {
      const { data } = await api.get(`/donations/request/${id}`);
      setDonations(data);
    } catch {}
  };

  useEffect(() => {
    loadRequest();
    loadDonations();
  }, [id]);

  const handleDonate = async (e) => {
    e.preventDefault();
    setDonating(true);
    setError("");
    try {
      await api.post("/donations", { requestId: id, amount: Number(amount) });
      setSuccess(`Thank you! PKR ${Number(amount).toLocaleString()} donated successfully.`);
      setAmount("");
      loadRequest();
      loadDonations();
    } catch (err) {
      setError(err.response?.data?.message || "Donation failed.");
    } finally {
      setDonating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32 text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-32 text-gray-400">Request not found.</div>
      </div>
    );
  }

  const progress = Math.min(Math.round(((request.receivedAmount || 0) / request.amountNeeded) * 100), 100);
  const remaining = request.amountNeeded - (request.receivedAmount || 0);

  // Check if current user is the owner of this request
  const isOwner = user && request.studentId &&
    (request.studentId._id?.toString() === user.id ||
     request.studentId._id?.toString() === user._id);

  // Show donate form if: logged in, request is approved, and not the owner
  const canDonate = user && request.status === "approved" && !isOwner;

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1 transition"
        >
          ← Back
        </button>

        {/* Request Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-xl font-bold text-gray-800">{request.title}</h1>
            <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize shrink-0 ${statusColors[request.status] || ""}`}>
              {request.status}
            </span>
          </div>

          {request.category && (
            <span className="inline-block text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full mb-4 capitalize">
              {request.category}
            </span>
          )}

          <p className="text-gray-600 text-sm leading-relaxed mb-6">{request.description}</p>

          {/* Student info */}
          {request.studentId && (
            <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-semibold text-sm">
                {request.studentId.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{request.studentId.name}</p>
                <p className="text-xs text-gray-500">{request.studentId.email}</p>
              </div>
            </div>
          )}

          {/* Progress */}
          <div className="mb-2">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>PKR {(request.receivedAmount || 0).toLocaleString()} raised</span>
              <span className="text-emerald-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="bg-emerald-500 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1.5">
              <span>Goal: PKR {request.amountNeeded?.toLocaleString()}</span>
              {remaining > 0 && <span>PKR {remaining.toLocaleString()} remaining</span>}
            </div>
          </div>
        </div>

        {/* Owner message */}
        {isOwner && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm">
            💡 This is your request. You cannot donate to your own request.
          </div>
        )}

        {/* Not logged in */}
        {!user && request.status === "approved" && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
            <p className="text-sm text-emerald-700 mb-3">Sign in to donate to this student</p>
            <a href="/login" className="px-6 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition">
              Sign In to Donate
            </a>
          </div>
        )}

        {/* Donate Form — for donors AND students (not own request) */}
        {canDonate && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-1">Make a Donation</h2>
            <p className="text-xs text-gray-400 mb-4">
              {user.role === "student" ? "You are donating as a student" : "You are donating as a donor"}
            </p>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}
            {success && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">{success}</div>}

            <form onSubmit={handleDonate} className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (PKR)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min={1}
                  max={remaining}
                  placeholder={`Max: PKR ${remaining.toLocaleString()}`}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={donating || remaining <= 0}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-semibold rounded-lg transition"
                >
                  {donating ? "Processing..." : remaining <= 0 ? "Fully Funded" : "Donate"}
                </button>
              </div>
            </form>

            {/* Quick amounts */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {[500, 1000, 5000, 10000].filter(amt => amt <= remaining).map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className="px-3 py-1 text-xs border border-emerald-300 text-emerald-700 rounded-md hover:bg-emerald-50 transition"
                >
                  PKR {amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {request.status === "completed" && (
          <div className="text-center py-6 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 mb-6">
            🎉 This request has been fully funded!
          </div>
        )}

        {/* Donations List */}
        {donations.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-gray-800 mb-4">
              Donations ({donations.length})
            </h2>
            <div className="space-y-3">
              {donations.map((d) => (
                <div key={d._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-semibold">
                      {d.donorId?.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{d.donorId?.name || "Anonymous"}</p>
                      <p className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">
                    PKR {d.amount?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
