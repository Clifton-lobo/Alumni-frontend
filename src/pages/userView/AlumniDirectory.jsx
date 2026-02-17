import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAlumni,
  setPage,
  setBatch,
  setStream,
  setSearch,
} from "../../store/user-view/AlumniDirectorySlice";
import PaginationControls from "../../components/common/Pagination";
import SearchComponent from "../../components/common/Search";

const AlumniDirectory = () => {
  const dispatch = useDispatch();

  const {
    alumniList,
    loading,
    error,
    currentPage,
    totalPages,
    batch,
    stream,
    search,
  } = useSelector((state) => state.alumni);

  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchAlumni());
  }, [dispatch, currentPage, batch, stream, search]);

  return (
    <div className="min-h-screen bg-[#F5F6F8]">

      {/* ================= HERO ================= */}
      <div className="bg-[#142A5D] text-white py-20 px-6">
        <div className="max-w-7xl mxauto text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Alumni Directory
          </h1>
          <p className="mt-4 text-white/80 text-lg">
            Connect with fellow alumni and grow your network.
          </p>

          <div className="mt-8 max-w-xl mx-auto">
            <SearchComponent
              placeholder="Search alumni..."
              onSearch={(query) => dispatch(setSearch(query))}
            />
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 pb-20">

        {/* FILTERS */}
        <div className="bg-white rounded-md shadow-sm p-6 mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-4">
            <select
              value={batch}
              onChange={(e) => dispatch(setBatch(e.target.value))}
              className="border rounded-md px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">All Years</option>
              {Array.from({ length: 50 }, (_, i) => {
                const year = 2026 - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>

            <select
              value={stream}
              onChange={(e) => dispatch(setStream(e.target.value))}
              className="border rounded-md px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
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

          <div className="text-slate-500 text-sm">
            {alumniList.length} Results
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20 text-slate-500">
            Loading alumni...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="text-center py-20 text-red-500 font-medium">
            {error}
          </div>
        )}

        {/* GRID */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 shadow-2 lg:grid-cols-3 gap-8">
            {alumniList.map((user) => {
              const currentUserId =
                currentUser?.id?.toString() ||
                currentUser?._id?.toString();

              const isCurrentUser =
                currentUserId === user._id?.toString();

              return (
                <div
                  key={user._id}
                  className="
                    bg-white
                    rounded-3xl
                    shadow-xl
                    p-6
                    flex flex-col
                    items-center
                    text-center
                    transition-shadow
                    hover:shadow-2xl
                    
                  "
                >
                  {/* Avatar */}
                  <div className="w-24 h-24 mb-5 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center text-slate-500 text-2xl font-semibold">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.fullname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.fullname?.charAt(0)?.toUpperCase() || "U"
                    )}
                  </div>

                  {/* Name */}
                  <h2 className="text-lg font-semibold text-slate-900">
                    {user.fullname}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">
                        You
                      </span>
                    )}
                  </h2>

                  {/* Job */}
                  <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                    {user.jobTitle
                      ? `${user.jobTitle}${user.company ? ` at ${user.company}` : ""
                      }`
                      : "Professional details not posted yet"}
                  </p>

                  {/* LinkedIn */}
                  <div className="mt-3">
                    {user.linkedin ? (
                      <a
                        href={
                          user.linkedin.startsWith("http")
                            ? user.linkedin
                            : `https://${user.linkedin}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        View LinkedIn
                      </a>
                    ) : (
                      <p className="text-slate-400 text-sm italic">
                        LinkedIn not posted yet
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <p className="text-slate-500 mt-3 text-xs tracking-wide">
                    {user.email || "Email not posted"}
                  </p>

                  {/* Meta */}
                  <div className="text-slate-500 text-xs mt-2">
                    {user.stream || "Stream not posted"} •{" "}
                    {user.batch
                      ? `Class of ${user.batch}`
                      : "Batch not posted"}
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 w-full flex gap-3">
                    {!isCurrentUser && (
                      <button className="flex-1 px-4 py-2 rounded-md bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200 transition">
                        Connect
                      </button>
                    )}

                    <button
                      disabled={isCurrentUser}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${isCurrentUser
                        ? "bg-indigo-100 text-indigo-700 cursor-default"
                        : "bg-[#142A5D] text-white hover:bg-[#0f2149]"
                        }`}
                    >
                      {isCurrentUser
                        ? "Your Profile"
                        : "Message"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        <div className="mt-16">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => dispatch(setPage(page))}
          />
        </div>
      </div>
    </div>
  );
};

export default AlumniDirectory;
