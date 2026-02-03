import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPublicJobs = createAsyncThunk(
  "jobs/fetchPublicJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/jobs", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch jobs"
      );
    }
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    list: [],
    pagination: { total: 0, page: 1, pages: 0 },
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload?.data)
          ? action.payload.data
          : [];

        state.pagination = action.payload?.pagination || {
          total: 0,
          page: 1,
          pages: 0,
        };
      })
      .addCase(fetchPublicJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default jobsSlice.reducer;
