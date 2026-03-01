import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { logoutUser } from "../authSlice/authSlice";


/* ============================ THUNKS ============================ */

export const sendMessage = createAsyncThunk(
    "messages/send",
    async ({ recipientId, content, replyTo, files = [] }, { rejectWithValue }) => {
        try {
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
        // NOTE: `sending` is kept but NO longer used to disable the send button
        // or show a spinner — it's available if you need it elsewhere.
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
                state.messagesByConversation[conversationId] = { messages: [], hasMore: true, page: 1 };
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
            /* ─── SEND MESSAGE ─── */
            .addCase(sendMessage.pending, (state, action) => {
                state.sending = true;
                state.error = null;

                // Optimistic insert — show message instantly in UI
                const { content, replyTo, conversationId } = action.meta.arg;
                if (!conversationId) return;

                const tempId = `temp_${Date.now()}_${Math.random()}`;
                // Stash tempId so fulfilled/rejected can clean it up
                action.meta.tempId = tempId;

                if (!state.messagesByConversation[conversationId]) {
                    state.messagesByConversation[conversationId] = { messages: [], hasMore: true, page: 1 };
                }

                state.messagesByConversation[conversationId].messages.push({
                    _id: tempId,
                    content: content?.trim() || "",
                    sender: { _id: "ME" },
                    replyTo: replyTo ? { _id: replyTo } : null,
                    attachments: [],
                    createdAt: new Date().toISOString(),
                    readBy: [],
                    _optimistic: true,
                });
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.sending = false;
                const { message, conversationId } = action.payload;
                const convId = conversationId?.toString();

                if (!state.messagesByConversation[convId]) {
                    state.messagesByConversation[convId] = { messages: [], hasMore: true, page: 1 };
                }

                // Remove ALL optimistic messages and replace with the confirmed one.
                // Using filter(_optimistic) means if you spammed 3 messages quickly,
                // each fulfilled response removes only the OLDEST optimistic and inserts
                // the real one — the remaining optimistics stay visible until their own
                // fulfilled events arrive. This is the cleanest approach for spam-send.
                const bucket = state.messagesByConversation[convId];
                const firstOptimisticIdx = bucket.messages.findIndex(m => m._optimistic);
                if (firstOptimisticIdx !== -1) {
                    bucket.messages.splice(firstOptimisticIdx, 1); // remove first optimistic
                }

                // Avoid duplicate if socket already delivered it
                const alreadyExists = bucket.messages.some(m => m._id === message._id);
                if (!alreadyExists) {
                    bucket.messages.push(message);
                }

                // Re-sort just in case (server createdAt may differ slightly)
                bucket.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                const conv = state.conversations.find(c => c.id === convId);
                if (conv) {
                    conv.lastMessage = message;
                    state.conversations = [conv, ...state.conversations.filter(c => c.id !== convId)];
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.sending = false;
                state.error = action.payload;

                // Remove the first optimistic message that failed
                const { conversationId } = action.meta.arg;
                if (conversationId && state.messagesByConversation[conversationId]) {
                    const bucket = state.messagesByConversation[conversationId];
                    const firstOptimisticIdx = bucket.messages.findIndex(m => m._optimistic);
                    if (firstOptimisticIdx !== -1) {
                        bucket.messages.splice(firstOptimisticIdx, 1);
                    }
                }
            })

            /* ─── FETCH MESSAGES ─── */
            .addCase(fetchMessages.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                const { conversationId, messages, hasMore, page } = action.payload;
                if (page === 1) {
                    // Merge: server messages take precedence; keep any optimistic messages
                    const existing = state.messagesByConversation[conversationId]?.messages || [];
                    const optimistics = existing.filter(m => m._optimistic);
                    const map = new Map();
                    messages.forEach(m => map.set(m._id, m));
                    state.messagesByConversation[conversationId] = {
                        messages: [
                            ...Array.from(map.values()).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
                            ...optimistics,
                        ],
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

            /* ─── FETCH CONVERSATIONS ─── */
            .addCase(fetchConversations.pending, (state) => { state.loading = true; })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.loading = false;
                state.conversations = action.payload.map(c => ({
                    ...c,
                    id: c.id?.toString(), // ← ensure string
                }));
            })
            .addCase(fetchConversations.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            /* ─── MARK AS READ ─── */
            .addCase(markAsRead.fulfilled, (state, action) => {
                const conv = state.conversations.find((c) => c.id === action.payload);
                if (conv) conv.unreadCount = 0;
            })

            /* ─── EDIT MESSAGE ─── */
            .addCase(editMessage.fulfilled, (state, action) => {
                const msg = action.payload;
                const bucket = state.messagesByConversation[msg.conversation];
                if (bucket) {
                    const existing = bucket.messages.find((m) => m._id === msg._id);
                    if (existing) { existing.content = msg.content; existing.editedAt = msg.editedAt; }
                }
            })

            /* ─── DELETE FOR ME ─── */
            .addCase(deleteMessageForMe.fulfilled, (state, action) => {
                const { messageId, conversationId } = action.payload;
                const bucket = state.messagesByConversation[conversationId];
                if (bucket) bucket.messages = bucket.messages.filter((m) => m._id !== messageId);
            })

            /* ─── DELETE FOR EVERYONE ─── */
            .addCase(deleteMessageForEveryone.fulfilled, (state, action) => {
                const { messageId, conversationId } = action.payload;
                const bucket = state.messagesByConversation[conversationId];
                if (bucket) {
                    const msg = bucket.messages.find((m) => m._id === messageId);
                    if (msg) { msg.deletedForEveryone = true; msg.content = "This message was deleted"; }
                }
            })

            /* ─── CLEAR CHAT ─── */
            .addCase(clearChat.fulfilled, (state, action) => {
                const conversationId = action.payload;
                state.messagesByConversation[conversationId] = { messages: [], hasMore: false, page: 1 };
                const conv = state.conversations.find((c) => c.id === conversationId);
                if (conv) { conv.lastMessage = null; conv.unreadCount = 0; }
            })

            /* ─── LOGOUT ─── */
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