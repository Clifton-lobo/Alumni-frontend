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

    // Separate loading states for different actions
    sendingRequest: false,
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
        req => req._id !== connectionId
      );
    },

    addAcceptedConnection(state, action) {
      state.acceptedConnections.unshift(action.payload);
    },

    removeAcceptedConnection(state, action) {
      const connectionId = action.payload;
      state.acceptedConnections = state.acceptedConnections.filter(
        conn => conn.id !== connectionId
      );
    },
    openRequestsDialog: (state) => {
      state.isRequestsDialogOpen = true;
    },
    closeRequestsDialog: (state) => {
      state.isRequestsDialogOpen = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // Send connection request
      .addCase(sendConnectionRequest.pending, (state) => {
        state.sendingRequest = true;
        state.error = null;
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.sendingRequest = false;
        // Add to outgoing if it's a new pending request
        if (action.payload.connection?.status === "PENDING") {
          state.outgoingRequests.unshift(action.payload.connection);
        }
        // If auto-accepted, add to accepted connections
        if (action.payload.connection?.status === "ACCEPTED") {
          state.acceptedConnections.unshift(action.payload.connection);

        }
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        state.sendingRequest = false;
        state.error = action.payload;
      })

      // Accept connection
      .addCase(acceptConnectionRequest.pending, (state) => {
        state.acceptingRequest = true;
        state.error = null;
      })
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        state.acceptingRequest = false;
        const connectionId = action.payload.connection._id;

        // Remove from incoming
        state.incomingRequests = state.incomingRequests.filter(
          req => req._id !== connectionId
        );

        // Add to accepted
        state.acceptedConnections.unshift({
          id: connectionId,
          connectedAt: action.payload.connection.respondedAt,
        });
      })
      .addCase(acceptConnectionRequest.rejected, (state, action) => {
        state.acceptingRequest = false;
        state.error = action.payload;
      })

      // Reject connection
      .addCase(rejectConnectionRequest.pending, (state) => {
        state.rejectingRequest = true;
        state.error = null;
      })
      .addCase(rejectConnectionRequest.fulfilled, (state, action) => {
        state.rejectingRequest = false;
        const connectionId = action.payload.connection._id;

        // Remove from incoming
        state.incomingRequests = state.incomingRequests.filter(
          req => req._id !== connectionId
        );
      })
      .addCase(rejectConnectionRequest.rejected, (state, action) => {
        state.rejectingRequest = false;
        state.error = action.payload;
      })

      // Remove connection
      .addCase(removeConnection.pending, (state) => {
        state.removingConnection = true;
        state.error = null;
      })
      .addCase(removeConnection.fulfilled, (state, action) => {
        state.removingConnection = false;
        const connectionId = action.payload.connectionId;

        state.acceptedConnections = state.acceptedConnections.filter(
          conn => conn.id !== connectionId
        );
      })
      .addCase(removeConnection.rejected, (state, action) => {
        state.removingConnection = false;
        state.error = action.payload;
      })

      // Fetch accepted connections
      .addCase(fetchAcceptedConnections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAcceptedConnections.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure consistent structure
        state.acceptedConnections = Array.isArray(action.payload)
          ? action.payload
          : action.payload.connections || [];
      })

      .addCase(fetchAcceptedConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch incoming requests
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

      // Fetch outgoing requests
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
      .addCase(logoutUser.fulfilled, (state) => {
        state.acceptedConnections = [];
        state.incomingRequests = [];
        state.outgoingRequests = [];
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
  openRequestsDialog,
  closeRequestsDialog,
} = connectionSlice.actions;

export default connectionSlice.reducer;