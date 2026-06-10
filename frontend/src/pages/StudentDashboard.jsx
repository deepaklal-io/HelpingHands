import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RequestCard from "../components/RequestCard";
import api from "../api/axios";

const EMPTY_FORM = {
  title: "", description: "", amountNeeded: "", category: "",
  accountTitle: "", accountNumber: "", bankName: "",
};

export default function StudentDashboard() {
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("my");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [challanFile, setChallanFile] = useState(null);
  const [challanPreview, setChallanPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

 const fetchMyRequests = async () => {
  try {
    const { data } = await api.get("/requests/my");
    // ✅ Make sure data is always an array
    setRequests(Array.isArray(data) ? data : []);
  } catch {
    setError("Failed to load your requests.");
    setRequests([]); // ✅ Set empty array on error
  }
};

const fetchAllRequests = async () => {
  try {
    const { data } = await api.get("/requests/approved");
    const list = Array.isArray(data) ? data : [];
    setAllRequests(list.filter(r => {
      const requestOwnerId = r.studentId?._id?.toString() || r.studentId?.toString();
      const currentUserId = user?.id?.toString() || user?._id?.toString();
      return requestOwnerId !== currentUserId;
    }));
  } catch {
    setAllRequests([]); // ✅
  }
};

const fetchMyDonations = async () => {
  try {
    const { data } = await api.get("/donations/my");
    setDonations(Array.isArray(data) ? data : []); // ✅
  } catch {
    setDonations([]); // ✅
  }
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChallanFile(file);
      setChallanPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!challanFile) {
    setError("Please upload your fee challan image.");
    return;
  }
  setSubmitting(true);
  setError("");
  setSuccess("");

  try {
    // Convert file to base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(challanFile);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

    await api.post("/requests", {
      ...form,
      challanImageBase64: base64,
    });

    setSuccess("Request submitted! Admin will review your challan and approve.");
    setForm(EMPTY_FORM);
    setChallanFile(null);
    setChallanPreview(null);
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
  (r?.title || "").toLowerCase().includes(search.toLowerCase()) ||
  (r?.description || "").toLowerCase().includes(search.toLowerCase())
);

  const tabs = [
    { key: "my", label: "My Requests" },
    { key: "browse", label: "Browse & Donate" },
    { key: "donated", label: "My Donations" },
  ];

  const safeRequests = Array.isArray(requests) ? requests : [];
  const safeAllRequests = Array.isArray(allRequests) ? allRequests : [];
  const safeDonations = Array.isArray(donations) ? donations : [];

  const safeStats = {
    total: safeRequests.length,
    approved: safeRequests.filter((r) => r.status === "approved").length,
    completed: safeRequests.filter((r) => r.status === "completed").length,
    totalRaised: safeRequests.reduce((s, r) => s + (r.receivedAmount || 0), 0),
    totalDonated: safeDonations.reduce((s, d) => s + (d.amount || 0), 0),
  };

  const safeFiltered = safeAllRequests.filter((r) =>
    (r.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

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

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}
        {success && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">{success}</div>}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {[
            { label: "My Requests", value: safeStats.total },
            { label: "Approved", value: safeStats.approved },
            { label: "Completed", value: safeStats.completed },
            { label: "Total Raised", value: `PKR ${safeStats.totalRaised.toLocaleString()}` },
            { label: "I Donated", value: `PKR ${safeStats.totalDonated.toLocaleString()}` },
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
            {showForm && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-800 mb-1">New Funding Request</h3>
                <p className="text-xs text-gray-400 mb-5">Fill all fields carefully. Admin will verify your challan before approving.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Title & Category */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        name="title" value={form.title} onChange={handleChange} required
                        placeholder="e.g. Semester fee support"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        name="category" value={form.category} onChange={handleChange} required
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

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description" value={form.description} onChange={handleChange} required rows={3}
                      placeholder="Explain your situation and why you need support..."
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>

                  {/* Amount */}
                  <div className="sm:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount Needed (PKR)</label>
                    <input
                      type="number" name="amountNeeded" value={form.amountNeeded} onChange={handleChange} required min={100}
                      placeholder="e.g. 50000"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Bank Account */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">🏦 Bank Account Details <span className="text-gray-400 font-normal">(for receiving donations)</span></h4>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Account Title</label>
                        <input
                          name="accountTitle" value={form.accountTitle} onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Account Number</label>
                        <input
                          name="accountNumber" value={form.accountNumber} onChange={handleChange}
                          placeholder="e.g. 1234567890"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Bank Name</label>
                        <input
                          name="bankName" value={form.bankName} onChange={handleChange}
                          placeholder="e.g. HBL, UBL, Meezan"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fee Challan Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fee Challan <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-400 mb-2">Upload your university fee challan as proof. JPG, PNG or PDF — max 5MB.</p>

                    <div
                      onClick={() => document.getElementById("challanInput").click()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                        challanPreview ? "border-emerald-400 bg-emerald-50" : "border-gray-300 hover:border-emerald-400"
                      }`}
                    >
                      {challanPreview ? (
                        <div>
                          <img src={challanPreview} alt="Challan preview" className="max-h-40 mx-auto rounded-lg mb-2 object-contain" />
                          <p className="text-xs text-emerald-600 font-medium">{challanFile?.name}</p>
                          <p className="text-xs text-gray-400 mt-1">Click to change</p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-3xl mb-2">📄</div>
                          <p className="text-sm text-gray-600 font-medium">Click to upload fee challan</p>
                          <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF up to 5MB</p>
                        </div>
                      )}
                    </div>
                    <input
                      id="challanInput"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit" disabled={submitting}
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
            ) : safeRequests.length === 0 ? (
              <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-xl text-gray-400">
                <p className="text-lg mb-1">No requests yet</p>
                <p className="text-sm">Click "New Request" to get started</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {safeRequests.map((r) => (
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
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search requests..."
                className="w-full sm:w-80 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-gray-400 mt-2">💡 You can donate to other students' approved requests</p>
            </div>
            {loading ? (
              <div className="text-center py-16 text-gray-400">Loading...</div>
            ) : safeFiltered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">No approved requests from other students.</div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {safeFiltered.map((r) => (<RequestCard key={r._id} request={r} />))}
              </div>
            )}
          </>
        )}

        {/* MY DONATIONS TAB */}
        {tab === "donated" && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
            {safeDonations.length === 0 ? (
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
                  {safeDonations.map((d, i) => (
                    <tr key={d._id} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                      <td className="px-5 py-3 text-emerald-600 font-medium">{d.requestId?.title || "Request"}</td>
                      <td className="px-5 py-3 text-right font-medium text-emerald-700">PKR {d.amount?.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</td>
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
