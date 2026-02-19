import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAcceptedConnections,
    removeConnection,
} from "../../store/user-view/ConnectionSlice"; // adjust path
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { UserMinus, MessageSquare, Users, ArrowLeft } from "lucide-react";

/* -----------------------------------------------------------------------
   ConnectionsList
   Props:
     onClose  – called when the user clicks "Back" / closes the panel
----------------------------------------------------------------------- */
const ConnectionsList = ({ onClose }) => {
    const dispatch = useDispatch();
    const { acceptedConnections, loading, removingConnection } = useSelector(
        (state) => state.connections
    );

    // ID of the connection pending removal confirmation
    const [pendingRemoveId, setPendingRemoveId] = useState(null);

    /* ── fetch on mount ── */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        dispatch(fetchAcceptedConnections());
    }, [dispatch]);

    /* ── remove handler ── */
    const handleConfirmRemove = async () => {
        if (!pendingRemoveId) return;
        try {
            await dispatch(removeConnection(pendingRemoveId)).unwrap();
            toast.success("Connection removed");
        } catch (err) {
            toast.error("Failed to remove connection", { description: err });
        } finally {
            setPendingRemoveId(null);
        }
    };

    /* ── helpers ── */
    const getInitials = (name = "") =>
        name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    /* ── render ── */
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100">
            {/* ── Header bar ── */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center gap-3">
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 transition text-slate-500"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                )}

                <Users className="h-4 w-4 text-amber-500" />
                <h1 className="text-base font-semibold text-slate-800">
                    My Connections
                </h1>

                <span className="ml-auto text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {acceptedConnections.length}
                </span>
            </div>

            {/* ── Body ── */}
            <div className="max-w-2xl mx-auto px-4 py-8">
                {loading ? (
                    /* skeleton */
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-4 flex items-center gap-4 animate-pulse"
                            >
                                <div className="h-14 w-14 rounded-2xl bg-slate-200 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-200 rounded w-40" />
                                    <div className="h-3 bg-slate-100 rounded w-60" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : acceptedConnections.length === 0 ? (
                    /* empty state */
                    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                        <div className="h-20 w-20 rounded-3xl bg-amber-50 flex items-center justify-center shadow-inner">
                            <Users className="h-9 w-9 text-amber-400" />
                        </div>
                        <p className="text-xl font-semibold text-slate-700">
                            No connections yet
                        </p>
                        <p className="text-sm text-slate-400 max-w-xs">
                            Start connecting with alumni and peers to grow your network.
                        </p>
                    </div>
                ) : (
                    /* list */
                    <ul className="space-y-3">
                        {acceptedConnections.map((conn) => {
                            /* support both shapes: flat user object or nested conn.user */
                            const user = conn.user || conn;
                            const connId = conn._id || conn.id;
                            const name = user.fullname || user.name || "Unknown";
                            const jobTitle = user.jobTitle || conn.jobTitle || "";
                            const company = user.company || conn.company || "";
                            const picture = user.profilePicture || conn.profilePicture || "";

                            return (
                                <li
                                    key={connId}
                                    className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-100 hover:border-amber-200"
                                >
                                    {/* Avatar */}
                                    <Avatar className="h-14 w-14 rounded-2xl shrink-0 ring-2 ring-amber-100 group-hover:ring-amber-300 transition-all">
                                        <AvatarImage src={picture} alt={name} className="object-cover" />
                                        <AvatarFallback className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-lg">
                                            {getInitials(name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-800 truncate leading-tight">
                                            {name}
                                        </p>
                                        <p className="text-sm text-slate-500 truncate mt-0.5">
                                            {jobTitle && company
                                                ? `${jobTitle} · ${company}`
                                                : jobTitle || company || "—"}
                                        </p>
                                        {conn.connectedAt && (
                                            <p className="text-xs text-slate-300 mt-1">
                                                Connected{" "}
                                                {new Date(conn.connectedAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        {/* Message (static) */}
                                        <button
                                            title="Message"
                                            className="p-2.5 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                                        >
                                            <MessageSquare className="h-4.5 w-4.5 " />
                                        </button>

                                        {/* Remove */}
                                        <button
                                            title="Remove connection"
                                            onClick={() => setPendingRemoveId(connId)}
                                            className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <UserMinus className="h-[18px] w-[18px]" />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* ── Remove Confirmation Dialog ── */}
            <Dialog
                open={!!pendingRemoveId}
                onOpenChange={(open) => !open && setPendingRemoveId(null)}
            >
                <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden">
                    <div className="p-6">
                        <DialogHeader>
                            <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                                <UserMinus className="h-6 w-6 text-red-500" />
                            </div>
                            <DialogTitle className="text-lg font-semibold text-slate-800">
                                Remove connection?
                            </DialogTitle>
                            <DialogDescription className="text-sm text-slate-500 mt-1">
                                This person will be removed from your connections. You can
                                always connect again later.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <DialogFooter className="bg-slate-50 px-6 py-4 flex gap-2 justify-end border-t border-slate-100">
                        <Button
                            variant="ghost"
                            onClick={() => setPendingRemoveId(null)}
                            className="rounded-xl text-slate-600 hover:bg-slate-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmRemove}
                            disabled={removingConnection}
                            className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold px-5"
                        >
                            {removingConnection ? "Removing…" : "Remove"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ConnectionsList;