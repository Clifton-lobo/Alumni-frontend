import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchMyRegisteredEvents } from "../../store/user-view/UserEventSlice";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, CalendarX } from "lucide-react";
import { startTransition } from "react";

const PAGE_SIZE = 5;

/* ── Shimmer Skeleton ───────────────────────────────────────── */
const ShimmerCard = ({ delay = 0 }) => (
    <div
        className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 overflow-hidden"
        style={{
            animation: `fadeSlideIn 0.4s ease forwards`,
            animationDelay: `${delay}ms`,
            opacity: 0,
        }}
    >
        <div className="w-14 h-14 rounded-xl shrink-0 shimmer" />
        <div className="flex-1 space-y-2">
            <div className="h-4 w-48 rounded-md shimmer" />
            <div className="h-3 w-32 rounded-md shimmer" />
            <div className="h-3 w-24 rounded-md shimmer" />
        </div>
        <div className="w-16 h-6 rounded-full shimmer" />
    </div>
);

/* ── Pagination ─────────────────────────────────────────────── */
const Pagination = ({ page, pages, total, onPageChange }) => {
    if (!pages || pages <= 1) return null;

    const getPages = () => {
        const range = [];
        const delta = 2;
        const left = Math.max(2, page - delta);
        const right = Math.min(pages - 1, page + delta);
        range.push(1);
        if (left > 2) range.push("...");
        for (let i = left; i <= right; i++) range.push(i);
        if (right < pages - 1) range.push("...");
        if (pages > 1) range.push(pages);
        return range;
    };

    return (
        <div
            className="flex items-center justify-between mt-8 px-1"
            style={{ animation: "fadeSlideIn 0.4s ease forwards", opacity: 0, animationDelay: "200ms" }}
        >
            <p className="text-sm text-gray-400">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
            </p>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="p-2 rounded-lg bg-[#1e2d4d] text-white disabled:opacity-30 hover:bg-[#EBAB09] hover:text-black transition-all duration-200 disabled:cursor-not-allowed active:scale-95"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {getPages().map((p, i) =>
                    p === "..." ? (
                        <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 ${
                                p === page
                                    ? "bg-[#EBAB09] text-black scale-105 shadow-sm"
                                    : "bg-[#1e2d4d] text-white hover:bg-[#EBAB09] hover:text-black hover:scale-105"
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === pages}
                    className="p-2 rounded-lg bg-[#1e2d4d] text-white disabled:opacity-30 hover:bg-[#EBAB09] hover:text-black transition-all duration-200 disabled:cursor-not-allowed active:scale-95"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

/* ── Helper ─────────────────────────────────────────────────── */
const formatDate = (dateStr, options) => {
    if (!dateStr) return "—";
    try {
        return new Date(dateStr).toLocaleString("default", options);
    } catch {
        return "—";
    }
};

/* ── Main Component ─────────────────────────────────────────── */
const RegisteredEventsList = ({ isActive }) => {
    const dispatch = useDispatch();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [contentKey, setContentKey] = useState(0);

    const listContainerRef = useRef(null);
    const prevPageRef = useRef(page);

    useEffect(() => {
        if (!isActive) return;
        setHasFetched(false);
        setLoading(true);

        dispatch(fetchMyRegisteredEvents(page))
            .unwrap()
            .then((data) => {
                startTransition(() => {
                    setEvents(data.events || []);
                    setTotalPages(data.totalPages || 1);
                    setTotal(data.totalEvents || 0);
                    setHasFetched(true);
                    setContentKey((k) => k + 1);
                });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [isActive, page, dispatch]);

    /* ── Scroll to top after page change ── */
    useEffect(() => {
        if (loading) return;
        if (prevPageRef.current === page) return;
        prevPageRef.current = page;

        const element = listContainerRef.current;
        if (!element) return;

        const headerOffset = 120;
        const offsetPosition =
            element.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }, [loading, page]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        if (newPage === page) return;
        setPage(newPage);
    };

    /* ── Loading skeleton ── */
    if (loading || (isActive && !hasFetched)) {
        return (
            <>
                <style>{`
                    @keyframes shimmer {
                        0%   { background-position: -600px 0; }
                        100% { background-position: 600px 0; }
                    }
                    .shimmer {
                        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                        background-size: 600px 100%;
                        animation: shimmer 1.4s infinite linear;
                    }
                    @keyframes fadeSlideIn {
                        from { opacity: 0; transform: translateY(12px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
                <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                        <ShimmerCard key={i} delay={i * 80} />
                    ))}
                </div>
            </>
        );
    }

    /* ── Empty state ── */
    if (hasFetched && events.length === 0) {
        return (
            <>
                <style>{`
                    @keyframes fadeScaleIn {
                        from { opacity: 0; transform: scale(0.94); }
                        to   { opacity: 1; transform: scale(1); }
                    }
                `}</style>
                <div
                    className="flex flex-col items-center justify-center py-20 text-center"
                    style={{ animation: "fadeScaleIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
                >
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                        <CalendarX className="h-7 w-7 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">No upcoming registered events</p>
                    <p className="text-gray-400 text-sm mt-1">
                        Events you register for will appear here.
                    </p>
                </div>
            </>
        );
    }

    /* ── Event list ── */
    return (
        <div ref={listContainerRef}>
            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div key={contentKey} className="space-y-4">
                {events.map((event, index) => {
                    // Since the backend now only returns upcoming events,
                    // derive a more precise badge: "ongoing" if today is the event date, else "upcoming"
                    const eventDate = new Date(event.date);
                    const today     = new Date();
                    const isToday   =
                        eventDate.getFullYear() === today.getFullYear() &&
                        eventDate.getMonth()    === today.getMonth()    &&
                        eventDate.getDate()     === today.getDate();

                    const statusLabel = isToday ? "Today" : "Upcoming";
                    const statusStyle = isToday
                        ? "bg-blue-50 text-blue-600"
                        : "bg-green-50 text-green-600";

                    return (
                        <div
                            key={event._id}
                            style={{
                                animation: "fadeSlideIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards",
                                animationDelay: `${index * 60}ms`,
                                opacity: 0,
                            }}
                        >
                            <Card className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out">
                                <CardContent className="p-5 flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        {/* Date box */}
                                        <div className="w-14 h-14 rounded-xl bg-[#152A5D] flex flex-col items-center justify-center text-white shrink-0">
                                            <span className="text-xs font-medium">
                                                {formatDate(event.date, { month: "short" })}
                                            </span>
                                            <span className="text-xl font-bold leading-tight">
                                                {formatDate(event.date, { day: "numeric" })}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-[#0F2747] text-base leading-tight">
                                                {event.title || "Untitled Event"}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {event.isVirtual ? "🌐 Virtual" : "📍 In-Person"}
                                                {event.location ? ` · ${event.location}` : ""}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Registered on{" "}
                                                {formatDate(event.registeredAt, { dateStyle: "medium" })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status badge — always upcoming or today since backend filters past */}
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 transition-colors duration-200 ${statusStyle}`}>
                                        {statusLabel}
                                    </span>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}

                <Pagination
                    page={page}
                    pages={totalPages}
                    total={total}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default RegisteredEventsList;