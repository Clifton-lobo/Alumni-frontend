import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  fetchAlumni,
} from "../../../store/user-view/AlumniDirectorySlice";
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
  Calendar,
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
  Connect Button
───────────────────────────────────────────── */
const ConnectButton = ({ status, onConnect, onRespond, loading }) => {
  if (status === "ACCEPTED") {
    return (
      <button
        disabled
        className="flex-1 px-4 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-semibold flex items-center justify-center gap-2 border border-green-200"
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
        className="flex-1 px-4 py-2 rounded-lg bg-amber-50 text-amber-700 text-sm font-semibold flex items-center justify-center gap-2 border border-amber-200"
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
        className="flex-1 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold hover:bg-blue-200 flex items-center justify-center gap-2 border border-blue-200 transition"
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
      className="flex-1 px-4 py-2 rounded-lg 
bg-gradient-to-r from-[#2A4A88] via-[#4A6FC1] to-[#2A4A88] shadow-inner
   text-white text-sm font-semibold 
hover:bg-[#2F5C8E] 
flex items-center justify-center gap-2 
transition disabled:opacity-50 cursor-pointer"    >
      <UserPlus className="w-4 h-4" />
      {loading ? "Sending…" : "Connect"}
    </button>
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

  // ── Local search text — pure local state, NOT synced from URL
  //    Mirrors UserEvents exactly: user types freely, debounce
  //    writes to URL, but the input itself is never reset externally.
  const [searchText, setSearchText] = useState("");

  // ── Refs ──
  const isFirstRender = useRef(true);
  const didMountRef = useRef(false);
  const listContainerRef = useRef(null);
  const prevPageRef = useRef(pageFromUrl);

  /* -----------------------------------
     MAIN FETCH — URL param driven
     searchFromUrl (written by debounce)
     is the API source of truth.
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
     (skip first mount so URL page is
      respected on load)
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
     DEBOUNCED SEARCH — mirrors UserEvents:
     1. Resets page to 1 via URL
     2. Also dispatches directly in case
        user is already on page 1 (URL
        wouldn't change, so main fetch
        useEffect above wouldn't re-run)
  ----------------------------------- */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const trimmed = searchText.trim();
    if (trimmed !== "" && trimmed.length < MIN_SEARCH_LENGTH) return;

    const timer = setTimeout(() => {
      // Write search + reset page in URL
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (trimmed) params.set("search", trimmed);
        else params.delete("search");
        params.set("page", "1");
        return params;
      });

      // Direct dispatch for when user is already on page 1
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
    <div className="min-h-screen bg-[#F5F6F8]">

      {/* ── HERO (original UI unchanged) ── */}
      <div className="bg-[#142A5D] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Alumni Directory</h1>
          <p className="mt-4 text-white/80 text-lg">
            Connect with fellow alumni and grow your network.
          </p>

          {/* Search bar — original SearchComponent replaced with
              inline input that mirrors UserEvents logic exactly */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="mx-auto max-w-4xl px-4 mt-8">
              <div className="flex items-center gap-3">

                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#142A5D]/60" />

                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search alumni by name, batch, company..."
                    className="w-full rounded-xl border border-[#142A5D]/20 bg-white px-12 py-3 text-[#142A5D] outline-none transition-all duration-200 placeholder:text-[#142A5D]/50 focus:border-[#142A5D] focus:ring-2 focus:ring-[#142A5D]/10"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 pb-20">

        {/* FILTERS — also the scroll target */}
        <div
          ref={listContainerRef}
          className="bg-white rounded-md shadow-sm p-6 mb-10 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex gap-4 flex-wrap">
            <select
              value={batchFromUrl}
              onChange={(e) => handleBatchChange(e.target.value)}
              className="border rounded-md px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#142A5D]/30"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={streamFromUrl}
              onChange={(e) => handleStreamChange(e.target.value)}
              className="border rounded-md px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#142A5D]/30"
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
          <div className="text-slate-500 text-sm">{totalUsers} Results</div>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  className="group relative bg-white rounded-2xl border hovershadow-md hover:shadow-2xl transition-all duration-300 border-gray-100 shadow-sm  overflow-hidden flex flex-col"
                >
                  {/* Hover Accent */}

                 {/* alumni card */}
                  <div className="p-5 flex flex-col items-center text-center flex-1">

                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center text-slate-600 text-xl font-semibold shadow">
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt={user.fullname} className="w-full h-full object-cover" />
                        ) : (
                          user.fullname?.charAt(0)?.toUpperCase() || "U"
                        )}
                      </div>
                      {connectionStatus === "ACCEPTED" && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                          <UserCheck className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <h2 className="mt-3 text-base font-semibold text-slate-900">
                      {user.fullname}
                      {isCurrentUser && (
                        <span className="ml-2 text-[10px] bg-[#142A5D]/10 text-[#142A5D] px-2 py-0.5 rounded-full font-medium">
                          You
                        </span>
                      )}
                    </h2>

                    {/* Email */}
                    <div className="flex items-center justify-center gap-1.5 text-sm text-slate-500 mt-1">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {user.email || "Email not provided"}
                    </div>

                    {/* Job */}
                    <div className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-blue-600">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      {user.jobTitle
                        ? `${user.jobTitle}${user.company ? ` at ${user.company}` : ""}`
                        : "Professional details not posted"}
                    </div>

                    {/* Meta */}
                    <div className="mt-3 space-y-1 text-sm text-slate-600">
                      <div className="flex items-center justify-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                        {user.stream || "Stream not provided"}
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {user.batch ? `Class of ${user.batch}` : "Batch not provided"}
                      </div>
                    </div>

                    {/* LinkedIn */}
                    <div className="mt-3">
                      {user.linkedin ? (
                        <a
                          href={user.linkedin.startsWith("http") ? user.linkedin : `https://${user.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-[#142A5D] hover:underline"
                        >
                          <Linkedin className="w-4 h-4" />
                          LinkedIn
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">LinkedIn not posted</span>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100" />

                  {/* Actions */}
                  {showActions && (
                    <div className="p-4 bg-gray-50 flex gap-2.5">
                      <ConnectButton
                        status={connectionStatus}
                        onRespond={() => dispatch(openRequestsDialog())}
                        onConnect={() => handleConnect(userId)}
                        loading={!!sendingRequests[userId]}
                      />
                      <button
                        onClick={connectionStatus === "ACCEPTED" ? () => handleMessage(user) : undefined}
                        disabled={connectionStatus !== "ACCEPTED"}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition
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

                  {/* Self notice */}
                  {isCurrentUser && (
                    <div className="p-4 bg-gray-50">
                      <div className="flex items-center justify-center py-2 rounded-xl bg-[#142A5D]/5 border border-[#142A5D]/15 text-[#142A5D] text-sm font-medium">
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

