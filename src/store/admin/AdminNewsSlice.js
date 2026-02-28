import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* ══════════════════════════════════════════════
   ASYNC THUNKS
══════════════════════════════════════════════ */

// Fetch paginated news list with filters
export const fetchNews = createAsyncThunk(
  "news/fetchNews",
  async ({ page = 1, limit = 10, search, category, isPublished } = {}, { rejectWithValue }) => {
    try {
      const params = { page, limit };
      if (search)              params.search      = search;
      if (category)            params.category    = category;
      if (isPublished !== "")  params.isPublished = isPublished;

      const res = await axiosInstance.get("/api/admin/news", { params });
      return res.data; // { data, pagination }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load news");
    }
  }
);

// Fetch stats (total, published, drafts) — two parallel calls
export const fetchNewsStats = createAsyncThunk(
  "news/fetchNewsStats",
  async (_, { rejectWithValue }) => {
    try {
      const [all, pub] = await Promise.all([
        axiosInstance.get("/api/admin/news", { params: { limit: 1 } }),
        axiosInstance.get("/api/admin/news", { params: { limit: 1, isPublished: true } }),
      ]);
      const total     = all.data.pagination.total;
      const published = pub.data.pagination.total;
      return { total, published, drafts: total - published };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load stats");
    }
  }
);

// Fetch a single article (for edit sheet)
export const fetchNewsById = createAsyncThunk(
  "news/fetchNewsById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/admin/news/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load article");
    }
  }
);

// Create a new article
export const createNews = createAsyncThunk(
  "news/createNews",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/admin/news", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create article");
    }
  }
);

// Update an existing article
export const updateNews = createAsyncThunk(
  "news/updateNews",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/api/admin/news/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update article");
    }
  }
);

// Toggle published / draft status
export const togglePublish = createAsyncThunk(
  "news/togglePublish",
  async (newsId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/api/admin/news/${newsId}/toggle-publish`, {});
      return { newsId, isPublished: res.data.data.isPublished };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to toggle publish status");
    }
  }
);

// Delete an article
export const deleteNews = createAsyncThunk(
  "news/deleteNews",
  async (newsId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/admin/news/${newsId}`);
      return newsId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete article");
    }
  }
);

/* ══════════════════════════════════════════════
   SLICE
══════════════════════════════════════════════ */

const newsSlice = createSlice({
  name: "news",
  initialState: {
    // List
    newsList:   [],
    pagination: { total: 0, page: 1, pages: 1, limit: 10 },
    loading:    false,
    error:      null,

    // Stats
    stats:        { total: 0, published: 0, drafts: 0 },
    statsLoading: false,

    // Single article (edit sheet)
    selectedNews:    null,
    selectedLoading: false,
    selectedError:   null,

    // Per-action loading states
    saving:     false,   // create or update
    deleting:   null,    // newsId currently being deleted
    togglingId: null,    // newsId currently being toggled
  },

  reducers: {
    clearSelectedNews(state) {
      state.selectedNews  = null;
      state.selectedError = null;
    },
    clearNewsError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ─── Fetch News List ─────────────────────────────────────────
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading    = false;
        state.newsList   = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

    // ─── Fetch Stats ─────────────────────────────────────────────
      .addCase(fetchNewsStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchNewsStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats        = action.payload;
      })
      .addCase(fetchNewsStats.rejected, (state) => {
        state.statsLoading = false;
      })

    // ─── Fetch Single ─────────────────────────────────────────────
      .addCase(fetchNewsById.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError   = null;
      })
      .addCase(fetchNewsById.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selectedNews    = action.payload;
      })
      .addCase(fetchNewsById.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError   = action.payload;
      })

    // ─── Create ───────────────────────────────────────────────────
      .addCase(createNews.pending, (state) => {
        state.saving = true;
      })
      .addCase(createNews.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(createNews.rejected, (state) => {
        state.saving = false;
      })

    // ─── Update ───────────────────────────────────────────────────
      .addCase(updateNews.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateNews.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(updateNews.rejected, (state) => {
        state.saving = false;
      })

    // ─── Toggle Publish ───────────────────────────────────────────
      .addCase(togglePublish.pending, (state, action) => {
        state.togglingId = action.meta.arg; // newsId
      })
      .addCase(togglePublish.fulfilled, (state, action) => {
        state.togglingId = null;
        // Optimistic update — no re-fetch needed
        const article = state.newsList.find((n) => n._id === action.payload.newsId);
        if (article) article.isPublished = action.payload.isPublished;
      })
      .addCase(togglePublish.rejected, (state) => {
        state.togglingId = null;
      })

    // ─── Delete ───────────────────────────────────────────────────
      .addCase(deleteNews.pending, (state, action) => {
        state.deleting = action.meta.arg; // newsId
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.deleting  = null;
        state.newsList  = state.newsList.filter((n) => n._id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteNews.rejected, (state) => {
        state.deleting = null;
      });
  },
});

export const { clearSelectedNews, clearNewsError } = newsSlice.actions;
export default newsSlice.reducer;