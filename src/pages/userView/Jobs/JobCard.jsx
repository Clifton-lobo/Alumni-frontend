import React from "react";
import {
  MapPin,
  Briefcase,
  Clock,
  IndianRupee,
  Building2,
  ArrowRight,
  Users,
  Shield,
} from "lucide-react";

const GOLD = "#EBAB09";

const JobCard = ({ job }) => {
  // Helper to determine display name
  const getDisplayName = () => {
    if (job.postedBy?.role === "admin") {
      return "Management Committee";
    }
    return job.postedBy?.username || "Anonymous";
  };

  // Helper to check if posted by admin
  const isAdminPosted = job.postedBy?.role === "admin";

  return (
    <div
      className="
        group relative rounded-2xl border-2 border-gray-200 bg-white
        transition-all duration-300
        hover:shadow-xl"
    >
      {/* Top border (hover synced) */}
      <div
        className="
          absolute top-0 left-0 right-0 h-[3px]
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        "
        style={{ backgroundColor: GOLD }}
      />

      {/* Admin Badge (Optional - shows if posted by admin) */}
      {isAdminPosted && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 border border-green-300">
            <Shield className="h-3.5 w-3.5 text-green-700" />
            <span className="text-xs font-medium text-green-700">
              Verified
            </span>
          </div>
        </div>
      )}

      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="
              flex-shrink-0 p-3 rounded-xl border border-gray-200
              transition-colors duration-300
              group-hover:border-[#EBAB09]
            "
          >
            <Briefcase
              className="
                h-6 w-6 text-gray-700
                transition-colors duration-300
                group-hover:text-[#EBAB09]
              "
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className="
                text-lg font-semibold text-gray-900
                transition-colors duration-300
                group-hover:text-[#EBAB09]
              "
            >
              {job.title}
            </h3>

            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Building2 className="h-4 w-4" />
              <span className="truncate">{job.companyName}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.employmentType && (
            <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
              {job.employmentType.replace("-", " ")}
            </span>
          )}
          {job.workMode && (
            <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
              {job.workMode}
            </span>
          )}
          {job.experienceLevel && (
            <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
              {job.experienceLevel === "fresher" 
                ? "Fresher" 
                : `${job.experienceLevel} exp`}
            </span>
          )}
          {job.openings > 1 && (
            <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
              <Users className="h-3 w-3" />
              {job.openings} openings
            </span>
          )}
        </div>

        {/* Details */}
        <div className="space-y-3 text-sm text-gray-700 mb-6">
          {(job.location?.city || job.location?.state) && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>
                {job.location?.city}
                {job.location?.state && `, ${job.location.state}`}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-gray-500" />
            {job.salary?.disclosed ? (
              <span>
                ₹{job.salary.min?.toLocaleString()} – ₹
                {job.salary.max?.toLocaleString()}
              </span>
            ) : (
              <span className="italic text-gray-500">
                Salary not disclosed
              </span>
            )}
          </div>

          {job.createdAt && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-200 flex items-center justify-between">
          {job.postedBy?.username && (
            <span className="text-sm text-gray-600">
              Posted by{" "}
              <span 
                className={`font-medium ${
                  isAdminPosted 
                    ? "text-green-700" 
                    : "text-gray-900"
                }`}
              >
                {getDisplayName()}
              </span>
            </span>
          )}

          <button
            className="
              inline-flex items-center gap-2
              px-4 py-2
              text-sm font-medium
              text-gray-800
              rounded-lg
              transition-all duration-200 ease-out
              hover:text-[#EBAB09]
              hover:bg-slate-200
              focus:outline-none
              cursor-pointer
            "
          >
            Apply
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;