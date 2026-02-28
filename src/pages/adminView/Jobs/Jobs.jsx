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
import { Plus, LayoutGrid, List, Briefcase } from "lucide-react";
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
  <div style={{ minHeight: "100vh", background: "#F8F7F4", fontFamily: "'Outfit', sans-serif" }}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600&display=swap');`}</style>

    {/* ── Page Header ── */}
    <div style={{ background: "#142A5D" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 2rem 1.75rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#EBAB09", marginBottom: "4px" }}>
              Admin Panel
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "2rem", fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: 0 }}>
              Job Approvals
            </h1>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
              Review, edit, and approve partner-submitted listings
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* View Toggle */}
            <div style={{ display: "flex", background: "rgba(255,255,255,0.1)", borderRadius: "12px", padding: "4px" }}>
              {[{ mode: "grid", Icon: LayoutGrid }, { mode: "list", Icon: List }].map(({ mode, Icon }) => (
                <button key={mode} onClick={() => setViewMode(mode)} style={{
                  padding: "7px 10px", borderRadius: "9px", border: "none", cursor: "pointer",
                  background: viewMode === mode ? "#fff" : "transparent",
                  color: viewMode === mode ? "#142A5D" : "rgba(255,255,255,0.5)",
                  transition: "all 0.2s",
                }}>
                  <Icon style={{ width: 15, height: 15 }} />
                </button>
              ))}
            </div>

            {/* Post Job Button */}
            <button onClick={() => setIsPostSheetOpen(true)} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "9px 18px", borderRadius: "12px", border: "none",
              background: "#EBAB09", color: "#142A5D",
              fontSize: "13px", fontWeight: 600, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              transition: "opacity 0.2s",
            }}>
              <Plus style={{ width: 15, height: 15 }} />
              Post Job
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* ── Content ── */}
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <AdminJobFilters filters={filters} onFilterChange={handleFilterChange} loading={loading.fetch} />

      {loading.fetch && (
        <div style={{ display: "flex", justifyContent: "center", padding: "6rem 0" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #EBAB0930", borderTopColor: "#EBAB09", animation: "spin 0.8s linear infinite" }} />
        </div>
      )}

      {!loading.fetch && pendingJobs.length === 0 && (
      <div style={{ textAlign: "center", padding: "6rem 2rem", borderRadius: "20px", background: "#fff", border: "1px dashed #e5e7eb" }}>
          <Briefcase style={{ width: 36, height: 36, color: "#d1d5db", margin: "0 auto 12px" }} />
          <p style={{ color: "#9ca3af", fontSize: "14px" }}>No pending jobs match your filters</p>
        </div>
      )}

      {!loading.fetch && pendingJobs.length > 0 && (
        <div style={viewMode === "grid"
          ? { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: "20px" }
          : { display: "flex", flexDirection: "column", gap: "14px" }
        }>
          {pendingJobs.map((job) => (
            <AdminJobCard key={job._id} job={job}
              loading={actionLoading[job._id]}
              onApprove={() => handleAction(job._id, "approved")}
              onReject={() => handleAction(job._id, "rejected")}
              onEdit={handleEdit}
              compact={viewMode === "list"}
            />
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div style={{ marginTop: "2rem" }}>
          <PaginationControls currentPage={pagination.page} totalPages={pagination.pages} onPageChange={onPageChange} />
        </div>
      )}
    </div>

    <AdminEditJobSheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen} job={editingJob} />
    <AdminPostJobSheet open={isPostSheetOpen} onOpenChange={setIsPostSheetOpen} onJobCreated={handleJobCreated} />
  </div>
);
};

export default Jobs;
