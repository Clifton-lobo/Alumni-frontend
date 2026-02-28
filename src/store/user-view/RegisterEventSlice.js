import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const registerForEvent = createAsyncThunk(
  "userEvent/registerForEvent",
  async ({ eventId, name, email }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/api/user/events/${eventId}/register`,
        { name, email }
      );

      // attach eventId so reducer knows WHICH event succeeded
      return { eventId, registrationId: data.registrationId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to register for event"
      );
    }
  }
);

const userEventRegistrationSlice = createSlice({
  name: "userEventRegistration",
  initialState: {
    registering: false,
    error: null,

    // PER-EVENT SUCCESS keyed by eventId
    registeredEvents: {
      // [eventId]: true
    },

    registrationId: null,
  },

  reducers: {
    resetRegistrationState: (state) => {
      state.registering = false;
      state.error = null;
      state.registrationId = null;
    },

    // ✅ FIX: Clears stale error so it doesn't bleed into the next event's dialog.
    // Dispatched in UserEventDetails whenever the dialog opens (see useEffect there).
    clearRegisterError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerForEvent.pending, (state) => {
        state.registering = true;
        state.error = null;
      })

      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.registering = false;
        state.registeredEvents[action.payload.eventId] = true;
        state.registrationId = action.payload.registrationId;
      })

      .addCase(registerForEvent.rejected, (state, action) => {
        state.registering = false;
        state.error = action.payload;
      });
  },
});

// ✅ clearRegisterError added to exports
export const { resetRegistrationState, clearRegisterError } =
  userEventRegistrationSlice.actions;

export default userEventRegistrationSlice.reducer;