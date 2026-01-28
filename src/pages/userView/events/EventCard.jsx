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
    <div className="flex gap-8 border-b pb-10">
      {/* LEFT DATE */}
      <div className="text-center w-20 shrink-0">
        <p className="font-semibold text-lg tracking-wide">{month}</p>
        <p className="text-7xl font-bold leading-none">{day}</p>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex justify-between items-center">
        {/* TEXT */}
        <div className="flex flex-col max-w-[70%]">
          {/* TITLE */}
          <h2
            onClick={() => setOpen(true)}
            className="group cursor-pointer text-[44px] font-bold leading-tight hover:text-blue-950 hover:underline"
          >
            {event.title}
            <MoveUpRight
              className="inline-block ml-1 h-5 w-5 align-baseline transition-transform duration-200 group-hover:-translate-y-1"
            />
          </h2>

          {/* DATE & TIME */}
          <div className="flex items-center gap-2 mt-3 font-semibold text-xl">
            <Calendar size={18} />
            <span>
              {eventDate.toDateString()}
              {event.time && `, ${event.time}`}
            </span>
          </div>

          {/* LOCATION */}
          {location && (
            <div className="flex items-center gap-2 mt-2 text-xl font-semibold">
              <MapPin size={18} />
              <span>{location}</span>
            </div>
          )}

          {/* CATEGORY */}
          {event.category && (
            <div className="flex items-center gap-2 mt-2 text-neutral-600">
              <Tag size={16} />
              <span>{event.category}</span>
            </div>
          )}

          {/* CATEGORY TAG
          <div className="flex gap-2 flex-wrap mt-4">
            {event.category && (
              <span className="px-3 py-1 border rounded-full text-sm text-neutral-700">
                {event.category}
              </span>
            )}
          </div> */}
        </div>

        {/* IMAGE */}
        {event.image && (
          <div className="w-40 h-40 ml-8 shrink-0">
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
