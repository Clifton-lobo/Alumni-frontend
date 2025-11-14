import React, { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useSelector } from "react-redux";
import { FaCalendarAlt, FaClock, FaFolder, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const EventCalendarView = ({ onEventClick }) => {
  const { eventList } = useSelector((state) => state.adminEvent);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const calendarEvents = useMemo(() => {
    return (
      eventList?.map((event) => ({
        id: event._id,
        title: event.title,
        start: event.date,
        extendedProps: {
          time: event.time,
          description: event.description,
          category: event.category,
          status: event.status,
          image: event.image?.secure_url || event.image,
        },
      })) || []
    );
  }, [eventList]);

  return (
    <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold flex items-center gap-3 text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text">
          <FaCalendarAlt className="text-blue-500" /> Event Calendar
        </h2>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="auto"
        events={calendarEvents}
        eventClick={(info) => {
          setSelectedEvent({
            title: info.event.title,
            ...info.event.extendedProps,
            date: info.event.startStr,
          });
          if (onEventClick) onEventClick(info.event);
        }}
        eventContent={(arg) => (
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="p-1.5 rounded-md text-sm cursor-pointer"
          >
            <p className="font-bold text-md text-blue-900 truncate">
              {arg.event.title}
            </p>
            <p className="text-xs text-gray-700">
              {arg.event.extendedProps.time}
            </p>
          </motion.div>
        )}
        eventClassNames={(arg) => {
          const status = arg.event.extendedProps.status;
          return [
            "rounded-lg border text-sm transition-all",
            status === "Upcoming"
              ? "bg-green-100 border-green-300"
              : status === "Completed"
              ? "bg-gray-100 border-gray-300"
              : status === "Cancelled"
              ? "bg-red-100 border-red-300"
              : "bg-yellow-100 border-yellow-300",
          ];
        }}
      />

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-lg overflow-hidden relative"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3  right-3 text-gray-600 hover:text-red-500"
              >
                <FaTimes />
              </button>

              <div className="p-6 mt-5 space-y-4">
                {selectedEvent.image && (
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="rounded-lg w-full h-40 object-cover"
                  />
                )}

                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedEvent.title}
                </h2>
                <p className="text-gray-600">{selectedEvent.description}</p>

                <div className="flex flex-col gap-2 text-sm text-gray-700 mt-3">
                  <p className="flex items-center gap-2">
                    <FaClock className="text-blue-500" />
                    {selectedEvent.date} — {selectedEvent.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaFolder className="text-indigo-500" />
                    {selectedEvent.category}
                  </p>
                  <p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedEvent.status === "Upcoming"
                          ? "bg-green-100 text-green-700"
                          : selectedEvent.status === "Completed"
                          ? "bg-gray-100 text-gray-700"
                          : selectedEvent.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {selectedEvent.status}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventCalendarView;
