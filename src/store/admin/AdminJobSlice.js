import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

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

const adminJobsSlice = createSlice({
  name: "adminJobs",
  initialState: {
    pendingJobs: [],
    pagination: { page: 1, pages: 1, total: 0 },
    loading: { fetch: false },
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
      // FETCH
      .addCase(fetchPendingJobs.pending, (s) => {
        s.loading.fetch = true;
      })
      .addCase(fetchPendingJobs.fulfilled, (s, a) => {
        s.loading.fetch = false;
        s.pendingJobs = a.payload.data;
        s.pagination = a.payload.pagination;
        s.actionLoading = {};
      })
      .addCase(fetchPendingJobs.rejected, (s, a) => {
        s.loading.fetch = false;
        s.error = a.payload;
      })

      // UPDATE STATUS
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
      });
  },
});

export const { clearError } = adminJobsSlice.actions;
export default adminJobsSlice.reducer;
