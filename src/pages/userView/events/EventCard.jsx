import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Tag,
  MoveUpRight,
} from "lucide-react";
import UserEventDetails from "./UserEventDetails";
import { getLocationSummary } from "../../../config/Location";

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

  const [open, setOpen] = useState(false);

  const location = getLocationSummary(event.address);

  return (
    <div className="flex gap-4 md:gap-8 border-b pb-6 md:pb-10">
      {/* LEFT DATE */}
      <div className="text-center w-16 md:w-20 shrink-0">
        <p className="font-semibold text-sm md:text-lg tracking-wide text-gray-600">
          {month}
        </p>
        <p className="text-5xl md:text-7xl font-bold leading-none">
          {day}
        </p>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex justify-between items-start md:items-center gap-4">
        {/* TEXT */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* TITLE */}
          <h2
            onClick={() => setOpen(true)}
            className="group cursor-pointer text-2xl md:text-[44px] font-bold leading-tight hover:text-blue-950 hover:underline transition-colors break-words"
          >
            {event.title}
            <MoveUpRight
              className="inline-block ml-1 h-4 w-4 md:h-5 md:w-5 align-baseline transition-transform duration-200 group-hover:-translate-y-1"
            />
          </h2>

          {/* DATE & TIME */}
          <div className="flex items-center gap-2 mt-2 md:mt-3 font-semibold text-sm md:text-xl text-gray-700">
            <Calendar size={16} className="md:w-[18px] md:h-[18px] shrink-0" />
            <span className="truncate">
              {eventDate.toDateString()}
              {event.time && `, ${event.time}`}
            </span>
          </div>

          {/* LOCATION */}
          {location && (
            <div className="flex items-center gap-2 mt-1 md:mt-2 text-sm md:text-xl font-semibold text-gray-700">
              <MapPin size={16} className="md:w-[18px] md:h-[18px] shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}

          {/* CATEGORY */}
          {event.category && (
            <div className="flex items-center gap-2 mt-1 md:mt-2 text-neutral-600">
              <Tag size={14} className="md:w-[16px] md:h-[16px] shrink-0" />
              <span className="text-sm md:text-base">{event.category}</span>
            </div>
          )}
        </div>

        {/* IMAGE - Hidden on mobile */}
        {event.image && (
          <div className="hidden md:block w-40 h-40 shrink-0">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full rounded-full object-cover shadow-md"
            />
          </div>
        )}
      </div>

      {/* DETAILS MODAL */}
      {event && (
        <UserEventDetails
          event={event}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </div>
  );
};

export default EventCard;