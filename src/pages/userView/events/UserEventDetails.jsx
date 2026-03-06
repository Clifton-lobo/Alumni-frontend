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
  Ban,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { registerForEvent, clearRegisterError } from "../../../store/user-view/RegisterEventSlice";

/* ─── Inline styles for animations (no Tailwind JIT needed) ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ued-root * { font-family: 'DM Sans', sans-serif; }
  .ued-title { font-family: 'Playfair Display', serif; }

  @keyframes ued-fade-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ued-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes ued-pulse-ring {
    0%   { transform: scale(1);   opacity: .6; }
    100% { transform: scale(1.55); opacity: 0; }
  }
  @keyframes ued-badge-pop {
    0%   { transform: scale(.8); opacity: 0; }
    70%  { transform: scale(1.06); }
    100% { transform: scale(1);   opacity: 1; }
  }

  .ued-fade-up   { animation: ued-fade-up .45s cubic-bezier(.22,1,.36,1) both; }
  .ued-delay-1   { animation-delay: .06s; }
  .ued-delay-2   { animation-delay: .12s; }
  .ued-delay-3   { animation-delay: .18s; }
  .ued-delay-4   { animation-delay: .24s; }
  .ued-delay-5   { animation-delay: .30s; }
  .ued-delay-6   { animation-delay: .36s; }

  .ued-hero-img {
    transition: transform .6s cubic-bezier(.22,1,.36,1);
  }
  .ued-hero-img:hover { transform: scale(1.03); }

  .ued-register-btn {
    background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
    position: relative;
    overflow: hidden;
    transition: transform .2s, box-shadow .2s;
  }
  .ued-register-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(255,255,255,.12) 50%,
      transparent 100%);
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity .2s;
  }
  .ued-register-btn:hover:not(:disabled)::before {
    opacity: 1;
    animation: ued-shimmer 1.4s linear infinite;
  }
  .ued-register-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(15,23,42,.35);
  }
  .ued-register-btn:active:not(:disabled) { transform: translateY(0); }

  .ued-meta-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 16px;
    border-radius: 14px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    transition: border-color .2s, box-shadow .2s;
  }
  .ued-meta-row:hover {
    border-color: #bfdbfe;
    box-shadow: 0 2px 12px rgba(59,130,246,.08);
  }

  .ued-icon-wrap {
    width: 38px; height: 38px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 0;
  }

  .ued-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #e2e8f0 20%, #e2e8f0 80%, transparent);
    margin: 4px 0;
  }

  .ued-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 999px;
    font-size: 11px; font-weight: 600; letter-spacing: .03em;
    animation: ued-badge-pop .35s cubic-bezier(.22,1,.36,1) both;
  }

  .ued-pulse-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #22c55e;
    position: relative;
  }
  .ued-pulse-dot::after {
    content: '';
    position: absolute;
    inset: 0; border-radius: 50%;
    background: #22c55e;
    animation: ued-pulse-ring 1.4s ease-out infinite;
  }

  .ued-capacity-bar-track {
    height: 6px; border-radius: 999px;
    background: #e2e8f0; overflow: hidden;
  }
  .ued-capacity-bar-fill {
    height: 100%; border-radius: 999px;
    background: linear-gradient(90deg, #22c55e, #16a34a);
    transition: width .8s cubic-bezier(.22,1,.36,1);
  }
  .ued-capacity-bar-fill.warn  { background: linear-gradient(90deg, #f59e0b, #d97706); }
  .ued-capacity-bar-fill.danger { background: linear-gradient(90deg, #ef4444, #dc2626); }

  /* scrollbar */
  .ued-scroll::-webkit-scrollbar { width: 4px; }
  .ued-scroll::-webkit-scrollbar-track { background: transparent; }
  .ued-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`;

const UserEventDetails = ({ event, open, onOpenChange }) => {
  const dispatch = useDispatch();

  const { registering, error, registeredEvents } = useSelector(
    (state) => state.register
  );
  const { user } = useSelector((state) => state.auth || {});

  useEffect(() => {
    if (open) dispatch(clearRegisterError());
  }, [open, event?._id, dispatch]);

  if (!event) return null;

  const isRegistered = !!registeredEvents[event._id];
  const isFull =
    event.isLimited && event.capacity && event.registrationsCount >= event.capacity;
  const isPastEvent = new Date(event.date) < new Date();

  const capacityPct = event.isLimited && event.capacity
    ? Math.min(100, Math.round((event.registrationsCount / event.capacity) * 100))
    : null;
  const barClass =
    capacityPct >= 90 ? "danger" : capacityPct >= 70 ? "warn" : "";

  const handleRegister = () => {
    if (!event._id || isRegistered || registering || isFull || isPastEvent) return;
    dispatch(registerForEvent({
      eventId: event._id,
      name: user?.name || "Guest User",
      email: user?.email,
    }));
  };

  /* ─── Status banner ─── */
  const statusBanner = () => {
    if (isRegistered) return (
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
        border: "1px solid #bbf7d0", borderRadius: 14,
        padding: "14px 18px", color: "#166534",
      }}>
        <div style={{ position: "relative" }}>
          <div className="ued-pulse-dot" />
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>You're in!</p>
          <p style={{ fontSize: 12, opacity: .8 }}>Successfully registered for this event.</p>
        </div>
        <CircleCheckBig size={22} style={{ marginLeft: "auto", color: "#16a34a", flexShrink: 0 }} />
      </div>
    );

    if (isPastEvent) return (
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        background: "#fffbeb", border: "1px solid #fde68a",
        borderRadius: 14, padding: "14px 18px", color: "#92400e",
      }}>
        <Ban size={20} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 500 }}>
          This event has already taken place. Registration is closed.
        </span>
      </div>
    );

    if (isFull) return (
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        background: "#fff1f2", border: "1px solid #fecdd3",
        borderRadius: 14, padding: "14px 18px", color: "#9f1239",
      }}>
        <AlertCircle size={20} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 500 }}>
          This event is sold out. No seats available.
        </span>
      </div>
    );

    if (error) return (
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        background: "#fff1f2", border: "1px solid #fecdd3",
        borderRadius: 14, padding: "14px 18px", color: "#be123c",
      }}>
        <AlertCircle size={18} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: 13 }}>
          {typeof error === "string" ? error : error?.message || "Something went wrong"}
        </span>
      </div>
    );

    return null;
  };

  const registerLabel = () => {
    if (registering)  return "Registering…";
    if (isRegistered) return "Registered ✓";
    if (isPastEvent)  return "Event Ended";
    if (isFull)       return "Sold Out";
    return "Reserve My Spot";
  };

  const btnStyle = () => {
    if (isRegistered) return { background: "linear-gradient(135deg,#16a34a,#15803d)", cursor: "not-allowed" };
    if (isPastEvent || isFull) return { background: "#94a3b8", cursor: "not-allowed" };
    return {};
  };

  return (
    <>
      <style>{styles}</style>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="ued-root"
          style={{
            maxWidth: 620,
            maxHeight: "92vh",
            padding: 0,
            borderRadius: 24,
            border: "none",
            boxShadow: "0 32px 80px rgba(0,0,0,.2), 0 0 0 1px rgba(0,0,0,.06)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "#ffffff",
          }}
        >
          {/* Close button override */}
          <style>{`
            [data-radix-dialog-close] {
              position: absolute; top: 14px; right: 14px; z-index: 20;
              background: rgba(255,255,255,.85); backdrop-filter: blur(8px);
              border-radius: 50%; width: 34px; height: 34px;
              display: flex; align-items: center; justify-content: center;
              border: 1px solid rgba(0,0,0,.1); cursor: pointer;
              transition: background .2s;
            }
            [data-radix-dialog-close]:hover { background: white; }
          `}</style>

          {/* ── SCROLLABLE BODY ── */}
          <div
            className="ued-scroll"
            style={{ flex: 1, overflowY: "auto", padding: "0 0 8px" }}
          >
            <DialogHeader style={{ padding: 0 }}>
              <DialogTitle style={{ display: "none" }} />
            </DialogHeader>

            {/* HERO IMAGE */}
            <div
              className="ued-fade-up"
              style={{ overflow: "hidden", position: "relative", height: 240 }}
            >
              <img
                className="ued-hero-img"
                src={event.image?.secure_url || event.image}
                alt={event.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* gradient overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,.55) 0%, rgba(0,0,0,.1) 55%, transparent 100%)",
              }} />

              {/* Badges overlaid on image */}
              <div style={{
                position: "absolute", bottom: 14, left: 16,
                display: "flex", gap: 8, flexWrap: "wrap",
              }}>
                {event.isVirtual ? (
                  <span className="ued-badge" style={{ background: "rgba(139,92,246,.9)", color: "#fff" }}>
                    <Video size={11} /> Virtual
                  </span>
                ) : (
                  <span className="ued-badge" style={{ background: "rgba(59,130,246,.9)", color: "#fff" }}>
                    <MapPin size={11} /> In-Person
                  </span>
                )}
                {isFull && (
                  <span className="ued-badge" style={{ background: "rgba(239,68,68,.9)", color: "#fff" }}>
                    Sold Out
                  </span>
                )}
                {isPastEvent && (
                  <span className="ued-badge" style={{ background: "rgba(100,116,139,.88)", color: "#fff" }}>
                    Event Ended
                  </span>
                )}
                {!isPastEvent && !isFull && !isRegistered && (
                  <span className="ued-badge" style={{ background: "rgba(34,197,94,.9)", color: "#fff" }}>
                    <Sparkles size={10} /> Open
                  </span>
                )}
              </div>
            </div>

            {/* CONTENT AREA */}
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

              {/* TITLE */}
              <h2
                className="ued-title ued-fade-up ued-delay-1"
                style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2, color: "#0f172a", margin: 0 }}
              >
                {event.title}
              </h2>

              {/* CATEGORY */}
              <div className="ued-fade-up ued-delay-2" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Tag size={14} style={{ color: "#7c3aed" }} />
                <span style={{
                  fontSize: 12, fontWeight: 600, letterSpacing: ".06em",
                  textTransform: "uppercase", color: "#7c3aed",
                  background: "#f5f3ff", padding: "3px 10px", borderRadius: 6,
                }}>
                  {event.category || "General"}
                </span>
              </div>

              <div className="ued-divider" />

              {/* DATE */}
              <div className="ued-meta-row ued-fade-up ued-delay-2">
                <div className="ued-icon-wrap" style={{ background: "#eff6ff" }}>
                  <Calendar size={18} style={{ color: "#2563eb" }} />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 3 }}>
                    Date & Time
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0 }}>
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      weekday: "long", day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                  <p style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                    <Clock size={12} />
                    {new Date(`1970-01-01T${event.time}`).toLocaleTimeString("en-IN", {
                      hour: "numeric", minute: "2-digit", hour12: true,
                    })}
                  </p>
                </div>
              </div>

              {/* LOCATION */}
              {!event.isVirtual && event.address && (
                <div className="ued-meta-row ued-fade-up ued-delay-3">
                  <div className="ued-icon-wrap" style={{ background: "#eef2ff" }}>
                    <MapPin size={18} style={{ color: "#4f46e5" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 3 }}>
                      Location
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0, lineHeight: 1.4 }}>
                      {event.address}
                    </p>
                  </div>
                </div>
              )}

              {/* REGISTRATIONS */}
              <div className="ued-meta-row ued-fade-up ued-delay-4">
                <div className="ued-icon-wrap" style={{ background: "#f0fdf4" }}>
                  <Users size={18} style={{ color: "#16a34a" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 3 }}>
                    Attendees
                  </p>
                  {event.isLimited ? (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                          {event.registrationsCount}
                          <span style={{ fontWeight: 400, color: "#64748b" }}> / {event.capacity} seats filled</span>
                        </p>
                        <span style={{ fontSize: 12, fontWeight: 700, color: capacityPct >= 90 ? "#dc2626" : capacityPct >= 70 ? "#d97706" : "#16a34a" }}>
                          {capacityPct}%
                        </span>
                      </div>
                      <div className="ued-capacity-bar-track">
                        <div
                          className={`ued-capacity-bar-fill ${barClass}`}
                          style={{ width: `${capacityPct}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0 }}>
                      <span style={{ color: "#16a34a" }}>{event.registrationsCount}</span> registered
                      <span style={{ fontWeight: 400, color: "#64748b" }}> · Unlimited capacity</span>
                    </p>
                  )}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="ued-fade-up ued-delay-5" style={{ paddingTop: 4 }}>
                <div className="ued-divider" style={{ marginBottom: 16 }} />
                <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 10 }}>
                  About this event
                </p>
                <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.75, margin: 0, whiteSpace: "pre-line" }}>
                  {event.description || "No description provided for this event."}
                </p>
              </div>

            </div>
          </div>

          {/* STATUS BANNER */}
          {statusBanner() && (
            <div style={{ padding: "0 24px 12px" }} className="ued-fade-up">
              {statusBanner()}
            </div>
          )}

          {/* FOOTER */}
          <div style={{
            borderTop: "1px solid #f1f5f9",
            padding: "16px 24px",
            display: "flex",
            gap: 12,
            alignItems: "center",
            background: "#fafafa",
          }}>
            <DialogClose asChild>
              <button style={{
                flex: "0 0 auto",
                padding: "10px 20px",
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                background: "white",
                fontSize: 14,
                fontWeight: 500,
                color: "#475569",
                cursor: "pointer",
                transition: "background .15s",
                fontFamily: "DM Sans, sans-serif",
              }}
                onMouseEnter={e => e.target.style.background = "#f8fafc"}
                onMouseLeave={e => e.target.style.background = "white"}
              >
                Close
              </button>
            </DialogClose>

            <button
              onClick={handleRegister}
              disabled={registering || isRegistered || isFull || isPastEvent}
              className="ued-register-btn"
              style={{
                flex: 1,
                padding: "12px 24px",
                borderRadius: 12,
                border: "none",
                color: "white",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                letterSpacing: ".01em",
                fontFamily: "DM Sans, sans-serif",
                ...btnStyle(),
              }}
            >
              {registerLabel()}
              {!isRegistered && !isPastEvent && !isFull && !registering && (
                <ArrowRight size={16} style={{ transition: "transform .2s" }} />
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserEventDetails;