import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  Building2,
  MapPin,
  Briefcase,
  Clock,
  Users,
  IndianRupee,
  Home,
} from 'lucide-react';

const JobCard = ({ job }) => {
  const formatSalary = (min, max) => {
    const formatAmount = (amount) => {
      if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)}Cr`;
      if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
      return `${(amount / 1000).toFixed(0)}K`;
    };

    return `₹${formatAmount(min)} - ${formatAmount(max)}`;
  };

  const getEmploymentTypeColor = (type) => {
    const colors = {
      'full-time': 'bg-green-100 text-green-800 border-green-200',
      'part-time': 'bg-blue-100 text-blue-800 border-blue-200',
      internship: 'bg-purple-100 text-purple-800 border-purple-200',
      contract: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getWorkModeColor = (mode) => {
    const colors = {
      remote: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      onsite: 'bg-slate-100 text-slate-800 border-slate-200',
      hybrid: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return colors[mode] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" />
              {job.companyName}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge
              variant="outline"
              className={getEmploymentTypeColor(job.employmentType)}
            >
              {job.employmentType.replace('-', ' ')}
            </Badge>
            <Badge variant="outline" className={getWorkModeColor(job.workMode)}>
              {job.workMode}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* Location */}
          {job.location?.city && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>
                {job.location.city}
                {job.location.state && `, ${job.location.state}`}
              </span>
            </div>
          )}

          {/* Experience */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase className="h-4 w-4 text-gray-400" />
            <span>
              {job.experienceLevel === 'fresher'
                ? 'Fresher'
                : `${job.experienceLevel} years`}
            </span>
          </div>

          {/* Openings */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4 text-gray-400" />
            <span>
              {job.openings} {job.openings === 1 ? 'Opening' : 'Openings'}
            </span>
          </div>

          {/* Posted Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{formatDate(job.createdAt)}</span>
          </div>
        </div>

        {/* Salary */}
        {job.salary?.disclosed && job.salary.min && job.salary.max && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
            <IndianRupee className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {formatSalary(job.salary.min, job.salary.max)} per annum
            </span>
          </div>
        )}

        {/* Posted By Info */}
        {job.postedBy && (
          <div className="text-xs text-gray-500 mb-4 border-t pt-3">
            Posted by {job.postedBy.name}
            {job.postedBy.department && ` • ${job.postedBy.department}`}
            {job.postedBy.graduationYear && ` • Class of ${job.postedBy.graduationYear}`}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1">View Details</Button>
          <Button variant="outline" className="flex-1">
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;