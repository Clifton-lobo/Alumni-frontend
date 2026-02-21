import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* ============================ THUNKS ============================ */

export const sendMessage = createAsyncThunk(
  "messages/send",
  async ({ recipientId, content, replyTo }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/user/message/send", { recipientId, content, replyTo });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send message");
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "messages/fetch",
  async ({ conversationId, page = 1, limit = 30 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/user/message/${conversationId}`, {
        params: { page, limit },
      });
      return { ...res.data, conversationId, page };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch messages");
    }
  }
);

export const fetchConversations = createAsyncThunk(
  "messages/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/user/message/conversations");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch conversations");
    }
  }
);

export const markAsRead = createAsyncThunk(
  "messages/markAsRead",
  async (conversationId, { rejectWithValue }) => {
    try {
      await axiosInstance.patch(`/api/user/message/${conversationId}/read`);
      return conversationId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to mark as read");
    }
  }
);

export const editMessage = createAsyncThunk(
  "messages/edit",
  async ({ messageId, content }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/api/user/message/${messageId}/edit`, { content });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to edit message");
    }
  }
);

export const deleteMessageForMe = createAsyncThunk(
  "messages/deleteForMe",
  async ({ messageId, conversationId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/user/message/${messageId}/me`);
      return { messageId, conversationId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete message");
    }
  }
);

export const deleteMessageForEveryone = createAsyncThunk(
  "messages/deleteForEveryone",
  async ({ messageId, conversationId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/user/message/${messageId}/everyone`);
      return { messageId, conversationId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete message");
    }
  }
);

export const clearChat = createAsyncThunk(
  "messages/clearChat",
  async (conversationId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/user/message/${conversationId}/clear`);
      return conversationId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to clear chat");
    }
  }
);

export const sendTypingIndicator = createAsyncThunk(
  "messages/typing",
  async ({ conversationId, isTyping }, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`/api/user/message/${conversationId}/typing`, { isTyping });
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

/* ============================ SLICE ============================ */

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    // conversationId → { messages: [], hasMore: true, page: 1 }
    messagesByConversation: {},
    conversations: [],
    activeConversationId: null,
    // conversationId → userId
    typingUsers: {},
    loading: false,
    sending: false,
    error: null,
  },

  reducers: {
    setActiveConversation(state, action) {
      state.activeConversationId = action.payload;
    },

    // Socket: incoming message from another user
    receiveMessage(state, action) {
      const { conversationId, message } = action.payload;
      const bucket = state.messagesByConversation[conversationId];
      if (bucket) {
        // Prevent duplicate (race between REST and socket)
        const exists = bucket.messages.some((m) => m._id === message._id);
        if (!exists) bucket.messages.push(message);
      }
      // Update last message in conversations list
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv) {
        conv.lastMessage = message;
        conv.unreadCount = (conv.unreadCount || 0) + 1;
        // Bubble to top
        state.conversations = [
          conv,
          ...state.conversations.filter((c) => c.id !== conversationId),
        ];
      }
    },

    // Socket: other user edited a message
    receiveEditedMessage(state, action) {
      const { conversationId, messageId, newContent, editedAt } = action.payload;
      const bucket = state.messagesByConversation[conversationId];
      if (bucket) {
        const msg = bucket.messages.find((m) => m._id === messageId);
        if (msg) {
          msg.content = newContent;
          msg.editedAt = editedAt;
        }
      }
    },

    // Socket: other user deleted a message for everyone
    receiveDeletedMessage(state, action) {
      const { conversationId, messageId } = action.payload;
      const bucket = state.messagesByConversation[conversationId];
      if (bucket) {
        const msg = bucket.messages.find((m) => m._id === messageId);
        if (msg) {
          msg.deletedForEveryone = true;
          msg.content = "This message was deleted";
        }
      }
    },

    // Socket: read receipt
    receiveReadReceipt(state, action) {
      const { conversationId } = action.payload;
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv) conv.unreadCount = 0;
    },

    // Socket: typing indicator
    setTypingUser(state, action) {
      const { conversationId, userId, isTyping } = action.payload;
      if (isTyping) {
        state.typingUsers[conversationId] = userId;
      } else {
        delete state.typingUsers[conversationId];
      }
    },

    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Send message
      .addCase(sendMessage.pending, (state) => { state.sending = true; state.error = null; })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        const { message, conversationId } = action.payload;
        if (!state.messagesByConversation[conversationId]) {
          state.messagesByConversation[conversationId] = { messages: [], hasMore: true, page: 1 };
        }
        state.messagesByConversation[conversationId].messages.push(message);
        // Update conversation list
        const conv = state.conversations.find((c) => c.id === conversationId);
        if (conv) {
          conv.lastMessage = message;
          state.conversations = [conv, ...state.conversations.filter((c) => c.id !== conversationId)];
        }
      })
      .addCase(sendMessage.rejected, (state, action) => { state.sending = false; state.error = action.payload; })

      // Fetch messages (paginated)
      .addCase(fetchMessages.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { conversationId, messages, hasMore, page } = action.payload;
        if (!state.messagesByConversation[conversationId] || page === 1) {
          state.messagesByConversation[conversationId] = { messages, hasMore, page };
        } else {
          // Prepend older messages (pagination going back in time)
          state.messagesByConversation[conversationId].messages = [
            ...messages,
            ...state.messagesByConversation[conversationId].messages,
          ];
          state.messagesByConversation[conversationId].hasMore = hasMore;
          state.messagesByConversation[conversationId].page = page;
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => { state.loading = true; })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const conv = state.conversations.find((c) => c.id === action.payload);
        if (conv) conv.unreadCount = 0;
      })

      // Edit message
      .addCase(editMessage.fulfilled, (state, action) => {
        const msg = action.payload;
        const bucket = state.messagesByConversation[msg.conversation];
        if (bucket) {
          const existing = bucket.messages.find((m) => m._id === msg._id);
          if (existing) {
            existing.content = msg.content;
            existing.editedAt = msg.editedAt;
          }
        }
      })

      // Delete for me
      .addCase(deleteMessageForMe.fulfilled, (state, action) => {
        const { messageId, conversationId } = action.payload;
        const bucket = state.messagesByConversation[conversationId];
        if (bucket) {
          bucket.messages = bucket.messages.filter((m) => m._id !== messageId);
        }
      })

      // Delete for everyone
      .addCase(deleteMessageForEveryone.fulfilled, (state, action) => {
        const { messageId, conversationId } = action.payload;
        const bucket = state.messagesByConversation[conversationId];
        if (bucket) {
          const msg = bucket.messages.find((m) => m._id === messageId);
          if (msg) {
            msg.deletedForEveryone = true;
            msg.content = "This message was deleted";
          }
        }
      })

      // Clear chat
      .addCase(clearChat.fulfilled, (state, action) => {
        const conversationId = action.payload;
        state.messagesByConversation[conversationId] = { messages: [], hasMore: false, page: 1 };
        const conv = state.conversations.find((c) => c.id === conversationId);
        if (conv) { conv.lastMessage = null; conv.unreadCount = 0; }
      });
  },
});

export const {
  setActiveConversation,
  receiveMessage,
  receiveEditedMessage,
  receiveDeletedMessage,
  receiveReadReceipt,
  setTypingUser,
  clearError,
} = messageSlice.actions;

export default messageSlice.reducer;