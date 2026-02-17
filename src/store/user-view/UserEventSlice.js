import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* ------------------ THUNKS ------------------ */

export const fetchFilteredEvents = createAsyncThunk(
  "events/fetchFiltered",
  async (
    {
      filter,
      startDate,
      endDate,
      search,
      category,
      isVirtual,
      status,
      page = 1,
      limit = 10,
    },
    { rejectWithValue }
  ) => {
    try {
      const params = { filter, page, limit };

      if (filter === "custom") {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      if (search) params.search = search;
      if (category && category !== "all") params.category = category;
      
      // ✅ FIXED: Properly handle isVirtual parameter
      if (isVirtual !== undefined && isVirtual !== null && isVirtual !== "all") {
        // Convert to string "true" or "false" for API
        params.isVirtual = isVirtual.toString();
      }
      
      if (status && status !== "all") params.status = status;

      console.log("📤 API Request params:", params);

      const { data } = await axiosInstance.get(
        "/api/user/events/filter",
        { params }
      );

      console.log("📥 API Response:", data);

      return data;
    } catch (error) {
      console.error("❌ API Error:", error);
      return rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);

export const fetchEventDetails = createAsyncThunk(
  "events/fetchEventDetails",
  async (id, { rejectWithValue }) => {
    try {
      const result = await axiosInstance.get(`/api/user/events/get/${id}`);
      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch event details"
      );
    }
  }
);

/* ------------------ SLICE ------------------ */

const eventSlice = createSlice({
  name: "events",
  initialState: {
    eventList: [],
    loading: false,
    error: null,

    activeFilter: "all",
    category: "all",
    mode: "all",
    status: "all",

    totalPages: 1,

    selectedEvent: null,
    detailsLoading: false,
    detailsError: null,
  },

  reducers: {
    /* filters — NO implicit page reset */
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
      // state.currentPage = 1; // Reset to page 1 when filter changes
    },

    setCategory: (state, action) => {
      state.category = action.payload;
      // state.currentPage = 1; // Reset to page 1 when filter changes
    },

    setMode: (state, action) => {
      state.mode = action.payload;
      // state.currentPage = 1; // Reset to page 1 when filter changes
    },

    setStatus: (state, action) => {
      state.status = action.payload;
      // state.currentPage = 1; // Reset to page 1 when filter changes
    },

    /* pagination — explicit control */
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },

    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
      state.detailsLoading = false;
      state.detailsError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchFilteredEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.eventList = action.payload.events;
        // state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })

      .addCase(fetchFilteredEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchEventDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })

      .addCase(fetchEventDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedEvent = action.payload;
      })

      .addCase(fetchEventDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload;
      });
  },
});

export const {
  setActiveFilter,
  setCategory,
  setMode,
  setStatus,
  setPage,
  clearSelectedEvent,
} = eventSlice.actions;

export default eventSlice.reducer;