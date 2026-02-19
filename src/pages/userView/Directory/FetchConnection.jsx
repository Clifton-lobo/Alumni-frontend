import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserCheck, UserX, Users } from "lucide-react";
import {
  fetchIncomingRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
} from "../../../store/user-view/ConnectionSlice"; // ← adjust path

/* =========================
   SINGLE REQUEST CARD
========================= */
const RequestCard = ({ request, onAccept, onReject, accepting, rejecting }) => {
  const requester = request.requester;
  const initials = requester?.fullname?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-[#142A5D]/10 flex items-center justify-center flex-shrink-0 text-[#142A5D] font-bold text-lg overflow-hidden">
        {requester?.profileImage ? (
          <img
            src={requester.profileImage}
            alt={requester.fullname}
            className="w-full h-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 text-sm truncate">
          {requester?.fullname || "Unknown User"}
        </p>
        <p className="text-xs text-slate-500 truncate">
          @{requester?.username || "—"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => onAccept(request._id)}
          disabled={accepting || rejecting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#142A5D] text-white text-xs font-semibold hover:bg-[#0f2149] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserCheck className="w-3.5 h-3.5" />
          Accept
        </button>

        <button
          onClick={() => onReject(request._id)}
          disabled={accepting || rejecting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserX className="w-3.5 h-3.5" />
          Ignore
        </button>
      </div>
    </div>
  );
};

/* =========================
   DIALOG
========================= */
const FetchConnection = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const {
    incomingRequests,
    loading,
    acceptingRequest,
    rejectingRequest,
  } = useSelector((state) => state.connections);

  // Fetch fresh requests whenever the dialog opens
  useEffect(() => {
    if (open) {
      dispatch(fetchIncomingRequests());
    }
  }, [open, dispatch]);

  const handleAccept = (connectionId) => {
    dispatch(acceptConnectionRequest(connectionId));
  };

  const handleReject = (connectionId) => {
    dispatch(rejectConnectionRequest(connectionId));
  };

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

          {/* Dialog Panel */}
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
                <h2 className="font-bold text-slate-900 text-base">
                  Connection Requests
                </h2>
                {incomingRequests.length > 0 && (
                  <span className="ml-1 bg-[#F2A20A] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {incomingRequests.length}
                  </span>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 max-h-[60vh] overflow-y-auto">
              {/* Loading */}
              {loading && (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Loading requests…
                </div>
              )}

              {/* Empty */}
              {!loading && incomingRequests.length === 0 && (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">
                    No pending requests
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    New connection requests will appear here
                  </p>
                </div>
              )}

              {/* Request List */}
              {!loading &&
                incomingRequests.map((req) => (
                  <RequestCard
                    key={req._id}
                    request={req}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    accepting={acceptingRequest}
                    rejecting={rejectingRequest}
                  />
                ))}
            </div>

            {/* Footer */}
            {incomingRequests.length > 0 && (
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-400 text-center">
                  Accepting connects you — ignoring hides the request
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FetchConnection;