import { useEffect } from "react";
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
    Calendar,
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
  Helper — identical to AlumniDirectory
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
    console.log("user ids in connections:", acceptedConnections.map(c => ({
        connectionId: c._id,
        userId: c.user?._id,
        userIdString: c.user?._id?.toString(),
        fullUser: c.user
    })));

    return "NONE";
};

/* ─────────────────────────────────────────────
  Connect Button — identical to AlumniDirectory
───────────────────────────────────────────── */
const ConnectButton = ({ status, onConnect, onRespond, loading }) => {
    if (status === "ACCEPTED") {
        return (
            <button
                disabled
                className="flex-1 px-4 py-2.5 rounded-xl bg-green-100 text-green-700 text-sm font-semibold flex items-center justify-center gap-2 border border-green-200"
            >
                <CheckCircle className="w-4 h-4" />
                Connected
            </button>
        );
    }

    if (status === "PENDING_SENT") {
        return (
            <button
                disabled
                className="flex-1 px-4 py-2.5 rounded-xl bg-amber-50 text-amber-700 text-sm font-semibold flex items-center justify-center gap-2 border border-amber-200"
            >
                <Clock className="w-4 h-4" />
                Request Sent
            </button>
        );
    }

    if (status === "PENDING_RECEIVED") {
        return (
            <button
                onClick={onRespond}
                className="flex-1 px-4 py-2.5 rounded-xl bg-blue-100 text-blue-700 text-sm font-semibold hover:bg-blue-200 flex items-center justify-center gap-2 border border-blue-200 transition"
            >
                <UserCheck className="w-4 h-4" />
                Respond
            </button>
        );
    }

    return (
        <button
            onClick={onConnect}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#EBAB09] text-black text-sm font-semibold hover:bg-[#d49a00] flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
        >
            <UserPlus className="w-4 h-4" />
            {loading ? "Sending…" : "Connect"}
        </button>
    );
};

/* ─────────────────────────────────────────────
  ProfileDialog
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

    // ── KEY FIX: fetch connection data when dialog opens ──
    // The Jobs page never calls fetchAcceptedConnections, so the Redux store
    // is empty and getConnectionStatus always returns "NONE".
    // Fetching here ensures we always have fresh data regardless of which
    // page the dialog is opened from.
    useEffect(() => {
        if (!open) return;
        console.log("acceptedConnections:", acceptedConnections);
        console.log("posterId:", posterId);
        console.log("connectionStatus:", connectionStatus);
        dispatch(fetchAcceptedConnections());
        dispatch(fetchIncomingRequests());
        dispatch(fetchOutgoingRequests());
    }, [open]);

    if (!open || !poster) return null;

    const currentUserId =
        currentUser?.id?.toString() || currentUser?._id?.toString();
    const posterId = (poster._id ?? poster.userId)?.toString();
    const isAdmin = poster.role === "admin";

    // Same logic as AlumniDirectory
    const isCurrentUser = !!(posterId && currentUserId && posterId === currentUserId);

    const connectionStatus = getConnectionStatus(
        posterId,
        currentUserId,
        acceptedConnections,
        outgoingRequests,
        incomingRequests
    );

    // Show action buttons for non-admin, non-self — same as AlumniDirectory's showActions
    const showActions = !isAdmin && !isCurrentUser;

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

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top accent bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#142A5D] via-[#EBAB09] to-[#142A5D]" />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition z-10"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Body */}
                <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center">

                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-[#142A5D] flex items-center justify-center text-white text-2xl font-bold shadow-md ring-4 ring-white">
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
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                                <UserCheck className="w-4 h-4 text-green-600" />
                            </div>
                        )}
                    </div>

                    {/* Name + badges */}
                    <div className="mt-3 flex items-center gap-2 justify-center flex-wrap">
                        <h2 className="text-lg font-bold text-slate-900">
                            {poster.fullname || poster.username || "Anonymous"}
                        </h2>
                        {isAdmin && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-xs font-medium text-green-700">
                                <Shield className="w-3 h-3" /> Admin
                            </span>
                        )}
                        {isCurrentUser && (
                            <span className="text-[10px] bg-[#142A5D]/10 text-[#142A5D] px-2 py-0.5 rounded-full font-medium">
                                You
                            </span>
                        )}
                    </div>

                    {/* Username */}
                    {poster.username && poster.fullname && (
                        <p className="text-xs text-slate-400 mt-0.5">@{poster.username}</p>
                    )}

                    {/* Divider */}
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#EBAB09] to-transparent rounded-full mt-3 mb-4" />

                    {/* Info rows */}
                    <div className="w-full space-y-2.5 text-sm text-left">

                        <div className="flex items-center gap-2.5 text-slate-600">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <Mail className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                            <span className="truncate">{poster.email || "Email not provided"}</span>
                        </div>

                        <div className="flex items-center gap-2.5 text-blue-600">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                            </div>
                            <span className="truncate">
                                {poster.jobTitle
                                    ? `${poster.jobTitle}${poster.company ? ` at ${poster.company}` : ""}`
                                    : "Professional details not posted"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2.5 text-slate-600">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                            <span>{poster.stream || "Stream not provided"}</span>
                        </div>

                        <div className="flex items-center gap-2.5 text-slate-600">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            </div>
                            <span>
                                {poster.batch ? `Class of ${poster.batch}` : "Batch not provided"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <Linkedin className="w-3.5 h-3.5 text-[#142A5D]" />
                            </div>
                            {poster.linkedin ? (
                                <a
                                    href={
                                        poster.linkedin.startsWith("http")
                                            ? poster.linkedin
                                            : `https://${poster.linkedin}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-[#142A5D] font-medium hover:underline truncate"
                                >
                                    View LinkedIn Profile
                                </a>
                            ) : (
                                <span className="text-sm text-slate-400 italic">
                                    LinkedIn not posted
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── ACTION BUTTONS — same logic as AlumniDirectory ── */}
                {showActions && (
                    <div className="px-6 pb-6 pt-2 flex gap-3">
                        <ConnectButton
                            status={connectionStatus}
                            onConnect={handleConnect}
                            onRespond={() => {
                                onClose();
                                dispatch(openRequestsDialog());
                            }}
                            loading={!!sendingRequests?.[posterId]}
                        />
                        {/* Message: enabled only when ACCEPTED, disabled otherwise */}
                        <button
                            onClick={connectionStatus === "ACCEPTED" ? handleMessage : undefined}
                            disabled={connectionStatus !== "ACCEPTED"}
                            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition
                                ${connectionStatus === "ACCEPTED"
                                    ? "bg-[#142A5D] text-white hover:bg-[#0f2149] cursor-pointer"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            <MessageCircle className="w-4 h-4" />
                            Message
                        </button>
                    </div>
                )}

                {/* ── Admin notice ── */}
                {isAdmin && (
                    <div className="px-6 pb-5 pt-1">
                        <div className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                            <Shield className="w-4 h-4" />
                            Posted by the platform administrator
                        </div>
                    </div>
                )}

                {/* ── Viewing own profile ── */}
                {isCurrentUser && (
                    <div className="px-6 pb-5 pt-1">
                        <div className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#142A5D]/5 border border-[#142A5D]/15 text-[#142A5D] text-sm font-medium">
                            This is your post
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileDialog;