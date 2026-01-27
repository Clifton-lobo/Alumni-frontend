import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../../components/ui/dialog";

import {
  Calendar,
  MapPin,
  Users,
  Video,
  Building2,
  Tag,
  CircleCheckBig,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  registerForEvent,

} from "../../../store/user-view/RegisterEventSlice";
import { useEffect } from "react";

const UserEventDetails = ({ event, open, onOpenChange }) => {
  const dispatch = useDispatch();

  const { registering, error, registeredEvents } = useSelector(
    (state) => state.register
  );

  const { user } = useSelector((state) => state.auth || {});

  const isRegistered = !!registeredEvents[event?._id];



  const handleRegister = () => {
    if (!event?._id || isRegistered || registering) return;

    dispatch(
      registerForEvent({
        eventId: event._id,
        name: user?.name || "Guest User",
        email: user?.email,
      })
    );
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">

        {/* Error */}
        {error && (
          <div className="flex items-center mt-10 gap-3 bg-green50 border bg-green-200 border-green-400 text-green-800 px-5 py-10 rounded-lg">
            <span><CircleCheckBig /></span> {error}
          </div>
        )}

        {/* SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto pr-2">

          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">
              {event.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            {/* Event Image */}
            <img
              src={event.image?.secure_url || event.image}
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg"
            />

            {/* Date & Time */}
            <div className="flex items-center gap-2 font-medium">
              <Calendar size={18} />
              <span>
                {new Date(event.date).toDateString()} · {event.time}
              </span>
            </div>

            {/* Category */}
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Tag size={16} />
              <span>{event.category}</span>
            </div>

            {/* Event Mode */}
            <div className="flex items-center gap-2">
              {event.isVirtual ? (
                <>
                  <Video size={18} className="text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700">
                    Virtual Event
                  </span>
                </>
              ) : (
                <>
                  <Building2 size={18} className="text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-700">
                    Physical Event
                  </span>
                </>
              )}
            </div>

            {/* Address */}
            {event.isVirtual === false && event.address && (
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin size={18} />
                <span>{event.address}</span>
              </div>
            )}

            {/* Registrations Count */}
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users size={18} />
              <span>
                {event.registrationsCount ?? 0} people registered
              </span>
            </div>

            {/* Description */}
            <p className="text-base leading-relaxed">
              {event.description}
            </p>


            {/* Already Registered */}
            {isRegistered && (
              <div className="flex items-center mt-10 gap-3 bg-green50 border bg-green-200 border-green-400 text-green-800 px-5 py-10 rounded-lg">
                <span><CircleCheckBig /></span> 
                <span>You have successfully registered for the event.</span>
              </div>
            )}
          </div>
        </div>

        {/* STATIC FOOTER */}
        <DialogFooter className="border-t pt-4 flex justify-between">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="cursor-pointer hover:bg-transparent hover:border hover:border-current"
            >
              Close
            </Button>
          </DialogClose>

          <Button
            onClick={handleRegister}
            disabled={registering || isRegistered}
            className="bg-blue-950 hover:bg-blue-900 cursor-pointer"
          >
            {registering
              ? "Registering..."
              : isRegistered
                ? "Registered ✓"
                : "Register"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>

  );
};

export default UserEventDetails;
