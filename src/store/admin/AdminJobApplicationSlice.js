// store/admin/AdminApplicationSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";


export const fetchAdminJobApplications = createAsyncThunk(
  "adminApplications/fetch",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/admin/jobs/applications", {
        params: { page, limit },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch applications"
      );
    }
  }
);

const adminApplicationSlice = createSlice({
  name: "adminApplications",
  initialState: {
    jobApplications: [],
    pagination: { total: 0, page: 1, pages: 1, limit: 10 },
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminAppError: (s) => { s.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminJobApplications.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchAdminJobApplications.fulfilled, (s, a) => {
        s.loading = false;
        s.jobApplications = a.payload.data;
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchAdminJobApplications.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export const { clearAdminAppError } = adminApplicationSlice.actions;
export default adminApplicationSlice.reducer;