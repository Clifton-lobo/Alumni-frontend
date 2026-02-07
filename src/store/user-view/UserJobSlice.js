import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* ================= THUNKS ================= */

export const fetchPublicJobs = createAsyncThunk(
  "userJobs/fetchPublicJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        "/api/user/jobs/alumni/jobs/get",
        { params }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch jobs"
      );
    }
  }
);

export const createJob = createAsyncThunk(
  "userJobs/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/api/user/jobs/alumni/jobs/create",
        jobData
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create job"
      );
    }
  }
);

/* ================= SLICE ================= */

const userJobsSlice = createSlice({
  name: "userJobs",
  initialState: {
    list: [],
    pagination: { total: 0, page: 1, pages: 1 },
    loading: { fetch: false, create: false },
    error: null,
  },
  reducers: {
    clearJobError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchPublicJobs.pending, (s) => {
        s.loading.fetch = true;
      })
      .addCase(fetchPublicJobs.fulfilled, (s, a) => {
        s.loading.fetch = false;
        s.list = a.payload.data;
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchPublicJobs.rejected, (s, a) => {
        s.loading.fetch = false;
        s.error = a.payload;
      })

      // CREATE
      .addCase(createJob.pending, (s) => {
        s.loading.create = true;
      })
      .addCase(createJob.fulfilled, (s) => {
        s.loading.create = false;
      })
      .addCase(createJob.rejected, (s, a) => {
        s.loading.create = false;
        s.error = a.payload;
      });
  },
});

export const { clearJobError } = userJobsSlice.actions;
export default userJobsSlice.reducer;
