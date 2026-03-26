import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFeedback,
  fetchFeedbackStats,
  updateFeedback,
  deleteFeedback,
  setFilters,
  clearFilters,
  selectAllFeedback,
  selectFeedbackPagination,
  selectFeedbackStats,
  selectFeedbackFilters,
  selectFeedbackLoading,
} from "../../store/admin/AdminFeedbackSlice";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
};

const PRIORITY_STYLES = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-orange-100 text-orange-600",
  high: "bg-red-100 text-red-600",
};

const TYPE_LABELS = {
  feature_request: "Feature Request",
  bug_report: "Bug Report",
  other: "Other",
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function FeedbackModal({ feedback, onClose, onSave }) {
  const [form, setForm] = useState({
    status: feedback.status,
    priority: feedback.priority,
    adminNote: feedback.adminNote || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(feedback._id, form);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Feedback Detail</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-light leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Meta */}
          <div className="space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Submitted by</p>
            <p className="text-sm font-medium text-gray-800">{feedback.userName}</p>
            <p className="text-xs text-gray-500">{feedback.userEmail}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Title</p>
            <p className="text-sm font-semibold text-gray-800">{feedback.title}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{feedback.description}</p>
          </div>

          <div className="flex gap-3 text-xs">
            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
              {TYPE_LABELS[feedback.type]}
            </span>
            <span className="text-gray-400">
              {new Date(feedback.createdAt).toLocaleString()}
            </span>
          </div>

          {/* Admin Controls */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Admin Controls</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Internal Note</label>
              <textarea
                value={form.adminNote}
                onChange={(e) => setForm((f) => ({ ...f, adminNote: e.target.value }))}
                maxLength={1000}
                rows={3}
                placeholder="Private note visible only to admins…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <p className="text-xs text-gray-400 text-right">{form.adminNote.length}/1000</p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-700 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-xl p-4 ${color}`}>
      <p className="text-xs font-medium opacity-70 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminFeedback() {
  const dispatch = useDispatch();
  const feedbacks = useSelector(selectAllFeedback);
  const pagination = useSelector(selectFeedbackPagination);
  const stats = useSelector(selectFeedbackStats);
  const filters = useSelector(selectFeedbackFilters);
  const loading = useSelector(selectFeedbackLoading);

  const [selected, setSelected] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  // Derived stat counts
  const statMap = (arr) =>
    arr.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {});
  const statusMap = statMap(stats.statusStats);
  const priorityMap = statMap(stats.priorityStats);

  const loadFeedback = (page = 1) => {
    dispatch(fetchAllFeedback({ ...filters, page, limit: 10 }));
  };

  useEffect(() => {
    dispatch(fetchFeedbackStats());
  }, [dispatch]);

  useEffect(() => {
    loadFeedback(1);
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchInput }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleUpdate = async (id, updates) => {
    await dispatch(updateFeedback({ id, updates }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this feedback? This cannot be undone.")) {
      dispatch(deleteFeedback(id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Feedback Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Review and manage alumni portal feedback.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="Open" value={statusMap["open"] ?? 0} color="bg-blue-50 text-blue-800" />
          <StatCard label="In Progress" value={statusMap["in_progress"] ?? 0} color="bg-yellow-50 text-yellow-800" />
          <StatCard label="Resolved" value={statusMap["resolved"] ?? 0} color="bg-green-50 text-green-800" />
          <StatCard label="High Priority" value={priorityMap["high"] ?? 0} color="bg-red-50 text-red-800" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">
          <div className="flex flex-wrap gap-3 items-end">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search title, name, email…"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
              >
                Search
              </button>
            </form>

            {/* Status filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            {/* Type filter */}
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Types</option>
              <option value="feature_request">Feature Request</option>
              <option value="bug_report">Bug Report</option>
              <option value="other">Other</option>
            </select>

            {/* Priority filter */}
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <button
              onClick={() => { dispatch(clearFilters()); setSearchInput(""); }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>
          ) : feedbacks.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">No feedback found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {feedbacks.map((fb) => (
                    <tr key={fb._id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">{fb.userName}</p>
                        <p className="text-xs text-gray-400">{fb.userEmail}</p>
                      </td>
                      <td className="px-5 py-4 max-w-[200px]">
                        <p className="truncate text-gray-700">{fb.title}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                          {TYPE_LABELS[fb.type]}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${PRIORITY_STYLES[fb.priority]}`}>
                          {fb.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[fb.status]}`}>
                          {fb.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => setSelected(fb)}
                            className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                          >
                            Manage
                          </button>
                          <button
                            onClick={() => handleDelete(fb._id)}
                            className="text-red-400 hover:text-red-600 text-xs font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400">
                Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
              </p>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => loadFeedback(pagination.page - 1)}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
                >
                  ← Prev
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => loadFeedback(pagination.page + 1)}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <FeedbackModal
          feedback={selected}
          onClose={() => setSelected(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}