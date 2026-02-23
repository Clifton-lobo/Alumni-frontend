import React from "react";
import {
  MapPin,
  Briefcase,
  Clock,
  IndianRupee,
  Building2,
  ArrowRight,
  ExternalLink,
  Users,
  Shield,
} from "lucide-react";

const JobCard = ({ job, view = "grid", onApply }) => {
  const getDisplayName = () => {
    if (job.postedBy?.role === "admin") return "Administrator";
    return job.postedBy?.username || "Anonymous";
  };

  const isAdminPosted = job.postedBy?.role === "admin";
  const isList = view === "list";
  const isExternal = job.applicationType === "external";

  // Apply button handler — external opens new tab, form calls parent
  const handleApply = () => {
    if (isExternal && job.externalLink) {
      window.open(job.externalLink, "_blank", "noopener,noreferrer");
    } else {
      onApply?.(job);
    }
  };

  const ApplyButton = () => (
    <button
      onClick={handleApply}
      className="
        group inline-flex items-center gap-2
        px-5 py-2.5 text-sm font-semibold rounded-xl
        hover:bg-[#1e2d4d] text-black
         hover:text-white
        transition-all duration-200 cursor-pointer
      "
    >
      Apply
      {isExternal ? (
        <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      ) : (
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </button>
  );

  /* ========== LIST VIEW ========== */
  if (isList) {
    return (
      <div className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#EBAB09]">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-[#EBAB09] transition-all duration-300" />

        {isAdminPosted && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200">
              <Shield className="h-3.5 w-3.5 text-green-600" />
              <span className="text-xs font-medium text-green-700">Verified</span>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start gap-5">
            <div className="p-4 rounded-xl bg-[#152A5D] text-[#EBAB09] flex-shrink-0">
              <Briefcase className="h-6 w-6" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#EBAB09] transition-colors duration-200">
                {job.title}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                <Building2 className="h-4 w-4" />
                <span>{job.companyName}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {job.employmentType && (
                  <span className="px-3 py-1 text-xs rounded-full border border-gray-200 bg-white text-gray-700 capitalize">
                    {job.employmentType.replace("-", " ")}
                  </span>
                )}
                {job.workMode && (
                  <span className="px-3 py-1 text-xs rounded-full border border-gray-200 bg-white text-gray-700 capitalize">
                    {job.workMode}
                  </span>
                )}
                {job.experienceLevel && (
                  <span className="px-3 py-1 text-xs rounded-full border border-gray-200 bg-white text-gray-700">
                    {job.experienceLevel === "fresher"
                      ? "fresher exp"
                      : `${job.experienceLevel} exp`}
                  </span>
                )}
                {job.openings > 1 && (
                  <span className="px-3 py-1 text-xs rounded-full border border-gray-200 bg-white text-gray-700 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {job.openings} openings
                  </span>
                )}
              </div>

              {/* Inline details row */}
              <div className="flex flex-wrap items-center gap-8 mt-4 text-sm text-gray-600">
                {(job.location?.city || job.location?.state) && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>
                      {job.location?.city}
                      {job.location?.state && `, ${job.location.state}`}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <IndianRupee className="h-4 w-4 text-gray-400" />
                  {job.salary?.disclosed ? (
                    <span className="font-medium text-gray-800">
                      ₹{job.salary.min?.toLocaleString()} – ₹
                      {job.salary.max?.toLocaleString()}
                    </span>
                  ) : (
                    <span className="italic text-gray-400">Not disclosed</span>
                  )}
                </div>
                {job.createdAt && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>
                      Posted {new Date(job.createdAt).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              by{" "}
              <span
                className={`font-semibold ${
                  isAdminPosted ? "text-green-700" : "text-gray-900"
                }`}
              >
                {getDisplayName()}
              </span>
            </span>
            <ApplyButton />
          </div>
        </div>
      </div>
    );
  }

  /* ========== GRID VIEW ========== */
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-transparent group-hover:bg-[#EBAB09] transition-all duration-300" />

      {isAdminPosted && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200">
            <Shield className="h-3.5 w-3.5 text-green-600" />
            <span className="text-xs font-medium text-green-700">Verified</span>
          </div>
        </div>
      )}

      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="p-3 rounded-xl bg-[#152A5D] flex-shrink-0">
            <Briefcase className="h-6 w-6 text-[#EBAB09]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#EBAB09] transition-colors duration-200 leading-snug">
              {job.title}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
              <Building2 className="h-3.5 w-3.5" />
              <span className="truncate">{job.companyName}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {job.employmentType && (
            <span className="px-3 py-1 text-xs rounded-full border border-gray-200 bg-white text-gray-700 capitalize">
              {job.employmentType.replace("-", " ")}
            </span>
          )}
          {job.workMode && (
            <span className="px-3 py-1 text-xs rounded-full border border-gray-200 bg-white text-gray-700 capitalize">
              {job.workMode}
            </span>
          )}
          {job.experienceLevel && (
            <span className="px-3 py-1 text-xs rounded-full border border-gray-200 bg-white text-gray-700">
              {job.experienceLevel === "fresher"
                ? "fresher exp"
                : `${job.experienceLevel} exp`}
            </span>
          )}
          {job.openings > 1 && (
            <span className="px-3 py-1 text-xs rounded-full border border-gray-200 bg-white text-gray-700 flex items-center gap-1">
              <Users className="h-3 w-3" />
              {job.openings} openings
            </span>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2.5 text-sm text-gray-600 mb-6">
          {(job.location?.city || job.location?.state) && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>
                {job.location?.city}
                {job.location?.state && `, ${job.location.state}`}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-gray-400" />
            {job.salary?.disclosed ? (
              <span className="font-medium text-gray-800">
                ₹{job.salary.min?.toLocaleString()} – ₹
                {job.salary.max?.toLocaleString()}
              </span>
            ) : (
              <span className="italic text-gray-400">Salary not disclosed</span>
            )}
          </div>
          {job.createdAt && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>
                Posted {new Date(job.createdAt).toLocaleDateString("en-GB")}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            by{" "}
            <span
              className={`font-semibold ${
                isAdminPosted ? "text-green-700" : "text-gray-900"
              }`}
            >
              {getDisplayName()}
            </span>
          </span>
          <ApplyButton />
        </div>
      </div>
    </div>
  );
};

export default JobCard;