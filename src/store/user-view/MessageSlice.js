import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { logoutUser } from "../authSlice/authSlice";


/* ============================ THUNKS ============================ */

export const sendMessage = createAsyncThunk(
    "messages/send",
    async ({ recipientId, content, replyTo, files = [] }, { rejectWithValue }) => {
        try {
            // Always use FormData so multer can parse files + fields together
            const formData = new FormData();
            formData.append("recipientId", recipientId);
            if (content?.trim()) formData.append("content", content.trim());
            if (replyTo) formData.append("replyTo", replyTo);
            files.forEach(file => formData.append("files", file));

            const res = await axiosInstance.post("/api/user/message/send", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
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
        messagesByConversation: {},
        conversations: [],
        activeConversationId: null,
        typingUsers: {},
        loading: false,
        sending: false,
        error: null,
    },

    reducers: {
        setActiveConversation(state, action) {
            state.activeConversationId = action.payload ?? null;
        },

        receiveMessage(state, action) {
            const conversationId = action.payload.conversationId?.toString();
            const { message } = action.payload;

            if (!state.messagesByConversation[conversationId]) {
                state.messagesByConversation[conversationId] = {
                    messages: [], hasMore: true, page: 1,
                };
            }

            const bucket = state.messagesByConversation[conversationId];
            const exists = bucket.messages.some((m) => m._id === message._id);
            if (!exists) bucket.messages.push(message);

            const existingIndex = state.conversations.findIndex((c) => c.id === conversationId);
            if (existingIndex !== -1) {
                const conv = state.conversations[existingIndex];
                conv.lastMessage = message;
                if (state.activeConversationId !== conversationId) {
                    conv.unreadCount = (conv.unreadCount || 0) + 1;
                }
                state.conversations.splice(existingIndex, 1);
                state.conversations.unshift(conv);
            } else {
                state.conversations.unshift({
                    id: conversationId,
                    lastMessage: message,
                    unreadCount: state.activeConversationId === conversationId ? 0 : 1,
                });
            }
        },

        receiveEditedMessage(state, action) {
            const { conversationId, messageId, newContent, editedAt } = action.payload;
            const bucket = state.messagesByConversation[conversationId];
            if (bucket) {
                const msg = bucket.messages.find((m) => m._id === messageId);
                if (msg) { msg.content = newContent; msg.editedAt = editedAt; }
            }
        },

        receiveDeletedMessage(state, action) {
            const { conversationId, messageId } = action.payload;
            const bucket = state.messagesByConversation[conversationId];
            if (bucket) {
                const msg = bucket.messages.find((m) => m._id === messageId);
                if (msg) { msg.deletedForEveryone = true; msg.content = "This message was deleted"; }
            }
        },

        receiveReadReceipt(state, action) {
            const { conversationId } = action.payload;
            const conv = state.conversations.find((c) => c.id === conversationId);
            if (conv) conv.unreadCount = 0;
        },

        setTypingUser(state, action) {
            const { conversationId, userId, isTyping } = action.payload;
            if (isTyping) state.typingUsers[conversationId] = userId;
            else delete state.typingUsers[conversationId];
        },

        clearError(state) { state.error = null; },
    },

    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state) => { state.sending = true; state.error = null; })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.sending = false;
                const { message, conversationId } = action.payload;
                const convId = conversationId?.toString();
                if (!state.messagesByConversation[convId]) {
                    state.messagesByConversation[convId] = { messages: [], hasMore: true, page: 1 };
                }
                state.messagesByConversation[convId].messages.push(message);
                const conv = state.conversations.find((c) => c.id === convId);
                if (conv) {
                    conv.lastMessage = message;
                    state.conversations = [conv, ...state.conversations.filter((c) => c.id !== convId)];
                }
            })
            .addCase(sendMessage.rejected, (state, action) => { state.sending = false; state.error = action.payload; })

            .addCase(fetchMessages.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                const { conversationId, messages, hasMore, page } = action.payload;
                if (page === 1) {
                    const existing = state.messagesByConversation[conversationId]?.messages || [];
                    const map = new Map();
                    messages.forEach(m => map.set(m._id, m));
                    existing.forEach(m => { if (!map.has(m._id)) map.set(m._id, m); });
                    state.messagesByConversation[conversationId] = {
                        messages: Array.from(map.values()).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
                        hasMore,
                        page,
                    };
                } else {
                    state.messagesByConversation[conversationId].messages = [
                        ...messages,
                        ...state.messagesByConversation[conversationId].messages,
                    ];
                    state.messagesByConversation[conversationId].hasMore = hasMore;
                    state.messagesByConversation[conversationId].page = page;
                }
            })
            .addCase(fetchMessages.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(fetchConversations.pending, (state) => { state.loading = true; })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.loading = false;
                // REPLACE entirely — don't merge with stale state
                state.conversations = action.payload;
            })
            .addCase(fetchConversations.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(markAsRead.fulfilled, (state, action) => {
                const conv = state.conversations.find((c) => c.id === action.payload);
                if (conv) conv.unreadCount = 0;
            })

            .addCase(editMessage.fulfilled, (state, action) => {
                const msg = action.payload;
                const bucket = state.messagesByConversation[msg.conversation];
                if (bucket) {
                    const existing = bucket.messages.find((m) => m._id === msg._id);
                    if (existing) { existing.content = msg.content; existing.editedAt = msg.editedAt; }
                }
            })

            .addCase(deleteMessageForMe.fulfilled, (state, action) => {
                const { messageId, conversationId } = action.payload;
                const bucket = state.messagesByConversation[conversationId];
                if (bucket) bucket.messages = bucket.messages.filter((m) => m._id !== messageId);
            })

            .addCase(deleteMessageForEveryone.fulfilled, (state, action) => {
                const { messageId, conversationId } = action.payload;
                const bucket = state.messagesByConversation[conversationId];
                if (bucket) {
                    const msg = bucket.messages.find((m) => m._id === messageId);
                    if (msg) { msg.deletedForEveryone = true; msg.content = "This message was deleted"; }
                }
            })

            .addCase(clearChat.fulfilled, (state, action) => {
                const conversationId = action.payload;
                state.messagesByConversation[conversationId] = { messages: [], hasMore: false, page: 1 };
                const conv = state.conversations.find((c) => c.id === conversationId);
                if (conv) { conv.lastMessage = null; conv.unreadCount = 0; }
            })
            .addCase(logoutUser.fulfilled, () => ({
                messagesByConversation: {},
                conversations: [],
                activeConversationId: null,
                typingUsers: {},
                loading: false,
                sending: false,
                error: null,
            }));
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