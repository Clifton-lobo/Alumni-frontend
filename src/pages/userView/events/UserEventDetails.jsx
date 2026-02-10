import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../../../components/ui/dialog";

import {
  Calendar,
  MapPin,
  Users,
  Video,
  Tag,
  CircleCheckBig,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { registerForEvent } from "../../../store/user-view/RegisterEventSlice";

const UserEventDetails = ({ event, open, onOpenChange }) => {
  const dispatch = useDispatch();

  const { registering, error, registeredEvents } = useSelector(
    (state) => state.register
  );

  const { user } = useSelector((state) => state.auth || {});

  if (!event) return null;

  const isRegistered = !!registeredEvents[event._id];

  const isFull =
    event.isLimited &&
    event.capacity &&
    event.registrationsCount >= event.capacity;

  const handleRegister = () => {
    if (!event._id || isRegistered || registering || isFull) return;

    dispatch(
      registerForEvent({
        eventId: event._id,
        name: user?.name || "Guest User",
        email: user?.email,
      })
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">

        {/* SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-6">

          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-bold pr-8">
              {event.title}
            </DialogTitle>
          </DialogHeader>

          {/* ERROR */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 px-3 md:px-4 py-2 md:py-3 rounded-lg mt-4">
              <AlertCircle size={18} className="shrink-0" />
              <span className="text-xs md:text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-4 md:space-y-6 mt-4">

            {/* IMAGE */}
            <img
              src={event.image?.secure_url || event.image}
              alt={event.title}
              className="w-full h-48 md:h-64 object-cover rounded-xl"
            />

            {/* MODE BADGE */}
            <div className="flex gap-2 flex-wrap">
              {event.isVirtual && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                  <Video size={14} />
                  Virtual Event
                </span>
              )}

              {!event.isVirtual && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                  <MapPin size={14} />
                  In-Person Event
                </span>
              )}

              {isFull && (
                <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                  Sold Out
                </span>
              )}
            </div>

            {/* DATE & TIME */}
            <div className="flex items-start gap-3">
              <Calendar className="text-blue-600 mt-1 shrink-0" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Date & Time</p>
                <p className="text-sm text-gray-700">
                  {new Date(event.date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {" · "}
                  {new Date(`1970-01-01T${event.time}`).toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </p>
              </div>
            </div>

            {/* CATEGORY */}
            <div className="flex items-center gap-3">
              <Tag size={18} className="text-purple-600 shrink-0" />
              <span className="px-3 py-1 rounded-md bg-purple-50 text-purple-700 text-sm font-medium">
                {event.category || "General"}
              </span>
            </div>

            {/* LOCATION */}
            {!event.isVirtual && event.address && (
              <div className="flex items-start gap-3">
                <MapPin size={22} className="text-indigo-600 mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Event Location</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {event.address}
                  </p>
                </div>
              </div>
            )}

            {/* REGISTRATIONS */}
            <div className="flex items-center gap-3">
              <Users size={20} className="text-emerald-600 shrink-0" />
              <p className="text-sm text-gray-800">
                {event.isLimited ? (
                  <>
                    <span className="font-semibold">
                      {event.registrationsCount}
                    </span>{" "}
                    / {event.capacity} seats filled
                  </>
                ) : (
                  <>
                    <span className="font-semibold">
                      {event.registrationsCount}
                    </span>{" "}
                    people registered (Unlimited)
                  </>
                )}
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="pt-4 border-t space-y-2">
              <p className="font-semibold text-gray-900">About this event</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description || "No description provided for this event."}
              </p>
            </div>

            {/* REGISTERED STATE */}
            {isRegistered && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-300 text-green-800 px-4 md:px-5 py-3 md:py-4 rounded-lg">
                <CircleCheckBig size={20} className="shrink-0" />
                <span className="font-medium text-sm md:text-base">
                  You have registered for this event.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="border-t pt-4 pb-4 px-4 md:px-6 flex flex-row justify-between gap-3">
          <DialogClose asChild> 
            <Button 
              variant="ghost" 
              className="cursor-pointer hover:bg-gray-100 flex-1 md:flex-initial"
            > 
              Close
            </Button>
          </DialogClose>

          <Button
            onClick={handleRegister}
            disabled={registering || isRegistered || isFull}
            className={`flex-1 md:flex-initial ${
              isFull
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-950 hover:bg-blue-900"
            }`}
          >
            {registering
              ? "Registering..."
              : isRegistered
              ? "Registered ✓"
              : isFull
              ? "Sold Out"
              : "Register"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserEventDetails;