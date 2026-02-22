import { useEffect } from "react";
import { connectSocket } from "./socket/socket";
import { useDispatch, useSelector } from "react-redux";
import store from "./src/store/store"; // ← import your Redux store
import {
  addIncomingRequest,
  removeIncomingRequest,
  addAcceptedConnection,
  removeAcceptedConnection,
} from "./src/store/user-view/ConnectionSlice";
import {
  receiveMessage,
  receiveEditedMessage,
  receiveDeletedMessage,
  receiveReadReceipt,
  fetchConversations,
  markAsRead, // ← from MessageSlice, not backend
} from "./src/store/user-view/MessageSlice";

function SocketInitializer() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(s => s.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchConversations());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = connectSocket(); // no token needed
    if (!socket) return;

    const registerListeners = () => {
      socket.on("connection_request", (data) => dispatch(addIncomingRequest(data)));
      socket.on("connection_accepted", (data) => dispatch(addAcceptedConnection(data)));
      socket.on("connection_rejected", (data) => dispatch(removeIncomingRequest(data.connectionId)));
      socket.on("connection_removed", (data) => dispatch(removeAcceptedConnection(data.connectionId)));

      // ── Single handler for new_message ──
      socket.on("new_message", (data) => {
        console.log("🔴 SOCKET new_message received:", data);

        dispatch(receiveMessage(data));

        const state = store.getState();
        const activeId = state.messages.activeConversationId;
        if (activeId && activeId === data.conversationId?.toString()) {
          dispatch(markAsRead(data.conversationId));
        }
      });

      socket.on("message_edited", (data) => dispatch(receiveEditedMessage(data)));
      socket.on("message_deleted", (data) => dispatch(receiveDeletedMessage(data)));
      socket.on("messages_read", (data) => dispatch(receiveReadReceipt(data)));
    };

    if (socket.connected) {
      registerListeners();
    } else {
      socket.on("connect", registerListeners);
    }

    return () => {
      socket.off("connect", registerListeners);
      socket.off("connection_request");
      socket.off("connection_accepted");
      socket.off("connection_rejected");
      socket.off("connection_removed");
      socket.off("new_message");
      socket.off("message_edited");
      socket.off("message_deleted");
      socket.off("messages_read");
    };
  }, [isAuthenticated, dispatch]);

  return null;
}

export default SocketInitializer;