import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAlumni,
  setSearch,
  setPage,
} from "../../store/user-view/AlumniDirectorySlice";
import PaginationControls from "../../components/common/Pagination";

const AlumniDirectory = () => {
  const dispatch = useDispatch();

  const {
    alumniList,
    loading,
    error,
    currentPage,
    totalPages,
    search,
  } = useSelector((state) => state.alumni);

  useEffect(() => {
    dispatch(fetchAlumni());
  }, [dispatch, currentPage, search]);

  return (
    <div className="max-w7xl mxauto px-4 md:px-8 py-12">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        Alumni Directory
      </h1>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <div className="flex gap-4 w-full md:w-auto">
          <select className="border rounded-lg px-4 py-2 bg-white shadow-sm">
            <option>All Years</option>
          </select>

          <select className="border rounded-lg px-4 py-2 bg-white shadow-sm">
            <option>All Departments</option>
          </select>
        </div>

        <div className="text-gray-500 text-sm">
          {alumniList.length} results
        </div>
      </div>

      {/* Loading */}
      {loading && <p>Loading alumni...</p>}

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Grid */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {alumniList.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-2xl shadow-sm border p-8 text-center transition hover:shadow-md"
            >
              {/* Profile Image Placeholder */}
              <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-3xl font-semibold">
                {user.fullname?.charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              <h2 className="text-xl font-semibold text-gray-900">
                {user.fullname}
              </h2>

              {/* Username */}
              <p className="text-blue-600 mt-1">@{user.email}</p>

              {/* Stream */}
              <p className="text-gray-600 mt-2">
                {user.stream}
              </p>

              {/* Batch */}
              <div className="text-gray-500 text-sm mt-2">
                Class of {user.batch}
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-center gap-3">
                <button className="px-4 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
                  Connected
                </button>

                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-12">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => dispatch(setPage(page))}
        />
      </div>
    </div>
  );
};

export default AlumniDirectory;
