import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Clock,
  MapPin,
  Users,
  DollarSign,
  CheckCircle2,
  XCircle,
  Loader2,
  Briefcase,
  Pencil,
} from "lucide-react";

const formatDateTime = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatExperience = (exp) => {
  if (!exp) return "Not specified";
  if (exp === "fresher") return "Fresher";
  return `${exp} years`;
};

const AdminJobCard = ({
  job,
  loading,
  onApprove,
  onReject,
  onEdit, // ✅ NEW
}) => {
  const salaryDisclosed = job.salary?.disclosed === true;
  const canEdit = job.status === "pending";

  return (
    <Card className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-bold">{job.title}</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            {job.companyName}
          </div>
        </div>
        <Badge>{job.status}</Badge>
      </div>

      {/* JOB META */}
      <div className="grid md:grid-cols-2 gap-3 text-sm">
        <p>
          <Clock className="inline h-4 w-4 mr-2" />
          {job.employmentType} · {job.workMode}
        </p>

        <p>
          <Briefcase className="inline h-4 w-4 mr-2" />
          {formatExperience(job.experienceLevel)}
        </p>

        <p>
          <Users className="inline h-4 w-4 mr-2" />
          {job.openings} opening{job.openings > 1 ? "s" : ""}
        </p>

        <p>
          <MapPin className="inline h-4 w-4 mr-2" />
          {[job.location?.city, job.location?.state]
            .filter(Boolean)
            .join(", ")}
        </p>

        <p>
          <DollarSign className="inline h-4 w-4 mr-2" />
          {salaryDisclosed ? (
            <>
              ₹{job.salary.min?.toLocaleString()} – ₹
              {job.salary.max?.toLocaleString()}
            </>
          ) : (
            <span className="italic text-muted-foreground">
              Salary not disclosed
            </span>
          )}
        </p>
      </div>

      {/* POSTED BY */}
      <div className="rounded-lg bg-muted p-3 text-sm">
        <p className="font-medium">
          Posted by {job.postedBy.username} ({job.postedBy.stream},{" "}
          {job.postedBy.batch})
        </p>
        <p className="text-muted-foreground">{job.postedBy.email}</p>
        <p className="text-xs text-muted-foreground">
          Submitted on {formatDateTime(job.createdAt)}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        {/* EDIT — NEW */}
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onEdit(job)}
          disabled={!canEdit || loading}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>

        <Button
          className="flex-1"
          onClick={onApprove}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="mr-2" />
              Approve
            </>
          )}
        </Button>

        <Button
          variant="destructive"
          className="flex-1"
          onClick={onReject}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <XCircle className="mr-2" />
              Reject
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default AdminJobCard;
