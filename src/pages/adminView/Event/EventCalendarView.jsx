import React, { useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useSelector } from "react-redux";
import {
  FaClock,
  FaCalendarAlt,
  FaFolder,
  FaGlobe,
  FaMapMarkerAlt,
  FaLocationArrow,
  FaAlignLeft,
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,

} from "@/components/ui/dialog";


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
          address: event.address,
          isVirtual: event.isVirtual,
        },
      })) || []
    );
  }, [eventList]);

  return (
    <div className="bg-white/90 backdrop-blur-lg p-4 sm:p-6 rounded-2xl shadow-md border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-3xl font-extrabold flex items-center gap-3 text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text">
          <FaCalendarAlt className="text-blue-500 text-xl sm:text-3xl" />
          Event Calendar
        </h2>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "dayGridMonth",
        }}
        height="auto"
        events={calendarEvents}
        // 🔥 MOBILE: Reduce calendar font + spacing
        dayHeaderClassNames="text-[10px] sm:text-xs"
        viewClassNames="text-[10px] sm:text-sm"
        eventClick={(info) => {
          setSelectedEvent({
            title: info.event.title,
            ...info.event.extendedProps,
            date: info.event.startStr,
          });
        }}
        // 🔥 SMALLER EVENT TEXT ON MOBILE
        eventContent={(arg) => (
          <div className="px-1 py-0.5 rounded-md text-[10px] sm:text-sm leading-tight cursor-pointer">
            <p className="font-semibold truncate">{arg.event.title}</p>
            <p className="text-[9px] sm:text-xs text-gray-700">
              {arg.event.extendedProps.time}
            </p>
          </div>
        )}
        eventClassNames={(arg) => {
          const status = arg.event.extendedProps.status;
          return [
            "rounded-md border text-[10px] sm:text-xs transition-all",
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
      <Dialog
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      >
  <DialogContent className="sm:max-w-lg h-[90vh] p-0 overflow-hidden rounded-2xl flex flex-col">
        
    <div className="flex-1 overflow-y-auto">
          
          {/* Image (fixed) */}
          {selectedEvent?.image && (
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-40 sm:h-52 object-cover shrink-0"
            />
          )}

          {/* Header (fixed) */}
          <DialogHeader className="p-6 pb-0 shrink-0">
            <DialogTitle className="text-3xl font-bold">
              {selectedEvent?.title}
            </DialogTitle>

            <span
              className={`inline-block w-fit px-3 py-1 rounded-full text-xs font-semibold
          ${selectedEvent?.status === "Upcoming"
                  ? "bg-green-100 text-green-700"
                  : selectedEvent?.status === "Completed"
                    ? "bg-gray-200 text-gray-700"
                    : selectedEvent?.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }
        `}
            >
              {selectedEvent?.status}
            </span>
          </DialogHeader>

           {/* 🔥 SCROLLABLE CONTENT */}
           <div className="px-6 py-4 space-y-5 text-sm text-gray-700">

            {/* Description */}
            <div className="flex-1 overflow-y-auto space-y-5 mt-4 pr-2">
              <div className="flex items-center gap-2 text-gray-800 font-semibold">
                <FaAlignLeft />
                <span>Description</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {selectedEvent?.description}
              </p>
            </div>

            {/* Date */}
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <FaCalendarAlt className="text-blue-600" />
              {new Date(selectedEvent?.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>

            {/* Time */}
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <FaClock className="text-indigo-600" />
              {new Date(`1970-01-01T${selectedEvent?.time}`).toLocaleTimeString(
                "en-IN",
                {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }
              )}
            </div>

            {/* Category */}
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <FaFolder className="text-purple-600" />
              {selectedEvent?.category}
            </div>

            {/* Mode */}
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt
                className={
                  selectedEvent?.isVirtual
                    ? "text-purple-600"
                    : "text-indigo-600"
                }
              />
              <span
                className={`text-sm font-semibold ${selectedEvent?.isVirtual
                    ? "text-purple-700"
                    : "text-indigo-700"
                  }`}
              >
                {selectedEvent?.isVirtual ? "Virtual Event" : "Physical Event"}
              </span>
            </div>

            {/* Address */}
            {!selectedEvent?.isVirtual && selectedEvent?.address && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-gray-800">
                  <FaLocationArrow />
                  <span>Event Address</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line pl-6">
                  {selectedEvent.address}
                </p>
              </div>
            )}
          </div>
        </div>

          {/* Footer (fixed) */}
    <DialogFooter className="p-6 border-t shrink-0">
            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full bg-gray-900 text-white py-2.5 rounded-xl hover:bg-gray-700 transition"
            >
              Close
            </button>
          </DialogFooter>

        </DialogContent>
      </Dialog>



    </div>
  );
};

export default EventCalendarView;
