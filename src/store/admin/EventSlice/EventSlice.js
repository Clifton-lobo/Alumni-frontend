import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance";

const initialState = {
  isLoading: false,
  eventList: [],
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
      });
  },
});

export default adminEventSlice.reducer;
