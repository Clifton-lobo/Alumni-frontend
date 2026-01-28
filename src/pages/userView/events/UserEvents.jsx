import eventPageAlumniEvent from "../../../assets/evenPageAlumniEvent2.png";
import EventFilter from "./EventFilter";
import PaginationControls from "../../../components/common/Pagination.jsx";
import LoadingOverlay from "../../../config/LoadingOverlay.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { fetchFilteredEvents } from "../../../store/user-view/UserEventSlice";
import EventList from "./EventList";
import { Search } from "lucide-react";

const DEBOUNCE_DELAY = 500;
const MIN_SEARCH_LENGTH = 2;

const UserEvents = () => {
  const dispatch = useDispatch();

  const {
    eventList,
    loading,
    activeFilter,
    category,
    isVirtual,
    status,
    currentPage,
    totalPages,
  } = useSelector((state) => state.events);

  const [searchText, setSearchText] = useState("");
  const isFirstRender = useRef(true);

  /* ------------------------------
     Fetch on filter change
  ------------------------------ */
  useEffect(() => {
    dispatch(
      fetchFilteredEvents({
        filter: activeFilter,
        category,
        isVirtual,
        status,
        page: 1,
      })
    );
  }, [activeFilter, category, isVirtual, status, dispatch]);

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
      dispatch(
        fetchFilteredEvents({
          filter: activeFilter,
          category,
          isVirtual,
          status,
          search: trimmed || undefined,
          page: 1,
        })
      );
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchText, activeFilter, category, isVirtual, status, dispatch]);

  /* ------------------------------
     Pagination
  ------------------------------ */
  const onPageChange = (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    dispatch(
      fetchFilteredEvents({
        filter: activeFilter,
        category,
        isVirtual,
        status,
        search: searchText.trim() || undefined,
        page,
      })
    );
  };

  return (
    <div className="bg-white">
      {/* HERO */}
      <div className="relative w-full h-[320px] overflow-hidden rounded-xl shadow-lg">
        <img
          src={eventPageAlumniEvent}
          alt="Events Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* SEARCH */}
      <div className="max-w-6xl mx-auto px-6 mt-10 flex gap-3">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by event title"
          className="w-full px-4 py-3 border-b-2 border-neutral-300 outline-none"
        />
        <button className="bg-yellow-500 text-white p-4 rounded-full">
          <Search size={22} />
        </button>
      </div>

      {/* FILTER + LIST */}
      <div className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10">
        <div className="md:sticky md:top-28 h-fit">
          <EventFilter />
        </div>

        <div className="relative min-h-[300px]">
          <EventList events={eventList || []} />
          <LoadingOverlay loading={loading} />
        </div>
      </div>

      {/* PAGINATION */}
      <div className="max-w-6xl mx-auto my-10 px-6">
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
