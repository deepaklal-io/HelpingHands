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
  const [message, setMessage] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [donating, setDonating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showChallan, setShowChallan] = useState(false);
  const [viewingProof, setViewingProof] = useState(null);

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

  const handleProofFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    setDonating(true);
    setError("");

    try {
      let paymentProofBase64 = null;

      // Convert proof image to base64 if provided
      if (proofFile) {
        paymentProofBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(proofFile);
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
        });
      }

      await api.post("/donations", {
        requestId: id,
        amount: Number(amount),
        message,
        paymentProofBase64,
      });

      setSuccess(`Thank you! PKR ${Number(amount).toLocaleString()} donated successfully.`);
      setAmount("");
      setMessage("");
      setProofFile(null);
      setProofPreview(null);
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

  const isOwner = user && request.studentId &&
    (request.studentId._id?.toString() === user.id ||
     request.studentId._id?.toString() === user._id);

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
          <div className="mb-4">
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

          {/* Fee Challan */}
          {request.challanImage && (
            <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
              <div
                className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
                onClick={() => setShowChallan(!showChallan)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">📄</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Fee Challan</p>
                    <p className="text-xs text-gray-400">Verified proof of financial need</p>
                  </div>
                </div>
                <span className="text-xs text-emerald-600 font-medium">
                  {showChallan ? "Hide ▲" : "View ▼"}
                </span>
              </div>
              {showChallan && (
                <div className="p-4 bg-white">
                  <img
                    src={request.challanImage}
                    alt="Fee Challan"
                    className="w-full object-contain max-h-96 rounded-lg border border-gray-100"
                  />
                  <a
                    href={request.challanImage}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-xs text-blue-600 hover:underline"
                  >
                    🔗 Open full image in new tab
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bank Account Details */}
        {request.bankAccount?.accountNumber && request.status === "approved" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-1">🏦 Bank Account for Direct Transfer</h2>
            <p className="text-xs text-gray-400 mb-4">
              Transfer directly to the student's bank account and upload screenshot as proof below.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Account Title</p>
                <p className="text-sm font-semibold text-gray-800">{request.bankAccount.accountTitle || "—"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Account Number</p>
                <p className="text-sm font-semibold text-gray-800 break-all">{request.bankAccount.accountNumber || "—"}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Bank Name</p>
                <p className="text-sm font-semibold text-gray-800">{request.bankAccount.bankName || "—"}</p>
              </div>
            </div>
          </div>
        )}

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

        {/* Donate Form */}
        {canDonate && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-1">Make a Donation</h2>
            <p className="text-xs text-gray-400 mb-5">
              {user.role === "student" ? "You are donating as a student" : "You are donating as a donor"} — upload your payment screenshot as proof.
            </p>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}
            {success && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">{success}</div>}

            <form onSubmit={handleDonate} className="space-y-4">
              {/* Amount */}
              <div>
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
                {/* Quick amounts */}
                <div className="flex gap-2 mt-2 flex-wrap">
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

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Best of luck with your studies!"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Payment Proof Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Screenshot <span className="text-gray-400 font-normal">(optional but recommended)</span>
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  Upload a screenshot of your bank transfer or payment app as proof of donation.
                </p>
                <div
                  onClick={() => document.getElementById("proofInput").click()}
                  className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition ${
                    proofPreview ? "border-emerald-400 bg-emerald-50" : "border-gray-300 hover:border-emerald-400"
                  }`}
                >
                  {proofPreview ? (
                    <div>
                      <img src={proofPreview} alt="Payment proof" className="max-h-40 mx-auto rounded-lg mb-2 object-contain" />
                      <p className="text-xs text-emerald-600 font-medium">{proofFile?.name}</p>
                      <p className="text-xs text-gray-400 mt-1">Click to change</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl mb-2">📸</div>
                      <p className="text-sm text-gray-600 font-medium">Click to upload payment screenshot</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                    </div>
                  )}
                </div>
                <input
                  id="proofInput"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleProofFile}
                  className="hidden"
                />
              </div>

              <button
                type="submit"
                disabled={donating || remaining <= 0}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                {donating ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Processing...
                  </>
                ) : remaining <= 0 ? "Fully Funded" : "💛 Donate Now"}
              </button>
            </form>
          </div>
        )}

        {/* Completed */}
        {request.status === "completed" && (
          <div className="text-center py-6 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 mb-6">
            🎉 This request has been fully funded!
          </div>
        )}

        {/* Donations List with proof */}
        {donations.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-gray-800 mb-4">
              Donations ({donations.length})
            </h2>
            <div className="space-y-4">
              {donations.map((d) => (
                <div key={d._id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
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

                  {/* Donor message */}
                  {d.message && (
                    <p className="text-xs text-gray-500 italic mb-2 pl-11">"{d.message}"</p>
                  )}

                  {/* Payment proof */}
                  {d.paymentProof && (
                    <div className="pl-11">
                      <button
                        onClick={() => setViewingProof(viewingProof === d._id ? null : d._id)}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        📸 {viewingProof === d._id ? "Hide payment proof ▲" : "View payment proof ▼"}
                      </button>
                      {viewingProof === d._id && (
                        <div className="mt-2">
                          <img
                            src={d.paymentProof}
                            alt="Payment proof"
                            className="max-h-48 rounded-lg border border-gray-200 object-contain"
                          />
                          <a
                            href={d.paymentProof}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block mt-1 text-xs text-blue-600 hover:underline"
                          >
                            🔗 Open full image
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* No proof badge */}
                  {!d.paymentProof && (
                    <div className="pl-11">
                      <span className="text-xs text-gray-400">No payment proof uploaded</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Challan fullscreen - removed, using inline expand instead */}
    </div>
  );
}
