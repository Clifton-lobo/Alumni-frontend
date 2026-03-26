import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

const BASE = "/api/user/feedback";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const submitFeedback = createAsyncThunk(
  "userFeedback/submit",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(BASE, formData);
      return data.feedback;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to submit feedback");
    }
  }
);

export const fetchMyFeedback = createAsyncThunk(
  "userFeedback/fetchMine",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`${BASE}/my`);
      return data.feedbacks;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch your feedback");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const userFeedbackSlice = createSlice({
  name: "userFeedback",
  initialState: {
    myFeedbacks: [],
    submitSuccess: false,
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    resetSubmitSuccess(state) {
      state.submitSuccess = false;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // submit
    builder
      .addCase(submitFeedback.pending, (state) => {
        state.submitting = true;
        state.submitSuccess = false;
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.submitting = false;
        state.submitSuccess = true;
        state.myFeedbacks.unshift(action.payload);
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      });

    // fetchMine
    builder
      .addCase(fetchMyFeedback.pending, (state) => { state.loading = true; })
      .addCase(fetchMyFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.myFeedbacks = action.payload;
      })
      .addCase(fetchMyFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSubmitSuccess, clearError } = userFeedbackSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectMyFeedbacks = (state) => state.userFeedback.myFeedbacks;
export const selectSubmitSuccess = (state) => state.userFeedback.submitSuccess;
export const selectSubmitting = (state) => state.userFeedback.submitting;
export const selectFeedbackLoading = (state) => state.userFeedback.loading;
export const selectFeedbackError = (state) => state.userFeedback.error;

export default userFeedbackSlice.reducer;