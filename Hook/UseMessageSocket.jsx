import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  receiveMessage,
  receiveEditedMessage,
  receiveDeletedMessage,
  receiveReadReceipt,
} from "../src/store/user-view/MessageSlice"; // ← adjust path

/**
 * useMessageSocket
 * 
 * Plug this into your top-level authenticated layout (e.g. UserLayout or App.jsx)
 * so socket events are captured globally — not just when the user is on /messages.
 * 
 * Usage:
 *   import useMessageSocket from "../hooks/useMessageSocket";
 *   const socket = useSelector(s => s.socket.instance); // or however you store it
 *   useMessageSocket(socket);
 */
const useMessageSocket = (socket) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    // ── Incoming new message ──────────────────────────
    const onNewMessage = (data) => {
      // data = { conversationId, message }
      dispatch(receiveMessage(data));
    };

    // ── Someone edited a message ──────────────────────
    const onMessageEdited = (data) => {
      // data = { conversationId, messageId, newContent, editedAt }
      dispatch(receiveEditedMessage(data));
    };

    // ── Someone deleted a message for everyone ────────
    const onMessageDeleted = (data) => {
      // data = { conversationId, messageId }
      dispatch(receiveDeletedMessage(data));
    };

    // ── Read receipt ──────────────────────────────────
    const onMessagesRead = (data) => {
      // data = { conversationId, readBy, readAt }
      dispatch(receiveReadReceipt(data));
    };

    socket.on("new_message",     onNewMessage);
    socket.on("message_edited",  onMessageEdited);
    socket.on("message_deleted", onMessageDeleted);
    socket.on("messages_read",   onMessagesRead);

    return () => {
      socket.off("new_message",     onNewMessage);
      socket.off("message_edited",  onMessageEdited);
      socket.off("message_deleted", onMessageDeleted);
      socket.off("messages_read",   onMessagesRead);
    };
  }, [socket, dispatch]);
};

export default useMessageSocket;