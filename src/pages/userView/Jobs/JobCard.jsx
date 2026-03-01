import React, { useState } from "react";
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
import ProfileDialog from "./ProfileDialog";

const JobCard = ({ job, view = "grid", onApply }) => {
  const [posterDialogOpen, setPosterDialogOpen] = useState(false);

  const getDisplayName = () => {
    if (job.postedBy?.role === "admin") return "Administrator";
    return job.postedBy?.fullname || job.postedBy?.username || "Anonymous";
  };

  const isAdminPosted = job.postedBy?.role === "admin";
  const isList = view === "list";
  const isExternal = job.applicationType === "external";

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
        hover:bg-[#1e2d4d] text-black hover:text-white
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

  /* ── Clickable poster chip shown in both views ── */
  const PosterChip = () => (
    <button
      onClick={() => setPosterDialogOpen(true)}
      className="flex items-center gap-2 group/poster min-w-0"
      title={`View ${getDisplayName()}'s profile`}
    >
      {/* "by" text FIRST */}
      <span className="text-sm text-gray-500 whitespace-nowrap">
        by
      </span>

      {/* Avatar */}
      <div className="w-7 h-7 rounded-full overflow-hidden bg-[#142A5D] flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm group-hover/poster:ring-[#EBAB09] transition-all">
        {job.postedBy?.profilePicture ? (
          <img
            src={job.postedBy.profilePicture}
            alt={getDisplayName()}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white text-[11px] font-bold">
            {isAdminPosted
              ? "A"
              : (job.postedBy?.fullname || job.postedBy?.username || "?")
                .charAt(0)
                .toUpperCase()}
          </span>
        )}
      </div>

      {/* Name */}
      <span
        className={`text-sm font-semibold group-hover/poster:underline underline-offset-2 transition-colors ${isAdminPosted
            ? "text-green-700"
            : "text-gray-900 group-hover/poster:text-[#142A5D]"
          }`}
      >
        {getDisplayName()}
        {isAdminPosted && (
          <Shield className="inline w-3 h-3 text-green-600 ml-1 -mt-0.5" />
        )}
      </span>
    </button>
  );

  /* ═══════════════ LIST VIEW ═══════════════ */
  if (isList) {
    return (
      <>
        <div className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#EBAB09]">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-[#EBAB09] transition-all duration-300" />

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

                {/* Details row */}
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
              <PosterChip />
              <ApplyButton />
            </div>
          </div>
        </div>

        <ProfileDialog
          open={posterDialogOpen}
          onClose={() => setPosterDialogOpen(false)}
          poster={job.postedBy}
        />
      </>
    );
  }

  /* ═══════════════ GRID VIEW ═══════════════ */
  return (
    <>
      <div className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-transparent group-hover:bg-[#EBAB09] transition-all duration-300" />

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
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
            <PosterChip />
            <ApplyButton />
          </div>
        </div>
      </div>

      <ProfileDialog
        open={posterDialogOpen}
        onClose={() => setPosterDialogOpen(false)}
        poster={job.postedBy}
      />
    </>
  );
};

export default JobCard;