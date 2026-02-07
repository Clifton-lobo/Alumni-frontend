import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingJobs,
  updateJobStatus,
  clearError,
} from "../../store/admin/AdminJobSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

const Jobs = () => {
  const dispatch = useDispatch();

  const {
    pendingJobs = [],
    loading = { fetch: false },
    actionLoading = {},
    error = null,
  } = useSelector((state) => state.adminJobs);

  useEffect(() => {
    dispatch(fetchPendingJobs());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleAction = async (jobId, status) => {
    try {
      await dispatch(updateJobStatus({ jobId, status })).unwrap();

      toast.success(
        status === "approved" ? "Job Approved" : "Job Rejected",
        {
          description:
            status === "approved"
              ? "Job is now visible to users"
              : "Job has been rejected",
        }
      );
    } catch (err) {
      toast.error(err || "Action failed");
    }
  };

  if (loading.fetch && pendingJobs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Job Approvals</h1>
          <Badge>{pendingJobs.length} Pending</Badge>
        </div>

        {pendingJobs.length === 0 ? (
          <div className="text-center py-24 text-slate-600">
            No pending jobs
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingJobs.map((job) => {
              const isLoading = actionLoading[job._id];

              return (
                <Card key={job._id} className="p-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold">{job.title}</h2>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Building2 className="h-4 w-4" />
                        {job.companyName}
                      </div>
                    </div>
                    <Badge>Pending</Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <p>
                      <Briefcase className="inline h-4 w-4 mr-2" />
                      {job.employmentType} · {job.workMode}
                    </p>
                    <p>
                      <Clock className="inline h-4 w-4 mr-2" />
                      {job.experienceLevel === "fresher"
                        ? "Fresher"
                        : `${job.experienceLevel} years`}
                    </p>
                    <p>
                      <MapPin className="inline h-4 w-4 mr-2" />
                      {[job.location?.city, job.location?.state]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    <p>
                      <Users className="inline h-4 w-4 mr-2" />
                      {job.openings} opening(s)
                    </p>

                    {job.salary?.disclosed && (
                      <p>
                        <DollarSign className="inline h-4 w-4 mr-2" />
                        ₹{job.salary.min?.toLocaleString()} – ₹
                        {job.salary.max?.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() =>
                        handleAction(job._id, "approved")
                      }
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
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
                      onClick={() =>
                        handleAction(job._id, "rejected")
                      }
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
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
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
