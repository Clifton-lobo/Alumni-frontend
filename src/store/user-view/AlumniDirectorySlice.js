import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ============================
   ASYNC THUNK
============================ */

export const fetchAlumni = createAsyncThunk(
  "alumni/fetchAlumni",
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        currentPage,
        search,
        loggedInOnly,
        limit,
        batch,
        stream,
        
      } = getState().alumni;

      const response = await axios.get("/api/auth/alumni", {
        params: {
          page: currentPage,
          limit,
          search: search || undefined,
          loggedIn: loggedInOnly ? "true" : undefined,
          batch: batch || undefined,     // ✅ added
          stream: stream || undefined,   // ✅ added
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
    limit: 20,
    search: "",
    loggedInOnly: false,
    search: "",  
    batch: "",    
    stream: "",
  },

  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
      state.currentPage = 1; // Reset page on search
    },

    setLoggedInOnly(state, action) {
      state.loggedInOnly = action.payload;
      state.currentPage = 1; // Reset page on filter change
    },

    setPage(state, action) {
      state.currentPage = action.payload;
    },

    resetAlumniState(state) {
      state.alumniList = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalUsers = 0;
      state.search = "";
      state.loggedInOnly = false;
      state.error = null;
    },
    setBatch(state, action) {
      state.batch = action.payload;
      state.currentPage = 1;
    },

    setStream(state, action) {
      state.stream = action.payload;
      state.currentPage = 1;
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
