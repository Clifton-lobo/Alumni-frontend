import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send, Search, ArrowLeft, Pencil, Trash2,
    Check, CheckCheck, Reply, X, MessageSquare, Loader2,
    ChevronDown, Maximize2, Minimize2, Paperclip, FileText,
    Music, Video, Download, AlertCircle
} from "lucide-react";
import {
    fetchConversations, fetchMessages, sendMessage, markAsRead,
    editMessage, deleteMessageForMe, deleteMessageForEveryone,
    setActiveConversation, clearError,
} from "../../../store/user-view/MessageSlice";
import { useOutletContext } from "react-router-dom";

const BLUE = "#142A5D";
const GOLD = "#F2A20A";
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_FILES = 5;

/* ══════════════════════════════════════════════════ UTILS */
const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
};
const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;
    messages.forEach((msg) => {
        const msgDate = formatDate(msg.createdAt);
        if (msgDate !== currentDate) { currentDate = msgDate; groups.push({ type: "date", label: msgDate }); }
        groups.push({ type: "message", data: msg });
    });
    return groups;
};
const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/* ══════════════════════════════════════════════════ ERROR TOAST */
const ErrorToast = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [message]);

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mx-4 mb-2 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl shadow-sm"
                >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                    <p className="text-xs flex-1">{message}</p>
                    <button onClick={onClose} className="text-red-400 hover:text-red-600 transition">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/* ══════════════════════════════════════════════════ AVATAR */
const Avatar = ({ user, size = "md" }) => {
    const sizeMap = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
    const cls = sizeMap[size];
    if (user?.profileImage) return <img src={user.profileImage} alt={user.fullname} className={`${cls} rounded-full object-cover flex-shrink-0`} />;
    return (
        <div className={`${cls} rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-white`}
            style={{ background: `linear-gradient(135deg, ${BLUE}, #2a4a8f)` }}>
            {user?.fullname?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "?"}
        </div>
    );
};

