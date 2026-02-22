import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserCheck, UserX, Users, Clock, Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchIncomingRequests,
  fetchOutgoingRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
} from "../../../store/user-view/ConnectionSlice";

/* =========================
   AVATAR HELPER
========================= */
const UserAvatar = ({ user }) => {
  const initials = user?.fullname?.charAt(0)?.toUpperCase() || "?";
  return (
    <div className="w-11 h-11 rounded-full bg-[#142A5D]/10 flex items-center justify-center flex-shrink-0 text-[#142A5D] font-bold text-base overflow-hidden">
      {user?.profileImage ? (
        <img src={user.profileImage} alt={user?.fullname} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
};

/* =========================
   INCOMING REQUEST CARD
========================= */
const IncomingCard = ({ request, onAccept, onReject, accepting, rejecting }) => {
  const requester = request.requester;
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-slate-100 last:border-0">
      <UserAvatar user={requester} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 text-sm truncate">
          {requester?.fullname || "Unknown User"}
        </p>
        <p className="text-xs text-slate-400 truncate">@{requester?.username || "—"}</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => onAccept(request._id)}
          disabled={accepting || rejecting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#142A5D] text-white text-xs font-semibold hover:bg-[#0f2149] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserCheck className="w-3.5 h-3.5" />
          Accept
        </button>
        <button
          onClick={() => onReject(request._id)}
          disabled={accepting || rejecting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserX className="w-3.5 h-3.5" />
          Ignore
        </button>
      </div>
    </div>
  );
};

/* =========================
   SENT REQUEST CARD
========================= */
const SentCard = ({ request }) => {
  const recipient = request.recipient;
  const sentAt = request.createdAt
    ? new Date(request.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })
    : null;

  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-slate-100 last:border-0">
      <UserAvatar user={recipient} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 text-sm truncate">
          {recipient?.fullname || "Unknown User"}
        </p>
        <p className="text-xs text-slate-400 truncate">@{recipient?.username || "—"}</p>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
          <Clock className="w-3 h-3" />
          Pending
        </span>
        {sentAt && <span className="text-[10px] text-slate-400">{sentAt}</span>}
      </div>
    </div>
  );
};

/* =========================
   EMPTY STATE
========================= */
const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="py-12 text-center">
    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
      <Icon className="w-6 h-6 text-slate-400" />
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <p className="text-slate-400 text-xs mt-1">{subtitle}</p>
  </div>
);

/* =========================
   MAIN DIALOG
========================= */
const FetchConnection = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const {
    incomingRequests,
    outgoingRequests,
    loading,
    acceptingRequest,
    rejectingRequest,
  } = useSelector((state) => state.connections);

  useEffect(() => {
    if (open) {
      dispatch(fetchIncomingRequests());
      dispatch(fetchOutgoingRequests());
    }
  }, [open, dispatch]);

  const handleAccept = (connectionId) => dispatch(acceptConnectionRequest(connectionId));
  const handleReject = (connectionId) => dispatch(rejectConnectionRequest(connectionId));

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/30 backdrop-blursm z-[30]"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed top-20 right-4 md:right-8 z-[70] w-[90vw] max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#142A5D]" />
                <h2 className="font-bold text-slate-900 text-base">Connections</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="incoming" className="w-full">
              <div className="px-5 pt-3">
                <TabsList className="w-full grid grid-cols-2 bg-slate-100 rounded-xl p-1">
                  <TabsTrigger
                    value="incoming"
                    className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#142A5D] data-[state=active]:shadow-sm transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      Received
                      {incomingRequests.length > 0 && (
                        <span className="bg-[#F2A20A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                          {incomingRequests.length}
                        </span>
                      )}
                    </span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="sent"
                    className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-[#142A5D] data-[state=active]:shadow-sm transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      Sent
                      {outgoingRequests.length > 0 && (
                        <span className="bg-slate-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                          {outgoingRequests.length}
                        </span>
                      )}
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Received tab */}
              <TabsContent value="incoming" className="mt-0">
                <div className="px-5 max-h-[55vh] overflow-y-auto">
                  {loading ? (
                    <div className="py-12 text-center text-slate-400 text-sm">Loading…</div>
                  ) : incomingRequests.length === 0 ? (
                    <EmptyState
                      icon={Users}
                      title="No pending requests"
                      subtitle="New connection requests will appear here"
                    />
                  ) : (
                    incomingRequests.map((req) => (
                      <IncomingCard
                        key={req._id}
                        request={req}
                        onAccept={handleAccept}
                        onReject={handleReject}
                        accepting={acceptingRequest}
                        rejecting={rejectingRequest}
                      />
                    ))
                  )}
                </div>

                {incomingRequests.length > 0 && (
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
                    <p className="text-xs text-slate-400 text-center">
                      Accepting connects you — ignoring hides the request
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Sent tab */}
              <TabsContent value="sent" className="mt-0">
                <div className="px-5 max-h-[55vh] overflow-y-auto">
                  {loading ? (
                    <div className="py-12 text-center text-slate-400 text-sm">Loading…</div>
                  ) : outgoingRequests.length === 0 ? (
                    <EmptyState
                      icon={Send}
                      title="No sent requests"
                      subtitle="People you've sent requests to will appear here"
                    />
                  ) : (
                    outgoingRequests.map((req) => (
                      <SentCard key={req._id} request={req} />
                    ))
                  )}
                </div>

                {outgoingRequests.length > 0 && (
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
                    <p className="text-xs text-slate-400 text-center">
                      Requests are pending until the other person responds
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FetchConnection;