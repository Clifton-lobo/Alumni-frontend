import { useEffect, useState, useMemo, useRef, useLayoutEffect } from "react";
import { Button } from "../../../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "../../../components/ui/sheet";
import {
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaPen,
  FaTrash,
  FaFilter,
  FaAlignLeft,
} from "react-icons/fa";
import EventImageUpload from "./EventImageUpload";
import {
  addNewEvent,
  deleteEvent,
  fetchAllEvents,
  updateEvent,
} from "../../../store/admin/EventSlice/EventSlice";
import EventCalendarView from "./EventCalendarView";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import PaginationControls from "../../../components/common/Pagination.jsx";
import LoadingOverlay from "../../../config/LoadingOverlay.jsx";

const DEBOUNCE_DELAY = 400;
const EVENTS_PER_PAGE = 10;

/* ── Shared input style ── */
const inputStyle = {
  width: "100%",
  padding: "0.625rem 1rem",
  borderRadius: "0.75rem",
  border: "1.5px solid #e5e7eb",
  fontSize: "0.875rem",
  color: "#1f2937",
  background: "#fff",
  outline: "none",
  fontFamily: "'Outfit', sans-serif",
  transition: "border-color 0.15s",
};

/*
  ✅ FIX: EvField is defined OUTSIDE Events component.

  The bug: it was defined inside Events, so every time Events re-rendered
  (e.g. on each keystroke changing title/description state), React created a
  brand-new EvField component reference. React saw this as a completely
  different component type, unmounted the old one, and mounted the new one —
  which destroyed the focused <input> and replaced it with a fresh one,
  causing focus loss after every single character typed.

  Moving it outside means the reference is stable across renders, React
  recognises it as the same component, and just updates it in-place.
*/
const EvField = ({ label, required, children }) => (
  <div>
    <label
      style={{
        display: "block",
        fontSize: "0.7rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#6b7280",
        marginBottom: "0.375rem",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {label} {required && <span style={{ color: "#f87171" }}>*</span>}
    </label>
    {children}
  </div>
);

const Events = () => {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [ImageLoadingState, setImageLoadingState] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [viewEvent, setViewEvent] = useState(null);

  // 🔍 Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearch, setdebounceSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isVirtual, setIsVirtual] = useState(false);
  const [isLimited, setIsLimited] = useState(false);
  const [capacity, setCapacity] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  // 📄 Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Refs for scroll management
  const isFirstRender = useRef(true);
  const tableContainerRef = useRef(null);
  const scrollPositionRef = useRef(0);

  const dispatch = useDispatch();
  const { eventList, isLoading } = useSelector((state) => state.adminEvent);

  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  /* Restore scroll position after loading */
  useLayoutEffect(() => {
    if (!isLoading) {
      window.scrollTo({ top: scrollPositionRef.current, behavior: "auto" });
    }
  }, [isLoading]);

  const handleEventDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(deleteEvent(id))
        .unwrap()
        .then(() => dispatch(fetchAllEvents()))
        .catch((err) => console.error("❌ Error deleting event:", err));
    }
  };

  const handleFunctionEdit = (event) => {
    setEditMode(true);
    setSelectedEvent(event);
    setUploadedImageUrl(event.image?.secure_url || event.image);

    setIsVirtual(event.isVirtual ?? false);
    setIsLimited(event.isLimited ?? false);
    setCapacity(event.capacity ?? "");

    setOpen(true);

    setTitle(event.title || "");
    setDate(
      event.date ? new Date(event.date).toISOString().split("T")[0] : ""
    ); setTime(event.time || "");
    setCategory(event.category || "");
    setStatus(event.status || "");
    setDescription(event.description || "");
    setAddress(event.address || "");
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      setdebounceSearch(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // ✅ Filter + Search logic (Memoized)
  const filteredEvents = useMemo(() => {
    let filtered = eventList || [];

    if (debounceSearch.trim() !== "") {
      filtered = filtered.filter((e) =>
        e.title.toLowerCase().includes(debounceSearch.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((e) => e.status === statusFilter);
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter((e) => e.category === categoryFilter);
    }

    return filtered;
  }, [eventList, debounceSearch, statusFilter, categoryFilter]);

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * EVENTS_PER_PAGE,
    currentPage * EVENTS_PER_PAGE
  );

  // 🔁 Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debounceSearch, statusFilter, categoryFilter]);

  // 📄 Pagination handler with scroll
  const onPageChange = (page) => {
    if (tableContainerRef.current) {
      const yOffset = -100;
      const element = tableContainerRef.current;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setCurrentPage(page);
  };

  // 🧾 Form submission
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      image: uploadedImageUrl,
      title: title.trim(),
      date,
      time,
      category,
      status,
      description: description.trim(),
      isVirtual,
      address: isVirtual ? undefined : address.trim(),
      isLimited,
      capacity: isLimited ? Number(capacity) : undefined,
    };

    try {
      if (editMode) {
        await dispatch(
          updateEvent({ id: selectedEvent._id, updatedData: formData })
        ).unwrap();
      } else {
        await dispatch(addNewEvent(formData)).unwrap();
      }
      await dispatch(fetchAllEvents());
      setOpen(false);
      e.target.reset();
      setUploadedImageUrl("");
      setImageFile(null);
      setEditMode(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

  return (
    <div>
      {/* Sheet */}
      <div className="flex bg-white px-3 sm:px-6 py-4 sm:py-6 rounded-lg shadow-sm justify-between items-center flex-wrap gap-3 sm:gap-4">
        <div className="min-w">
          <h1 className="font-bold text-lg sm:text-2xl md:text-3xl text-gray-900 truncate">
            Event Management
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base truncate">
            Create, manage, and track alumni events
          </p>
        </div>

        <Sheet
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (!nextOpen) {
              setEditMode(false);
              setSelectedEvent(null);
              setUploadedImageUrl("");
              setImageFile(null);
              setIsVirtual(false);
            }
          }}
        >
          <SheetTrigger asChild>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90 shadow-md"
              style={{
                background: "#EBAB09",
                color: "#142A5D",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <FaCalendarAlt className="h-4 w-4" />
              Create Event
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="!w-[600px] !max-w-none overflow-auto p-0 border-l-0 bg-[#F8F7F4]"
          >
            {/* ── Drawer Header ── */}
            <div
              className="sticky top-0 z-10 px-7 py-6 border-b border-gray-200"
              style={{ background: "#142A5D" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em] mb-1"
                    style={{ color: "#EBAB09", fontFamily: "'Outfit', sans-serif" }}
                  >
                    Alumni Network
                  </p>
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "1.75rem",
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1.2,
                    }}
                  >
                    {editMode ? "Edit Event" : "New Event"}
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.45)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {editMode
                      ? "Update the event details below"
                      : "Fill in the details to create a new event"}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Form Body ── */}
            <div className="px-7 py-6">
              {/* Image Upload */}
              <div
                className="mb-6 rounded-2xl overflow-hidden border border-gray-200 bg-white"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              >
                <EventImageUpload
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  uploadedImageUrl={uploadedImageUrl}
                  setUploadedImageUrl={setUploadedImageUrl}
                  ImageLoadingState={ImageLoadingState}
                  setImageLoadingState={setImageLoadingState}
                />
              </div>

              <form
                onSubmit={onSubmit}
                className="space-y-5"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {/* Title */}
                <EvField label="Event Title" required>
                  <input
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Annual Alumni Reunion 2025"
                    required
                    style={inputStyle}
                  />
                </EvField>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <EvField label="Date" required>
                    <input
                      name="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      style={inputStyle}
                    />
                  </EvField>
                  <EvField label="Time" required>
                    <input
                      name="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      style={inputStyle}
                    />
                  </EvField>
                </div>

                {/* Event Mode */}
                <EvField label="Event Mode">
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    {[
                      { val: true, label: "🌐 Virtual" },
                      { val: false, label: "📍 Physical" },
                    ].map(({ val, label }) => (
                      <label
                        key={String(val)}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium"
                        style={{
                          borderColor: isVirtual === val ? "#EBAB09" : "#e5e7eb",
                          background: isVirtual === val ? "#EBAB0912" : "#fff",
                          color: isVirtual === val ? "#142A5D" : "#6b7280",
                        }}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          checked={isVirtual === val}
                          onChange={() => setIsVirtual(val)}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </EvField>

                {/* Address (physical only) */}
                {!isVirtual && (
                  <EvField label="Event Address" required>
                    <textarea
                      name="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter venue address…"
                      required
                      rows={2}
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  </EvField>
                )}

                {/* Registration Limit */}
                <EvField label="Registration Limit">
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    {[
                      { val: false, label: "♾️ Unlimited" },
                      { val: true, label: "🔢 Limited" },
                    ].map(({ val, label }) => (
                      <label
                        key={String(val)}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium"
                        style={{
                          borderColor: isLimited === val ? "#EBAB09" : "#e5e7eb",
                          background: isLimited === val ? "#EBAB0912" : "#fff",
                          color: isLimited === val ? "#142A5D" : "#6b7280",
                        }}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          checked={isLimited === val}
                          onChange={() => {
                            setIsLimited(val);
                            if (!val) setCapacity("");
                          }}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </EvField>

                {isLimited && (
                  <EvField label="Maximum Registrations" required>
                    <input
                      type="number"
                      min="1"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="e.g. 100"
                      required
                      style={inputStyle}
                    />
                  </EvField>
                )}

                {/* Category */}
                <EvField label="Category" required>
                  <select
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    style={inputStyle}
                  >
                    <option value="">Select category…</option>
                    <option value="Networking">Networking</option>
                    <option value="Reunion">Reunion</option>
                    <option value="Career">Career</option>
                  </select>
                </EvField>

                {/* Status */}
                <EvField label="Status" required>
                  <select
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                    style={inputStyle}
                  >
                    <option value="">Select status…</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </EvField>

                {/* Description */}
                <EvField label="Description" required>
                  <textarea
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your event…"
                    required
                    rows={3}
                    style={{ ...inputStyle, resize: "none" }}
                  />
                </EvField>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={ImageLoadingState}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 mt-2"
                  style={{ background: "#142A5D", color: "#fff" }}
                >
                  {ImageLoadingState ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading Image…
                    </>
                  ) : editMode ? (
                    <>
                      <FaCalendarAlt className="h-4 w-4" /> Update Event
                    </>
                  ) : (
                    <>
                      <FaCalendarAlt className="h-4 w-4" /> Create Event
                    </>
                  )}
                </button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* View Switch */}
      <div className="flex gap-3 mt-6 mb-6">
        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 cursor-pointer rounded-lg shadow-sm ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
            }`}
        >
          List View
        </button>
        <button
          onClick={() => setViewMode("calendar")}
          className={`px-4 py-2 cursor-pointer rounded-lg shadow-sm flex items-center gap-2 ${viewMode === "calendar"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800"
            }`}
        >
          <FaCalendarAlt /> Calendar View
        </button>
      </div>

      {/* 📋 List View */}
      {viewMode === "list" ? (
        <div>
          {/* Filters */}
          <div className="bg-white p-5 rounded-xl shadow-sm mb-5">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <FaFilter className="text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title..."
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full md:w-auto"
              >
                <option>All</option>
                <option>Upcoming</option>
                <option>Ongoing</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full md:w-auto"
              >
                <option>All</option>
                <option>Networking</option>
                <option>Reunion</option>
                <option>Career</option>
              </select>
            </div>
          </div>

          {/* Table Container with Loading Overlay */}
          <div ref={tableContainerRef} className="relative min-h-[400px]">
            {isLoading && (
              <div className="absolute inset-0 bg-white/70 z-10 flex items-start justify-center pt-20">
                <LoadingOverlay loading={isLoading} />
              </div>
            )}

            <div
              className={`bg-white rounded-xl shadow-sm p-5 overflow-x-auto transition-opacity duration-200 ${isLoading ? "opacity-30" : "opacity-100"
                }`}
            >
              <table className="w-full text-left min-w-[900px] border-collapse">
                <thead>
                  <tr className="text-gray-600 border-b bg-gray-50">
                    <th className="p-3 text-center w-16">#</th>
                    <th className="p-3">Event</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3 text-center">Category</th>
                    <th className="p-3 text-center">Registrations</th>
                    <th className="p-3 text-center">Mode</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center w-28">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedEvents.length > 0 ? (
                    paginatedEvents.map((event, index) => (
                      <tr
                        key={event._id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-all text-sm align-middle"
                      >
                        {/* Index */}
                        <td className="p-3 text-center font-medium text-gray-700">
                          {(currentPage - 1) * EVENTS_PER_PAGE + (index + 1)}
                        </td>

                        {/* Event */}
                        <td
                          onClick={() => setViewEvent(event)}
                          className="p-3 flex items-center gap-3 min-w-[180px]"
                        >
                          <img
                            src={
                              event.image?.secure_url ||
                              event.image ||
                              "/placeholder.png"
                            }
                            alt={event.title}
                            className="rounded-md w-12 h-12 object-cover border"
                          />
                          <div className="truncate">
                            <p className="font-semibold text-gray-800 cursor-pointer hover:underline">
                              {event.title}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[160px]">
                              {event.description.slice(0, 40)}...
                            </p>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="p-3">
                          <p className="font-medium">
                            {new Date(event.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              `1970-01-01T${event.time}`
                            ).toLocaleTimeString("en-IN", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                        </td>

                        {/* Category */}
                        <td className="p-3 text-center">
                          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm">
                            {event.category}
                          </span>
                        </td>

                        {/* Registrations */}
                        <td className="p-3 text-center">
                          {event.isLimited ? (
                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {event.registrationsCount ?? 0} / {event.capacity}
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {event.registrationsCount ?? 0}
                            </span>
                          )}
                        </td>

                        {/* Mode */}
                        <td className="p-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-medium ${event.isVirtual
                                ? "bg-purple-100 text-purple-700"
                                : "bg-indigo-100 text-indigo-700"
                              }`}
                          >
                            {event.isVirtual ? "Virtual" : "Physical"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="p-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-lg text-sm ${event.status === "Upcoming"
                                ? "bg-green-100 text-green-700"
                                : event.status === "Completed"
                                  ? "bg-gray-200 text-gray-600"
                                  : event.status === "Cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                            {event.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3 text-center">
                          <div className="flex justify-center items-center gap-3">
                            <FaEye
                              onClick={() => setViewEvent(event)}
                              className="text-gray-600 cursor-pointer hover:text-blue-600"
                            />
                            <FaPen
                              onClick={() => handleFunctionEdit(event)}
                              className="text-gray-600 cursor-pointer hover:text-blue-600"
                            />
                            <FaTrash
                              onClick={() => handleEventDelete(event._id)}
                              className="text-red-500 cursor-pointer hover:text-red-700"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center p-5 text-gray-500">
                        No events found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      ) : (
        <EventCalendarView />
      )}

      {/* 👁️ Event View Dialog */}
      <Dialog
        open={!!viewEvent}
        onOpenChange={(open) => !open && setViewEvent(null)}
      >
        <DialogContent className="sm:max-w-lg h-[90vh] p-0 overflow-hidden rounded-2xl flex flex-col">
          {/* SCROLLABLE AREA */}
          <div className="flex-1 overflow-y-auto">
            {viewEvent?.image && (
              <img
                src={viewEvent.image?.secure_url || viewEvent.image}
                alt={viewEvent.title}
                className="w-full h-40 sm:h-52 object-cover"
              />
            )}

            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {viewEvent?.title}
              </DialogTitle>

              <span
                className={`inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold ${viewEvent?.status === "Upcoming"
                    ? "bg-green-100 text-green-700"
                    : viewEvent?.status === "Completed"
                      ? "bg-gray-200 text-gray-700"
                      : viewEvent?.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {viewEvent?.status}
              </span>
            </DialogHeader>

            <div className="px-6 py-4 space-y-5 text-sm text-gray-700">
              <div className="flex-1 overflow-y-auto space-y-5 mt-4 pr-2">
                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                  <FaAlignLeft />
                  <span>Description</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {viewEvent?.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-blue-600" />
                {new Date(viewEvent?.date).toLocaleDateString("en-IN")}
              </div>

              <div className="flex items-center gap-2">
                <FaClock className="text-indigo-600" />
                {viewEvent?.time}
              </div>

              <div className="flex items-center gap-2">
                {viewEvent?.isVirtual ? "🌐 Virtual Event" : "📍 Physical Event"}
              </div>

              {!viewEvent?.isVirtual && viewEvent?.address && (
                <p className="text-sm">{viewEvent.address}</p>
              )}
            </div>
          </div>

          {/* STATIC FOOTER */}
          <DialogFooter className="p-6 border-t shrink-0">
            <Button onClick={() => setViewEvent(null)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;