import { useEffect, useMemo, useState } from "react";
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
import * as XLSX from "xlsx";


/* ─────────────────────────────────────────
   Stat Card
───────────────────────────────────────── */
const StatCard = ({ label, value, icon }) => (
  <div className="bg-white rounded-2xl px-6 py-5 flex items-center gap-4 shadow-sm border border-slate-100">
    <div className="w-12 h-12 rounded-xl bg-[#142A5D]/8 flex items-center justify-center text-2xl shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-[#142A5D] leading-tight">{value}</p>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   Alumni Card
───────────────────────────────────────── */
const AlumniCard = ({ user, isCurrentUser }) => {
  const initials = user.fullname
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  const avatarColors = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-500",
    "from-indigo-500 to-blue-600",
  ];
  const colorIdx = user._id
    ? parseInt(user._id.toString().slice(-1), 16) % avatarColors.length
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#142A5D] to-[#2A4A9D]" />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.fullname}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${avatarColors[colorIdx]} flex items-center justify-center text-white text-lg font-bold`}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-col items-end gap-1.5">
            {isCurrentUser && (
              <span className="text-[10px] font-semibold bg-[#142A5D] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                You
              </span>
            )}
            {user.stream && (
              <span className="text-[10px] font-semibold bg-[#142A5D]/8 text-[#142A5D] px-2 py-0.5 rounded-full uppercase tracking-wider">
                {user.stream}
              </span>
            )}
          </div>
        </div>

        {/* Name */}
        <h3 className="text-base font-bold text-slate-900 leading-tight">
          {user.fullname || "—"}
        </h3>

        {/* Job */}
        <p className="text-sm text-slate-500 mt-1 leading-relaxed min-h-[2.5rem]">
          {user.jobTitle
            ? `${user.jobTitle}${user.company ? ` · ${user.company}` : ""}`
            : <span className="italic text-slate-300">No professional info</span>}
        </p>

        {/* Divider */}
        <div className="border-t border-slate-100 my-4" />

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            🎓{" "}
            {user.batch ? `Class of ${user.batch}` : "Batch N/A"}
          </span>
          <span className="truncate max-w-[120px]">{user.email || "—"}</span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {user.linkedin ? (
            <a
              href={
                user.linkedin.startsWith("http")
                  ? user.linkedin
                  : `https://${user.linkedin}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-xs font-semibold py-2 rounded-lg bg-[#142A5D] text-white hover:bg-[#1e3a7a] transition-colors"
            >
              LinkedIn →
            </a>
          ) : (
            <span className="flex-1 text-center text-xs font-medium py-2 rounded-lg bg-slate-50 text-slate-300 cursor-not-allowed">
              No LinkedIn
            </span>
          )}

          <button className="px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 text-xs font-medium transition-colors">
            ✉ Email
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
const AlumniDirectory = () => {
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState("list"); // "grid" | "list"

  const {
    alumniList,
    loading,
    error,
    currentPage,
    totalPages,
    totalUsers,
    batch,
    stream,
    search,
  } = useSelector((state) => state.alumni);

  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchAlumni());
  }, [currentPage, batch, stream, search]);

  const currentUserId =
    currentUser?.id?.toString() || currentUser?._id?.toString();

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 50 }, (_, i) => currentYear - i);
  }, []);

  /* Active filter count */
  const activeFilters = [batch, stream, search].filter(Boolean).length;

  const handleExportXLSX = () => {
    if (!Array.isArray(alumniList) || alumniList.length === 0) {
      console.warn("No alumni data available for export");
      return;
    }

    const rows = alumniList.map((user) => ({
      "Full Name": user.fullname ?? "",
      "Email": user.email ?? "",
      "Department": user.stream ?? "",
      "Batch": user.batch ?? "",
      "Job Title": user.jobTitle ?? "",
      "Company": user.company ?? "",
      "LinkedIn": user.linkedin ?? "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 22 }, { wch: 28 }, { wch: 16 },
      { wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 30 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Alumni");

    // ✅ Write as binary array, then create a proper Blob
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // ✅ Trigger download manually
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alumni_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-sans">

      {/* ════════════ TOP BAR ════════════ */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between  top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#142A5D] rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">Alumni Directory</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>
<div className="flex items-center gap-4">

  {/* PRIMARY — Invite */}
  <button
    className="
      relative inline-flex items-center gap-2
      px-5 py-2.5 text-sm font-semibold
      rounded-xl
      bg-gradient-to-r from-[#142A5D] to-[#1e3a7a]
      text-white
      shadow-md shadow-[#142A5D]/20
      transition-all duration-300
      hover:shadow-lg hover:shadow-[#142A5D]/30
      active:scale-[0.97]
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#142A5D]/40
    "
  >
    <span className="text-base leading-none">+</span>
    Invite Alumni
  </button>

  {/* SECONDARY — Export */}
  <button
    onClick={handleExportXLSX}
    className="
      relative inline-flex items-center gap-2
      px-5 py-2.5 text-sm font-semibold
      rounded-xl
      bg-white
      border border-slate-200
      text-slate-700
      shadow-sm
      transition-all duration-300
      hover:bg-slate-50
      hover:border-[#142A5D]/40
      hover:text-[#142A5D]
      hover:shadow-md
      active:scale-[0.97]
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#142A5D]/20
    "
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
    </svg>
    Export XLSX
  </button>

</div>
      </div>

      {/* ════════════ HERO ════════════ */}
      <div className="bg-gradient-to-br from-[#0e1f4a] via-[#142A5D] to-[#1a3570] text-white px-6 pt-10 pb-20">
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">
              Admin · Alumni Management
            </p>
            <h2 className="text-4xl font-extrabold leading-tight mb-2">
              Manage & Connect
              <br />
              <span className="text-white/60">Your Alumni Network</span>
            </h2>
            <p className="text-white/60 text-sm mt-3">
              Browse, filter, and reach out to your institution's alumni community.
            </p>
          </div>
        </div>
      </div>

      {/* ════════════ MAIN CONTENT ════════════ */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 pb-20 relative">

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Alumni" value={totalUsers ?? "—"} icon="👥" />
          <StatCard label="Departments" value="10" icon="🏛️" />
          <StatCard label="Batches" value="50+" icon="🎓" />
          <StatCard label="With LinkedIn" value="—" icon="🔗" />
        </div>

        {/* ── Filters Bar ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">

            {/* Search */}
            <div className="flex-1">
              <SearchComponent
                placeholder="Search by name, email, company..."
                onSearch={(q) => dispatch(setSearch(q))}
              />
            </div>

            {/* Batch */}
            <select
              value={batch}
              onChange={(e) => dispatch(setBatch(e.target.value))}
              className="text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#142A5D]/20 min-w-[140px]"
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {/* Stream */}
            <select
              value={stream}
              onChange={(e) => dispatch(setStream(e.target.value))}
              className="text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#142A5D]/20 min-w-[160px]"
            >
              <option value="">All Departments</option>
              {["CSE", "MECH", "EEE", "ECE", "CIVIL", "IT", "CHEM", "AERO", "BIOTECH", "MBA"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Clear filters */}
            {activeFilters > 0 && (
              <button
                onClick={() => {
                  dispatch(setSearch(""));
                  dispatch(setBatch(""));
                  dispatch(setStream(""));
                }}
                className="text-xs font-semibold text-rose-500 hover:text-rose-700 px-3 py-2.5 rounded-xl border border-rose-100 bg-rose-50 hover:bg-rose-100 transition-colors whitespace-nowrap"
              >
                Clear ({activeFilters})
              </button>
            )}

            {/* View toggle */}
            <div className="flex rounded-xl border border-slate-200 overflow-hidden shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2.5 text-sm transition-colors ${viewMode === "grid" ? "bg-[#142A5D] text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
                title="Grid view"
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2.5 text-sm transition-colors ${viewMode === "list" ? "bg-[#142A5D] text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
                title="List view"
              >
                ☰
              </button>
            </div>
          </div>

          {/* Result count */}
          <div className="mt-3 text-xs text-slate-400">
            Showing <span className="font-semibold text-slate-600">{alumniList.length}</span> of{" "}
            <span className="font-semibold text-slate-600">{totalUsers}</span> alumni
            {(batch || stream) && (
              <span className="ml-1">
                {stream && <span> in <span className="text-[#142A5D] font-semibold">{stream}</span></span>}
                {batch && <span> · Class of <span className="text-[#142A5D] font-semibold">{batch}</span></span>}
              </span>
            )}
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-4 border-[#142A5D]/20 border-t-[#142A5D] rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Loading alumni...</p>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl p-6 text-center text-sm font-medium">
            ⚠️ {typeof error === "string" ? error : error?.message || "Something went wrong"}
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !error && alumniList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="text-5xl">🔍</div>
            <p className="text-slate-500 font-medium">No alumni found</p>
            <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
          </div>
        )}

        {/* ── Grid View ── */}
        {!loading && !error && alumniList.length > 0 && viewMode === "grid" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {alumniList.map((user) => (
              <AlumniCard
                key={user._id}
                user={user}
                isCurrentUser={currentUserId === user._id?.toString()}
              />
            ))}
          </div>
        )}

        {/* ── List View ── */}
        {!loading && !error && alumniList.length > 0 && viewMode === "list" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-left">
                  <th className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Alumni</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">Role</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Dept · Batch</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Email</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {alumniList.map((user) => {
                  const isCurrentUser = currentUserId === user._id?.toString();
                  const initials = user.fullname?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "U";
                  return (
                    <tr key={user._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-[#142A5D] to-[#2A4A9D] flex items-center justify-center text-white text-xs font-bold">
                            {user.profilePicture
                              ? <img src={user.profilePicture} alt={user.fullname} className="w-full h-full object-cover" />
                              : initials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">
                              {user.fullname}
                              {isCurrentUser && <span className="ml-1.5 text-[10px] bg-[#142A5D] text-white px-1.5 py-0.5 rounded-full">You</span>}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-500 hidden md:table-cell">
                        {user.jobTitle
                          ? `${user.jobTitle}${user.company ? ` · ${user.company}` : ""}`
                          : <span className="italic text-slate-300 text-xs">N/A</span>}
                      </td>
                      <td className="px-5 py-4 text-slate-500 hidden lg:table-cell">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">{user.stream || "—"}</span>
                        <span className="ml-2 text-xs">{user.batch}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-xs hidden lg:table-cell">{user.email || "—"}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {user.linkedin ? (
                            <a
                              href={user.linkedin.startsWith("http") ? user.linkedin : `https://${user.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold px-3 py-1.5 bg-[#142A5D] text-white rounded-lg hover:bg-[#1e3a7a] transition-colors"
                            >
                              LinkedIn
                            </a>
                          ) : (
                            <span className="text-xs px-3 py-1.5 bg-slate-50 text-slate-300 rounded-lg cursor-not-allowed">No Link</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => dispatch(setPage(page))}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniDirectory;