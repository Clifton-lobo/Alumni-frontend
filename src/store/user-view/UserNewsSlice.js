import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* ══════════════════════════════════════════
   THUNKS
══════════════════════════════════════════ */

export const fetchPublicNews = createAsyncThunk(
  "news/fetchPublicNews",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/user/news", { params });
      return res.data; // { data, pagination }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch news");
    }
  }
);

export const fetchNewsById = createAsyncThunk(
  "news/fetchNewsById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/user/news/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Article not found");
    }
  }
);

export const fetchLatestNews = createAsyncThunk(
  "news/fetchLatestNews",
  async (limit = 4, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/user/news/latest", { params: { limit } });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch latest news");
    }
  }
);

/* ══════════════════════════════════════════
   SLICE
══════════════════════════════════════════ */

const newsSlice = createSlice({
  name: "news",
  initialState: {
    list:       [],
    pagination: { total: 0, page: 1, pages: 1, limit: 9 },
    article:    null,
    latest:     [],
    loading: {
      list:    false,
      article: false,
      latest:  false,
    },
    error: null,
  },

  reducers: {
    clearArticle:   (s) => { s.article = null; s.error = null; },
    clearNewsError: (s) => { s.error   = null; },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicNews.pending,   (s) => { s.loading.list = true;  s.error = null; })
      .addCase(fetchPublicNews.fulfilled, (s, a) => {
        s.loading.list = false;
        s.list         = a.payload.data;
        s.pagination   = a.payload.pagination;
      })
      .addCase(fetchPublicNews.rejected,  (s, a) => { s.loading.list = false; s.error = a.payload; })

      .addCase(fetchNewsById.pending,   (s) => { s.loading.article = true;  s.article = null; s.error = null; })
      .addCase(fetchNewsById.fulfilled, (s, a) => { s.loading.article = false; s.article = a.payload; })
      .addCase(fetchNewsById.rejected,  (s, a) => { s.loading.article = false; s.error = a.payload; })

      .addCase(fetchLatestNews.pending,   (s) => { s.loading.latest = true; })
      .addCase(fetchLatestNews.fulfilled, (s, a) => { s.loading.latest = false; s.latest = a.payload; })
      .addCase(fetchLatestNews.rejected,  (s) => { s.loading.latest = false; });
  },
});

export const { clearArticle, clearNewsError } = newsSlice.actions;
export default newsSlice.reducer;