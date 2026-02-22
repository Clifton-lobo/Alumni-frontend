import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAcceptedConnections,
    fetchIncomingRequests,
    fetchOutgoingRequests,
    removeConnection,
    acceptConnectionRequest,
    rejectConnectionRequest,
} from "../../store/user-view/ConnectionSlice";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
    UserMinus, MessageSquare, Users, ArrowLeft,
    UserCheck, UserX, Clock, Send, Link2, Globe2, Sparkles,
} from "lucide-react";

const BLUE = "#142A5D";
const GOLD = "#F2A20A";

const getInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : null;

/* ── Avatar ── */
const UserAvatar = ({ user, size = "md" }) => {
    const sizeClass = size === "lg" ? "h-14 w-14 text-lg" : "h-11 w-11 text-base";
    const name = user?.fullname || user?.name || "?";
    const picture = user?.profilePicture || user?.profileImage || "";
    return (
        <Avatar className={`${sizeClass} rounded-2xl shrink-0 ring-2 ring-amber-100`}>
            <AvatarImage src={picture} alt={name} className="object-cover" />
            <AvatarFallback className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold">
                {getInitials(name)}
            </AvatarFallback>
        </Avatar>
    );
};

/* ── Skeleton ── */
const Skeleton = () => (
    <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-4 animate-pulse border border-slate-100">
                <div className="h-14 w-14 rounded-2xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-40" />
                    <div className="h-3 bg-slate-100 rounded w-60" />
                </div>
            </div>
        ))}
    </div>
);

/* ── Empty State ── */
const EmptyState = ({ icon: Icon, title, subtitle }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <div className="h-20 w-20 rounded-3xl bg-amber-50 flex items-center justify-center shadow-inner">
            <Icon className="h-9 w-9 text-amber-400" />
        </div>
        <p className="text-lg font-semibold text-slate-700">{title}</p>
        <p className="text-sm text-slate-400 max-w-xs">{subtitle}</p>
    </div>
);

