import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    sendConnectionRequest,
    openRequestsDialog,
    fetchAcceptedConnections,
    fetchIncomingRequests,
    fetchOutgoingRequests,
} from "../../../store/user-view/ConnectionSlice";
import {
    Briefcase,
    GraduationCap,
    Linkedin,
    MessageCircle,
    UserPlus,
    CheckCircle,
    Clock,
    UserCheck,
    Mail,
    X,
    Shield,
} from "lucide-react";

/* ─────────────────────────────────────────────
  Helper: derive connection status for a user
───────────────────────────────────────────── */
const getConnectionStatus = (
    targetUserId,
    currentUserId,
    acceptedConnections,
    outgoingRequests,
    incomingRequests
) => {
    if (targetUserId && currentUserId && targetUserId === currentUserId)
        return "SELF";
    if (!targetUserId) return "NONE";
    if (acceptedConnections.some((c) => c.user?._id?.toString() === targetUserId))
        return "ACCEPTED";
    if (
        outgoingRequests.some((r) => {
            const id = r.recipient?._id?.toString() ?? r.recipient?.toString();
            return id === targetUserId;
        })
    )
        return "PENDING_SENT";
    if (
        incomingRequests.some((r) => {
            const id = r.requester?._id?.toString() ?? r.requester?.toString();
            return id === targetUserId;
        })
    )
        return "PENDING_RECEIVED";
    return "NONE";
};

/* ─────────────────────────────────────────────
  Avatar gradient per first letter (same as AlumniDirectory)
───────────────────────────────────────────── */
const avatarColors = [
    "from-[#142A5D] to-[#1E3A7A]",
    "from-[#2A7A4B] to-[#16A34A]",
    "from-[#7B5EA7] to-[#9333EA]",
    "from-[#B45309] to-[#EBAB09]",
    "from-[#0369A1] to-[#0EA5E9]",
    "from-[#374151] to-[#6B7280]",
];
const getAvatarColor = (name = "") =>
    avatarColors[name.charCodeAt(0) % avatarColors.length];

/* ─────────────────────────────────────────────
  Primary action button — matches AlumniDirectory
───────────────────────────────────────────── */
const PrimaryActionButton = ({ status, onConnect, onRespond, onMessage, loading }) => {
    return (
        <>
            <style>{`
                .pd-primary-btn {
                    background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%);
                    position: relative;
                    overflow: hidden;
                    transition: transform .2s, box-shadow .2s;
                }
                .pd-primary-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg,
                        transparent 0%,
                        rgba(255,255,255,.12) 50%,
                        transparent 100%);
                    background-size: 200% 100%;
                    opacity: 0;
                    transition: opacity .2s;
                }
                .pd-primary-btn:hover:not(:disabled)::before {
                    opacity: 1;
                    animation: pd-shimmer 1.4s linear infinite;
                }
                .pd-primary-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(15,23,42,.35);
                }
                .pd-primary-btn:active:not(:disabled) { transform: translateY(0); }
                @keyframes pd-shimmer {
                    from { background-position: 200% 0; }
                    to   { background-position: -200% 0; }
                }
            `}</style>

            {status === "ACCEPTED" && (
                <button
                    onClick={onMessage}
                    className="pd-primary-btn flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                    <MessageCircle className="w-4 h-4" />
                    Message
                </button>
            )}
            {status === "PENDING_SENT" && (
                <button
                    disabled
                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 text-sm font-semibold flex items-center justify-center gap-2 border border-blue-200 cursor-default"
                >
                    <Clock className="w-4 h-4" />
                    Request Sent
                </button>
            )}
            {status === "PENDING_RECEIVED" && (
                <button
                    onClick={onRespond}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 text-sm font-semibold flex items-center justify-center gap-2 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                    <UserCheck className="w-4 h-4" />
                    Respond
                </button>
            )}
            {(status === "NONE" || (!["ACCEPTED", "PENDING_SENT", "PENDING_RECEIVED"].includes(status))) && (
                <button
                    onClick={onConnect}
                    disabled={loading}
                    className="pd-primary-btn flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                    <UserPlus className="w-4 h-4" />
                    {loading ? "Sending…" : "Connect"}
                </button>
            )}
        </>
    );
};

