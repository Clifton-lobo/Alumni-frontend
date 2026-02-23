import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicationsForMyJobs } from "../../../store/user-view/ApplicationSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  User,
  Eye,
  FileText,
  GraduationCap,
  Mail,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";

/* ── Pagination ────────────────────────────────────────────── */
const Pagination = ({ pagination, onPageChange }) => {
  const { page, pages } = pagination;
  if (!pages || pages <= 1) return null;

  const getPages = () => {
    const range = [];
    const delta = 2;
    const left  = Math.max(2, page - delta);
    const right = Math.min(pages - 1, page + delta);

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < pages - 1) range.push("...");
    if (pages > 1) range.push(pages);

    return range;
  };

  return (
    <div className="flex items-center justify-between mt-8 px-1">
      <p className="text-sm text-gray-400">
        Showing {(page - 1) * pagination.limit + 1}–
        {Math.min(page * pagination.limit, pagination.total)} of{" "}
        {pagination.total}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-lg bg-[#1e2d4d] text-white disabled:opacity-30 hover:bg-[#EBAB09] hover:text-black transition-all disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                p === page
                  ? "bg-[#EBAB09] text-black"
                  : "bg-[#1e2d4d] text-white hover:bg-[#EBAB09] hover:text-black"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="p-2 rounded-lg bg-[#1e2d4d] text-white disabled:opacity-30 hover:bg-[#EBAB09] hover:text-black transition-all disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

/* ── Application Detail Dialog ──────────────────────────────── */
const ApplicationDetailDialog = ({ app, open, onClose }) => {
  if (!app) return null;

  const applicant   = app.applicant || {};
  const resume      = app.resume    || {};
  const appliedDate = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit", month: "2-digit", year: "numeric",
      })
    : "—";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl p-0 gap-0 overflow-hidden bg-white">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-lg font-bold text-gray-900">
            Application Details
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-0.5">
            Review this alumni's application.
          </p>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* Applicant info */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-[#EBAB09]/20 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-[#EBAB09]" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {applicant.fullname || "Unknown"}
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <Mail className="h-3 w-3" />
                {applicant.email || "No email"}
              </p>
            </div>
          </div>

          {/* Graduation */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Graduation
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-800">
              <GraduationCap className="h-4 w-4 text-[#EBAB09]" />
              <span>
                {applicant.stream || "Stream N/A"},{" "}
                {applicant.batch   || "Batch N/A"}
              </span>
            </div>
          </div>

          {/* Resume */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Resume
            </p>
            {resume.url ? (
              <a
                href={resume.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#EBAB09] hover:bg-amber-50 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#EBAB09]" />
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {resume.originalName || "Resume.pdf"}
                  </span>
                </div>
                <Eye className="h-4 w-4 text-[#EBAB09] flex-shrink-0" />
              </a>
            ) : (
              <p className="text-sm italic text-gray-400">No resume uploaded</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Message
            </p>
            <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed">
              {app.message || "No message provided."}
            </div>
          </div>

          <p className="text-xs text-gray-400">Applied on {appliedDate}</p>
        </div>

        <DialogFooter className="px-6 pb-5">
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ── Single Job Row (accordion) ─────────────────────────────── */
const JobRow = ({ jobData }) => {
  const [expanded, setExpanded]       = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const applicants = jobData.applications || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Collapsed header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="p-3 rounded-xl bg-[#152A5D] flex-shrink-0">
          <Briefcase className="h-5 w-5 text-[#EBAB09]" />
        </div>

        <div className="flex-1 text-left">
          <p className="font-semibold text-gray-900 text-sm">{jobData.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {jobData.totalApplications}{" "}
            {jobData.totalApplications === 1 ? "application" : "applications"}
          </p>
        </div>

        {expanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {/* Expanded applicant list */}
      {expanded && (
        <div className="border-t border-gray-100">
          {applicants.length === 0 ? (
            <p className="px-5 py-4 text-sm text-gray-400 italic">
              No applicants on this page.
            </p>
          ) : (
            applicants.map((app, idx) => {
              const applicant   = app.applicant || {};
              const appliedDate = app.createdAt
                ? new Date(app.createdAt).toLocaleDateString("en-GB")
                : "—";

              return (
                <div
                  key={app._id || idx}
                  className={`flex items-center gap-4 px-5 py-3.5 ${
                    idx < applicants.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#EBAB09]/15 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-[#EBAB09]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {applicant.fullname || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {applicant.stream
                        ? `${applicant.stream}, ${applicant.batch}`
                        : "—"}{" "}
                      · Applied {appliedDate}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedApp(app)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#EBAB09] text-[#EBAB09] text-xs font-semibold hover:bg-[#EBAB09] hover:text-black transition-all"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      <ApplicationDetailDialog
        app={selectedApp}
        open={!!selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  );
};

/* ── Main Component ─────────────────────────────────────────── */
// isActive is passed from UserProfile when the "applications" tab is selected
const MyJobApplications = ({ isActive }) => {
  const dispatch = useDispatch();
  const { jobApplications, pagination, loading } = useSelector(
    (state) => state.applications
  );

  const [page, setPage]           = useState(1);
  const [hasFetched, setHasFetched] = useState(false);

  // ── KEY FIX: only fetch when the tab becomes active ──
  useEffect(() => {
    if (!isActive) return;           // tab not visible yet — skip
    dispatch(fetchApplicationsForMyJobs({ page, limit: 10 }));
    setHasFetched(true);
  }, [isActive, page, dispatch]);    // re-fires when page changes too

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* Loading skeleton */
  if (loading.fetchForJobs || (isActive && !hasFetched)) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-gray-200 rounded-md" />
              <div className="h-3 w-28 bg-gray-100 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* Empty state */
  if (hasFetched && !jobApplications.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <Inbox className="h-7 w-7 text-gray-300" />
        </div>
        <p className="text-gray-500 font-medium">No applications yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Applications to your jobs will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3">
        {jobApplications.map((jobData) => (
          <JobRow key={jobData._id} jobData={jobData} />
        ))}
      </div>

      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  );
};

export default MyJobApplications;