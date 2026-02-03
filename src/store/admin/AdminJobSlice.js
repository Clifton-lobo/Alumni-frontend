import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * Fetch pending jobs for admin
 */
export const fetchPendingJobs = createAsyncThunk(
  "adminJobs/fetchPendingJobs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/admin/jobs");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch pending jobs"
      );
    }
  }
);

/**
 * Approve or reject job
 */
export const updateJobStatus = createAsyncThunk(
  "adminJobs/updateJobStatus",
  async ({ jobId, status }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/admin/jobs/${jobId}/status`, {
        status,
      });
      return res.data.data;
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
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // fetch pending jobs
      .addCase(fetchPendingJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingJobs = action.payload;
      })
      .addCase(fetchPendingJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // approve / reject job
      .addCase(updateJobStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        state.loading = false;
        // remove job from pending list after approval/rejection
        state.pendingJobs = state.pendingJobs.filter(
          (job) => job._id !== action.payload._id
        );
      })
      .addCase(updateJobStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminJobsSlice.reducer;
