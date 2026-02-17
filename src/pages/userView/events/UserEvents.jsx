import eventPageAlumniEvent from "../../../assets/evenPageAlumniEvent2.png";
import EventFilter from "./EventFilter";
import PaginationControls from "../../../components/common/Pagination.jsx";
import LoadingOverlay from "../../../config/LoadingOverlay.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { fetchFilteredEvents } from "../../../store/user-view/UserEventSlice";
import EventList from "./EventList";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";

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

  const isFirstRender = useRef(true);
  const didMountRef = useRef(false);
  const prevPageRef = useRef(pageFromUrl);
  const listContainerRef = useRef(null);

  /* -----------------------------------
     Helper: build isVirtual param
  ----------------------------------- */
  const getIsVirtual = () => {
    if (mode === "virtual") return true;
    if (mode === "physical") return false;
    return undefined;
  };

  /* -----------------------------------
     MAIN FETCH — URL + searchText driven
     Re-runs whenever page, filters, OR
     search text changes.
  ----------------------------------- */
  useEffect(() => {
    if (activeFilter === "custom") return;

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
     RESET PAGE WHEN FILTERS CHANGE
     (skip on first mount so the URL
      page param is respected on load)
  ----------------------------------- */
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", "1");
      return params;
    });
  }, [activeFilter, category, mode, status]);

  /* -----------------------------------
     DEBOUNCED SEARCH
     — resets page to 1 via URL
     — also dispatches directly so that
       if the user is already on page 1
       (URL doesn't change) the fetch
       still fires.
  ----------------------------------- */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const trimmed = searchText.trim();
    if (trimmed !== "" && trimmed.length < MIN_SEARCH_LENGTH) return;

    const timer = setTimeout(() => {
      // Reset to page 1 in the URL
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set("page", "1");
        return params;
      });

      // Dispatch directly in case the user is already on page 1
      // (URL change wouldn't trigger the main useEffect above)
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
     SCROLL TO LIST AFTER PAGE CHANGE
  ----------------------------------- */
  useEffect(() => {
    if (loading) return;

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
     PAGE CHANGE HANDLER
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
      {/* HERO SECTION - Hidden on mobile */}
      <div className="relative hidden h-[450px] w-full overflow-hidden roundedxl shadow-lg md:block">
        <img
          src={eventPageAlumniEvent}
          alt="Events Banner"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>


      {/* SEARCH BAR + MOBILE FILTER BUTTON */}
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

          {/* Mobile Filter Toggle Button */}
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

      {/* MAIN CONTENT AREA */}
      <div
        ref={listContainerRef}
        className="mx-auto max-w-6xl px-4 py-8 md:px-6"
      >
        <div className="grid grid-cols-[0px_1fr] gap-6 mt-10 md:grid-cols-[minmax(280px,320px)_1fr] md:gap-10">
          {/* DESKTOP FILTER SIDEBAR */}
          <div className="hidden md:block">
            <div className="top-8">
              <EventFilter />
            </div>
          </div>

          {/* EVENT LIST AREA */}
          <div className="relative min-h-[600px]">
            {/* Loading overlay */}

            {/* Content with fade transition */}
            <div
              className={`transition-opacity duration-300 ease-in-out ${loading ? "opacity-40" : "opacity-100"
                }`}
            >
              {activeFilter === "custom" && eventList.length === 0 && !loading ? (
                <div className="py-20 text-center">
                  <p className="text-lg text-gray-500">
                    Please select start and end dates, then click "Apply" to see events.
                  </p>
                </div>
              ) : (
                <EventList events={eventList || []} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {showMobileFilters && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden"
            onClick={() => setShowMobileFilters(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden">
            {/* Drawer Header */}
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

            {/* Drawer Content */}
            <div className="p-4">
              <EventFilter onFilterChange={() => setShowMobileFilters(false)} />
            </div>
          </div>
        </>
      )}

      {/* PAGINATION CONTROLS */}
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