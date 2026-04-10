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
  ZoomIn,
  ZoomOut,
  Download,
} from "lucide-react";

/* ── Cloudinary PDF → image URL ─────────────────────────────── */
const getPdfImageUrl = (pdfUrl) => {
  if (!pdfUrl) return null;
  return pdfUrl.replace(/\.pdf(\.pdf)?$/, ".jpg");
};

/* ── Pagination ────────────────────────────────────────────── */
const Pagination = ({ pagination, onPageChange }) => {
  const { page, pages } = pagination;
  if (!pages || pages <= 1) return null;

  const getPages = () => {
    const range = [];
    const delta = 2;
    const left = Math.max(2, page - delta);
    const right = Math.min(pages - 1, page + delta);
    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < pages - 1) range.push("...");
    if (pages > 1) range.push(pages);
    return range;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 px-1 gap-3">
      <p className="text-sm text-gray-400 order-2 sm:order-1">
        Showing {(page - 1) * pagination.limit + 1}–
        {Math.min(page * pagination.limit, pagination.total)} of{" "}
        {pagination.total}
      </p>
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-lg bg-[#1e2d4d] text-white disabled:opacity-30 hover:bg-[#EBAB09] hover:text-black transition-all disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">
              …
            </span>
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
          ),
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

/* ── PDF Preview Dialog ─────────────────────────────────────── */
const ResumePreviewDialog = ({ open, onClose, resumeUrl, resumeName }) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!open || !resumeUrl) return;

    setLoading(true);
    setError(false);
    setPdfBlobUrl(null);
    setZoom(1);

    const API_BASE = import.meta.env.VITE_API_URL || "";
    const proxyUrl = `${API_BASE}/api/proxy/file?url=${encodeURIComponent(resumeUrl)}&filename=${encodeURIComponent(resumeName || "resume.pdf")}`;

    fetch(proxyUrl, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        const pdfBlob = new Blob([blob], { type: "application/pdf" });
        setPdfBlobUrl(URL.createObjectURL(pdfBlob));
      })
      .catch((err) => {
        console.error("Preview fetch failed:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [open, resumeUrl]);

  useEffect(() => {
    if (!open && pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
      setError(false);
    }
  }, [open]);

  const downloadBlob = () => {
    if (!pdfBlobUrl) return;
    const a = document.createElement("a");
    a.href = pdfBlobUrl;
    a.download = resumeName || "resume.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-[780px] rounded-2xl p-0 gap-0 overflow-hidden bg-white max-h-[96vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center border-b border-gray-100 flex-shrink-0 px-4 h-12">
          {/* Left: icon + filename */}
          <div className="flex items-center gap-2 flex-1 min-w-0 mr-3">
            <FileText className="h-4 w-4 text-[#EBAB09] flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-800 truncate">
              {resumeName || "Resume.pdf"}
            </span>
          </div>

          {/* Right: zoom + download */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {/* <button
              onClick={() =>
                setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))
              }
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>

            <span className="text-xs text-gray-500 w-10 text-center tabular-nums select-none">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={() =>
                setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))
              }
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button> */}


            <button
              onClick={downloadBlob}
              disabled={!pdfBlobUrl}
              className="p-1.5 rounded-lg hover:bg-gray-100 mr-8 text-gray-500 transition-colors disabled:opacity-30"
              title="Download PDF"
            >
              <Download className="h-4 w-4" />
            </button>

                        <div className="w-px h-5 bg-gray-200 mx-1.5" />

          </div>
        </div>

        {/* Body */}
        <div
          className="flex-1 bg-gray-100 overflow-hidden"
          style={{ height: "82vh" }}
        >
          {loading && (
            <div className="flex items-center justify-center w-full h-full">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#EBAB09] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-400">Loading preview…</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-4 text-center">
              <FileText className="h-12 w-12 text-gray-300" />
              <p className="text-sm text-gray-500 font-medium">
                Preview unavailable
              </p>
              <p className="text-xs text-gray-400">
                Download the file to view it.
              </p>
            </div>
          )}

          {pdfBlobUrl && !loading && !error && (
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
                width: `${100 / zoom}%`,
                height: `${100 / zoom}%`,
              }}
            >
              <object
                data={pdfBlobUrl}
                type="application/pdf"
                className="w-full"
                style={{ height: "82vh" }}
              >
                <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
                  <FileText className="h-12 w-12 text-gray-300" />
                  <p className="text-sm text-gray-500">
                    Your browser cannot display PDFs inline.
                  </p>
                  <button
                    onClick={downloadBlob}
                    className="px-4 py-2 rounded-xl bg-[#EBAB09] text-black text-xs font-semibold hover:bg-[#d49a08]"
                  >
                    Download Instead
                  </button>
                </div>
              </object>
            </div>
          )}
        </div>

        <DialogFooter className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full sm:w-auto rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 text-sm"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ── Application Detail Dialog ──────────────────────────────── */
const ApplicationDetailDialog = ({ app, open, onClose }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  useEffect(() => {
    if (!open) setPreviewOpen(false);
  }, [open]);

  if (!app) return null;

  const applicant = app.applicant || {};
  const resume = app.resume || {};
  const appliedDate = app.createdAt
    ? new Date(app.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

  const triggerDownload = async (url, filename) => {
    if (!url || downloading) return;
    setDownloading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "";
      const proxyUrl = `${API_BASE}/api/proxy/file?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename || "resume.pdf")}&download=true`;

      console.log("Fetching:", proxyUrl);

      const res = await fetch(proxyUrl, { credentials: "include" });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename || "resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] sm:max-w-[480px] rounded-2xl p-0 gap-0 overflow-hidden bg-white max-h-[90vh] flex flex-col">
          <DialogHeader className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
            <DialogTitle className="text-lg font-bold text-gray-900">
              Application Details
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-0.5">
              Review this alumni's application.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {/* Applicant info */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <div className="w-10 h-10 rounded-full bg-[#EBAB09]/20 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-[#EBAB09]" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {applicant.fullname || "Unknown"}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                  <Mail className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">
                    {applicant.email || "No email"}
                  </span>
                </p>
              </div>
            </div>

            {/* Graduation */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Graduation
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <GraduationCap className="h-4 w-4 text-[#EBAB09] flex-shrink-0" />
                <span>
                  {applicant.stream || "Stream N/A"},{" "}
                  {applicant.batch || "Batch N/A"}
                </span>
              </div>
            </div>

            {/* Resume */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Resume
              </p>
              {resume.url ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-50 border border-gray-200 min-w-0">
                    <FileText className="h-4 w-4 text-[#EBAB09] flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {resume.originalName || "Resume.pdf"}
                    </span>
                  </div>

                  <button
                    onClick={() => setPreviewOpen(true)}
                    className="p-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#EBAB09] hover:bg-amber-50 transition-all flex-shrink-0"
                    title="Preview resume"
                  >
                    <Eye className="h-4 w-4 text-[#EBAB09]" />
                  </button>

                  <button
                    onClick={() =>
                      triggerDownload(resume.url, resume.originalName)
                    }
                    className="p-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#EBAB09] hover:bg-amber-50 transition-all flex-shrink-0"
                    title="Download resume"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#EBAB09]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </button>
                </div>
              ) : (
                <p className="text-sm italic text-gray-400">
                  No resume uploaded
                </p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Message
              </p>
              <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed break-words">
                {app.message || "No message provided."}
              </div>
            </div>

            <p className="text-xs text-gray-400">Applied on {appliedDate}</p>
          </div>

          <DialogFooter className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full sm:w-auto rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ResumePreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        resumeUrl={resume.url}
        resumeName={resume.originalName}
      />
    </>
  );
};

/* ── Single Job Row (accordion) ─────────────────────────────── */
const JobRow = ({ jobData }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const applicants = jobData.applications || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="p-2.5 sm:p-3 rounded-xl bg-[#152A5D] flex-shrink-0">
          <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-[#EBAB09]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">
            {jobData.title}
          </p>
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

      {expanded && (
        <div className="border-t border-gray-100">
          {applicants.length === 0 ? (
            <p className="px-4 py-4 text-sm text-gray-400 italic">
              No applicants on this page.
            </p>
          ) : (
            applicants.map((app, idx) => {
              const applicant = app.applicant || {};
              const appliedDate = app.createdAt
                ? new Date(app.createdAt).toLocaleDateString("en-GB")
                : "—";

              return (
                <div
                  key={app._id || idx}
                  className={`flex items-center gap-3 px-4 py-3.5 ${
                    idx < applicants.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EBAB09]/15 flex items-center justify-center flex-shrink-0">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#EBAB09]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {applicant.fullname || "Unknown"}
                    </p>
                    {/* Stack on mobile, inline on sm+ */}
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      <span className="hidden sm:inline">
                        {applicant.stream
                          ? `${applicant.stream}, ${applicant.batch}`
                          : "—"}{" "}
                        ·{" "}
                      </span>
                      Applied {appliedDate}
                    </p>
                    <p className="text-xs text-gray-400 sm:hidden truncate">
                      {applicant.stream
                        ? `${applicant.stream}, ${applicant.batch}`
                        : "—"}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="flex items-center gap-1.5 px-3 py-2 sm:px-4 rounded-xl border border-[#EBAB09] text-[#EBAB09] text-xs font-semibold hover:bg-[#EBAB09] hover:text-black transition-all flex-shrink-0"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">View</span>
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
const MyJobApplications = ({ isActive }) => {
  const dispatch = useDispatch();
  const { jobApplications, pagination, loading } = useSelector(
    (state) => state.applications,
  );

  const [page, setPage] = useState(1);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    dispatch(fetchApplicationsForMyJobs({ page, limit: 10 }));
    setHasFetched(true);
  }, [isActive, page, dispatch]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading.fetchForJobs || (isActive && !hasFetched)) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 sm:w-48 bg-gray-200 rounded-md" />
              <div className="h-3 w-24 sm:w-28 bg-gray-100 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (hasFetched && !jobApplications.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
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
