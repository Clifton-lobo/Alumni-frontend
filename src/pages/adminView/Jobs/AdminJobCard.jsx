import {
  Building2, Clock, MapPin, Users, DollarSign,
  CheckCircle2, XCircle, Loader2, Briefcase,
  Pencil, Calendar, Wifi, WifiOff, ChevronRight,
} from "lucide-react";

const statusConfig = {
  pending:  { label: "Pending",  classes: "bg-amber-50 text-amber-700 ring-amber-200" },
  approved: { label: "Approved", classes: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  rejected: { label: "Rejected", classes: "bg-rose-50 text-rose-700 ring-rose-200" },
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

const formatExperience = (exp) => {
  if (!exp) return "Any level";
  if (exp === "fresher") return "Fresher";
  return `${exp}+ yrs`;
};

const Tag = ({ icon: Icon, children }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 text-xs font-medium">
    {Icon && <Icon className="w-3 h-3 text-slate-400" />}
    {children}
  </span>
);

const AdminJobCard = ({ job, loading, onApprove, onReject, onEdit, compact }) => {
  const salaryDisclosed = job.salary?.disclosed === true;
  const canEdit = job.status === "pending";
  const sc = statusConfig[job.status] || statusConfig.pending;
  const location = [job.location?.city, job.location?.state].filter(Boolean).join(", ") || "Remote";

  return (
    <div className="group w-full bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 overflow-hidden">

      {/* ── Top stripe ── */}
      <div className="h-1 w-full bg-gradient-to-r from-[#142A5D] via-[#2B4A9F] to-[#EBAB09]" />

      <div className="p-6">

        {/* ── Row 1: Title + Status ── */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0">
            <h2
              className="text-xl font-bold text-[#142A5D] leading-tight truncate"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {job.title}
            </h2>
            <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-sm">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="font-medium truncate">{job.companyName}</span>
            </div>
          </div>

          <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${sc.classes}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {sc.label}
          </span>
        </div>

        {/* ── Row 2: Tags ── */}
        <div className="flex flex-wrap gap-2 mb-5">
          <Tag icon={Clock}>{job.employmentType}</Tag>
          <Tag icon={Briefcase}>{job.workMode}</Tag>
          <Tag icon={MapPin}>{location}</Tag>
          <Tag icon={Users}>{job.openings} opening{job.openings !== 1 ? "s" : ""}</Tag>
          <Tag icon={Briefcase}>{formatExperience(job.experienceLevel)}</Tag>
        </div>

        {/* ── Row 3: Salary ── */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-lg bg-[#142A5D]/6 flex items-center justify-center">
            <DollarSign className="w-3.5 h-3.5 text-[#142A5D]" />
          </div>
          {salaryDisclosed ? (
            <span className="text-sm font-semibold text-[#142A5D]">
              ₹{job.salary.min?.toLocaleString()} – ₹{job.salary.max?.toLocaleString()}
              <span className="text-slate-400 font-normal"> / yr</span>
            </span>
          ) : (
            <span className="text-sm text-slate-400 italic">Salary not disclosed</span>
          )}
        </div>

        {/* ── Row 4: Posted by (non-compact) ── */}
        {!compact && (
          <div className="flex items-center justify-between gap-3 py-3 px-4 rounded-xl bg-slate-50 border border-slate-100 mb-5">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {job.postedBy.username}
                <span className="font-normal text-slate-400 text-xs ml-1">
                  · {job.postedBy.stream}, {job.postedBy.batch}
                </span>
              </p>
              <p className="text-xs text-slate-400 truncate">{job.postedBy.email}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
              <Calendar className="w-3 h-3" />
              {formatDate(job.createdAt)}
            </div>
          </div>
        )}

        {/* ── Row 5: Actions ── */}
        <div className="flex items-center gap-2">
          {/* Edit */}
          <button
            onClick={() => onEdit(job)}
            disabled={!canEdit || loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Reject */}
          <button
            onClick={onReject}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-rose-100"
          >
            {loading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <XCircle className="w-3.5 h-3.5" />
            }
            Reject
          </button>

          {/* Approve */}
          <button
            onClick={onApprove}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#142A5D] hover:bg-[#1e3a7a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm shadow-[#142A5D]/20"
          >
            {loading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <CheckCircle2 className="w-3.5 h-3.5" />
            }
            Approve
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminJobCard;