import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance"; // adjust path
import { logoutUser } from "../authSlice/authSlice";


/* ============================
   ASYNC THUNKS
============================ */

// Send connection request
export const sendConnectionRequest = createAsyncThunk(
  "connections/sendRequest",
  async (recipientId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/user/connect/send", {
        recipientId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send request"
      );
    }
  }
);

// Accept connection request
export const acceptConnectionRequest = createAsyncThunk(
  "connections/accept",
  async (connectionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/api/user/connect/${connectionId}/accept`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to accept request"
      );
    }
  }
);

// Reject connection request
export const rejectConnectionRequest = createAsyncThunk(
  "connections/reject",
  async (connectionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/api/user/connect/${connectionId}/reject`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reject request"
      );
    }
  }
);

// Fetch accepted connections
export const fetchAcceptedConnections = createAsyncThunk(
  "connections/fetchAccepted",
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/user/connect/accept", {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch connections"
      );
    }
  }
);

// Remove connection
export const removeConnection = createAsyncThunk(
  "connections/remove",
  async (connectionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/user/connect/${connectionId}`);
      return { connectionId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove connection"
      );
    }
  }
);

// Fetch incoming requests
export const fetchIncomingRequests = createAsyncThunk(
  "connections/fetchIncoming",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/user/connect/incoming");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch incoming requests"
      );
    }
  }
);

// Fetch outgoing requests
export const fetchOutgoingRequests = createAsyncThunk(
  "connections/fetchOutgoing",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/user/connect/outgoing");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch outgoing requests"
      );
    }
  }
);

/* ============================
   SLICE
============================ */

const connectionSlice = createSlice({
  name: "connections",
  initialState: {
    acceptedConnections: [],
    incomingRequests: [],
    outgoingRequests: [],

    loading: false,
    error: null,

    // ✅ FIX 1: Per-user loading map instead of single boolean
    // Shape: { [recipientId]: true }
    // This way only the clicked card shows "Sending..." instead of all cards
    sendingRequests: {},

    acceptingRequest: false,
    rejectingRequest: false,
    removingConnection: false,

    isRequestsDialogOpen: false,
  },

  reducers: {
    clearError(state) {
      state.error = null;
    },

    // Real-time socket handlers
    addIncomingRequest(state, action) {
      state.incomingRequests.unshift(action.payload);
    },

    removeIncomingRequest(state, action) {
      const connectionId = action.payload;
      state.incomingRequests = state.incomingRequests.filter(
        (req) => req._id !== connectionId
      );
    },

    addAcceptedConnection(state, action) {
      // Avoid duplicates before adding
      const exists = state.acceptedConnections.some(
        (c) => c._id === action.payload._id
      );
      if (!exists) {
        state.acceptedConnections.unshift(action.payload);
      }
    },

    removeAcceptedConnection(state, action) {
      const connectionId = action.payload;
      state.acceptedConnections = state.acceptedConnections.filter(
        (conn) => conn.id !== connectionId
      );
    },

    // ✅ FIX 2: Remove a specific outgoing request by connection _id
    // Used by the socket listener when User B accepts — moves it to accepted on User A's side
    removeOutgoingRequest(state, action) {
      const connectionId = action.payload;
      state.outgoingRequests = state.outgoingRequests.filter(
        (req) => req._id !== connectionId
      );
    },

    openRequestsDialog(state) {
      state.isRequestsDialogOpen = true;
    },

    closeRequestsDialog(state) {
      state.isRequestsDialogOpen = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // ─── Send connection request ───────────────────────────────────────────
      // ✅ FIX 1: action.meta.arg = the recipientId passed to the thunk
      // We key sendingRequests by recipientId so only that card shows "Sending..."
      .addCase(sendConnectionRequest.pending, (state, action) => {
        state.sendingRequests[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        // Clear the loading state for this specific recipient
        delete state.sendingRequests[action.meta.arg];

        if (action.payload.connection?.status === "PENDING") {
          state.outgoingRequests.unshift(action.payload.connection);
        }
        if (action.payload.connection?.status === "ACCEPTED") {
          state.acceptedConnections.unshift(action.payload.connection);
        }
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        delete state.sendingRequests[action.meta.arg];
        state.error = action.payload;
      })

      // ─── Accept connection ─────────────────────────────────────────────────
      .addCase(acceptConnectionRequest.pending, (state) => {
        state.acceptingRequest = true;
        state.error = null;
      })
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        state.acceptingRequest = false;
        const connectionId = action.payload.connection._id;

        state.incomingRequests = state.incomingRequests.filter(
          (req) => req._id !== connectionId
        );

        state.acceptedConnections.unshift({
          id: connectionId,
          connectedAt: action.payload.connection.respondedAt,
        });
      })
      .addCase(acceptConnectionRequest.rejected, (state, action) => {
        state.acceptingRequest = false;
        state.error = action.payload;
      })

      // ─── Reject connection ─────────────────────────────────────────────────
      .addCase(rejectConnectionRequest.pending, (state) => {
        state.rejectingRequest = true;
        state.error = null;
      })
      .addCase(rejectConnectionRequest.fulfilled, (state, action) => {
        state.rejectingRequest = false;
        const connectionId = action.payload.connection._id;

        state.incomingRequests = state.incomingRequests.filter(
          (req) => req._id !== connectionId
        );
      })
      .addCase(rejectConnectionRequest.rejected, (state, action) => {
        state.rejectingRequest = false;
        state.error = action.payload;
      })

      // ─── Remove connection ─────────────────────────────────────────────────
      .addCase(removeConnection.pending, (state) => {
        state.removingConnection = true;
        state.error = null;
      })
      .addCase(removeConnection.fulfilled, (state, action) => {
        state.removingConnection = false;
        const connectionId = action.payload.connectionId;

        state.acceptedConnections = state.acceptedConnections.filter(
          (conn) => conn.id !== connectionId
        );
      })
      .addCase(removeConnection.rejected, (state, action) => {
        state.removingConnection = false;
        state.error = action.payload;
      })

      // ─── Fetch accepted connections ────────────────────────────────────────
      .addCase(fetchAcceptedConnections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAcceptedConnections.fulfilled, (state, action) => {
        state.loading = false;
        state.acceptedConnections = Array.isArray(action.payload)
          ? action.payload
          : action.payload.connections || [];
      })
      .addCase(fetchAcceptedConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── Fetch incoming requests ───────────────────────────────────────────
      .addCase(fetchIncomingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncomingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.incomingRequests = action.payload;
      })
      .addCase(fetchIncomingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── Fetch outgoing requests ───────────────────────────────────────────
      .addCase(fetchOutgoingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOutgoingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.outgoingRequests = action.payload;
      })
      .addCase(fetchOutgoingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── Logout ────────────────────────────────────────────────────────────
      .addCase(logoutUser.fulfilled, (state) => {
        state.acceptedConnections = [];
        state.incomingRequests = [];
        state.outgoingRequests = [];
        state.sendingRequests = {};
        state.error = null;
      });
  },
});

export const {
  clearError,
  addIncomingRequest,
  removeIncomingRequest,
  addAcceptedConnection,
  removeAcceptedConnection,
  removeOutgoingRequest,  // ✅ FIX 2: exported for socket listener usage
  openRequestsDialog,
  closeRequestsDialog,
} = connectionSlice.actions;

export default connectionSlice.reducer;