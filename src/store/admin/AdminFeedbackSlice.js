import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

const BASE = "/api/admin/feedback";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchAllFeedback = createAsyncThunk(
  "adminFeedback/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(BASE, { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch feedback");
    }
  }
);

export const fetchFeedbackById = createAsyncThunk(
  "adminFeedback/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`${BASE}/${id}`);
      return data.feedback;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch feedback");
    }
  }
);

export const updateFeedback = createAsyncThunk(
  "adminFeedback/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(`${BASE}/${id}`, updates);
      return data.feedback;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update feedback");
    }
  }
);

export const deleteFeedback = createAsyncThunk(
  "adminFeedback/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${BASE}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete feedback");
    }
  }
);

export const fetchFeedbackStats = createAsyncThunk(
  "adminFeedback/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`${BASE}/stats`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch stats");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const adminFeedbackSlice = createSlice({
  name: "adminFeedback",
  initialState: {
    feedbacks: [],
    selected: null,
    pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
    stats: { statusStats: [], typeStats: [], priorityStats: [] },
    filters: { status: "", type: "", priority: "", search: "" },
    loading: false,
    statsLoading: false,
    error: null,
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = { status: "", type: "", priority: "", search: "" };
    },
    clearSelected(state) {
      state.selected = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAll
    builder
      .addCase(fetchAllFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload.feedbacks;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchById
    builder
      .addCase(fetchFeedbackById.pending, (state) => { state.loading = true; })
      .addCase(fetchFeedbackById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchFeedbackById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // update
    builder
      .addCase(updateFeedback.fulfilled, (state, action) => {
        const updated = action.payload;
        state.feedbacks = state.feedbacks.map((f) =>
          f._id === updated._id ? updated : f
        );
        if (state.selected?._id === updated._id) state.selected = updated;
      })
      .addCase(updateFeedback.rejected, (state, action) => {
        state.error = action.payload;
      });

    // delete
    builder
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.feedbacks = state.feedbacks.filter((f) => f._id !== action.payload);
        if (state.selected?._id === action.payload) state.selected = null;
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.error = action.payload;
      });

    // stats
    builder
      .addCase(fetchFeedbackStats.pending, (state) => { state.statsLoading = true; })
      .addCase(fetchFeedbackStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchFeedbackStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearSelected, clearError } =
  adminFeedbackSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectAllFeedback = (state) => state.adminFeedback.feedbacks;
export const selectSelectedFeedback = (state) => state.adminFeedback.selected;
export const selectFeedbackPagination = (state) => state.adminFeedback.pagination;
export const selectFeedbackStats = (state) => state.adminFeedback.stats;
export const selectFeedbackFilters = (state) => state.adminFeedback.filters;
export const selectFeedbackLoading = (state) => state.adminFeedback.loading;
export const selectFeedbackError = (state) => state.adminFeedback.error;

export default adminFeedbackSlice.reducer;