/* ══════════════════════════════════════════════════
   RIGHT PANEL — network graphic + stats + tips
══════════════════════════════════════════════════ */
const RightPanel = ({ acceptedCount, incomingCount }) => (
    <div className="flex flex-col gap-5">
        {/* Network graphic card */}
        <div className="rounded-3xl overflow-hidden shadow-xl"
            style={{ background: `linear-gradient(145deg, ${BLUE}, #1e3d7a)` }}>
            <div className="px-6 pt-8 pb-4 flex flex-col items-center">
                {/* SVG illustration */}
                <svg viewBox="0 0 200 160" className="w-full max-w-[210px]" fill="none">
                    {/* dashed lines */}
                    <line x1="100" y1="80" x2="40"  y2="38"  stroke="rgba(242,162,10,0.45)" strokeWidth="1.5" strokeDasharray="4 3"/>
                    <line x1="100" y1="80" x2="162" y2="38"  stroke="rgba(242,162,10,0.45)" strokeWidth="1.5" strokeDasharray="4 3"/>
                    <line x1="100" y1="80" x2="28"  y2="122" stroke="rgba(242,162,10,0.45)" strokeWidth="1.5" strokeDasharray="4 3"/>
                    <line x1="100" y1="80" x2="172" y2="122" stroke="rgba(242,162,10,0.45)" strokeWidth="1.5" strokeDasharray="4 3"/>
                    <line x1="100" y1="80" x2="100" y2="16"  stroke="rgba(242,162,10,0.45)" strokeWidth="1.5" strokeDasharray="4 3"/>
                    {/* faint cross lines */}
                    <line x1="40"  y1="38"  x2="28"  y2="122" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
                    <line x1="162" y1="38"  x2="172" y2="122" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
                    {/* outer nodes */}
                    <circle cx="40"  cy="38"  r="14" fill="rgba(255,255,255,0.1)"  stroke="rgba(242,162,10,0.7)" strokeWidth="1.5"/>
                    <circle cx="40"  cy="38"  r="8"  fill={GOLD} opacity="0.9"/>
                    <circle cx="162" cy="38"  r="14" fill="rgba(255,255,255,0.1)"  stroke="rgba(242,162,10,0.7)" strokeWidth="1.5"/>
                    <circle cx="162" cy="38"  r="8"  fill={GOLD} opacity="0.9"/>
                    <circle cx="28"  cy="122" r="13" fill="rgba(255,255,255,0.1)"  stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                    <circle cx="28"  cy="122" r="7"  fill="rgba(255,255,255,0.75)"/>
                    <circle cx="172" cy="122" r="13" fill="rgba(255,255,255,0.1)"  stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                    <circle cx="172" cy="122" r="7"  fill="rgba(255,255,255,0.75)"/>
                    <circle cx="100" cy="16"  r="12" fill="rgba(255,255,255,0.1)"  stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                    <circle cx="100" cy="16"  r="6"  fill="rgba(255,255,255,0.75)"/>
                    {/* centre YOU */}
                    <circle cx="100" cy="80" r="24" fill="rgba(255,255,255,0.12)" stroke={GOLD} strokeWidth="2"/>
                    <circle cx="100" cy="80" r="16" fill={GOLD}/>
                    <text x="100" y="85" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight="bold">YOU</text>
                </svg>

                <p className="text-white font-bold text-base mt-3 text-center">Your Network</p>
                <p className="text-blue-200 text-[11px] text-center mt-1 mb-4 leading-relaxed px-2">
                    Every connection is a door to a new opportunity
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10">
                <div className="py-4 text-center">
                    <p className="text-2xl font-bold text-white">{acceptedCount}</p>
                    <p className="text-[11px] text-blue-200 mt-0.5">Connected</p>
                </div>
                <div className="py-4 text-center">
                    <p className="text-2xl font-bold" style={{ color: GOLD }}>{incomingCount}</p>
                    <p className="text-[11px] text-blue-200 mt-0.5">Pending</p>
                </div>
            </div>
        </div>

        {/* Tips card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Network tips</p>

            {[
                { Icon: Globe2,      color: BLUE,         bg: `${BLUE}12`,  title: "Grow your reach",       desc: "Connect with alumni from different batches and streams." },
                { Icon: MessageSquare, color: GOLD,       bg: `${GOLD}20`,  title: "Start conversations",   desc: "Message connections to share ideas and opportunities." },
                { Icon: Sparkles,    color: "#22c55e",    bg: "#f0fdf4",    title: "Accept requests",       desc: "Review pending requests — someone may be waiting." },
            ].map(({ Icon, color, bg, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-700">{title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

/* ══════════════════════════════════════════════════
   CONNECTED TAB
══════════════════════════════════════════════════ */
const ConnectedTab = ({ onMessage, onRemove }) => {
    const { acceptedConnections, loading } = useSelector((s) => s.connections);
    if (loading) return <Skeleton />;
    if (!acceptedConnections.length)
        return <EmptyState icon={Users} title="No connections yet" subtitle="Start connecting with alumni and peers to grow your network." />;

    return (
        <ul className="space-y-3">
            {acceptedConnections.map((conn) => {
                const user   = conn.user || conn;
                const connId = conn._id || conn.id;
                const name   = user.fullname || user.name || "Unknown";
                const jobTitle = user.jobTitle || conn.jobTitle || "";
                const company  = user.company  || conn.company  || "";
                return (
                    <li key={connId}
                        className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all border border-slate-100 hover:border-amber-200">
                        <UserAvatar user={user} size="lg" />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 truncate">{name}</p>
                            <p className="text-sm text-slate-500 truncate mt-0.5">
                                {jobTitle && company ? `${jobTitle} · ${company}` : jobTitle || company || "—"}
                            </p>
                            {conn.connectedAt && (
                                <p className="text-xs text-slate-300 mt-1">Connected {formatDate(conn.connectedAt)}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button title="Message" onClick={() => onMessage?.(conn)}
                                className="p-2.5 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                                <MessageSquare className="h-[18px] w-[18px]" />
                            </button>
                            <button title="Remove connection" onClick={() => onRemove(connId)}
                                className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                <UserMinus className="h-[18px] w-[18px]" />
                            </button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

/* ══════════════════════════════════════════════════
   RECEIVED TAB
══════════════════════════════════════════════════ */
const ReceivedTab = () => {
    const dispatch = useDispatch();
    const { incomingRequests, loading, acceptingRequest, rejectingRequest } = useSelector((s) => s.connections);

    const handleAccept = async (id) => {
        try   { await dispatch(acceptConnectionRequest(id)).unwrap(); toast.success("Connection accepted!"); }
        catch (err) { toast.error(err || "Failed to accept request."); }
    };
    const handleReject = async (id) => {
        try   { await dispatch(rejectConnectionRequest(id)).unwrap(); toast.success("Request ignored."); }
        catch (err) { toast.error(err || "Failed to ignore request."); }
    };

    if (loading) return <Skeleton />;
    if (!incomingRequests.length)
        return <EmptyState icon={Users} title="No pending requests" subtitle="New connection requests will appear here." />;

    return (
        <ul className="space-y-3">
            {incomingRequests.map((req) => {
                const requester = req.requester;
                return (
                    <li key={req._id}
                        className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm border border-slate-100 hover:border-amber-200 transition-all">
                        <UserAvatar user={requester} size="lg" />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 truncate">{requester?.fullname || "Unknown"}</p>
                            <p className="text-sm text-slate-400 truncate">@{requester?.username || "—"}</p>
                            {req.createdAt && <p className="text-xs text-slate-300 mt-1">Sent {formatDate(req.createdAt)}</p>}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => handleAccept(req._id)} disabled={acceptingRequest || rejectingRequest}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition disabled:opacity-50"
                                style={{ background: BLUE }}>
                                <UserCheck className="w-3.5 h-3.5" /> Accept
                            </button>
                            <button onClick={() => handleReject(req._id)} disabled={acceptingRequest || rejectingRequest}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition disabled:opacity-50">
                                <UserX className="w-3.5 h-3.5" /> Ignore
                            </button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

/* ══════════════════════════════════════════════════
   SENT TAB
══════════════════════════════════════════════════ */
const SentTab = () => {
    const { outgoingRequests, loading } = useSelector((s) => s.connections);
    if (loading) return <Skeleton />;
    if (!outgoingRequests.length)
        return <EmptyState icon={Send} title="No sent requests" subtitle="People you've requested to connect with will appear here." />;

    return (
        <ul className="space-y-3">
            {outgoingRequests.map((req) => {
                const recipient = req.recipient;
                return (
                    <li key={req._id}
                        className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm border border-slate-100 hover:border-amber-200 transition-all">
                        <UserAvatar user={recipient} size="lg" />
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 truncate">{recipient?.fullname || "Unknown"}</p>
                            <p className="text-sm text-slate-400 truncate">@{recipient?.username || "—"}</p>
                            {req.createdAt && <p className="text-xs text-slate-300 mt-1">Sent {formatDate(req.createdAt)}</p>}
                        </div>
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex-shrink-0">
                            <Clock className="w-3 h-3" /> Pending
                        </span>
                    </li>
                );
            })}
        </ul>
    );
};

/* ══════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════ */
const ConnectionsList = ({ onClose, onMessage }) => {
    const dispatch = useDispatch();
    const { acceptedConnections, incomingRequests, outgoingRequests, removingConnection } =
        useSelector((s) => s.connections);
    const [pendingRemoveId, setPendingRemoveId] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        dispatch(fetchAcceptedConnections());
        dispatch(fetchIncomingRequests());
        dispatch(fetchOutgoingRequests());
    }, [dispatch]);

    const handleConfirmRemove = async () => {
        if (!pendingRemoveId) return;
        try   { await dispatch(removeConnection(pendingRemoveId)).unwrap(); toast.success("Connection removed."); }
        catch (err) { toast.error(err || "Failed to remove connection."); }
        finally { setPendingRemoveId(null); }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100">

            {/* ── Header ── */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center gap-3">
                {onClose && (
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition text-slate-500">
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                )}
                <Link2 className="h-4 w-4 text-amber-500" />
                <h1 className="text-base font-semibold text-slate-800">My Network</h1>
                <span className="ml-auto text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {acceptedConnections.length} connected
                </span>
            </div>

            {/* ── Two-column layout ── */}
            <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6 items-start">

                {/* LEFT 70% */}
                <div className="flex-1 min-w-0">
                    <Tabs defaultValue="connected" className="w-full">
                        <TabsList className="w-full grid grid-cols-3 bg-white border border-slate-200 rounded-2xl p-1 mb-6 shadow-sm">
                            <TabsTrigger value="connected"
                                className="rounded-xl text-xs font-semibold data-[state=active]:bg-[#142A5D] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
                                <span className="flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5" />
                                    Connected
                                    {acceptedConnections.length > 0 && (
                                        <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                                            {acceptedConnections.length}
                                        </span>
                                    )}
                                </span>
                            </TabsTrigger>

                            <TabsTrigger value="received"
                                className="rounded-xl text-xs font-semibold data-[state=active]:bg-[#142A5D] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
                                <span className="flex items-center gap-1.5">
                                    <UserCheck className="w-3.5 h-3.5" />
                                    Received
                                    {incomingRequests.length > 0 && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none text-white"
                                            style={{ background: GOLD }}>
                                            {incomingRequests.length}
                                        </span>
                                    )}
                                </span>
                            </TabsTrigger>

                            <TabsTrigger value="sent"
                                className="rounded-xl text-xs font-semibold data-[state=active]:bg-[#142A5D] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
                                <span className="flex items-center gap-1.5">
                                    <Send className="w-3.5 h-3.5" />
                                    Sent
                                    {outgoingRequests.length > 0 && (
                                        <span className="bg-slate-300 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                                            {outgoingRequests.length}
                                        </span>
                                    )}
                                </span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="connected">
                            <ConnectedTab onMessage={onMessage} onRemove={(id) => setPendingRemoveId(id)} />
                        </TabsContent>
                        <TabsContent value="received"><ReceivedTab /></TabsContent>
                        <TabsContent value="sent"><SentTab /></TabsContent>
                    </Tabs>
                </div>

                {/* RIGHT 30% — hidden on small screens */}
                <div className="hidden lg:block w-[30%] flex-shrink-0 sticky top-20">
                    <RightPanel
                        acceptedCount={acceptedConnections.length}
                        incomingCount={incomingRequests.length}
                    />
                </div>
            </div>

            {/* ── Remove Dialog ── */}
            <Dialog open={!!pendingRemoveId} onOpenChange={(open) => !open && setPendingRemoveId(null)}>
                <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden">
                    <div className="p-6">
                        <DialogHeader>
                            <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                                <UserMinus className="h-6 w-6 text-red-500" />
                            </div>
                            <DialogTitle className="text-lg font-semibold text-slate-800">Remove connection?</DialogTitle>
                            <DialogDescription className="text-sm text-slate-500 mt-1">
                                This person will be removed from your connections. You can always connect again later.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <DialogFooter className="bg-slate-50 px-6 py-4 flex gap-2 justify-end border-t border-slate-100">
                        <Button variant="ghost" onClick={() => setPendingRemoveId(null)}
                            className="rounded-xl text-slate-600 hover:bg-slate-100">Cancel</Button>
                        <Button onClick={handleConfirmRemove} disabled={removingConnection}
                            className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold px-5">
                            {removingConnection ? "Removing…" : "Remove"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ConnectionsList;