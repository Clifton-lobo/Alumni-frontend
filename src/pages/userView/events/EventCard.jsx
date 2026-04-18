import React, { useState, useEffect, useRef } from "react";
import { Calendar, MapPin, Tag, MoveUpRight } from "lucide-react";
import UserEventDetails from "./UserEventDetails";
import { getLocationSummary } from "../../../config/Location";
import LoginPromptModal from "../../../components/common/LoginPromptModal";

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

const EventCard = ({ event, scrollToMe = false }) => {
  const eventDate = new Date(event.date);
  const month = months[eventDate.getMonth()];
  const day = eventDate.getDate();

  const [open, setOpen] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [highlight, setHighlight] = useState(false);
  const cardRef = useRef(null);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    // Reset hasScrolledRef whenever scrollToMe flips back to false.
    // Without this, navigating to the same card a second time (e.g. going
    // Home → Learn More → back to Home → Learn More again) does nothing
    // because hasScrolledRef is still true from the first visit.
    if (!scrollToMe) {
      hasScrolledRef.current = false;
      return;
    }

    if (!cardRef.current || hasScrolledRef.current) return;

    hasScrolledRef.current = true;

    const el = cardRef.current;

    requestAnimationFrame(() => {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setHighlight(true);
    });
  }, [scrollToMe]);

  useEffect(() => {
    if (!highlight) return;
    const timer = setTimeout(() => setHighlight(false), 2000);
    return () => clearTimeout(timer);
  }, [highlight]);

  const location = getLocationSummary(event.address);

  return (
    <div
      ref={cardRef}
      id={`event-${event._id}`}
      className={`flex gap-4 md:gap-8 border-b pb-6 md:pb-10 rounded-lg transition-all duration-700 
        ${highlight ? "bg-[#eceff3] border-2 border-blue-400 shadow-md" : ""}
        `}
    >
      {/* LEFT DATE */}
      <div className="text-center w-16 md:w-20 shrink-0">
        <p className="font-semibold text-sm md:text-lg tracking-wide text-gray-600">
          {month}
        </p>
        <p className='text-5xl md:text-6xl font-bold leading-none font-["Source_Serif_4"]'>
          {String(day).padStart(2, "0")}
        </p>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex justify-between items-start md:items-center gap-4">
        <div className="flex flex-col flex-1 min-w-0">
          <div
            onClick={() => setOpen(true)}
            className="font-serif group w-full cursor-pointer text-2xl md:text-[32px] font-bold leading-tight hover:text-[#142A5D] hover:underline transition-colors break-normal"
          >
            {event.title}
            <MoveUpRight className="inline-block ml-1 h-4 w-4 md:h-5 md:w-5 align-baseline transition-transform duration-200 group-hover:-translate-y-1" />
          </div>

          <div className="flex items-center gap-2 mt-2 md:mt-3 font-semibold text-sm md:text-2xl text-gray-700">
            <Calendar size={16} className="md:w-[22px] md:h-[25px] shrink-0" />
            <span className="truncate">
              {eventDate.toDateString()}
              {event.time && `, ${event.time}`}
            </span>
          </div>

          {location && (
            <div className="flex items-center gap-2 mt-1 md:mt-2 text-sm md:text-[23px] font-semibold text-gray-700">
              <MapPin size={16} className="md:w-[22px] md:h-[25px] shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          )}

          {event.category && (
            <div className="flex items-center gap-2 mt-1 md:mt-2 text-neutral-600">
              <Tag size={14} className="md:w-[20px] md:h-[21px] shrink-0" />
              <span className="text-sm md:text-base">{event.category}</span>
            </div>
          )}
        </div>

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

      {event && (
        <UserEventDetails
          event={event}
          open={open}
          onOpenChange={setOpen}
          onAuthFail={() => setShowLoginPrompt(true)}
        />
      )}
      <LoginPromptModal
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        message="Sign in to register for this event"
      />
    </div>
  );
};

export default EventCard;
