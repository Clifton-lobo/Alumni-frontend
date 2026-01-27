import { useEffect, useState, useMemo } from "react";
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
  FaChevronLeft,
  FaChevronRight,
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
  DialogDescription,
  DialogFooter,

} from "@/components/ui/dialog";


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


  // 📄 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;

  const dispatch = useDispatch();
  const { eventList, isLoading } = useSelector((state) => state.adminEvent);

  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

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
    + setIsVirtual(event.isVirtual ?? false); // 🆕 ADD
    setOpen(true);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setdebounceSearch(searchTerm);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // ✅ Filter + Search logic (Memoized)
  const filteredEvents = useMemo(() => {
    let filtered = eventList || [];

    if (debounceSearch.trim() !== "") {
      filtered = filtered.filter((e) =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase())
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
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  // 🔁 Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, categoryFilter]);

  // 🧾 Form submission
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      image: uploadedImageUrl,
      title: e.target.title.value.trim(),
      date: e.target.date.value,
      time: e.target.time.value,
      category: e.target.category.value,
      status: e.target.status.value,
      description: e.target.description.value.trim(),
      isVirtual,
      address: isVirtual ? undefined : e.target.address?.value.trim(),
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
      {/* Header */}
      <div className="flex bg-white px-3 sm:px-6 py-4 sm:py-6 rounded-lg shadow-sm justify-between items-center flex-wrap gap-3 sm:gap-4">
        <div className="min-w ">
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
            <Button
              onClick={() => setOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 transition-all shadow-md rounded-lg text-sm sm:text-base px-3 sm:px-4 py-2"
            >
              + Create Event
            </Button>
          </SheetTrigger>

          {/* Add/Edit Form Drawer */}
          <SheetContent
            side="right"
            className="overflow-auto px-6 py-8 bg-gray-50"
          >
            <SheetHeader className="mb-6 border-b pb-5">
              <SheetTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent flex items-center gap-2">
                <FaCalendarAlt className="text-blue-500" />
                {editMode ? "Edit Event" : "Add New Event"}
              </SheetTitle>

              <SheetDescription className="text-gray-600 mt-2 text-base leading-relaxed">
                Plan your next alumni gathering — add event details, date, and
                category below.
              </SheetDescription>
            </SheetHeader>

            <div className="mb-6">
              <EventImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                ImageLoadingState={ImageLoadingState}
                setImageLoadingState={setImageLoadingState}
              />
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  name="title"
                  type="text"
                  defaultValue={editMode ? selectedEvent?.title : ""}
                  placeholder="Enter event title"
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    name="date"
                    type="date"
                    defaultValue={editMode ? selectedEvent?.date : ""}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    name="time"
                    type="time"
                    defaultValue={editMode ? selectedEvent?.time : ""}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* 🆕 Event Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Mode
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isVirtual === true}
                      onChange={() => setIsVirtual(true)}
                    />
                    Virtual
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isVirtual === false}
                      onChange={() => setIsVirtual(false)}
                    />
                    Physical
                  </label>
                </div>
              </div>

              {/* 🆕 Address (only for physical events) */}
              {!isVirtual && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Address
                  </label>
                  <textarea
                    name="address"
                    defaultValue={editMode ? selectedEvent?.address : ""}
                    placeholder="Enter event location"
                    required
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              )}
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={editMode ? selectedEvent?.category : ""}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option>Networking</option>
                  <option>Reunion</option>
                  <option>Career</option>
                </select>
              </div>



              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  required
                  defaultValue={editMode ? selectedEvent?.status : ""}
                  className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option>Upcoming</option>
                  <option>Ongoing</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editMode ? selectedEvent?.description : ""}
                  placeholder="Describe your event..."
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 h-28 resize-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <Button
                type="submit"
                disabled={ImageLoadingState}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all shadow-md"
              >
                {ImageLoadingState
                  ? "Uploading Image..."
                  : editMode
                    ? "Update Event"
                    : "Add Event"}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* View Switch */}
      <div className="flex  gap-3 mt-6 mb-6">
        <button
          onClick={() => setViewMode("list")}
          className={`px-4 py-2 cursor-pointer rounded-lg shadow-sm ${viewMode === "list"
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-800"
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

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm p-5 overflow-x-auto">
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
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="text-center p-5 text-gray-500">
                      Loading events...
                    </td>
                  </tr>
                ) : paginatedEvents.length > 0 ? (
                  paginatedEvents.map((event, index) => (
                    <tr
                      key={event._id}
                      className="border-b hover:bg-gray-50 transition-all text-sm align-middle"
                    >
                      {/* Index */}
                      <td className="p-3 text-center font-medium text-gray-700">
                        {(currentPage - 1) * eventsPerPage + (index + 1)}
                      </td>

                      {/* Event */}
                      <td onClick={() => setViewEvent(event)}
                        className="p-3 flex items-center gap-3 min-w-[180px]">
                        <img
                          src={event.image?.secure_url || event.image || "/placeholder.png"}
                          alt={event.title}
                          className="rounded-md w-12 h-12 object-cover border"
                        />
                        <div className="truncate">
                          <p
                            className="font-semibold text-gray-800 cursor-pointer hover:underline"
                          >
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
                          {new Date(`1970-01-01T${event.time}`).toLocaleTimeString("en-IN", {
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
                        <span
                          className={`inline-flex items-center justify-center min-w-[60px] px-3 py-1 rounded-full text-sm font-semibold ${(event.registrationCount ?? 0) > 0
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                            }`}
                        >
                          {event.registrationsCount ?? 0}
                        </span>
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
                          <FaEye onClick={() => setViewEvent(event)}
                            className="text-gray-600 cursor-pointer hover:text-blue-600" />
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


          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6 flex-wrap">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium ${currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                <FaChevronLeft /> Prev
              </button>

              <span className="text-gray-600 font-medium text-sm sm:text-base">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium ${currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                Next <FaChevronRight />
              </button>
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

          {/* 🔽 SCROLLABLE AREA (everything except footer) */}
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
                className={`inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold
            ${viewEvent?.status === "Upcoming"
                    ? "bg-green-100 text-green-700"
                    : viewEvent?.status === "Completed"
                      ? "bg-gray-200 text-gray-700"
                      : viewEvent?.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }
          `}
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

          {/* 🔒 STATIC FOOTER */}
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
