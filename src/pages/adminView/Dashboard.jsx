import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminJobApplications } from "../../store/admin/AdminJobApplicationSlice";
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
  LayoutDashboard,
  Users,
  ClipboardList,
  Download,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";

/* ── Inline PDF Viewer Modal ────────────────────────────────── */
const ResumeViewerModal = ({ resume, open, onClose }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const blobRef               = useRef(null);

  useEffect(() => {
    if (!open || !resume?.url) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setBlobUrl(null);

    // Route through backend proxy — Cloudinary requires signed URLs regardless of resource type
    fetch(`/api/admin/proxy/file?url=${encodeURIComponent(resume.url)}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        blobRef.current = url;
        setBlobUrl(url);
      })
      .catch((err) => {
        if (!cancelled) setError(`Could not load resume (${err.message})`);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [open, resume?.url]);

  useEffect(() => {
    if (!open && blobRef.current) {
      URL.revokeObjectURL(blobRef.current);
      blobRef.current = null;
      setBlobUrl(null);
    }
  }, [open]);

  if (!resume?.url) return null;

  const downloadUrl = resume.url.includes("/image/upload/")
    ? resume.url.replace("/image/upload/", "/image/upload/fl_attachment/")
    : resume.url.replace("/upload/", "/upload/fl_attachment/");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] rounded-2xl p-0 gap-0 overflow-hidden bg-white flex flex-col">
        <div className="px-5 py-3.5 border-b border-gray-100 flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#EBAB09]/15">
              <FileText className="h-4 w-4 text-[#EBAB09]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-none">
                {resume.originalName || "Resume.pdf"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Resume Preview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={downloadUrl}
              download={resume.originalName || "resume.pdf"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#152A5D] text-white text-xs font-medium hover:bg-[#1e3a6e] transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </a>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-gray-100 overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50">
              <Loader2 className="h-8 w-8 text-[#EBAB09] animate-spin" />
              <p className="text-sm text-gray-500">Loading resume…</p>
            </div>
          )}

          {error && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50 px-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">Could not preview resume</p>
              <p className="text-xs text-gray-400">{error}</p>
              <a
                href={downloadUrl}
                download={resume.originalName || "resume.pdf"}
                className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#152A5D] text-white text-sm font-medium hover:bg-[#1e3a6e] transition-colors"
              >
                <Download className="h-4 w-4" />
                Download instead
              </a>
            </div>
          )}

          {blobUrl && !loading && (
            <iframe
              src={blobUrl}
              title="Resume Preview"
              className="w-full h-full border-0"
              style={{ minHeight: 0 }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ── Application Detail Dialog ──────────────────────────────── */
const ApplicationDetailDialog = ({ app, open, onClose }) => {
  const [showResume, setShowResume] = useState(false);

  if (!app) return null;
  const applicant   = app.applicant || {};
  const resume      = app.resume    || {};
  const appliedDate = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit", month: "2-digit", year: "numeric",
      })
    : "—";

  const handleClose = () => {
    setShowResume(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open && !showResume} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl p-0 gap-0 overflow-hidden bg-white max-h-[90vh] flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
            <DialogTitle className="text-lg font-bold text-gray-900">
              Application Details
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-0.5">Applicant information</p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-[#EBAB09]/20 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-[#EBAB09]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{applicant.fullname || "Unknown"}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Mail className="h-3 w-3" />
                  {applicant.email || "No email"}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Graduation</p>
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <GraduationCap className="h-4 w-4 text-[#EBAB09]" />
                <span>{applicant.stream || "Stream N/A"}, {applicant.batch || "Batch N/A"}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Resume</p>
              {resume.url ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
                    <FileText className="h-4 w-4 text-[#EBAB09] flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {resume.originalName || "Resume.pdf"}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowResume(true)}
                    className="p-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#EBAB09] hover:bg-amber-50 transition-all"
                    title="View resume"
                  >
                    <Eye className="h-4 w-4 text-[#EBAB09]" />
                  </button>
                  <a
                    href={resume.url.replace("/upload/", "/upload/fl_attachment/")}
                    download={resume.originalName || "resume.pdf"}
                    className="p-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#EBAB09] hover:bg-amber-50 transition-all"
                    title="Download resume"
                  >
                    <Download className="h-4 w-4 text-[#EBAB09]" />
                  </a>
                </div>
              ) : (
                <p className="text-sm italic text-gray-400">No resume uploaded</p>
              )}
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Message</p>
              <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed">
                {app.message || "No message provided."}
              </div>
            </div>

            <p className="text-xs text-gray-400">Applied on {appliedDate}</p>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <Button onClick={handleClose} variant="outline" className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ResumeViewerModal
        resume={resume}
        open={showResume}
        onClose={() => setShowResume(false)}
      />
    </>
  );
};

/* ── Job Row ────────────────────────────────────────────────── */
const JobRow = ({ jobData }) => {
  const [expanded, setExpanded]       = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const applicants = jobData.applications || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
            {jobData.companyName} ·{" "}
            <span className="font-medium text-[#EBAB09]">
              {jobData.totalApplications}{" "}
              {jobData.totalApplications === 1 ? "application" : "applications"}
            </span>
          </p>
        </div>
        {expanded ? <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-100">
          {applicants.length === 0 ? (
            <p className="px-5 py-4 text-sm text-gray-400 italic">No applicants yet.</p>
          ) : (
            applicants.map((app, idx) => {
              const applicant   = app.applicant || {};
              const appliedDate = app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-GB") : "—";
              return (
                <div
                  key={app._id || idx}
                  className={`flex items-center gap-4 px-5 py-3.5 ${idx < applicants.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#EBAB09]/15 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-[#EBAB09]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{applicant.fullname || "Unknown"}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {applicant.stream ? `${applicant.stream}, ${applicant.batch}` : "—"} · Applied {appliedDate}
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

      <ApplicationDetailDialog app={selectedApp} open={!!selectedApp} onClose={() => setSelectedApp(null)} />
    </div>
  );
};

/* ── Stat Card ──────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
    <div className="p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: `${accent}18` }}>
      <Icon className="h-5 w-5" style={{ color: accent }} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  </div>
);

/* ── Pagination ─────────────────────────────────────────────── */
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
    <div className="flex items-center justify-between mt-6 px-1">
      <p className="text-sm text-gray-400">Page {page} of {pages} · {pagination.total} jobs</p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
          className="p-2 rounded-lg bg-[#1e2d4d] text-white disabled:opacity-30 hover:bg-[#EBAB09] hover:text-black transition-all">
          <ChevronLeft className="h-4 w-4" />
        </button>
        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">…</span>
          ) : (
            <button key={p} onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${p === page ? "bg-[#EBAB09] text-black" : "bg-[#1e2d4d] text-white hover:bg-[#EBAB09] hover:text-black"}`}>
              {p}
            </button>
          )
        )}
        <button onClick={() => onPageChange(page + 1)} disabled={page === pages}
          className="p-2 rounded-lg bg-[#1e2d4d] text-white disabled:opacity-30 hover:bg-[#EBAB09] hover:text-black transition-all">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

/* ── Dashboard ──────────────────────────────────────────────── */
const Dashboard = () => {
  const dispatch = useDispatch();
  const { jobApplications, pagination, loading } = useSelector((state) => state.adminApplications);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAdminJobApplications({ page, limit: 10 }));
  }, [page, dispatch]);

  const totalApplications = jobApplications.reduce((sum, job) => sum + job.totalApplications, 0);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb] p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-[#152A5D]">
            <LayoutDashboard className="h-5 w-5 text-[#EBAB09]" />
          </div>
          <h1 className="text-2xl font-bold text-[#152A5D]">Admin Dashboard</h1>
        </div>
        <p className="text-sm text-gray-500 ml-12">Applications received for jobs you posted</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Briefcase}     label="Jobs Posted by You"       value={pagination.total}                                accent="#152A5D" />
        <StatCard icon={ClipboardList} label="Applications (this page)" value={totalApplications}                              accent="#EBAB09" />
        <StatCard icon={Users}         label="Showing Page"             value={`${pagination.page} / ${pagination.pages || 1}`} accent="#10b981" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[#EBAB09]" />
          Applications for Your Jobs
        </h2>

        {loading && (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-gray-200 rounded-md" />
                  <div className="h-3 w-28 bg-gray-100 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && jobApplications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Inbox className="h-7 w-7 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No applications yet</p>
            <p className="text-gray-400 text-sm mt-1">Applications to jobs you posted will appear here.</p>
          </div>
        )}

        {!loading && jobApplications.length > 0 && (
          <div className="space-y-3">
            {jobApplications.map((jobData) => (
              <JobRow key={jobData._id} jobData={jobData} />
            ))}
          </div>
        )}

        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default Dashboard;