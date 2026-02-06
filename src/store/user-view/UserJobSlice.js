// src/store/user-view/jobsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* -------------------- THUNKS -------------------- */

// GET public jobs
export const fetchPublicJobs = createAsyncThunk(
  "jobs/fetchPublicJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "/api/user/jobs/alumni/jobs/get",
        { params, withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch jobs"
      );
    }
  }
);

// CREATE job
export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "/api/user/jobs/alumni/jobs/create",
        jobData,
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create job"
      );
    }
  }
);

/* -------------------- SLICE -------------------- */

const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    list: [],
    pagination: { total: 0, page: 1, pages: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    clearJobError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // fetch jobs
      .addCase(fetchPublicJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || [];
        state.pagination = action.payload?.pagination || {
          total: 0,
          page: 1,
          pages: 0,
        };
      })
      .addCase(fetchPublicJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // create job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearJobError } = jobsSlice.actions;
export default jobsSlice.reducer;
