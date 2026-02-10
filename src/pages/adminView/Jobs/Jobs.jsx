import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchPendingJobs,
  updateJobStatus,
  clearError,
} from "../../../store/admin/AdminJobSlice";

import AdminJobFilters from "./AdminJobFilters";
import AdminJobCard from "./AdminJobCard";
import AdminEditJobSheet from "./AdminEditJobSheet";
import AdminPostJobSheet from "./AdminPostJobSheet";
import PaginationControls from "../../../components/common/Pagination";

import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Jobs = () => {
  const dispatch = useDispatch();

  const {
    pendingJobs,
    pagination,
    loading,
    actionLoading,
    error,
  } = useSelector((s) => s.adminJobs);

  /* ================= STATE ================= */
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    employmentType: "",
    workMode: "",
    experienceLevel: "",
    city: "",
    search: "",
  });

  const [editingJob, setEditingJob] = useState(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isPostSheetOpen, setIsPostSheetOpen] = useState(false);

  // NEW — explicit, predictable UI state
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  /* ================= HANDLERS ================= */
  const handleEdit = (job) => {
    setEditingJob(job);
    setIsEditSheetOpen(true);
  };

  const handleJobCreated = () => {
    toast.success("Job published successfully!");
  };

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(fetchPendingJobs(filters));
  }, [
    filters.employmentType,
    filters.workMode,
    filters.experienceLevel,
    filters.city,
    filters.search,
    filters.page,
    filters.limit,
    dispatch,
  ]);

  /* ================= ERROR ================= */
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  /* ================= FILTERS ================= */
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  /* ================= ACTIONS ================= */
  const handleAction = async (jobId, status) => {
    try {
      await dispatch(updateJobStatus({ jobId, status })).unwrap();
      toast.success(`Job ${status}`);
    } catch (e) {
      toast.error(e);
    }
  };

  /* ================= PAGINATION ================= */
  const onPageChange = (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFilters((p) => ({ ...p, page }));
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Pending Job Approvals
          </h1>
          <p className="text-sm text-muted-foreground">
            Review, edit, and approve partner-submitted jobs
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex rounded-xl border bg-background p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-3 py-2 rounded-lg transition",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3 py-2 rounded-lg transition",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Post Job */}
          <Button
            onClick={() => setIsPostSheetOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Post Job as Admin
          </Button>
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <AdminJobFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        loading={loading.fetch}
      />

      {/* ================= STATES ================= */}
      {!loading.fetch && pendingJobs.length === 0 && (
        <div className="text-center py-24 rounded-xl border bg-muted/30">
          <p className="text-muted-foreground">
            No pending jobs match your filters
          </p>
        </div>
      )}

      {loading.fetch && (
        <div className="flex justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}

      {/* ================= JOBS ================= */}
      {!loading.fetch && pendingJobs.length > 0 && (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 gap-6"
              : "space-y-4"
          )}
        >
          {pendingJobs.map((job) => (
            <AdminJobCard
              key={job._id}
              job={job}
              loading={actionLoading[job._id]}
              onApprove={() => handleAction(job._id, "approved")}
              onReject={() => handleAction(job._id, "rejected")}
              onEdit={handleEdit}
              compact={viewMode === "list"} // optional, safe extension
            />
          ))}
        </div>
      )}

      {/* ================= PAGINATION ================= */}
      {pagination.pages > 1 && (
        <PaginationControls
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={onPageChange}
        />
      )}

      {/* ================= SHEETS ================= */}
      <AdminEditJobSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        job={editingJob}
      />

      <AdminPostJobSheet
        open={isPostSheetOpen}
        onOpenChange={setIsPostSheetOpen}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
};

export default Jobs;
