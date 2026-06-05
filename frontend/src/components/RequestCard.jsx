import { Link } from "react-router-dom";

export default function RequestCard({ request, showActions, onDelete }) {
  const { _id, title, description, amountNeeded, receivedAmount, status, category } = request;
  const progress = Math.min(Math.round(((receivedAmount || 0) / amountNeeded) * 100), 100);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 text-base leading-snug">{title}</h3>
          {category && (
            <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
              {category}
            </span>
          )}
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize shrink-0 ${statusColors[status] || "bg-gray-100 text-gray-600"}`}>
          {status}
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{description}</p>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>PKR {(receivedAmount || 0).toLocaleString()} raised</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-1">Goal: PKR {amountNeeded?.toLocaleString()}</p>
      </div>

      <div className="flex gap-2">
        <Link
          to={`/request/${_id}`}
          className="flex-1 text-center py-2 text-sm border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 transition"
        >
          View Details
        </Link>
        {showActions && (
          <button
            onClick={() => onDelete && onDelete(_id)}
            className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
