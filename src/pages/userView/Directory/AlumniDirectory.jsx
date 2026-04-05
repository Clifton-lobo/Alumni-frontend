import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchAlumni } from "../../../store/user-view/AlumniDirectorySlice";
import {
  fetchAcceptedConnections,
  fetchIncomingRequests,
  fetchOutgoingRequests,
  sendConnectionRequest,
  openRequestsDialog,
} from "../../../store/user-view/ConnectionSlice";
import PaginationControls from "../../../components/common/Pagination";
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
  Search,
} from "lucide-react";

const DEBOUNCE_DELAY = 500;
const MIN_SEARCH_LENGTH = 2;

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
  Avatar gradient per first letter
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
  Primary action button (left):
  Connect / Request Sent / Respond / Message
───────────────────────────────────────────── */

const PrimaryActionButton = ({ status, onConnect, onRespond, onMessage, loading }) => {
  return (
    <>
      <style>{`
        .ued-primary-btn {
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%);
          position: relative;
          overflow: hidden;
          transition: transform .2s, box-shadow .2s;
        }
        .ued-primary-btn::before {
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
        .ued-primary-btn:hover:not(:disabled)::before {
          opacity: 1;
          animation: ued-shimmer 1.4s linear infinite;
        }
        .ued-primary-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(15,23,42,.35);
        }
        .ued-primary-btn:active:not(:disabled) { transform: translateY(0); }
        @keyframes ued-shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }
      `}</style>

      {status === "ACCEPTED" && (
        <button
          onClick={onMessage}
          className="ued-primary-btn flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          Message
        </button>
      )}
      {status === "PENDING_SENT" && (
        <button
          disabled
          className="flex-1 px-4 py-2.5 rounded-xl bg-amber-50 text-amber-700 text-sm font-semibold flex items-center justify-center gap-2 border border-amber-200 cursor-default"
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
      {(status === "NONE" || (!["ACCEPTED","PENDING_SENT","PENDING_RECEIVED"].includes(status))) && (
        <button
          onClick={onConnect}
          disabled={loading}
          className="ued-primary-btn flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          {loading ? "Sending…" : "Connect"}
        </button>
      )}
    </>
  );
};

/* ─────────────────────────────────────────────
  LinkedIn icon button (right)
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
  Main Page
───────────────────────────────────────────── */
const AlumniDirectory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();


  // ── Read URL params ──
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const searchFromUrl = searchParams.get("search") || "";
  const batchFromUrl = searchParams.get("batch") || "";
  const streamFromUrl = searchParams.get("stream") || "";

  // ── Alumni state ──
  const { alumniList, loading, error, totalPages, totalUsers } = useSelector(
    (state) => state.alumni
  );

  // ── Auth ──
  const currentUser = useSelector((state) => state.auth.user);

  // ── Connection state ──
  const { acceptedConnections, incomingRequests, outgoingRequests, sendingRequests } =
    useSelector((state) => state.connections);

  const currentUserId =
    currentUser?.id?.toString() || currentUser?._id?.toString();

  const [searchText, setSearchText] = useState("");

  // ── Refs ──
  const isFirstRender = useRef(true);
  const didMountRef = useRef(false);
  const listContainerRef = useRef(null);
  const prevPageRef = useRef(pageFromUrl);

  /* -----------------------------------
     MAIN FETCH — URL param driven
  ----------------------------------- */
  useEffect(() => {
    dispatch(
      fetchAlumni({
        page: pageFromUrl,
        search: searchFromUrl,
        batch: batchFromUrl,
        stream: streamFromUrl,
      })
    );
  }, [pageFromUrl, searchFromUrl, batchFromUrl, streamFromUrl, dispatch]);

  /* -----------------------------------
     FETCH CONNECTIONS (once)
  ----------------------------------- */
  useEffect(() => {
    dispatch(fetchAcceptedConnections());
    dispatch(fetchIncomingRequests());
    dispatch(fetchOutgoingRequests());
  }, []);

  /* -----------------------------------
     RESET PAGE WHEN FILTERS CHANGE
  ----------------------------------- */
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", "1");
      return params;
    });
  }, [batchFromUrl, streamFromUrl]);

  /* -----------------------------------
     DEBOUNCED SEARCH
  ----------------------------------- */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const trimmed = searchText.trim();
    if (trimmed !== "" && trimmed.length < MIN_SEARCH_LENGTH) return;

    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (trimmed) params.set("search", trimmed);
        else params.delete("search");
        params.set("page", "1");
        return params;
      });

      dispatch(
        fetchAlumni({
          page: 1,
          search: trimmed || undefined,
          batch: batchFromUrl,
          stream: streamFromUrl,
        })
      );
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchText, batchFromUrl, streamFromUrl, dispatch]);

  /* -----------------------------------
     SCROLL TO LIST AFTER PAGE CHANGE
  ----------------------------------- */
  useEffect(() => {
    if (loading) return;

    if (prevPageRef.current !== pageFromUrl) {
      prevPageRef.current = pageFromUrl;

      setTimeout(() => {
        const element = listContainerRef.current;
        if (!element) return;

        const headerOffset = 120;
        const offsetPosition =
          element.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }, 300);
    }
  }, [loading, pageFromUrl]);

  /* -----------------------------------
     HANDLERS
  ----------------------------------- */
  const handleBatchChange = (value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (value) params.set("batch", value);
      else params.delete("batch");
      params.set("page", "1");
      return params;
    });
  };

  const handleStreamChange = (value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (value) params.set("stream", value);
      else params.delete("stream");
      params.set("page", "1");
      return params;
    });
  };

  const handlePageChange = (page) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", String(page));
      return params;
    });
  };

  const handleMessage = (user) => {
    navigate("/user/messages", {
      state: {
        recipientId: user._id.toString(),
        recipientUser: {
          _id: user._id.toString(),
          fullname: user.fullname,
          username: user.username,
          profileImage: user.profilePicture,
        },
      },
    });
  };

  const handleConnect = (recipientId) => {
    dispatch(sendConnectionRequest(recipientId));
  };

  /* -----------------------------------
     MEMOIZED VALUES
  ----------------------------------- */
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 50 }, (_, i) => currentYear - i);
  }, []);

  /* -----------------------------------
     RENDER
  ----------------------------------- */
  return (
    <div className="min-h-screen bg-[#F0F2F7]">

      {/* ── HERO ── */}
      <div className="bg-[#142A5D] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Alumni Directory</h1>
          <p className="mt-3 text-white/60 text-base">
            Connect with fellow alumni and grow your network.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#142A5D]/50" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search alumni by name, batch, company..."
                className="w-full rounded-xl border-[1.5px] border-transparent bg-white pl-12 pr-4 py-3.5 text-[#142A5D] text-sm outline-none placeholder:text-[#142A5D]/40 focus:border-[#EBAB09] transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 -mt-6 pb-24">

        {/* FILTERS */}
        <div
          ref={listContainerRef}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="flex gap-3 flex-wrap">
            <select
              value={batchFromUrl}
              onChange={(e) => handleBatchChange(e.target.value)}
              className="appearance-none border-[1.5px] border-gray-200 rounded-xl pl-4 pr-10 py-2.5 bg-gray-50 text-sm text-gray-700 font-medium focus:outline-none focus:border-[#142A5D] hover:border-[#142A5D] transition-colors cursor-pointer min-w-[160px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
              }}
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={streamFromUrl}
              onChange={(e) => handleStreamChange(e.target.value)}
              className="appearance-none border-[1.5px] border-gray-200 rounded-xl pl-4 pr-10 py-2.5 bg-gray-50 text-sm text-gray-700 font-medium focus:outline-none focus:border-[#142A5D] hover:border-[#142A5D] transition-colors cursor-pointer min-w-[160px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
              }}
            >
              <option value="">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="MECH">MECH</option>
              <option value="EEE">EEE</option>
              <option value="ECE">ECE</option>
              <option value="CIVIL">CIVIL</option>
              <option value="IT">IT</option>
              <option value="CHEM">CHEM</option>
              <option value="AERO">AERO</option>
              <option value="BIOTECH">BIOTECH</option>
              <option value="MBA">MBA</option>
            </select>
          </div>

          <p className="text-sm text-gray-400">
            <span className="text-[#142A5D] font-semibold">{totalUsers}</span> Results
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20 text-slate-500">Loading alumni...</div>
        )}

        {/* ERROR */}
        {error && (
          <div className="text-center py-20 text-red-500 font-medium">
            {typeof error === "string" ? error : error?.message || "Something went wrong"}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && alumniList.length === 0 && (
          <div className="text-center py-20 text-slate-500">No alumni found.</div>
        )}

        {/* GRID */}
        {!loading && !error && alumniList.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumniList.map((user) => {
              const userId = user._id?.toString();
              const isCurrentUser = !!(userId && currentUserId && userId === currentUserId);
              const isAdmin = user.role === "admin";
              const showActions = !isAdmin && !isCurrentUser;

              const connectionStatus = getConnectionStatus(
                userId,
                currentUserId,
                acceptedConnections,
                outgoingRequests,
                incomingRequests
              );

              return (
                <div
                  key={user._id}
                  className="bg-white rounded-2xl border-[1.5px] border-gray-100 shadow-sm hover:shadow-xl overflow-hidden flex flex-col"
                >
                  {/* Card body */}
                  <div className="p-6 flex flex-col items-center text-center flex-1">

                    {/* Avatar */}
                    <div className="relative mb-4">
                      <div
                        className={`w-[72px] h-[72px] rounded-full overflow-hidden bg-gradient-to-br ${getAvatarColor(user.fullname)} flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md`}
                      >
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt={user.fullname} className="w-full h-full object-cover" />
                        ) : (
                          user.fullname?.charAt(0)?.toUpperCase() || "U"
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
                      {user.fullname}
                      {isCurrentUser && (
                        <span className="text-[10px] text-[#142A5D]/50 font-medium">(you)</span>
                      )}
                    </h2>

                    {/* Info rows */}
                    <div className="mt-4 w-full flex flex-col gap-2">

                      {/* Email */}
                      <div className="flex items-center gap-2.5 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500">
                        <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{user.email || "Email not provided"}</span>
                      </div>

                      {/* Job */}
                      <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-500">
                        <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">
                          {user.jobTitle
                            ? `${user.jobTitle}${user.company ? ` at ${user.company}` : ""}`
                            : "Professional details not posted"}
                        </span>
                      </div>

                      {/* Stream + Batch */}
                      <div className="flex items-center gap-2.5 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500">
                        <GraduationCap className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span>
                          {user.stream || "Stream not provided"} ·{" "}
                          {user.batch ? `Class of ${user.batch}` : "Batch not provided"}
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
                        onRespond={() => dispatch(openRequestsDialog())}
                        onConnect={() => handleConnect(userId)}
                        onMessage={() => handleMessage(user)}
                        loading={!!sendingRequests[userId]}
                      />
                      <LinkedInButton url={user.linkedin} />
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
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-16">
            <PaginationControls
              currentPage={pageFromUrl}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniDirectory;