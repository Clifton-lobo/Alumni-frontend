
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

/* -----------------------------------------
   REGISTER
------------------------------------------ */
export const registerUser = createAsyncThunk(
  "/auth/register",
  async (registerData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/auth/register",
        registerData
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Registration failed"
      );
    }
  }
);

/* -----------------------------------------
   LOGIN
------------------------------------------ */
export const loginUser = createAsyncThunk(
  "/auth/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/auth/login", loginData);

      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }

      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Login failed");
    }
  }
);

/* -----------------------------------------
   CHECK AUTH
------------------------------------------ */
export const checkAuth = createAsyncThunk(
  "/auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/auth/checkAuth", {
        headers: {
          "cache-control": "no-store,no-cache,proxy-validate,must-revalidate",
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue("Not authenticated");
    }
  }
);

/* -----------------------------------------
   LOGOUT
------------------------------------------ */
export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("/api/auth/logout");
      return response.data;
    } catch (err) {
      return rejectWithValue("Logout failed");
    }
  }
);

/* -----------------------------------------
   SLICE
------------------------------------------ */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;

