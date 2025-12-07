import React from "react";
import { Calendar, MapPin } from "lucide-react";

const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const EventCard = ({ event }) => {
  const eventDate = new Date(event.date);
  const month = months[eventDate.getMonth()];
  const day = eventDate.getDate();

  return (
    <div className="flex gap-8 border-b pb-10">
      {/* LEFT DATE SECTION */}
      <div className="text-center w-20">
        <p className="font-semibold text-lg tracking-wide">{month}</p>
        <p className="text-7xl font-bold leading-none">{day}</p>
      </div>

      {/* RIGHT EVENT DETAILS (Text left & Image right) */}
      <div className="flex-1 flex justify-between items-center">
        {/* TEXT DETAILS */}
        <div className="flex flex-col">
          {/* TITLE */}
          <h2 className="text-4xl font-bold hover:text-blue-700 hover:underline transition cursor-pointer">
            {event.title}
          </h2>

          {/* DATE + TIME */}
          <div className="flex items-center font-semibold gap-2 mt-2">
            <Calendar size={18} />
            <span>
              {eventDate.toDateString()}, {event.time}
            </span>
          </div>

          {/* CATEGORY */}
          <div className="flex items-center gap-2 font-semibold text-neutral-600 mt-1">
            <MapPin size={18} />
            <span>{event.category}</span>
          </div>

          {/* TAGS */}
          <div className="flex gap-2 flex-wrap mt-4">
            {event.category && (
              <span className="px-3 py-1 border rounded-full text-sm text-neutral-700">
                {event.category}
              </span>
            )}
          </div>
        </div>

        {/* EVENT IMAGE ON RIGHT */}
        <div className="w-40 h-40 ml-8 shrink-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full rounded-full object-cover shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
