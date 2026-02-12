// store/admin/AdminJobSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* ================= ASYNC THUNKS ================= */

export const fetchPendingJobs = createAsyncThunk(
  "adminJobs/fetchPendingJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        "/api/admin/jobs/pending-jobs",
        { params }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch pending jobs"
      );
    }
  }
);

export const updateJobStatus = createAsyncThunk(
  "adminJobs/updateJobStatus",
  async ({ jobId, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/api/admin/jobs/${jobId}/status`,
        { status }
      );
      return { jobId, job: res.data.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update job status"
      );
    }
  }
);

export const updatePendingJob = createAsyncThunk(
  "adminJobs/updatePendingJob",
  async ({ jobId, payload }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/api/admin/jobs/${jobId}/edit`,
        payload
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update job"
      );
    }
  }
);

// ✅ NEW: Admin creates job
export const createJobAsAdmin = createAsyncThunk(
  "adminJobs/createJobAsAdmin",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/api/admin/jobs/create",
        payload
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create job"
      );
    }
  }
);

/* ================= SLICE ================= */

const adminJobsSlice = createSlice({
  name: "adminJobs",
  initialState: {
    pendingJobs: [],
    pagination: {
      page: 1,
      pages: 1,
      total: 0,
      limit: 10,
    },
    loading: {
      fetch: false,
      create: false, // ✅ NEW
    },
    actionLoading: {},
    error: null,
  },

  reducers: {
    clearError: (s) => {
      s.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ============ FETCH ============ */
      .addCase(fetchPendingJobs.pending, (s) => {
        s.loading.fetch = true;
      })
      .addCase(fetchPendingJobs.fulfilled, (s, a) => {
        s.loading.fetch = false;
        s.pendingJobs = a.payload.data;
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchPendingJobs.rejected, (s, a) => {
        s.loading.fetch = false;
        s.error = a.payload;
      })

      /* ============ UPDATE STATUS ============ */
      .addCase(updateJobStatus.pending, (s, a) => {
        s.actionLoading[a.meta.arg.jobId] = true;
      })
      .addCase(updateJobStatus.fulfilled, (s, a) => {
        s.pendingJobs = s.pendingJobs.filter(
          (j) => j._id !== a.payload.jobId
        );
        delete s.actionLoading[a.payload.jobId];
      })
      .addCase(updateJobStatus.rejected, (s, a) => {
        delete s.actionLoading[a.meta.arg.jobId];
        s.error = a.payload;
      })

      /* ============ UPDATE PENDING JOB ============ */
      .addCase(updatePendingJob.fulfilled, (s, a) => {
        const idx = s.pendingJobs.findIndex((j) => j._id === a.payload._id);
        if (idx !== -1) {
          s.pendingJobs[idx] = a.payload;
        }
      })

      /* ============ CREATE JOB AS ADMIN (NEW) ============ */
      .addCase(createJobAsAdmin.pending, (s) => {
        s.loading.create = true;
      })
      .addCase(createJobAsAdmin.fulfilled, (s, a) => {
        s.loading.create = false;
        // Since admin jobs are auto-approved, they don't go to pending list
        // You could add a success flag or just rely on toast notification
      })
      .addCase(createJobAsAdmin.rejected, (s, a) => {
        s.loading.create = false;
        s.error = a.payload;
      });
  },
});

export const { clearError } = adminJobsSlice.actions;
export default adminJobsSlice.reducer;