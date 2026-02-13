import eventPageAlumniEvent from "../../../assets/evenPageAlumniEvent2.png";
import EventFilter from "./EventFilter";
import PaginationControls from "../../../components/common/Pagination.jsx";
import LoadingOverlay from "../../../config/LoadingOverlay.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { fetchFilteredEvents } from "../../../store/user-view/UserEventSlice";
import EventList from "./EventList";
import { Search, SlidersHorizontal, X } from "lucide-react";

const DEBOUNCE_DELAY = 500;
const MIN_SEARCH_LENGTH = 2;

const UserEvents = () => {
  const dispatch = useDispatch();

  const {
    eventList,
    loading,
    activeFilter,
    category,
    mode,
    status,
    currentPage,
    totalPages,
  } = useSelector((state) => state.events);

  const [searchText, setSearchText] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const isFirstRender = useRef(true);
  const listContainerRef = useRef(null);
  const shouldScrollToPaginationRef = useRef(false);

  /* ------------------------------
     Fetch on filter change (EXCEPT custom date without dates)
  ------------------------------ */
  useEffect(() => {
    // Skip fetch if custom filter is selected but dates aren't applied yet
    if (activeFilter === "custom") {
      console.log("⏸️ Custom filter selected, waiting for date selection...");
      return;
    }

    // Convert mode to isVirtual boolean
    let isVirtualParam = undefined;
    if (mode === "virtual") {
      isVirtualParam = true;
    } else if (mode === "physical") {
      isVirtualParam = false;
    }

    console.log("🔄 Filter changed, fetching with:", {
      activeFilter,
      category,
      mode,
      isVirtualParam,
      status,
    });

    dispatch(
      fetchFilteredEvents({
        filter: activeFilter,
        category: category === "all" ? undefined : category,
        isVirtual: isVirtualParam,
        status: status === "all" ? undefined : status,
        page: 1,
      })
    );
  }, [activeFilter, category, mode, status, dispatch]);

  /* ------------------------------
     Debounced search
  ------------------------------ */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const trimmed = searchText.trim();
    if (trimmed !== "" && trimmed.length < MIN_SEARCH_LENGTH) return;

    const timer = setTimeout(() => {
      let isVirtualParam = undefined;
      if (mode === "virtual") {
        isVirtualParam = true;
      } else if (mode === "physical") {
        isVirtualParam = false;
      }

      dispatch(
        fetchFilteredEvents({
          filter: activeFilter === "custom" ? "all" : activeFilter,
          category: category === "all" ? undefined : category,
          isVirtual: isVirtualParam,
          status: status === "all" ? undefined : status,
          search: trimmed || undefined,
          page: 1,
        })
      );
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchText, activeFilter, category, mode, status, dispatch]);

  /* ------------------------------
     Smooth scroll to events after pagination
  ------------------------------ */
  useEffect(() => {
    console.log("📍 Scroll useEffect triggered:", { 
      loading, 
      shouldScroll: shouldScrollToPaginationRef.current,
      hasRef: !!listContainerRef.current,
      currentPage 
    });

    if (!loading && shouldScrollToPaginationRef.current && listContainerRef.current) {
      // Longer delay ensures DOM has fully rendered with new content
      const timeoutId = setTimeout(() => {
        const element = listContainerRef.current;
        const headerOffset = 120; // Adjust based on your fixed header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        console.log("🎯 Scrolling to position:", {
          elementPosition,
          currentScroll: window.scrollY,
          offsetPosition,
          headerOffset
        });

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        shouldScrollToPaginationRef.current = false;
      }, 300); // Increased delay for better reliability

      return () => clearTimeout(timeoutId);
    }
  }, [loading, currentPage]); // Added currentPage as dependency

  /* ------------------------------
     Pagination handler
  ------------------------------ */
  const onPageChange = (page) => {
    console.log("📄 Pagination clicked - Page:", page);
    
    // Mark that we should scroll after loading completes
    shouldScrollToPaginationRef.current = true;

    let isVirtualParam = undefined;
    if (mode === "virtual") {
      isVirtualParam = true;
    } else if (mode === "physical") {
      isVirtualParam = false;
    }

    dispatch(
      fetchFilteredEvents({
        filter: activeFilter,
        category: category === "all" ? undefined : category,
        isVirtual: isVirtualParam,
        status: status === "all" ? undefined : status,
        search: searchText.trim() || undefined,
        page,
      })
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION - Hidden on mobile */}
      <div className="relative hidden h-[450px] w-full overflow-hidden rounded-xl shadow-lg md:block">
        <img
          src={eventPageAlumniEvent}
          alt="Events Banner"
          className="h-full w-full object-cover"
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
        <div className="grid grid-cols-[0px_1fr] gap-6 md:grid-cols-[minmax(280px,320px)_1fr] md:gap-10">
          {/* DESKTOP FILTER SIDEBAR */}
          <div className="hidden md:block">
            <div className=" top-8">
              <EventFilter />
            </div>
          </div>

          {/* EVENT LIST AREA */}
          <div className="relative min-h-[600px]">
            {/* Loading overlay */}
            <LoadingOverlay loading={loading} />

            {/* Content with fade transition */}
            <div
              className={`transition-opacity duration-300 ease-in-out ${
                loading ? "opacity-40" : "opacity-100"
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
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default UserEvents;