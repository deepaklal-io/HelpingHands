import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function ProgressBar({ received, needed }) {
  const pct = Math.min(Math.round(((received || 0) / needed) * 100), 100);
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>PKR {(received || 0).toLocaleString()} raised</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-400 mt-1">Goal: PKR {needed?.toLocaleString()}</p>
    </div>
  );
}

const categoryIcons = {
  tuition: "🎓",
  books: "📚",
  accommodation: "🏠",
  medical: "🏥",
  other: "💛",
};

const categories = ["all", "tuition", "books", "accommodation", "medical", "other"];

export default function Home() {
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [allStats, setAllStats] = useState({ completed: 0, totalRaised: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

useEffect(() => {
  api.get("/requests/approved")
    .then(({ data }) => setRequests(Array.isArray(data) ? data : []))
    .catch(() => setRequests([]));

  api.get("/requests")
    .then(({ data }) => {
      const all = Array.isArray(data) ? data : [];
      setAllRequests(all);
      const completed = all.filter(r => r.status === "completed").length;
      const totalRaised = all.reduce((s, r) => s + (r.receivedAmount || 0), 0);
      setAllStats({ completed, totalRaised });
    })
    .catch(() => {})
    .finally(() => setLoading(false));
}, []);

  const visibleRequests = requests.length > 0 ? requests : allRequests;

  const filtered = visibleRequests.filter((r) => {
    const matchSearch =
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.category === filter;
    return matchSearch && matchFilter;
  });

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const dashPath =
    user?.role === "admin" ? "/admin" :
    user?.role === "donor" ? "/donor" :
    user?.role === "student" ? "/student" : null;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-gray-800 text-lg">Helping Hands</span>
          </div>
          <div className="flex items-center gap-3">
            {dashPath ? (
              <Link to={dashPath} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-6 tracking-wide uppercase">
            University Donation Platform — Pakistan
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Help a Student <br className="hidden sm:block" />
            <span className="text-emerald-200">Complete Their Degree</span>
          </h1>
          <p className="text-emerald-100 text-lg max-w-xl mx-auto mb-10">
            Real students. Real needs. Your donation directly funds tuition, books, and essentials for university students who can't afford to continue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="px-8 py-3 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition">
              💛 Donate Now
            </Link>
            <Link to="/register" className="px-8 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition">
              🎓 Request Help
            </Link>
          </div>
        </div>

        {/* Stats Bar — uses allStats for accuracy */}
        <div className="bg-white/10 border-t border-white/20">
          <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Active Requests", value: requests.length },
              { label: "Students Helped", value: allStats.completed },
              { label: "Total Raised", value: `PKR ${allStats.totalRaised.toLocaleString()}` },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl sm:text-3xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-emerald-200 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: "🎓", title: "Student Applies", desc: "A verified university student submits a funding request with fee challan as proof of need." },
              { icon: "✅", title: "Admin Reviews", desc: "Our team reviews the challan and approves genuine requests within 24-48 hours." },
              { icon: "💛", title: "Donors Give", desc: "Donors browse approved requests and contribute any amount directly with payment proof." },
            ].map((step) => (
              <div key={step.title} className="text-center p-5 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-4xl mb-3">{step.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Requests Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Students Needing Help</h2>
            <p className="text-gray-500 text-sm mt-1">Browse verified funding requests from university students</p>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search requests..."
            className="w-full sm:w-64 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-1.5 text-sm rounded-full border capitalize transition ${
                filter === c
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "border-gray-300 text-gray-600 hover:border-emerald-400"
              }`}
            >
              {c === "all" ? "All" : `${categoryIcons[c]} ${c}`}
            </button>
          ))}
        </div>

        {/* Request Cards */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading requests...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-1">No requests found</p>
            <p className="text-sm">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r) => (
              <div key={r._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800 text-sm leading-snug">{r.title}</h3>
                  <span className="text-lg shrink-0">{categoryIcons[r.category] || "💛"}</span>
                  {r.status === "approved" || r.status === "completed" ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✅ Verified
                    </span>
                  ) : (
                    <span className="text-xs text-yellow-700 font-medium bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200">
                      {r.status || "pending"}
                    </span>
                  )}
                </div>
                {r.category && (
                  <span className="inline-block text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full mb-3 w-fit capitalize">
                    {r.category}
                  </span>
                )}
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{r.description}</p>
                <ProgressBar received={r.receivedAmount} needed={r.amountNeeded} />
                <Link
                  to={user ? `/request/${r._id}` : "/register"}
                  className="mt-4 w-full text-center py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition"
                >
                  {user ? "Donate Now" : "Sign Up to Donate"}
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-14 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Are You a University Student in Need?</h2>
          <p className="text-emerald-100 mb-6 text-sm max-w-md mx-auto">
            Register with your university email and submit a funding request with your fee challan. Our team reviews every application carefully.
          </p>
          <Link to="/register" className="inline-block px-8 py-3 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition">
            Submit a Request
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-600 rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-medium text-gray-700">Helping Hands</span>
          </div>
          <p>© 2024 Helping Hands. Made with ❤️ for Pakistani students.</p>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-gray-800 transition">Sign In</Link>
            <Link to="/register" className="hover:text-gray-800 transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