/* ══════════════════════════════════════════════════ ATTACHMENT RENDERER */
const AttachmentRenderer = ({ attachment, isMine }) => {
    const { url, type, name, size } = attachment;

    if (type === "image") {
        return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-1.5">
                <img src={url} alt={name}
                    className="rounded-xl max-w-[260px] max-h-[200px] object-cover cursor-pointer hover:opacity-90 transition" />
            </a>
        );
    }
    if (type === "video") {
        return (
            <div className="mt-1.5">
                <video src={url} controls className="rounded-xl max-w-[260px] max-h-[200px]" />
            </div>
        );
    }
    if (type === "audio") {
        return (
            <div className="mt-1.5">
                <audio src={url} controls className="max-w-[240px]" />
            </div>
        );
    }
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" download={name}
            className={`mt-1.5 flex items-center gap-3 px-3 py-2.5 rounded-xl transition
                ${isMine ? "bg-white/15 hover:bg-white/25" : "bg-gray-100 hover:bg-gray-200"}`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isMine ? "bg-white/20" : "bg-blue-100"}`}>
                <FileText className={`w-4 h-4 ${isMine ? "text-white" : "text-blue-600"}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-[12px] font-medium truncate ${isMine ? "text-white" : "text-gray-800"}`}>{name}</p>
                <p className={`text-[10px] ${isMine ? "text-white/60" : "text-gray-400"}`}>{formatFileSize(size)}</p>
            </div>
            <Download className={`w-4 h-4 flex-shrink-0 ${isMine ? "text-white/70" : "text-gray-400"}`} />
        </a>
    );
};

/* ══════════════════════════════════════════════════ ATTACHMENT PREVIEW (before send) */
const AttachmentPreview = ({ files, onRemove }) => {
    if (!files.length) return null;
    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-2 bg-white border-t border-gray-100 flex gap-2 flex-wrap overflow-hidden"
        >
            {files.map((file, i) => {
                const isImage = file.type.startsWith("image/");
                const isVideo = file.type.startsWith("video/");
                const isAudio = file.type.startsWith("audio/");
                const previewUrl = isImage ? URL.createObjectURL(file) : null;

                return (
                    <div key={i} className="relative group flex-shrink-0">
                        {isImage ? (
                            <img src={previewUrl} alt={file.name}
                                className="w-16 h-16 object-cover rounded-xl border border-gray-200" />
                        ) : isVideo ? (
                            <div className="w-16 h-16 rounded-xl border border-gray-200 bg-gray-100 flex flex-col items-center justify-center gap-1">
                                <Video className="w-5 h-5 text-gray-500" />
                                <span className="text-[9px] text-gray-400">Video</span>
                            </div>
                        ) : isAudio ? (
                            <div className="w-16 h-16 rounded-xl border border-gray-200 bg-gray-100 flex flex-col items-center justify-center gap-1">
                                <Music className="w-5 h-5 text-gray-500" />
                                <span className="text-[9px] text-gray-400">Audio</span>
                            </div>
                        ) : (
                            <div className="h-16 px-3 rounded-xl border border-gray-200 bg-gray-50 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[11px] font-medium text-gray-700 truncate max-w-[80px]">{file.name}</p>
                                    <p className="text-[10px] text-gray-400">{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                        )}
                        <button onClick={() => onRemove(i)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow">
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                );
            })}
        </motion.div>
    );
};

/* ══════════════════════════════════════════════════ FILE VALIDATION */
const validateFiles = (newFiles, existingFiles = []) => {
    const errors = [];

    // Check count
    if (existingFiles.length + newFiles.length > MAX_FILES) {
        errors.push(`You can only attach up to ${MAX_FILES} files per message.`);
        return { valid: [], errors };
    }

    const valid = [];
    for (const file of newFiles) {
        if (file.size > MAX_FILE_SIZE) {
            errors.push(`"${file.name}" exceeds the 25MB limit (${formatFileSize(file.size)}).`);
        } else {
            valid.push(file);
        }
    }

    return { valid, errors };
};

/* ══════════════════════════════════════════════════ CONVERSATION LIST ITEM */
const ConversationItem = ({ conv, isActive, onClick }) => {
    const hasUnread = conv.unreadCount > 0;
    const lastMsg = conv.lastMessage;
    const hasAttachment = lastMsg?.attachments?.length > 0;
    const preview = lastMsg?.deletedForEveryone ? "This message was deleted"
        : hasAttachment && !lastMsg?.content ? "📎 Attachment"
            : lastMsg?.content || "Start a conversation";

    return (
        <motion.button onClick={onClick} whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all relative
                ${isActive ? "bg-blue-50" : "hover:bg-gray-50"}`}>
            {isActive && <span className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full" style={{ background: GOLD }} />}
            <Avatar user={conv.otherUser} size="md" />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                    <span className={`text-sm font-semibold truncate ${hasUnread ? "text-gray-900" : "text-gray-700"}`}>
                        {conv.otherUser?.fullname || conv.otherUser?.username}
                    </span>
                    <span className="text-[10px] text-gray-400 ml-2 flex-shrink-0">{formatTime(lastMsg?.createdAt)}</span>
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

/* ══════════════════════════════════════════════════ REPLY PREVIEW IN BUBBLE */
const ReplyPreviewInBubble = ({ replyTo, isMine, onClick }) => {
    if (!replyTo || replyTo.deletedForEveryone) return null;
    const hasAttachment = replyTo.attachments?.length > 0;
    return (
        <div onClick={onClick}
            className={`mb-1.5 rounded-lg overflow-hidden cursor-pointer transition-opacity hover:opacity-80
                ${isMine ? "bg-white/15" : "bg-black/5"}`}>
            <div className="flex">
                <div className="w-1 flex-shrink-0 rounded-l-lg" style={{ background: isMine ? "rgba(255,255,255,0.6)" : GOLD }} />
                <div className="px-2.5 py-1.5 flex-1 min-w-0">
                    <p className={`text-[11px] font-semibold truncate mb-0.5 ${isMine ? "text-white/80" : "text-amber-600"}`}>
                        {replyTo.sender?.fullname || replyTo.sender?.username || "User"}
                    </p>
                    <p className={`text-[11px] truncate ${isMine ? "text-white/65" : "text-gray-500"}`}>
                        {hasAttachment && !replyTo.content ? "📎 Attachment" : replyTo.content || "Message"}
                    </p>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════ MESSAGE BUBBLE */
const MessageBubble = ({ msg, isMine, onReply, onEdit, onDeleteMe, onDeleteEveryone, scrollToMessage }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [swipeX, setSwipeX] = useState(0);
    const menuRef = useRef(null);
    const touchStartX = useRef(null);
    const isDeleted = msg.deletedForEveryone;
    const isEdited = !!msg.editedAt;
    const hasAttachments = msg.attachments?.length > 0;

    useEffect(() => {
        const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchMove = (e) => {
        if (!touchStartX.current) return;
        const diff = e.touches[0].clientX - touchStartX.current;
        if (isMine && diff < 0) setSwipeX(Math.max(diff, -60));
        if (!isMine && diff > 0) setSwipeX(Math.min(diff, 60));
    };
    const handleTouchEnd = () => {
        if ((isMine && swipeX <= -45) || (!isMine && swipeX >= 45)) onReply(msg);
        setSwipeX(0);
        touchStartX.current = null;
    };

    return (
        <div className={`flex ${isMine ? "justify-end" : "justify-start"} group mb-1 relative`}
            onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>

            <AnimatePresence>
                {Math.abs(swipeX) > 20 && (
                    <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}
                        className={`absolute top-1/2 -translate-y-1/2 ${isMine ? "left-2" : "right-2"} w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center z-10`}>
                        <Reply className="w-4 h-4 text-gray-600" />
                    </motion.div>
                )}
            </AnimatePresence>


            <motion.div animate={{ x: swipeX }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`flex items-end gap-1.5 max-w-[72%] min-w-0 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                {!isMine && <Avatar user={msg.sender} size="sm" />}

                <div className="flex flex-col gap-1">
                    <div className={`relative px-3 py-2 rounded-2xl text-sm shadow-sm
                        ${isMine ? "text-white rounded-tr-sm" : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"}
                        ${isDeleted ? "italic opacity-60" : ""}`}
                        style={isMine ? { background: `linear-gradient(135deg, ${BLUE}, #1e3d7a)` } : {}}>

                        {!isDeleted && msg.replyTo && (
                            <ReplyPreviewInBubble replyTo={msg.replyTo} isMine={isMine} onClick={() => scrollToMessage?.(msg.replyTo._id)} />
                        )}

                        {isDeleted ? (
                            <span className="flex items-center gap-1.5 text-xs opacity-70">
                                <Trash2 className="w-3 h-3" /> This message was deleted
                            </span>
                        ) : (
                            <>
                                {hasAttachments && (
                                    <div className="flex flex-col gap-1.5">
                                        {msg.attachments.map((att, i) => (
                                            <AttachmentRenderer key={i} attachment={att} isMine={isMine} />
                                        ))}
                                    </div>
                                )}
                                {msg.content && (
                                    <p className={`whitespace-pre-wrap break-words leading-relaxed text-[13.5px] ${hasAttachments ? "mt-2" : ""}`}>
                                        {msg.content}
                                    </p>
                                )}
                                <div className={`flex items-center gap-1 mt-0.5 ${isMine ? "justify-end" : "justify-start"}`}>
                                    {isEdited && <span className={`text-[10px] ${isMine ? "text-blue-200" : "text-gray-400"}`}>edited</span>}
                                    <span className={`text-[10px] ${isMine ? "text-blue-200" : "text-gray-400"}`}>{formatTime(msg.createdAt)}</span>
                                    {isMine && (msg.readBy?.length > 0
                                        ? <CheckCheck className="w-3.5 h-3.5 text-blue-300" />
                                        : <Check className="w-3.5 h-3.5 text-blue-200/70" />
                                    )}
                                </div>
                            </>
                        )}

                        {isMine ? (
                            <div className="absolute -right-[5px] bottom-0 w-0 h-0"
                                style={{ borderLeft: "6px solid #1e3d7a", borderBottom: "6px solid transparent" }} />
                        ) : (
                            <div className="absolute -left-[5px] bottom-0 w-0 h-0"
                                style={{ borderRight: "6px solid white", borderBottom: "6px solid transparent" }} />
                        )}
                    </div>

                    {!isDeleted && (
                        <div ref={menuRef} className={`absolute top-0 ${isMine ? "-left-9" : "-right-9"} opacity-0 group-hover:opacity-100 transition-opacity flex items-center`}>
                            <button onClick={() => setMenuOpen(v => !v)}
                                className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all">
                                <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <AnimatePresence>
                                {menuOpen && (
                                    <motion.div initial={{ opacity: 0, scale: 0.85, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.85, y: -4 }} transition={{ duration: 0.12 }}
                                        className={`absolute top-8 ${isMine ? "right-0" : "left-0"} bg-white rounded-2xl shadow-2xl border border-gray-100 py-1.5 min-w-[160px] z-30`}>
                                        <button onClick={() => { onReply(msg); setMenuOpen(false); }}
                                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition">
                                            <Reply className="w-3.5 h-3.5 text-gray-400" /> Reply
                                        </button>
                                        {isMine && !hasAttachments && (
                                            <button onClick={() => { onEdit(msg); setMenuOpen(false); }}
                                                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition">
                                                <Pencil className="w-3.5 h-3.5 text-gray-400" /> Edit
                                            </button>
                                        )}
                                        {isMine && (
                                            <>
                                                <div className="my-1 border-t border-gray-100" />
                                                <button onClick={() => { onDeleteEveryone(msg._id); setMenuOpen(false); }}
                                                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition">
                                                    <Trash2 className="w-3.5 h-3.5" /> Delete for everyone
                                                </button>
                                            </>
                                        )}
                                        <button onClick={() => { onDeleteMe(msg._id); setMenuOpen(false); }}
                                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs text-gray-500 hover:bg-gray-50 transition">
                                            <Trash2 className="w-3.5 h-3.5 text-gray-400" /> Delete for me
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

/* ══════════════════════════════════════════════════ REPLY BANNER */
const ReplyBanner = ({ replyTo, onCancel }) => {
    if (!replyTo) return null;
    return (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }}
            className="px-4 pt-2 pb-1 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl overflow-hidden">
                <div className="w-1 self-stretch flex-shrink-0 rounded-l-xl" style={{ background: GOLD }} />
                <div className="flex-1 py-2 min-w-0">
                    <p className="text-[11px] font-semibold truncate" style={{ color: GOLD }}>
                        {replyTo.sender?.fullname || replyTo.sender?.username || "User"}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                        {replyTo.attachments?.length && !replyTo.content ? "📎 Attachment" : replyTo.content}
                    </p>
                </div>
                <button onClick={onCancel} className="p-2 mr-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

/* ══════════════════════════════════════════════════ EDIT BANNER */
const EditBanner = ({ editingMsg, onCancel }) => {
    if (!editingMsg) return null;
    return (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }}
            className="px-4 pt-2 pb-1 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-blue-50 rounded-xl overflow-hidden">
                <div className="w-1 self-stretch flex-shrink-0 rounded-l-xl" style={{ background: BLUE }} />
                <div className="flex-1 py-2 min-w-0">
                    <p className="text-[11px] font-semibold truncate" style={{ color: BLUE }}>Editing message</p>
                    <p className="text-[11px] text-gray-500 truncate">{editingMsg.content}</p>
                </div>
                <button onClick={onCancel} className="p-2 mr-1 text-gray-400 hover:text-gray-600 hover:bg-blue-100 rounded-full transition">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

/* ══════════════════════════════════════════════════ EMPTY STATE */
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
            {hasConversations ? "Choose a conversation from the left to start chatting" : "Connect with alumni and start a conversation"}
        </p>
    </div>
);

/* ══════════════════════════════════════════════════ NEW CHAT PANEL */
const NewChatPanel = ({ recipientId, recipientUser, onConversationCreated }) => {
    const dispatch = useDispatch();
    const [text, setText] = useState("");
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [fileError, setFileError] = useState(null);
    const { sending } = useSelector(s => s.messages);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const { valid, errors } = validateFiles(newFiles, attachedFiles);
        if (errors.length > 0) setFileError(errors.join(" "));
        if (valid.length > 0) setAttachedFiles(prev => [...prev, ...valid]);
        e.target.value = "";
    };

    const handleSend = async () => {
        const content = text.trim();
        if (!content && attachedFiles.length === 0) return;
        const result = await dispatch(sendMessage({ recipientId, content, replyTo: null, files: attachedFiles }));
        if (result.meta.requestStatus === "fulfilled") {
            onConversationCreated(result.payload.conversationId);
            setText("");
            setAttachedFiles([]);
        } else {
            setFileError(result.payload || "Failed to send message.");
        }
    };

    const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

    return (
        <div className="flex-1 flex flex-col h-full min-w-0">
            <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-100 bg-white flex-shrink-0 shadow-sm">
                <Avatar user={recipientUser} size="md" />
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{recipientUser?.fullname || recipientUser?.username || "New Conversation"}</p>
                    <p className="text-xs text-gray-400">Send your first message</p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center" style={{ background: "#EAE6DF" }}>
                <div className="text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No messages yet. Say hello!</p>
                </div>
            </div>

            <ErrorToast message={fileError} onClose={() => setFileError(null)} />

            <AnimatePresence>
                {attachedFiles.length > 0 && (
                    <AttachmentPreview files={attachedFiles} onRemove={(i) => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))} />
                )}
            </AnimatePresence>

            <div className="px-3 py-2.5 bg-gray-100 border-t border-gray-200 flex items-end gap-2 flex-shrink-0">
                <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,audio/*,.pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
                <button onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition flex-shrink-0">
                    <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm flex items-end px-4 py-2">
                    <textarea ref={inputRef} rows={1} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown}
                        placeholder="Type a message"
                        className="flex-1 resize-none text-sm text-gray-800 outline-none bg-transparent max-h-32 overflow-y-auto leading-relaxed placeholder-gray-400"
                        style={{ minHeight: "24px" }} />
                </div>
                <button onClick={handleSend} disabled={(!text.trim() && attachedFiles.length === 0) || sending}
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 active:scale-95 shadow-md"
                    style={{ background: BLUE }}>
                    {sending ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white ml-0.5" />}
                </button>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════ CHAT PANEL */
const ChatPanel = ({ conversationId, currentUserId }) => {
    const dispatch = useDispatch();
    const [text, setText] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [editingMsg, setEditingMsg] = useState(null);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [fileError, setFileError] = useState(null);
    const messageRefs = useRef({});
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);

    const { messagesByConversation, conversations, sending, error } = useSelector(s => s.messages);
    const bucket = messagesByConversation[conversationId] || { messages: [], hasMore: false };
    const messages = bucket.messages;
    const activeConv = conversations.find(c => c.id === conversationId);
    const otherUser = activeConv?.otherUser;

    // Dismiss redux error automatically
    useEffect(() => {
        if (error) {
            setFileError(error);
            dispatch(clearError());
        }
    }, [error]);

    const scrollToMessage = (messageId) => {
        const el = messageRefs.current[messageId];
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.style.transition = "background 0.2s";
        el.style.background = "rgba(242,162,10,0.15)";
        el.style.borderRadius = "12px";
        setTimeout(() => { el.style.background = ""; el.style.borderRadius = ""; }, 1200);
    };

    useEffect(() => {
        if (!conversationId) return;
        dispatch(fetchMessages({ conversationId, page: 1 }));
        dispatch(markAsRead(conversationId));
        dispatch(setActiveConversation(conversationId.toString()));
        setText("");
        setReplyTo(null);
        setEditingMsg(null);
        setAttachedFiles([]);
        setFileError(null);
    }, [conversationId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    // ── Client-side file validation ──
    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const { valid, errors } = validateFiles(newFiles, attachedFiles);
        if (errors.length > 0) setFileError(errors.join(" "));
        if (valid.length > 0) setAttachedFiles(prev => [...prev, ...valid]);
        e.target.value = "";
    };

    const handleSend = async () => {
        const content = text.trim();
        if (!content && attachedFiles.length === 0) return;

        if (editingMsg) {
            if (!content) return;
            dispatch(editMessage({ messageId: editingMsg._id, content }));
            setEditingMsg(null);
            setText("");
            return;
        }

        const result = await dispatch(sendMessage({
            recipientId: otherUser?._id,
            content,
            replyTo: replyTo?._id || null,
            files: attachedFiles,
        }));

        if (result.meta.requestStatus === "fulfilled") {
            setReplyTo(null);
            setAttachedFiles([]);
            setText("");
            inputRef.current?.focus();
        } else {
            // Backend error (e.g. server-side size check)
            setFileError(result.payload || "Failed to send message.");
        }
    };

    const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };
    const handleReply = (msg) => { setEditingMsg(null); setReplyTo(msg); inputRef.current?.focus(); };
    const handleEdit = (msg) => { setReplyTo(null); setEditingMsg(msg); setText(msg.content); inputRef.current?.focus(); };
    const cancelCompose = () => { setEditingMsg(null); setReplyTo(null); setText(""); setAttachedFiles([]); };

    const grouped = groupMessagesByDate(messages);

    return (
        <div className="flex-1 flex flex-col h-full min-w-0">
            {/* Header */}
            <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-100 bg-white flex-shrink-0 shadow-sm">
                <Avatar user={otherUser} size="md" />
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate text-[15px]">{otherUser?.fullname || otherUser?.username || "Chat"}</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-0.5" style={{ background: "#EAE6DF" }}>                {grouped.map((item, i) =>
                item.type === "date" ? (
                    <div key={i} className="flex justify-center my-4">
                        <span className="text-[11px] text-gray-600 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow-sm font-medium">
                            {item.label}
                        </span>
                    </div>
                ) : (
                    <div key={item.data._id} ref={(el) => { if (el) messageRefs.current[item.data._id] = el; }}>
                        <MessageBubble
                            msg={item.data}
                            isMine={item.data.sender?._id === currentUserId || item.data.sender === currentUserId}
                            onReply={handleReply}
                            onEdit={handleEdit}
                            scrollToMessage={scrollToMessage}
                            onDeleteMe={(id) => dispatch(deleteMessageForMe({ messageId: id, conversationId }))}
                            onDeleteEveryone={(id) => dispatch(deleteMessageForEveryone({ messageId: id, conversationId }))}
                        />
                    </div>
                )
            )}
                <div ref={bottomRef} />
            </div>

            {/* Banners */}
            <AnimatePresence>
                {replyTo && <ReplyBanner replyTo={replyTo} onCancel={cancelCompose} />}
                {editingMsg && <EditBanner editingMsg={editingMsg} onCancel={cancelCompose} />}
            </AnimatePresence>

            {/* Error toast — shown above attachment preview */}
            <ErrorToast message={fileError} onClose={() => setFileError(null)} />

            {/* Attachment preview */}
            <AnimatePresence>
                {attachedFiles.length > 0 && (
                    <AttachmentPreview
                        files={attachedFiles}
                        onRemove={(i) => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                    />
                )}
            </AnimatePresence>

            {/* Input */}
            <div className="px-3 py-2.5 bg-gray-100 border-t border-gray-200 flex items-end gap-2 flex-shrink-0">
                <input ref={fileInputRef} type="file" multiple
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    className="hidden" onChange={handleFileChange} />

                {!editingMsg && (
                    <button onClick={() => fileInputRef.current?.click()}
                        title="Attach files (max 5, 25MB each)"
                        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition flex-shrink-0">
                        <Paperclip className="w-5 h-5" />
                    </button>
                )}

                <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm flex items-end px-4 py-2 gap-2">
                    <textarea ref={inputRef} rows={1} value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={editingMsg ? "Edit message…" : "Type a message"}
                        className="flex-1 resize-none text-sm text-gray-800 outline-none bg-transparent max-h-32 overflow-y-auto leading-relaxed placeholder-gray-400"
                        style={{ minHeight: "24px" }} />
                </div>

                <button onClick={handleSend}
                    disabled={(!text.trim() && attachedFiles.length === 0) || sending}
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 active:scale-95 shadow-md"
                    style={{ background: BLUE }}>
                    {sending ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white ml-0.5" />}
                </button>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════ MAIN PAGE */
const MessagingPage = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const currentUser = useSelector((s) => s.auth.user);
    const currentUserId = currentUser?.id?.toString() || currentUser?._id?.toString();
    const { conversations, loading, activeConversationId } = useSelector((s) => s.messages);
    const { isFullscreen, setIsFullscreen } = useOutletContext();

    const [search, setSearch] = useState("");
    const [mobileView, setMobileView] = useState("list");
    const [pendingRecipient, setPendingRecipient] = useState(null);
    const [pendingRecipientUser, setPendingRecipientUser] = useState(null);

    useEffect(() => {
        const recipientId = location.state?.recipientId;
        if (!recipientId) return;
        const conv = conversations.find(c => c.otherUser?._id?.toString() === recipientId.toString());
        if (conv) {
            dispatch(setActiveConversation(conv.id));
            setPendingRecipient(null);
            setPendingRecipientUser(null);
        } else {
            dispatch(setActiveConversation(null));
            setPendingRecipient(recipientId);
            setPendingRecipientUser(location.state?.recipientUser || null);
        }
        setMobileView("chat");
    }, [location.state]);

    useEffect(() => { dispatch(fetchConversations()); }, []);

    const filtered = conversations.filter(c => {
        const name = c.otherUser?.fullname || c.otherUser?.username || "";
        return name.toLowerCase().includes(search.toLowerCase());
    });

    const handleSelectConversation = (convId) => {
        dispatch(setActiveConversation(convId));
        setPendingRecipient(null);
        setPendingRecipientUser(null);
        setMobileView("chat");
    };

    const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

    return (
        <div className="h-screen flex flex-col">
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className={`flex flex-col border-r border-gray-200 bg-white w-full md:w-[320px] lg:w-[360px] flex-shrink-0
                    ${mobileView === "chat" ? "hidden md:flex" : "flex"}`}>
                    <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-100 flex-shrink-0" style={{ background: BLUE }}>
                        <h1 className="text-white font-semibold text-base tracking-wide flex-1">Messages</h1>
                        {totalUnread > 0 && (
                            <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ background: GOLD }}>
                                {totalUnread} unread
                            </span>
                        )}
                        <button onClick={() => setIsFullscreen(prev => !prev)}
                            className="p-2 rounded-lg bg-white/10 text-white cursor-pointer hover:bg-white/20 transition ml-1">
                            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>
                    </div>
                    <div className="px-3 py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <input type="text" placeholder="Search conversations..." value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="bg-transparent text-sm text-gray-700 outline-none flex-1 placeholder-gray-400" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loading && conversations.length === 0 ? (
                            <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-12 text-sm text-gray-400">No conversations found</div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {filtered.map(conv => (
                                    <ConversationItem key={conv.id} conv={conv}
                                        isActive={conv.id === activeConversationId}
                                        onClick={() => handleSelectConversation(conv.id)} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat area */}
                <div className={`flex-1 flex flex-col min-w-0 ${mobileView === "list" ? "hidden md:flex" : "flex"}`}>
                    {mobileView === "chat" && (
                        <button onClick={() => { setMobileView("list"); setPendingRecipient(null); }}
                            className="md:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border-b border-gray-100">
                            <ArrowLeft className="w-4 h-4" /> Back to messages
                        </button>
                    )}
                    {activeConversationId ? (
                        <ChatPanel conversationId={activeConversationId} currentUserId={currentUserId} />
                    ) : pendingRecipient ? (
                        <NewChatPanel recipientId={pendingRecipient} recipientUser={pendingRecipientUser}
                            currentUserId={currentUserId}
                            onConversationCreated={(convId) => {
                                setPendingRecipient(null);
                                setPendingRecipientUser(null);
                                dispatch(setActiveConversation(convId));
                            }} />
                    ) : (
                        <EmptyState hasConversations={conversations.length > 0} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagingPage;