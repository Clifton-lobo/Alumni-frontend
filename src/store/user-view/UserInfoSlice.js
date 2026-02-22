import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

const initialState = {
  isLoading: false,
  userProfile: null,
  allProfiles: [],
  error: null,
};

// Get User Profile
export const fetchUserProfile = createAsyncThunk(
  "userProfile/fetchUserProfile",
  async (_, { rejectWithValue, getState }) => {
    // Skip fetch if profile is already loaded
    const existing = getState().userProfile.userProfile;
    if (existing) return { data: existing };

    try {
      const result = await axiosInstance.get(`/api/user/info/get`);
      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch user profile" }
      );
    }
  }
);

// Create or Update User Profile
export const createOrUpdateUserProfile = createAsyncThunk(
  "userProfile/createOrUpdateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const result = await axiosInstance.put(
        "/api/user/info/update",
        profileData
      );
      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update profile" }
      );
    }
  }
);


// Delete User Profile
export const deleteUserProfile = createAsyncThunk(
  "userProfile/deleteUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const result = await axiosInstance.delete(
        `/api/user/info/delete/${userId}`
      );
      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete profile" }
      );
    }
  }
);

// Get All User Profiles (Admin)
export const fetchAllUserProfiles = createAsyncThunk(
  "userProfile/fetchAllUserProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const result = await axiosInstance.get("/api/user/info/get-all");
      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch profiles" }
      );
    }
  }
);

// Slice
const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserProfile: (state) => {
      state.userProfile = null;
    },

  },
  extraReducers: (builder) => {
    builder
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload?.data || null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch profile";
        state.userProfile = null;
      })

      // Create/Update User Profile
      .addCase(createOrUpdateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrUpdateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload?.data || null;
      })
      .addCase(createOrUpdateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update profile";
      })

      // Delete User Profile
      .addCase(deleteUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserProfile.fulfilled, (state) => {
        state.isLoading = false;
        state.userProfile = null;
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to delete profile";
      })

      // Fetch All User Profiles
      .addCase(fetchAllUserProfiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUserProfiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allProfiles = action.payload?.data || [];
      })
      .addCase(fetchAllUserProfiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch profiles";
        state.allProfiles = [];
      });
  },
});

export const { clearError, clearUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;