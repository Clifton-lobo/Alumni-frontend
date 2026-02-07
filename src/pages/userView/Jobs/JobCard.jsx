import React from "react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building2,
  ArrowRight,
  Users,
} from "lucide-react";

const JobCard = ({ job }) => {
  return (
    <Card className="bg-white hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-indigo-300 group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-slate-600 mb-3">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">{job.companyName}</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full p-3">
            <Briefcase className="h-6 w-6 text-indigo-600" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
            {job.employmentType}
          </Badge>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
            {job.workMode}
          </Badge>
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">
            {job.experienceLevel} exp
          </Badge>
          {job.openings > 1 && (
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">
              <Users className="h-3 w-3 mr-1" />
              {job.openings} openings
            </Badge>
          )}
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span>
              {job.location?.city}, {job.location?.state}
            </span>
          </div>

          {job.salary?.disclosed && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <DollarSign className="h-4 w-4 text-slate-400" />
              <span>
                ₹{job.salary.min?.toLocaleString()} - ₹
                {job.salary.max?.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="h-4 w-4 text-slate-400" />
            <span>
              Posted {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-sm text-slate-500">
            Posted by <span className="font-medium text-slate-700">{job.postedBy?.name}</span>
          </div>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all"
          >
            View Details
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;