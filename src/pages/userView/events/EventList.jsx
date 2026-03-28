import React from "react";
import EventCard from "./EventCard";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const EventList = ({ events, scrollToEventId }) => {
  // const [parentRef] = useAutoAnimate({ duration: 250, easing: "ease-out" });

  if (!events || events.length === 0) {
    return <p className="text-neutral-500 text-lg font-medium">No events found.</p>;
  }

  return (
    <div   className="space-y-12">
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          scrollToMe={scrollToEventId === event._id}
        />
      ))}
    </div>
  );
};

export default EventList;
