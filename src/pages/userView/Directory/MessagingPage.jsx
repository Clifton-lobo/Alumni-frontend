import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Search, MoreVertical, ArrowLeft, Pencil, Trash2,
  Check, CheckCheck, Reply, X, MessageSquare, Loader2,
  ChevronDown
} from "lucide-react";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  markAsRead,
  editMessage,
  deleteMessageForMe,
  deleteMessageForEveryone,
  setActiveConversation,
  receiveMessage,
  receiveEditedMessage,
  receiveDeletedMessage,
  receiveReadReceipt,
} from "../../../store/user-view/MessageSlice"; // ← adjust path

/* ─── Brand tokens (match your existing navbar) ─── */
const BLUE = "#142A5D";
const GOLD = "#F2A20A";

/* ══════════════════════════════════════════════════
   UTILS
══════════════════════════════════════════════════ */
const formatTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

const groupMessagesByDate = (messages) => {
  const groups = [];
  let currentDate = null;
  messages.forEach((msg) => {
    const msgDate = formatDate(msg.createdAt);
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groups.push({ type: "date", label: msgDate });
    }
    groups.push({ type: "message", data: msg });
  });
  return groups;
};

/* ══════════════════════════════════════════════════
   AVATAR
══════════════════════════════════════════════════ */
const Avatar = ({ user, size = "md" }) => {
  const sizeMap = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  const cls = sizeMap[size];
  if (user?.profileImage) {
    return <img src={user.profileImage} alt={user.fullname} className={`${cls} rounded-full object-cover flex-shrink-0`} />;
  }
  return (
    <div className={`${cls} rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-white`}
      style={{ background: `linear-gradient(135deg, ${BLUE}, #2a4a8f)` }}>
      {user?.fullname?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "?"}
    </div>
  );
};

