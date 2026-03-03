import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* ============================
   ASYNC THUNK
   Accepts params directly — does NOT read from getState()
   so URL-driven fetches are always in sync.
============================ */
export const fetchAlumni = createAsyncThunk(
  "alumni/fetchAlumni",
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState().alumni;

      // Prefer explicitly passed params, fall back to Redux state
      const page   = params.page   ?? state.currentPage;
      const search = params.search ?? state.search;
      const batch  = params.batch  ?? state.batch;
      const stream = params.stream ?? state.stream;
      const limit  = params.limit  ?? state.limit;
      const loggedInOnly = params.loggedInOnly ?? state.loggedInOnly;

      const response = await axiosInstance.get("/api/auth/alumni", {
        params: {
          page,
          limit,
          search: search || undefined,
          loggedIn: loggedInOnly ? "true" : undefined,
          batch: batch || undefined,
          stream: stream || undefined,
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch alumni"
      );
    }
  }
);

/* ============================
   SLICE
============================ */
const alumniSlice = createSlice({
  name: "alumni",
  initialState: {
    alumniList: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 21,
    search: "",
    loggedInOnly: false,
    batch: "",
    stream: "",
  },

  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
      state.currentPage = 1;
    },
    setLoggedInOnly(state, action) {
      state.loggedInOnly = action.payload;
      state.currentPage = 1;
    },
    setPage(state, action) {
      state.currentPage = action.payload;
    },
    setBatch(state, action) {
      state.batch = action.payload;
      state.currentPage = 1;
    },
    setStream(state, action) {
      state.stream = action.payload;
      state.currentPage = 1;
    },
    resetAlumniState(state) {
      state.alumniList = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalUsers = 0;
      state.search = "";
      state.loggedInOnly = false;
      state.batch = "";
      state.stream = "";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAlumni.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlumni.fulfilled, (state, action) => {
        state.loading = false;
        state.alumniList = action.payload.data;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalUsers = action.payload.totalUsers;
      })
      .addCase(fetchAlumni.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearch,
  setLoggedInOnly,
  setPage,
  setBatch,
  setStream,
  resetAlumniState,
} = alumniSlice.actions;

export default alumniSlice.reducer;