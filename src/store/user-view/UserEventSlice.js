import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";


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
      const params = {
        filter,
        page,
        limit,
      };

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
    category: "all",
    mode: "all",
    status: "all",

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
      state.currentPage = 1;

    },
    // optional: clear selected event
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
      state.detailsLoading = false;
      state.detailsError = null;
    },

    setCategory: (state, action) => {
      state.category = action.payload;
      state.currentPage = 1;
    },

    setMode: (state, action) => {
      state.mode = action.payload;
      state.currentPage = 1;
    },

    setStatus: (state, action) => {
      state.status = action.payload;
      state.currentPage = 1;
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

export const { setActiveFilter, clearSelectedEvent,setCategory ,setMode,setStatus} = eventSlice.actions;
export default eventSlice.reducer;
