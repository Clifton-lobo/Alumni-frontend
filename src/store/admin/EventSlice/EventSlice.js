import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  eventList: [],
};

// ✅ Add new event
export const addNewEvent = createAsyncThunk(
  "event/addNewEvent",
  async (formData) => {
    const result = await axios.post(
      "http://localhost:5000/api/admin/events/add",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
  }
);

// ✅ Fetch all events
export const fetchAllEvents = createAsyncThunk(
  "event/fetchAllEvents",
  async () => {
    const result = await axios.get(
      "http://localhost:5000/api/admin/events/get"
    );
    return result?.data;
  }
);

// ✅ Update event
export const updateEvent = createAsyncThunk(
  "event/updateEvent",
  async ({ id, updatedData }) => {
    const result = await axios.put(
      `http://localhost:5000/api/admin/events/update/${id}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result?.data;
  }
);

// ✅ Delete event
export const deleteEvent = createAsyncThunk("event/deleteEvent", async (id) => {
  const result = await axios.delete(
    `http://localhost:5000/api/admin/events/delete/${id}`
  );
  return result?.data;
});

const adminEventSlice = createSlice({
  name: "adminEvent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all events
      .addCase(fetchAllEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.eventList = action.payload?.data || []; // optional chaining
      })
      .addCase(fetchAllEvents.rejected, (state) => {
        state.isLoading = false;
        state.eventList = [];
      });
  },
});

export default adminEventSlice.reducer;
