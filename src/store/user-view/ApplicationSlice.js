import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* ================= THUNKS ================= */

/* Alumni submits an application */
export const applyToJob = createAsyncThunk(
  "applications/applyToJob",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/api/user/jobs/alumni/jobs/apply",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to submit application"
      );
    }
  }
);

/* Job poster fetches applications on their own jobs (paginated) */
export const fetchApplicationsForMyJobs = createAsyncThunk(
  "applications/fetchApplicationsForMyJobs",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        "/api/user/jobs/alumni/applications",
        { params: { page, limit } }
      );
      return res.data; // { data, pagination }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch applications"
      );
    }
  }
);

/* Applicant fetches their own submitted applications */
export const fetchMyApplications = createAsyncThunk(
  "applications/fetchMyApplications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/user/applications/my");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch applications"
      );
    }
  }
);

/* ================= SLICE ================= */

const applicationsSlice = createSlice({
  name: "applications",
  initialState: {
    /* applicant view */
    myApplications: [],

    /* job poster view */
    jobApplications: [],          // jobs with nested applications[]
    pagination: {
      total: 0,
      page: 1,
      pages: 1,
      limit: 10,
    },

    loading: {
      submit: false,
      fetchMine: false,
      fetchForJobs: false,
    },
    error: null,
  },
  reducers: {
    clearApplicationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ── applyToJob ── */
      .addCase(applyToJob.pending, (state) => {
        state.loading.submit = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state) => {
        state.loading.submit = false;
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.loading.submit = false;
        state.error = action.payload;
      })

      /* ── fetchApplicationsForMyJobs ── */
      .addCase(fetchApplicationsForMyJobs.pending, (state) => {
        state.loading.fetchForJobs = true;
        state.error = null;
      })
      .addCase(fetchApplicationsForMyJobs.fulfilled, (state, action) => {
        state.loading.fetchForJobs = false;
        state.jobApplications = action.payload.data;
        state.pagination       = action.payload.pagination;
      })
      .addCase(fetchApplicationsForMyJobs.rejected, (state, action) => {
        state.loading.fetchForJobs = false;
        state.error = action.payload;
      })

      /* ── fetchMyApplications ── */
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading.fetchMine = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading.fetchMine = false;
        state.myApplications = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading.fetchMine = false;
        state.error = action.payload;
      });
  },
});

export const { clearApplicationError } = applicationsSlice.actions;
export default applicationsSlice.reducer;