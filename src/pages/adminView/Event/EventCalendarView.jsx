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
  FaTimes,
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const statusConfig = {
  Upcoming: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
    calBg: "bg-indigo-50 border-indigo-200",
  },
  Completed: {
    bg: "bg-slate-100",
    border: "border-slate-200",
    text: "text-slate-600",
    dot: "bg-slate-400",
    calBg: "bg-slate-100 border-slate-200",
  },
  Cancelled: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-600",
    dot: "bg-rose-500",
    calBg: "bg-rose-50 border-rose-200",
  },
  default: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-600",
    dot: "bg-amber-500",
    calBg: "bg-amber-50 border-amber-200",
  },
};

const getStatus = (status) => statusConfig[status] || statusConfig.default;

const InfoRow = ({ icon: Icon, iconClass, label, children }) => (
  <div className="flex items-start gap-3">
    <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-100`}>
      <Icon className={`text-sm ${iconClass}`} />
    </div>
    <div className="flex flex-col min-w-0">
      {label && <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">{label}</span>}
      <span className="text-sm text-slate-700 leading-relaxed">{children}</span>
    </div>
  </div>
);

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

  const status = selectedEvent ? getStatus(selectedEvent.status) : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
          <FaCalendarAlt className="text-white text-sm" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 leading-tight">Event Calendar</h2>
          <p className="text-xs text-slate-400">{eventList?.length || 0} events scheduled</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="p-4 sm:p-6 [&_.fc-toolbar-title]:text-base [&_.fc-toolbar-title]:font-bold [&_.fc-toolbar-title]:text-slate-700 [&_.fc-button]:!bg-slate-800 [&_.fc-button]:!border-slate-800 [&_.fc-button]:!text-white [&_.fc-button]:!rounded-lg [&_.fc-button]:!text-xs [&_.fc-button]:!px-3 [&_.fc-button]:!py-1.5 [&_.fc-button:hover]:!bg-slate-700 [&_.fc-button-active]:!bg-blue-600 [&_.fc-button-active]:!border-blue-600 [&_.fc-daygrid-day-number]:text-xs [&_.fc-daygrid-day-number]:text-slate-500 [&_.fc-col-header-cell-cushion]:text-xs [&_.fc-col-header-cell-cushion]:font-semibold [&_.fc-col-header-cell-cushion]:text-slate-500 [&_.fc-col-header-cell-cushion]:uppercase [&_.fc-col-header-cell-cushion]:tracking-wide">
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
          eventClick={(info) => {
            setSelectedEvent({
              title: info.event.title,
              ...info.event.extendedProps,
              date: info.event.startStr,
            });
          }}
          eventContent={(arg) => {
            const s = getStatus(arg.event.extendedProps.status);
            return (
              <div className={`px-1.5 py-0.5 rounded cursor-pointer flex items-center gap-1 min-w-0 overflow-hidden`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                <p className="font-medium truncate text-[10px] sm:text-xs text-slate-700 min-w-0">
                  {arg.event.title}
                </p>
              </div>
            );
          }}
          eventClassNames={(arg) => {
            const s = getStatus(arg.event.extendedProps.status);
            return [`!rounded border ${s.calBg} !shadow-none`];
          }}
        />
      </div>

      {/* Event Detail Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl border-0 shadow-2xl max-h-[90vh] flex flex-col">

          {/* Image */}
          <div className="relative shrink-0">
            {selectedEvent?.image ? (
              <img
                src={selectedEvent.image}
                alt={selectedEvent?.title}
                className="w-full h-44 sm:h-56 object-cover"
              />
            ) : (
              <div className="w-full h-28 bg-gradient-to-br from-blue-500 to-indigo-600" />
            )}
            {/* Close button */}
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
            >
              <FaTimes className="text-xs" />
            </button>
            {/* Status badge */}
            {status && (
              <div className="absolute bottom-3 left-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.bg} ${status.border} ${status.text} backdrop-blur-sm`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {selectedEvent?.status}
                </span>
              </div>
            )}
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-5 pt-4 pb-2">
              {/* Title */}
              <h2 className="text-xl font-bold text-slate-900 leading-snug line-clamp-2 overflow-hidden text-ellipsis">
                {selectedEvent?.title}
              </h2>
              {selectedEvent?.category && (
                <span className="inline-block mt-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {selectedEvent.category}
                </span>
              )}
            </div>

            <div className="px-5 py-4 space-y-3.5">
              {/* Description */}
              {selectedEvent?.description && (
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <FaAlignLeft className="text-slate-400" /> Description
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {/* Date */}
              <InfoRow icon={FaCalendarAlt} iconClass="text-blue-600" label="Date">
                {selectedEvent?.date &&
                  new Date(selectedEvent.date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
              </InfoRow>

              {/* Time */}
              <InfoRow icon={FaClock} iconClass="text-indigo-600" label="Time">
                {selectedEvent?.time &&
                  new Date(`1970-01-01T${selectedEvent.time}`).toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
              </InfoRow>

              {/* Mode */}
              <InfoRow
                icon={selectedEvent?.isVirtual ? FaGlobe : FaMapMarkerAlt}
                iconClass={selectedEvent?.isVirtual ? "text-violet-600" : "text-indigo-600"}
                label="Mode"
              >
                <span className={`font-semibold ${selectedEvent?.isVirtual ? "text-violet-700" : "text-indigo-700"}`}>
                  {selectedEvent?.isVirtual ? "Virtual Event" : "In-Person Event"}
                </span>
              </InfoRow>

              {/* Address */}
              {!selectedEvent?.isVirtual && selectedEvent?.address && (
                <InfoRow icon={FaLocationArrow} iconClass="text-rose-500" label="Address">
                  {selectedEvent.address}
                </InfoRow>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-slate-100 shrink-0">
            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full bg-slate-900 hover:bg-slate-700 active:bg-slate-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventCalendarView;