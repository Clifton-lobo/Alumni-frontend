import eventPageAlumniEvent from "../../../assets/evenPageAlumniEvent2.png";
import EventFilter from "./EventFilter";
import PaginationControls from "../../../components/common/Pagination.jsx";
import LoadingOverlay from "../../../config/LoadingOverlay.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
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
  const scrollPositionRef = useRef(0);

  /* ------------------------------
     Restore scroll position after loading
  ------------------------------ */
  // useLayoutEffect(() => {
  //   if (!loading) {
  //     // Restore scroll position after loading completes
  //     window.scrollTo({ top: scrollPositionRef.current, behavior: "auto" });
  //   }
  // }, [loading]);

  /* ------------------------------
     Fetch on filter change (EXCEPT custom date without dates)
  ------------------------------ */
  useEffect(() => {
    // Skip fetch if custom filter is selected but dates aren't applied yet
    // The EventFilter component will handle fetching when Apply is clicked
    if (activeFilter === "custom") {
      console.log("⏸️ Custom filter selected, waiting for date selection...");
      return;
    }

    // Save current scroll position before fetch
    // scrollPositionRef.current = window.scrollY;

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
      // Save current scroll position before fetch
      // scrollPositionRef.current = window.scrollY;

      // Convert mode to isVirtual boolean
      let isVirtualParam = undefined;
      if (mode === "virtual") {
        isVirtualParam = true;
      } else if (mode === "physical") {
        isVirtualParam = false;
      }

      dispatch(
        fetchFilteredEvents({
          filter: activeFilter === "custom" ? "all" : activeFilter, // Use "all" for search with custom
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
     Pagination
  ------------------------------ */
  const onPageChange = (page) => {
    // Convert mode to isVirtual boolean
    let isVirtualParam = undefined;
    if (mode === "virtual") {
      isVirtualParam = true;
    } else if (mode === "physical") {
      isVirtualParam = false;
    }

    // Smooth scroll to list container
    if (listContainerRef.current) {
      const yOffset = -100; // Offset from top
      const element = listContainerRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
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
    <div className="bg-white min-h-screen">
      {/* HERO - Hidden on mobile */}
      <div className="relative w-full h-[450px] overflow-hidden rounded-xl shadow-lg hidden md:block">
        <img
          src={eventPageAlumniEvent}
          alt="Events Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* SEARCH + MOBILE FILTER BUTTON */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 mt-6 md:mt-15">
        <div className="flex gap-3 items-center">
          <div className="flex-1 flex gap-3">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by event title"
              className="w-full px-4 py-3 border-b-2 border-gray-400 placeholder:text-lg md:placeholder:text-xl outline-none focus:border-blue-950 transition-colors"
            />
            <button className="hidden md:inline-flex bg-yellow-500 text-white p-3 md:p-4 rounded-full shrink-0 hover:bg-yellow-600 transition-colors">
              <Search size={20} className="md:w-[22px] md:h-[22px]" />
            </button>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden bg-blue-950 text-white p-3 rounded-full flex items-center gap-2 hover:bg-blue-900 transition-colors"
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      <div
        ref={listContainerRef}
        className="max-w-6xl mx-auto px-4 md:px-6 py-8"
      >
        <div className="grid grid-cols-[0px_1fr] md:grid-cols-[minmax(280px,320px)_1fr] gap-6 md:gap-10">

          {/* Desktop Filter */}
          <div>
            <div className="sticky top-8 hidden md:block">
              <EventFilter />
            </div>
          </div>

          {/* Event List */}
          <div className="relative min-h-[600px]">
            <div
              className={`transition-opacity duration-200 ${loading ? "opacity-30" : "opacity-100"
                }`}
            >
              {activeFilter === "custom" && eventList.length === 0 && !loading ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">
                    Please select start and end dates, then click "Apply" to see events.
                  </p>
                </div>
              ) : (
                <EventList events={eventList || []} />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <>
            <div
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowMobileFilters(false)}
            />

            <div className="md:hidden fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-4 py-4 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
      </div>



      {/* PAGINATION */}
      <div className="max-w-6xl mx-auto my-10 px-4 md:px-6">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default UserEvents;