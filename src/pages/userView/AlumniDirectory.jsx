import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAlumni,
  setPage,
} from "../../store/user-view/AlumniDirectorySlice";
import PaginationControls from "../../components/common/Pagination";
import { Search } from "lucide-react";

const AlumniDirectory = () => {
  const dispatch = useDispatch();

  const {
    alumniList,
    loading,
    error,
    currentPage,
    totalPages,
  } = useSelector((state) => state.alumni);

  useEffect(() => {
    dispatch(fetchAlumni());
  }, [dispatch, currentPage]);

  return (
    <div className="min-h-screen bg-[#F5F6F8]">

      {/* ================= HERO ================= */}
      <div className="bg-[#142A5D] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Alumni Directory
          </h1>
          <p className="mt-4 text-white/80 text-lg">
            Connect with fellow alumni and grow your network.
          </p>

          {/* Static Search */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search alumni..."
              className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none shadow-md"
              disabled
            />
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 pb-20">

        {/* Filters Row (Static for now) */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-4">
            <select className="border rounded-xl px-4 py-2 bg-white shadow-sm" disabled>
              <option>All Years</option>
            </select>

            <select className="border rounded-xl px-4 py-2 bg-white shadow-sm" disabled>
              <option>All Departments</option>
            </select>
          </div>

          <div className="text-gray-500 text-sm">
            {alumniList.length} Results
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 text-gray-500">
            Loading alumni...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20 text-red-500 font-medium">
            {error}
          </div>
        )}

        {/* Alumni Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {alumniList.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-3xl shadow-md border p-8 text-center transition-all hover:shadow-xl hover:-translate-y-1"
              >
                {/* Profile Image */}
                <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-400 text-3xl font-semibold">
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
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.fullname}
                </h2>

                {/* Professional Info */}
                <p className="text-gray-600 mt-2 text-sm">
                  {user.jobTitle
                    ? `${user.jobTitle}${user.company ? ` at ${user.company}` : ""}`
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
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View LinkedIn
                    </a>
                  ) : (
                    <p className="text-gray-400 text-sm italic">
                      LinkedIn not posted yet
                    </p>
                  )}
                </div>

                {/* Email */}
                <p className="text-gray-500 mt-3 text-sm">
                  {user.email || "Email not posted"}
                </p>

                {/* Academic */}
                <div className="text-gray-500 text-sm mt-3">
                  {user.stream || "Stream not posted"} •{" "}
                  {user.batch ? `Class of ${user.batch}` : "Batch not posted"}
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-center gap-3">
                  <button className="px-4 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
                    Connected
                  </button>

                  <button className="px-4 py-2 rounded-lg bg-[#142A5D] text-white text-sm font-medium hover:bg-[#0f2149] transition">
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
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
