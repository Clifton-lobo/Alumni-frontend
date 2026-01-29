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
      if (isVirtual === "virtual") params.isVirtual = "true";
      if (isVirtual === "physical") params.isVirtual = "false";
      if (status && status !== "all") params.status = status;

      const { data } = await axiosInstance.get(
        "/api/user/events/filter",
        { params }
      );

      return data;
    } catch (error) {
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

    currentPage: 1,
    totalPages: 1,

    selectedEvent: null,
    detailsLoading: false,
    detailsError: null,
  },

  reducers: {
    /* filters — NO implicit page reset */
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },

    setCategory: (state, action) => {
      state.category = action.payload;
    },

    setMode: (state, action) => {
      state.mode = action.payload;
    },

    setStatus: (state, action) => {
      state.status = action.payload;
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
        state.currentPage = action.payload.currentPage;
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
