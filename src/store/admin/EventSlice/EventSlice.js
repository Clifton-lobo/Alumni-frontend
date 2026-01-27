import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";

const initialState = {
  isLoading: false,
  eventList: [],
  registrations: [],
  registrationCount: 0,
};


// Add Event
export const addNewEvent = createAsyncThunk(
  "event/addNewEvent",
  async (formData) => {
    const result = await axiosInstance.post("/api/admin/events/add", formData, {
      headers: { "Content-Type": "application/json" },
    });

    return result.data;
  }
);

// Fetch All Events
export const fetchAllEvents = createAsyncThunk(
  "event/fetchAllEvents",
  async () => {
    const result = await axiosInstance.get("/api/admin/events/get");
    return result.data;
  }
);

// Update Event
export const updateEvent = createAsyncThunk(
  "event/updateEvent",
  async ({ id, updatedData }) => {
    const result = await axiosInstance.put(
      `/api/admin/events/update/${id}`,
      updatedData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return result.data;
  }
);

// Delete Event
export const deleteEvent = createAsyncThunk("event/deleteEvent", async (id) => {
  const result = await axiosInstance.delete(`/api/admin/events/delete/${id}`);

  return result.data;
});

// Fetch Event Registrations
export const fetchEventRegistrations = createAsyncThunk(
  "event/fetchEventRegistrations",
  async (eventId, { rejectWithValue }) => {
    try {
      const result = await axiosInstance.get(
        `/api/admin/events/registrations/${eventId}`
      );
      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch registrations" }
      );
    }
  }
);


// Slice
const adminEventSlice = createSlice({
  name: "adminEvent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.eventList = action.payload?.data || [];
      })
      .addCase(fetchAllEvents.rejected, (state) => {
        state.isLoading = false;
        state.eventList = [];
      })

      // ---------------- REGISTRATIONS ----------------
    .addCase(fetchEventRegistrations.pending, (state) => {
      state.isLoading = true;
      state.registrations = [];
      state.registrationCount = 0;
    })
    .addCase(fetchEventRegistrations.fulfilled, (state, action) => {
      state.isLoading = false;
      state.registrations = action.payload?.registrations || [];
      state.registrationCount = action.payload?.count || 0;
    })
    .addCase(fetchEventRegistrations.rejected, (state) => {
      state.isLoading = false;
      state.registrations = [];
      state.registrationCount = 0;
    });
  },
});

export default adminEventSlice.reducer;
