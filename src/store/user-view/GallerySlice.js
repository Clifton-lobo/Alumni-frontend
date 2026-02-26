import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* ══════════════════════════════════════════
   THUNKS
══════════════════════════════════════════ */

export const fetchApprovedAlbums = createAsyncThunk(
  "gallery/fetchApprovedAlbums",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/user/gallery/albums", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch albums");
    }
  }
);

export const fetchAlbumPhotos = createAsyncThunk(
  "gallery/fetchAlbumPhotos",
  async (albumId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/user/gallery/albums/${albumId}/photos`);
      return res.data.data; // { album, photos }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch photos");
    }
  }
);

export const submitAlbum = createAsyncThunk(
  "gallery/submitAlbum",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/user/gallery/albums", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to submit album");
    }
  }
);

export const fetchMyAlbums = createAsyncThunk(
  "gallery/fetchMyAlbums",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/user/gallery/my-albums");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch your albums");
    }
  }
);

/* ══════════════════════════════════════════
   SLICE
══════════════════════════════════════════ */

const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    albums:     [],
    pagination: { total: 0, page: 1, pages: 1, limit: 12 },

    /* Active album + its photos */
    activeAlbum:  null,
    activePhotos: [],

    /* User's own submissions */
    myAlbums: [],

    loading: {
      albums:  false,
      photos:  false,
      submit:  false,
      mine:    false,
    },

    error:         null,
    submitSuccess: false,
  },

  reducers: {
    clearActiveAlbum: (s) => { s.activeAlbum = null; s.activePhotos = []; },
    clearSubmitState: (s) => { s.submitSuccess = false; s.error = null; },
    clearError:       (s) => { s.error = null; },
  },

  extraReducers: (builder) => {
    builder
      /* Approved albums */
      .addCase(fetchApprovedAlbums.pending,   (s) => { s.loading.albums = true;  s.error = null; })
      .addCase(fetchApprovedAlbums.fulfilled, (s, a) => {
        s.loading.albums = false;
        s.albums         = a.payload.data;
        s.pagination     = a.payload.pagination;
      })
      .addCase(fetchApprovedAlbums.rejected,  (s, a) => { s.loading.albums = false; s.error = a.payload; })

      /* Album photos */
      .addCase(fetchAlbumPhotos.pending,   (s) => { s.loading.photos = true; s.activeAlbum = null; s.activePhotos = []; })
      .addCase(fetchAlbumPhotos.fulfilled, (s, a) => {
        s.loading.photos = false;
        s.activeAlbum    = a.payload.album;
        s.activePhotos   = a.payload.photos;
      })
      .addCase(fetchAlbumPhotos.rejected,  (s, a) => { s.loading.photos = false; s.error = a.payload; })

      /* Submit album */
      .addCase(submitAlbum.pending,   (s) => { s.loading.submit = true;  s.error = null; s.submitSuccess = false; })
      .addCase(submitAlbum.fulfilled, (s) => { s.loading.submit = false; s.submitSuccess = true; })
      .addCase(submitAlbum.rejected,  (s, a) => { s.loading.submit = false; s.error = a.payload; })

      /* My albums */
      .addCase(fetchMyAlbums.pending,   (s) => { s.loading.mine = true; })
      .addCase(fetchMyAlbums.fulfilled, (s, a) => { s.loading.mine = false; s.myAlbums = a.payload; })
      .addCase(fetchMyAlbums.rejected,  (s) => { s.loading.mine = false; });
  },
});

export const { clearActiveAlbum, clearSubmitState, clearError } = gallerySlice.actions;
export default gallerySlice.reducer;