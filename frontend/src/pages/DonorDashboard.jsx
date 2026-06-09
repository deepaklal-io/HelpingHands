import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import RequestCard from "../components/RequestCard";
import api from "../api/axios";

export default function DonorDashboard() {
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("browse");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, donRes] = await Promise.all([
          api.get("/requests/approved"),
          api.get("/donations/my"),
        ]);
        setRequests(reqRes.data);
        setDonations(donRes.data);
      } catch {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = requests.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalDonated = donations.reduce((s, d) => s + (d.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Donor Dashboard</h2>
          <p className="text-gray-500 text-sm mt-0.5">Browse requests and track your contributions</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Donations Made", value: donations.length },
            { label: "Total Donated", value: `PKR ${totalDonated.toLocaleString()}` },
            { label: "Requests Available", value: requests.length },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          {["browse", "history"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-medium rounded-md capitalize transition ${
                tab === t ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "browse" ? "Browse Requests" : "My Donations"}
            </button>
          ))}
        </div>

        {tab === "browse" && (
          <>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests..."
              className="w-full sm:w-80 px-4 py-2.5 border border-gray-300 rounded-lg text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {loading ? (
              <div className="text-center py-16 text-gray-400">Loading requests...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">No approved requests found.</div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {filtered.map((r) => (
                  <RequestCard key={r._id} request={r} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "history" && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">

            {donations.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg mb-1">No donations yet</p>
                <p className="text-sm">Browse requests and make your first contribution!</p>
              </div>
            ) : (
              <table className="w-full text-sm">
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
                      <td className="px-5 py-3 text-gray-800">
                        <Link to={`/request/${d.requestId?._id}`} className="text-emerald-600 hover:underline">
                          {d.requestId?.title || "Request"}
                        </Link>
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
