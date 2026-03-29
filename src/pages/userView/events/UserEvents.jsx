import eventPageAlumniEvent from "../../../assets/eventPageAlumniEvent.png";
import EventFilter from "./EventFilter";
import PaginationControls from "../../../components/common/Pagination.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { fetchFilteredEvents } from "../../../store/user-view/UserEventSlice";
import EventList from "./EventList";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import axiosInstance from "../../../api/axiosInstance.js";

const DEBOUNCE_DELAY = 500;
const MIN_SEARCH_LENGTH = 2;

const UserEvents = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = parseInt(searchParams.get("page")) || 1;

  const {
    eventList,
    loading,
    activeFilter,
    category,
    mode,
    status,
    totalPages,
  } = useSelector((state) => state.events);

  const [searchText, setSearchText] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [scrollToEventId, setScrollToEventId] = useState(null);

  // pendingEventId: the eventId we're navigating to.
  // Kept as state (not a ref) so STEP 2 re-runs when it changes.
  const [pendingEventId, setPendingEventId] = useState(null);

  const isFirstRender = useRef(true);
  const prevPageRef = useRef(pageFromUrl);
  const listContainerRef = useRef(null);

  // True while an eventId navigation is in progress.
  // Suppresses the main fetch so only ONE fetch fires (for the correct page).
  const isEventNavigationRef = useRef(false);

  const getIsVirtual = () => {
    if (mode === "virtual") return true;
    if (mode === "physical") return false;
    return undefined;
  };

  /* -----------------------------------
     CLEAR HIGHLIGHT ON FILTER/SEARCH CHANGE
  ----------------------------------- */
  useEffect(() => {
    if (isFirstRender.current) return;
    setScrollToEventId(null);
  }, [activeFilter, category, mode, status, searchText]);

  /* -----------------------------------
     FIND WHICH PAGE THE EVENT IS ON
     Called immediately when a new eventId arrives — no list check needed.
     Updates the page param → the main fetch fires ONCE for the right page.
  ----------------------------------- */
  const findEventPage = async (eventId) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/user/events/${eventId}/page`,
        { params: { limit: 10 } }
      );

      if (!data.success) {
        isEventNavigationRef.current = false; // unblock on failure
        return;
      }

      // isEventNavigationRef stays true here — it gets cleared in STEP 2
      // only after the card is confirmed to be in the list.
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set("page", String(data.page));
        return params;
      });
    } catch (e) {
      console.error("Failed to find event page", e);
      isEventNavigationRef.current = false;
    }
  };

  /* -----------------------------------
     STEP 1 — DETECT NEW eventId IN URL
     Calls findEventPage immediately — no wasted fetch, no first opacity flash.
     Previously the code waited for eventList to load before calling
     findEventPage, causing: fetch → flash → findEventPage → fetch → flash.
     Now it's: findEventPage → fetch (correct page) → scroll. One flash only.
  ----------------------------------- */
  useEffect(() => {
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      setPendingEventId(null);
      setScrollToEventId(null);
      isEventNavigationRef.current = false;
      return;
    }

    setPendingEventId((prev) => {
      if (prev === eventId) return prev; // same id — already being handled

      // Brand new eventId: engage nav mode, clear old highlight, find page now
      isEventNavigationRef.current = true;
      setScrollToEventId(null);
      findEventPage(eventId);

      return eventId;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /* -----------------------------------
     STEP 2 — SCROLL once the correct page's events are loaded
     findEventPage set the page param → main fetch ran → eventList now has
     the target event. Scroll to it and clean up.
  ----------------------------------- */
  useEffect(() => {
    if (!pendingEventId) return;
    if (loading) return;
    if (eventList.length === 0) return;

    const found = eventList.find((e) => e._id === pendingEventId);
    if (!found) return; // page not loaded yet — wait

    setScrollToEventId(pendingEventId);

    setTimeout(() => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.delete("eventId");
        return params;
      });
      setPendingEventId(null);
      isEventNavigationRef.current = false;
    }, 0);
  }, [pendingEventId, eventList, loading]);

  /* -----------------------------------
     MAIN FETCH
     Suppressed while isEventNavigationRef is true so only ONE fetch fires —
     the one triggered after findEventPage sets the correct page param.
  ----------------------------------- */
  useEffect(() => {
    if (activeFilter === "custom") return;
    if (isEventNavigationRef.current) return;

    dispatch(
      fetchFilteredEvents({
        filter: activeFilter,
        category: category === "all" ? undefined : category,
        isVirtual: getIsVirtual(),
        status: status === "all" ? undefined : status,
        search: searchText.trim() || undefined,
        page: pageFromUrl,
      })
    );
  }, [activeFilter, category, mode, status, pageFromUrl, searchText, dispatch]);

  /* -----------------------------------
     SINGLE SOURCE: SEARCH + FILTER RESET
  ----------------------------------- */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isEventNavigationRef.current) return;

    const trimmed = searchText.trim();
    if (trimmed !== "" && trimmed.length < MIN_SEARCH_LENGTH) return;

    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set("page", "1");
        return params;
      });

      dispatch(
        fetchFilteredEvents({
          filter: activeFilter === "custom" ? "all" : activeFilter,
          category: category === "all" ? undefined : category,
          isVirtual: getIsVirtual(),
          status: status === "all" ? undefined : status,
          search: trimmed || undefined,
          page: 1,
        })
      );
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchText, activeFilter, category, mode, status, dispatch]);

  /* -----------------------------------
     SCROLL TO TOP ON PAGE CHANGE
     Skipped during eventId nav — we scroll to the card instead.
  ----------------------------------- */
  useEffect(() => {
    if (loading) return;
    if (isEventNavigationRef.current) return;
    if (searchParams.get("eventId")) return;

    if (prevPageRef.current !== pageFromUrl) {
      prevPageRef.current = pageFromUrl;

      setTimeout(() => {
        const element = listContainerRef.current;
        if (!element) return;

        const headerOffset = 120;
        const offsetPosition =
          element.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }, 300);
    }
  }, [loading, pageFromUrl]);

  /* -----------------------------------
     PAGE CHANGE
  ----------------------------------- */
  const onPageChange = (page) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", String(page));
      return params;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative md:h-[450px] w-full overflow-hidden shadow-lg md:block">
        <img
          src={eventPageAlumniEvent}
          alt="Events Banner"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="mx-auto max-w-4xl px-4 mt-6 md:mt-15 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 gap-3">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by event title"
              className="w-full border-b-2 border-gray-400 px-4 py-3 outline-none transition-colors duration-200 placeholder:text-lg focus:border-blue-950 md:placeholder:text-xl"
            />
            <button
              type="button"
              className="hidden shrink-0 rounded-full bg-yellow-500 p-3 text-white transition-colors duration-200 hover:bg-yellow-600 md:inline-flex md:p-4"
              aria-label="Search events"
            >
              <Search size={20} className="md:h-[22px] md:w-[22px]" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 rounded-full bg-blue-950 p-3 text-white transition-colors duration-200 hover:bg-blue-900 md:hidden"
            aria-label="Open filters"
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      <div
        ref={listContainerRef}
        className="mx-auto max-w-6xl px-4 py-8 md:px-6"
      >
        <div className="grid grid-cols-[0px_1fr] gap-6 mt-10 md:grid-cols-[minmax(280px,320px)_1fr] md:gap-10">
          <div className="hidden md:block">
            <div className="top-8">
              <EventFilter />
            </div>
          </div>

          <div className="relative min-h-[600px]">
            <div
              className={`transition-opacity duration-300 ease-in-out ${
                loading ? "opacity-40" : "opacity-100"
              }`}
            >
              {activeFilter === "custom" && eventList.length === 0 && !loading ? (
                <div className="py-20 text-center">
                  <p className="text-lg text-gray-500">
                    There are no events on the date you selected
                  </p>
                </div>
              ) : (
                <EventList
                  events={eventList || []}
                  scrollToEventId={scrollToEventId}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {showMobileFilters && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden"
            onClick={() => setShowMobileFilters(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-4">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="rounded-full p-2 transition-colors duration-200 hover:bg-gray-100"
                aria-label="Close filters"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <EventFilter onFilterChange={() => setShowMobileFilters(false)} />
            </div>
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="mx-auto my-10 max-w-6xl px-4 md:px-6">
          <PaginationControls
            currentPage={pageFromUrl}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default UserEvents;