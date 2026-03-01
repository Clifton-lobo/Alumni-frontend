import { useEffect } from "react";
import { connectSocket } from "./socket/socket";
import { useDispatch, useSelector } from "react-redux";
import store from "./src/store/store";
import {
  addIncomingRequest,
  removeIncomingRequest,
  addAcceptedConnection,
  removeAcceptedConnection,
  removeOutgoingRequest,
} from "./src/store/user-view/ConnectionSlice";
import {
  receiveMessage,
  receiveEditedMessage,
  receiveDeletedMessage,
  receiveReadReceipt,
  fetchConversations,
  markAsRead,
} from "./src/store/user-view/MessageSlice";

function SocketInitializer() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  const currentUserId = user?.id?.toString() ?? user?._id?.toString();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchConversations());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = connectSocket();
    if (!socket) return;

    const registerListeners = () => {

      // ── FIX: event names changed from underscore → colon style ──────────
      // These must match what the backend controller emits exactly.

      // Someone sent YOU a request
      // payload: { connection: <populated doc> }
      socket.on("connection:request", ({ connection }) => {
        if (connection) dispatch(addIncomingRequest(connection));
      });

      // Someone ACCEPTED your request (you are the requester)
      // payload: { connection: <populated doc> }
      socket.on("connection:accepted", ({ connection }) => {
        if (!connection) return;

        // Remove from outgoing pending list
        dispatch(removeOutgoingRequest(connection._id));

        // Normalise to { _id, user: <other party>, connectedAt }
        // For the requester (User A), the other party is the recipient
        const requesterId =
          connection.requester?._id?.toString() ?? connection.requester?.toString();

        const normalised = {
          _id: connection._id,
          user:
            requesterId === currentUserId
              ? connection.recipient  // I sent the request → other is recipient
              : connection.requester, // fallback
          connectedAt: connection.respondedAt ?? new Date().toISOString(),
        };

        dispatch(addAcceptedConnection(normalised));
      });

      // Someone REJECTED your request
      // payload: { connectionId, by }
      socket.on("connection:rejected", ({ connectionId }) => {
        if (connectionId) dispatch(removeOutgoingRequest(connectionId));
      });

      // Someone REMOVED an accepted connection
      // payload: { connectionId, by }
      socket.on("connection:removed", ({ connectionId }) => {
        if (connectionId) dispatch(removeAcceptedConnection(connectionId));
      });

      // ── Messages (unchanged) ─────────────────────────────────────────────
      socket.on("new_message", (data) => {
        console.log("🔴 SOCKET new_message received:", data);
        dispatch(receiveMessage(data));

        const state = store.getState();
        const activeId = state.messages.activeConversationId;
        if (activeId && activeId === data.conversationId?.toString()) {
          dispatch(markAsRead(data.conversationId));
        }
      });

      socket.on("message_edited",  (data) => dispatch(receiveEditedMessage(data)));
      socket.on("message_deleted", (data) => dispatch(receiveDeletedMessage(data)));
      socket.on("messages_read",   (data) => dispatch(receiveReadReceipt(data)));
    };

    if (socket.connected) {
      registerListeners();
    } else {
      socket.on("connect", registerListeners);
    }

    return () => {
      socket.off("connect",            registerListeners);
      socket.off("connection:request");
      socket.off("connection:accepted");
      socket.off("connection:rejected");
      socket.off("connection:removed");
      socket.off("new_message");
      socket.off("message_edited");
      socket.off("message_deleted");
      socket.off("messages_read");
    };
  }, [isAuthenticated, dispatch, currentUserId]);

  return null;
}

export default SocketInitializer;