/* ══════════════════════════════════════════════════
   CONVERSATION LIST ITEM
══════════════════════════════════════════════════ */
const ConversationItem = ({ conv, isActive, onClick }) => {
  const hasUnread = conv.unreadCount > 0;
  const lastMsg = conv.lastMessage;
  const preview = lastMsg?.deletedForEveryone
    ? "This message was deleted"
    : lastMsg?.content || "Start a conversation";

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all relative
        ${isActive ? "bg-blue-50" : "hover:bg-gray-50"}`}
    >
      {isActive && <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full" style={{ background: GOLD }} />}

      <Avatar user={conv.otherUser} size="md" />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <span className={`text-sm font-semibold truncate ${hasUnread ? "text-gray-900" : "text-gray-700"}`}>
            {conv.otherUser?.fullname || conv.otherUser?.username}
          </span>
          <span className="text-[10px] text-gray-400 ml-2 flex-shrink-0">
            {formatTime(lastMsg?.createdAt)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-0.5">
          <p className={`text-xs truncate max-w-[160px] ${hasUnread ? "text-gray-700 font-medium" : "text-gray-400"} ${lastMsg?.deletedForEveryone ? "italic" : ""}`}>
            {preview}
          </p>
          {hasUnread && (
            <span className="ml-2 min-w-[18px] h-[18px] rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1 flex-shrink-0"
              style={{ background: GOLD }}>
              {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
};

/* ══════════════════════════════════════════════════
   MESSAGE BUBBLE
══════════════════════════════════════════════════ */
const MessageBubble = ({ msg, isMine, onReply, onEdit, onDeleteMe, onDeleteEveryone }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const isDeleted = msg.deletedForEveryone;
  const isEdited = !!msg.editedAt;

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex ${isMine ? "justify-end" : "justify-start"} group mb-1`}
    >
      <div className={`flex items-end gap-2 max-w-[70%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
        {!isMine && <Avatar user={msg.sender} size="sm" />}

        <div className="relative">
          {/* Reply preview */}
          {msg.replyTo && !msg.replyTo.deletedForEveryone && (
            <div className={`text-xs px-3 py-1.5 rounded-t-xl mb-0.5 border-l-2 ${isMine ? "bg-blue-900/30 border-white/50 text-blue-100 rounded-l-xl" : "bg-gray-200 border-gray-400 text-gray-600 rounded-r-xl"}`}>
              <p className="font-semibold truncate">{msg.replyTo.sender?.fullname || "User"}</p>
              <p className="truncate opacity-75">{msg.replyTo.content}</p>
            </div>
          )}

          <div className={`relative px-4 py-2.5 rounded-2xl text-sm shadow-sm
            ${isMine
              ? "text-white rounded-br-sm"
              : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
            }
            ${isDeleted ? "italic opacity-60" : ""}
          `}
            style={isMine ? { background: `linear-gradient(135deg, ${BLUE}, #1e3d7a)` } : {}}
          >
            {isDeleted ? (
              <span className="flex items-center gap-1.5 text-xs">
                <Trash2 className="w-3 h-3" /> This message was deleted
              </span>
            ) : (
              <>
                <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                <div className={`flex items-center gap-1.5 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
                  {isEdited && <span className="text-[10px] opacity-60">edited</span>}
                  <span className={`text-[10px] ${isMine ? "text-blue-200" : "text-gray-400"}`}>
                    {formatTime(msg.createdAt)}
                  </span>
                  {isMine && (
                    msg.readBy?.length > 0
                      ? <CheckCheck className="w-3 h-3 text-blue-300" />
                      : <Check className="w-3 h-3 text-blue-300" />
                  )}
                </div>
              </>
            )}
          </div>

          {/* Action button (hover) */}
          {!isDeleted && (
            <div ref={menuRef} className={`absolute top-1 ${isMine ? "-left-8" : "-right-8"} opacity-0 group-hover:opacity-100 transition-opacity`}>
              <button onClick={() => setMenuOpen(v => !v)}
                className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-gray-500 hover:text-gray-800">
                <ChevronDown className="w-3 h-3" />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`absolute top-7 ${isMine ? "right-0" : "left-0"} bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[150px] z-20`}
                  >
                    <button onClick={() => { onReply(msg); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                      <Reply className="w-3.5 h-3.5" /> Reply
                    </button>
                    {isMine && (
                      <>
                        <button onClick={() => { onEdit(msg); setMenuOpen(false); }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => { onDeleteEveryone(msg._id); setMenuOpen(false); }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-500 hover:bg-red-50">
                          <Trash2 className="w-3.5 h-3.5" /> Delete for everyone
                        </button>
                      </>
                    )}
                    <button onClick={() => { onDeleteMe(msg._id); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-500 hover:bg-gray-50">
                      <Trash2 className="w-3.5 h-3.5" /> Delete for me
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};



/* ══════════════════════════════════════════════════
   EMPTY STATE
══════════════════════════════════════════════════ */
const EmptyState = ({ hasConversations }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50">
    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-inner"
      style={{ background: `linear-gradient(135deg, ${BLUE}15, ${GOLD}15)` }}>
      <MessageSquare className="w-9 h-9" style={{ color: BLUE }} />
    </div>
    <h3 className="text-lg font-semibold text-gray-700">
      {hasConversations ? "Select a conversation" : "No messages yet"}
    </h3>
    <p className="text-sm text-gray-400 mt-1 max-w-xs">
      {hasConversations
        ? "Choose a conversation from the left to start chatting"
        : "Connect with alumni and start a conversation"}
    </p>
  </div>
);

/* ══════════════════════════════════════════════════
   CHAT PANEL
══════════════════════════════════════════════════ */
const ChatPanel = ({ conversationId, currentUserId, socket }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const { messagesByConversation, conversations, sending } = useSelector(s => s.messages);
  const bucket = messagesByConversation[conversationId] || { messages: [], hasMore: false };
  const messages = bucket.messages;
  const activeConv = conversations.find(c => c.id === conversationId);
  const otherUser = activeConv?.otherUser;

  // Load messages & mark read
  useEffect(() => {
    if (!conversationId) return;
    dispatch(fetchMessages({ conversationId, page: 1 }));
    dispatch(markAsRead(conversationId));
    dispatch(setActiveConversation(conversationId));
  }, [conversationId]);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);



  const handleSend = async () => {
    const content = text.trim();
    if (!content) return;

    if (editingMsg) {
      dispatch(editMessage({ messageId: editingMsg._id, content }));
      setEditingMsg(null);
    } else {
      dispatch(sendMessage({
        recipientId: otherUser?._id,
        content,
        replyTo: replyTo?._id || null,
      }));
      setReplyTo(null);
    }
    setText("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEdit = (msg) => {
    setEditingMsg(msg);
    setReplyTo(null);
    setText(msg.content);
    inputRef.current?.focus();
  };

  const cancelCompose = () => {
    setEditingMsg(null);
    setReplyTo(null);
    setText("");
  };

  const grouped = groupMessagesByDate(messages);

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      {/* ── Header ── */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-100 bg-white flex-shrink-0 shadow-sm">
        <Avatar user={otherUser} size="md" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {otherUser?.fullname || otherUser?.username || "Chat"}
          </p>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5" style={{ background: "#F0F2F5" }}>
        {grouped.map((item, i) =>
          item.type === "date" ? (
            <div key={i} className="flex justify-center my-3">
              <span className="text-[11px] text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                {item.label}
              </span>
            </div>
          ) : (
            <MessageBubble
              key={item.data._id}
              msg={item.data}
              isMine={item.data.sender?._id === currentUserId || item.data.sender === currentUserId}
              onReply={setReplyTo}
              onEdit={handleEdit}
              onDeleteMe={(id) => dispatch(deleteMessageForMe({ messageId: id, conversationId }))}
              onDeleteEveryone={(id) => dispatch(deleteMessageForEveryone({ messageId: id, conversationId }))}
            />
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Reply / Edit Banner ── */}
      <AnimatePresence>
        {(replyTo || editingMsg) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-2 border-t border-gray-100 bg-white flex items-center gap-3"
          >
            <div className="flex-1 pl-3 border-l-2 min-w-0" style={{ borderColor: GOLD }}>
              <p className="text-[11px] font-semibold" style={{ color: GOLD }}>
                {editingMsg ? "Editing message" : `Replying to ${replyTo?.sender?.fullname || "message"}`}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {editingMsg ? editingMsg.content : replyTo?.content}
              </p>
            </div>
            <button onClick={cancelCompose} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input ── */}
      <div className="px-4 py-3 bg-white border-t border-gray-100 flex items-end gap-3 flex-shrink-0">
        <textarea
          ref={inputRef}
          rows={1}
          value={text}
          onChange={(e) => { setText(e.target.value); }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          className="flex-1 resize-none rounded-2xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition max-h-32 overflow-y-auto leading-relaxed"
          style={{ minHeight: "42px" }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition disabled:opacity-40"
          style={{ background: BLUE }}
        >
          {sending ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   MAIN MESSAGING PAGE
══════════════════════════════════════════════════ */
const MessagingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = useSelector((s) => s.auth.user);
  const currentUserId = currentUser?.id?.toString() || currentUser?._id?.toString();
  const { conversations, loading, activeConversationId } = useSelector((s) => s.messages);

  const [search, setSearch] = useState("");
  const [mobileView, setMobileView] = useState("list"); // "list" | "chat"

  // Auto-open a conversation if navigated from alumni directory
  // Expected: location.state = { recipientId: "..." }
  useEffect(() => {
    const recipientId = location.state?.recipientId;
    if (recipientId && conversations.length > 0) {
      const conv = conversations.find(c => c.otherUser?._id === recipientId);
      if (conv) {
        dispatch(setActiveConversation(conv.id));
        setMobileView("chat");
      }
    }
  }, [location.state, conversations]);

  // Fetch all conversations on mount
  useEffect(() => {
    dispatch(fetchConversations());
  }, []);

  const filtered = conversations.filter(c => {
    const name = c.otherUser?.fullname || c.otherUser?.username || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const handleSelectConversation = (convId) => {
    dispatch(setActiveConversation(convId));
    setMobileView("chat");
  };

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <div className="h-screen flex flex-col" style={{ paddingTop: "" }}> {/* offset for fixed navbar */}
      <div className="flex flex-1 overflow-hidden">

        {/* ════════ LEFT SIDEBAR ════════ */}
        <div className={`
          flex flex-col border-r border-gray-100 bg-white
          w-full md:w-[320px] lg:w-[360px] flex-shrink-0
          ${mobileView === "chat" ? "hidden md:flex" : "flex"}
        `}>
          {/* Sidebar header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 flex-shrink-0"
            style={{ background: BLUE }}>
            <h1 className="text-white font-semibold text-base tracking-wide">Messages</h1>
            {totalUnread > 0 && (
              <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
                style={{ background: GOLD }}>
                {totalUnread} unread
              </span>
            )}
          </div>

          {/* Search */}
          <div className="px-3 py-2 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-sm text-gray-700 outline-none flex-1 placeholder-gray-400"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading && conversations.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-sm text-gray-400">No conversations found</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map(conv => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isActive={conv.id === activeConversationId}
                    onClick={() => handleSelectConversation(conv.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ════════ RIGHT CHAT AREA ════════ */}
        <div className={`
          flex-1 flex flex-col min-w-0
          ${mobileView === "list" ? "hidden md:flex" : "flex"}
        `}>
          {/* Mobile back button */}
          {mobileView === "chat" && (
            <button
              onClick={() => setMobileView("list")}
              className="md:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border-b border-gray-100"
            >
              <ArrowLeft className="w-4 h-4" /> Back to messages
            </button>
          )}

          {activeConversationId ? (
            <ChatPanel
              conversationId={activeConversationId}
              currentUserId={currentUserId}
            />
          ) : (
            <EmptyState hasConversations={conversations.length > 0} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;