/* ─────────────────────────────────────────────
  LinkedIn icon button — matches AlumniDirectory
───────────────────────────────────────────── */
const LinkedInButton = ({ url }) => {
    if (url) {
        return (
            <a
                href={url.startsWith("http") ? url : `https://${url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-500 text-white hover:bg-[#0958a8] transition-colors duration-200 flex-shrink-0"
                title="LinkedIn Profile"
            >
                <Linkedin className="w-4 h-4" />
            </a>
        );
    }
    return (
        <div
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-300 flex-shrink-0 cursor-not-allowed"
            title="LinkedIn not posted"
        >
            <Linkedin className="w-4 h-4" />
        </div>
    );
};

/* ─────────────────────────────────────────────
  Main ProfileDialog
───────────────────────────────────────────── */
const ProfileDialog = ({ open, onClose, poster }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentUser = useSelector((s) => s.auth.user);
    const {
        acceptedConnections,
        incomingRequests,
        outgoingRequests,
        sendingRequests,
    } = useSelector((s) => s.connections);

    useEffect(() => {
        if (!open) return;
        dispatch(fetchAcceptedConnections());
        dispatch(fetchIncomingRequests());
        dispatch(fetchOutgoingRequests());
    }, [open]);

    if (!open || !poster) return null;

    const currentUserId =
        currentUser?.id?.toString() || currentUser?._id?.toString();
    const posterId = (poster._id ?? poster.userId)?.toString();
    const isAdmin = poster.role === "admin";
    const isCurrentUser = !!(posterId && currentUserId && posterId === currentUserId);
    const showActions = !isAdmin && !isCurrentUser;

    const connectionStatus = getConnectionStatus(
        posterId,
        currentUserId,
        acceptedConnections,
        outgoingRequests,
        incomingRequests
    );

    const handleConnect = () => {
        if (posterId) dispatch(sendConnectionRequest(posterId));
    };

    const handleMessage = () => {
        onClose();
        navigate("/user/messages", {
            state: {
                recipientId: posterId,
                recipientUser: {
                    _id: posterId,
                    fullname: poster.fullname,
                    username: poster.username,
                    profileImage: poster.profilePicture,
                },
            },
        });
    };

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-sm bg-white rounded-2xl border-[1.5px] border-gray-100 shadow-2xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition z-10"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Card body */}
                <div className="p-6 flex flex-col items-center text-center flex-1">

                    {/* Avatar */}
                    <div className="relative mb-4">
                        <div
className="w-[72px] h-[72px] rounded-full overflow-hidden bg-gradient-to-br from-[#142A5D] to-[#1E3A7A] flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md"                        >
                            {poster.profilePicture ? (
                                <img
                                    src={poster.profilePicture}
                                    alt={poster.fullname}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                (poster.fullname || poster.username || "?")
                                    .charAt(0)
                                    .toUpperCase()
                            )}
                        </div>
                        {connectionStatus === "ACCEPTED" && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                <CheckCircle className="w-3.5 h-3.5 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Name */}
                    <h2 className="text-[15px] font-semibold text-slate-900 flex items-center gap-2 flex-wrap justify-center">
                        {poster.fullname || poster.username || "Anonymous"}
                        {isAdmin && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-[10px] font-medium text-green-700">
                                <Shield className="w-3 h-3" /> Admin
                            </span>
                        )}
                        {isCurrentUser && (
                            <span className="text-[10px] text-[#142A5D]/50 font-medium">(you)</span>
                        )}
                    </h2>

                    {poster.username && poster.fullname && (
                        <p className="text-xs text-slate-400 mt-0.5">@{poster.username}</p>
                    )}

                    {/* Info rows */}
                    <div className="mt-4 w-full flex flex-col gap-2">

                        {/* Email */}
                        <div className="flex items-center gap-2.5 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500">
                            <Mail className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                            <span className="truncate">{poster.email || "Email not provided"}</span>
                        </div>

                        {/* Job */}
                        <div className="flex items-center gap-2.5 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500">
                            <Briefcase className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                            <span className="truncate">
                                {poster.jobTitle
                                    ? `${poster.jobTitle}${poster.company ? ` at ${poster.company}` : ""}`
                                    : "Professional details not posted"}
                            </span>
                        </div>

                        {/* Stream */}
                        <div className="flex items-center gap-2.5 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500">
                            <GraduationCap className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                            <span>
                                {poster.stream || "Stream not provided"} ·{" "}
                                {poster.batch ? `Class of ${poster.batch}` : "Batch not provided"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100" />

                {/* Actions */}
                {showActions && (
                    <div className="p-4 bg-gray-50 flex gap-2.5 items-center">
                        <PrimaryActionButton
                            status={connectionStatus}
                            onRespond={() => {
                                onClose();
                                dispatch(openRequestsDialog());
                            }}
                            onConnect={handleConnect}
                            onMessage={handleMessage}
                            loading={!!sendingRequests?.[posterId]}
                        />
                        <LinkedInButton url={poster.linkedin} />
                    </div>
                )}

                {/* Admin notice */}
                {isAdmin && (
                    <div className="p-4 bg-gray-50">
                        <div className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                            <Shield className="w-4 h-4" />
                            Posted by the platform administrator
                        </div>
                    </div>
                )}

                {/* Self notice */}
                {isCurrentUser && (
                    <div className="p-4 bg-gray-50">
                        <div className="py-2 rounded-xl bg-[#142A5D]/5 border border-[#142A5D]/10 text-[#142A5D] text-sm font-medium text-center">
                            This is you
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default ProfileDialog;