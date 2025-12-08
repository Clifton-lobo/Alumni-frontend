import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";


export const fetchFilteredEvents = createAsyncThunk(
  "events/fetchFiltered",
  async (
    { filter, startDate, endDate, search, page = 1, limit = 5 },
    { rejectWithValue }
  ) => {
    try {
      const params = { filter };

      if (filter === "custom") {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      if (search) {
        params.search = search;
      }
      const { data } = await axiosInstance.get("/api/user/events/filter", {
        params,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Fixed variable name and return the actual data for event details
export const fetchEventDetails = createAsyncThunk(
  "events/fetchEventDetails",
  async (id, { rejectWithValue }) => {
    try {
      const result = await axiosInstance.get(`/api/user/events/get/${id}`);
      // assuming the API returns the event object in result.data
      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch event details"
      );
    }
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState: {
    eventList: [],
    loading: false,
    error: null,
    activeFilter: "all",
    currentPage: 1,
    totalPages: 1,

    // added fields to track a single event's details
    selectedEvent: null,
    detailsLoading: false,
    detailsError: null,
  },

  reducers: {
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    // optional: clear selected event
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
      state.detailsLoading = false;
      state.detailsError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // --- fetchFilteredEvents handlers ---
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

      // --- fetchEventDetails handlers ---
      .addCase(fetchEventDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
        // optional: keep previous selectedEvent until new one arrives
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

export const { setActiveFilter, clearSelectedEvent } = eventSlice.actions;
export default eventSlice.reducer;
