import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { logoutUser } from "../authSlice/authSlice";

/* ============================
   ASYNC THUNKS
============================ */

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

export const fetchAcceptedConnections = createAsyncThunk(
  "connections/fetchAccepted",
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/user/connect/accept", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch connections"
      );
    }
  }
);

export const removeConnection = createAsyncThunk(
  "connections/remove",
  async (connectionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/api/user/connect/${connectionId}`
      );
      return { connectionId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove connection"
      );
    }
  }
);

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
   HELPERS
============================ */

// Normalise a raw populated Connection document into the shape stored in
// acceptedConnections: { _id, user: <other party's full object>, connectedAt }
//
// The "other party" depends on who the current viewer is:
//   - For the ACCEPTOR  → other party is the requester
//   - For the REQUESTER → other party is the recipient (used in socket handler)
//
// When we only have the connection object from the accept response we always
// treat `requester` as the other party from the acceptor's perspective.
const normaliseAccepted = (conn, currentUserId) => {
  if (!conn) return null;

  // Determine the other party. conn.requester / conn.recipient may be a full
  // populated object or just an ID string depending on call site.
  const requesterId =
    conn.requester?._id?.toString() ?? conn.requester?.toString();
  const recipientId =
    conn.recipient?._id?.toString() ?? conn.recipient?.toString();

  const otherParty =
    currentUserId && requesterId === currentUserId
      ? conn.recipient   // I am the requester → other is recipient
      : conn.requester;  // I am the acceptor  → other is requester

  return {
    _id: conn._id,
    user: otherParty ?? null,  // full populated user object (or null as fallback)
    connectedAt: conn.respondedAt ?? conn.connectedAt ?? new Date().toISOString(),
  };
};

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

    // Per-user loading map — { [recipientId]: true }
    // Only the clicked card shows "Sending…" instead of all cards
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

    // ── Real-time socket reducers ──────────────────────────────────────────

    addIncomingRequest(state, action) {
      // action.payload = full populated Connection document
      const exists = state.incomingRequests.some(
        (r) => r._id === action.payload._id
      );
      if (!exists) state.incomingRequests.unshift(action.payload);
    },

    removeIncomingRequest(state, action) {
      // action.payload = connectionId string
      state.incomingRequests = state.incomingRequests.filter(
        (req) => req._id?.toString() !== action.payload?.toString()
      );
    },

    // Used by socket "connection:accepted" on User A's side:
    // move the outgoing request → accepted connections with full user object
    addAcceptedConnection(state, action) {
      // action.payload = full populated Connection document
      // We store it in normalised shape; currentUserId not available here so
      // the socket handler should dispatch normaliseAccepted manually OR we
      // detect which party we are from the payload.
      const conn = action.payload;
      const exists = state.acceptedConnections.some(
        (c) => c._id?.toString() === conn._id?.toString()
      );
      if (!exists) {
        // Store as-is if already normalised ({ _id, user, connectedAt }),
        // otherwise store raw — getConnectionStatus handles both shapes.
        state.acceptedConnections.unshift(conn);
      }
    },

    removeAcceptedConnection(state, action) {
      // action.payload = connectionId string
      state.acceptedConnections = state.acceptedConnections.filter(
        (conn) => conn._id?.toString() !== action.payload?.toString()
      );
    },

    // Used by socket "connection:accepted" on User A's side to clean outgoing list
    removeOutgoingRequest(state, action) {
      // action.payload = connectionId string
      state.outgoingRequests = state.outgoingRequests.filter(
        (req) => req._id?.toString() !== action.payload?.toString()
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
      // ─── Send connection request ─────────────────────────────────────────
      .addCase(sendConnectionRequest.pending, (state, action) => {
        state.sendingRequests[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        delete state.sendingRequests[action.meta.arg];

        const conn = action.payload.connection;
        if (!conn) return;

        if (conn.status === "PENDING") {
          // Avoid duplicates
          const exists = state.outgoingRequests.some(
            (r) => r._id?.toString() === conn._id?.toString()
          );
          if (!exists) state.outgoingRequests.unshift(conn);
        }

        if (conn.status === "ACCEPTED") {
          // Auto-accepted (was a reverse pending) — normalise and store
          const normalised = {
            _id: conn._id,
            user: conn.recipient ?? null,  // sender is requester → other is recipient
            connectedAt: conn.respondedAt,
          };
          const exists = state.acceptedConnections.some(
            (c) => c._id?.toString() === conn._id?.toString()
          );
          if (!exists) state.acceptedConnections.unshift(normalised);
        }
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        delete state.sendingRequests[action.meta.arg];
        state.error = action.payload;
      })

      // ─── Accept connection ───────────────────────────────────────────────
      .addCase(acceptConnectionRequest.pending, (state) => {
        state.acceptingRequest = true;
        state.error = null;
      })
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        state.acceptingRequest = false;

        const conn = action.payload.connection;
        if (!conn) return;

        const connectionId = conn._id?.toString();

        // Remove from incoming requests
        state.incomingRequests = state.incomingRequests.filter(
          (req) => req._id?.toString() !== connectionId
        );

        // FIX: store a normalised entry with the full requester object so
        // getConnectionStatus (which checks c.user?._id) can find it immediately
        // without requiring a page refresh.
        // The acceptor's "other party" is always the requester.
        const normalised = {
          _id: conn._id,
          user: conn.requester ?? null,   // ← full populated object from backend
          connectedAt: conn.respondedAt ?? new Date().toISOString(),
        };

        const alreadyExists = state.acceptedConnections.some(
          (c) => c._id?.toString() === connectionId
        );
        if (!alreadyExists) {
          state.acceptedConnections.unshift(normalised);
        }
      })
      .addCase(acceptConnectionRequest.rejected, (state, action) => {
        state.acceptingRequest = false;
        state.error = action.payload;
      })

      // ─── Reject connection ───────────────────────────────────────────────
      .addCase(rejectConnectionRequest.pending, (state) => {
        state.rejectingRequest = true;
        state.error = null;
      })
      .addCase(rejectConnectionRequest.fulfilled, (state, action) => {
        state.rejectingRequest = false;
        const connectionId = action.payload.connection?._id?.toString();
        if (!connectionId) return;

        state.incomingRequests = state.incomingRequests.filter(
          (req) => req._id?.toString() !== connectionId
        );
      })
      .addCase(rejectConnectionRequest.rejected, (state, action) => {
        state.rejectingRequest = false;
        state.error = action.payload;
      })

      // ─── Remove connection ───────────────────────────────────────────────
      .addCase(removeConnection.pending, (state) => {
        state.removingConnection = true;
        state.error = null;
      })
      .addCase(removeConnection.fulfilled, (state, action) => {
        state.removingConnection = false;
        const connectionId = action.payload.connectionId?.toString();
        if (!connectionId) return;

        // FIX: was `conn.id` (undefined) — now uses `conn._id` consistently
        state.acceptedConnections = state.acceptedConnections.filter(
          (conn) => conn._id?.toString() !== connectionId
        );
      })
      .addCase(removeConnection.rejected, (state, action) => {
        state.removingConnection = false;
        state.error = action.payload;
      })

      // ─── Fetch accepted connections ──────────────────────────────────────
      .addCase(fetchAcceptedConnections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAcceptedConnections.fulfilled, (state, action) => {
        state.loading = false;
        // Backend now returns { _id, user, connectedAt }[] — store directly
        state.acceptedConnections = Array.isArray(action.payload)
          ? action.payload
          : action.payload.connections || [];
      })
      .addCase(fetchAcceptedConnections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── Fetch incoming requests ─────────────────────────────────────────
      .addCase(fetchIncomingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncomingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.incomingRequests = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchIncomingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── Fetch outgoing requests ─────────────────────────────────────────
      .addCase(fetchOutgoingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOutgoingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.outgoingRequests = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchOutgoingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ─── Logout ──────────────────────────────────────────────────────────
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
  removeOutgoingRequest,
  openRequestsDialog,
  closeRequestsDialog,
} = connectionSlice.actions;

export default connectionSlice.reducer;