import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* ══════════════════════════════════════════════
   ASYNC THUNKS
══════════════════════════════════════════════ */

// Fetch all albums with filters + pagination
export const fetchAlbums = createAsyncThunk(
  "gallery/fetchAlbums",
  async ({ page = 1, limit = 12, status, search } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, limit });
      if (status && status !== "all") params.append("status", status);
      if (search) params.append("search", search);

      const res = await axiosInstance.get(`/api/admin/gallery/albums?${params}`);
      return res.data; // { data, pagination, pendingCount }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load albums");
    }
  }
);

// Fetch photos inside a single album
export const fetchAlbumPhotos = createAsyncThunk(
  "gallery/fetchAlbumPhotos",
  async (albumId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/admin/gallery/albums/${albumId}/photos`);
      console.log("fetchAlbumPhotos raw response:", res.data); // ← add this
      
      // Handle whatever shape the backend returns
      const photos = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data.photos)
        ? res.data.photos
        : [];
        
      return photos;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load photos");
    }
  }
);


// Create a new album (admin — auto-approved)
export const createAlbum = createAsyncThunk(
  "gallery/createAlbum",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/admin/gallery/albums", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create album");
    }
  }
);

// Add photos to existing album
export const addPhotosToAlbum = createAsyncThunk(
  "gallery/addPhotosToAlbum",
  async ({ albumId, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/api/admin/gallery/albums/${albumId}/photos`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add photos");
    }
  }
);

// Approve an album
export const approveAlbum = createAsyncThunk(
  "gallery/approveAlbum",
  async (albumId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/api/admin/gallery/albums/${albumId}/approve`, {});
      return { albumId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to approve album");
    }
  }
);

// Reject an album
export const rejectAlbum = createAsyncThunk(
  "gallery/rejectAlbum",
  async ({ albumId, reason }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/api/admin/gallery/albums/${albumId}/reject`, { reason });
      return { albumId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to reject album");
    }
  }
);

// Delete an album
export const deleteAlbum = createAsyncThunk(
  "gallery/deleteAlbum",
  async (albumId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/admin/gallery/albums/${albumId}`);
      return albumId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete album");
    }
  }
);

// Delete a single photo
export const deletePhoto = createAsyncThunk(
  "gallery/deletePhoto",
  async (photoId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/admin/gallery/photos/${photoId}`);
      return photoId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete photo");
    }
  }
);

// Set album cover photo
export const setAlbumCover = createAsyncThunk(
  "gallery/setAlbumCover",
  async ({ albumId, photoId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(
        `/api/admin/gallery/albums/${albumId}/set-cover/${photoId}`,
        {}
      );
      return { albumId, photoId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to set cover");
    }
  }
);

// Merge multiple albums
export const mergeAlbums = createAsyncThunk(
  "gallery/mergeAlbums",
  async ({ albumIds, title }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch("/api/admin/gallery/albums/merge", {
        albumIds,
        title,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Merge failed");
    }
  }
);

/* ══════════════════════════════════════════════
   SLICE
══════════════════════════════════════════════ */

const gallerySlice = createSlice({
  name: "Admingallery",
  initialState: {
    // Albums list
    albums: [],
    pagination: { total: 0, page: 1, pages: 1, limit: 12 },
    pendingCount: 0,
    loading: false,
    error: null,

    // Active filters
    statusFilter: "all",
    search: "",

    // Per-album action loading states (keyed by albumId)
    approving: null,   // albumId currently being approved
    deleting: null,    // albumId currently being deleted

    // Photos for the currently viewed album
    albumPhotos: [],
    photosLoading: false,
    photosError: null,

    // Upload / action states
    creating: false,
    addingPhotos: false,
    rejecting: false,
    merging: false,
  },

  reducers: {
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    clearAlbumPhotos(state) {
      state.albumPhotos = [];
      state.photosError = null;
    },
    clearGalleryError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ─── Fetch Albums ────────────────────────────────────────────
    builder
      .addCase(fetchAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload.data;
        state.pagination = action.payload.pagination;
        state.pendingCount = action.payload.pendingCount;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // ─── Fetch Album Photos ──────────────────────────────────────
      .addCase(fetchAlbumPhotos.pending, (state) => {
        state.photosLoading = true;
        state.photosError = null;
      })
      .addCase(fetchAlbumPhotos.fulfilled, (state, action) => {
        state.photosLoading = false;
        state.albumPhotos = action.payload;
      })
      .addCase(fetchAlbumPhotos.rejected, (state, action) => {
        state.photosLoading = false;
        state.photosError = action.payload;
      })

    // ─── Create Album ────────────────────────────────────────────
      .addCase(createAlbum.pending, (state) => {
        state.creating = true;
      })
      .addCase(createAlbum.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createAlbum.rejected, (state) => {
        state.creating = false;
      })

    // ─── Add Photos ──────────────────────────────────────────────
      .addCase(addPhotosToAlbum.pending, (state) => {
        state.addingPhotos = true;
      })
      .addCase(addPhotosToAlbum.fulfilled, (state) => {
        state.addingPhotos = false;
      })
      .addCase(addPhotosToAlbum.rejected, (state) => {
        state.addingPhotos = false;
      })

    // ─── Approve Album ───────────────────────────────────────────
      .addCase(approveAlbum.pending, (state, action) => {
        state.approving = action.meta.arg; // albumId
      })
      .addCase(approveAlbum.fulfilled, (state, action) => {
        state.approving = null;
        // Optimistically update status in list
        const album = state.albums.find((a) => a._id === action.payload.albumId);
        if (album) album.status = "approved";
        if (state.pendingCount > 0) state.pendingCount -= 1;
      })
      .addCase(approveAlbum.rejected, (state) => {
        state.approving = null;
      })

    // ─── Reject Album ────────────────────────────────────────────
      .addCase(rejectAlbum.pending, (state) => {
        state.rejecting = true;
      })
      .addCase(rejectAlbum.fulfilled, (state, action) => {
        state.rejecting = false;
        const album = state.albums.find((a) => a._id === action.payload.albumId);
        if (album) album.status = "rejected";
        if (state.pendingCount > 0) state.pendingCount -= 1;
      })
      .addCase(rejectAlbum.rejected, (state) => {
        state.rejecting = false;
      })

    // ─── Delete Album ────────────────────────────────────────────
      .addCase(deleteAlbum.pending, (state, action) => {
        state.deleting = action.meta.arg; // albumId
      })
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        state.deleting = null;
        state.albums = state.albums.filter((a) => a._id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteAlbum.rejected, (state) => {
        state.deleting = null;
      })

    // ─── Delete Photo ────────────────────────────────────────────
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.albumPhotos = state.albumPhotos.filter((p) => p._id !== action.payload);
      })

    // ─── Merge Albums ────────────────────────────────────────────
      .addCase(mergeAlbums.pending, (state) => {
        state.merging = true;
      })
      .addCase(mergeAlbums.fulfilled, (state) => {
        state.merging = false;
      })
      .addCase(mergeAlbums.rejected, (state) => {
        state.merging = false;
      });
  },
});

export const {
  setStatusFilter,
  setSearch,
  clearAlbumPhotos,
  clearGalleryError,
} = gallerySlice.actions;

export default gallerySlice.reducer;