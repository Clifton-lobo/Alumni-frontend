import eventPageAlumniEvent from "../../../assets/evenPageAlumniEvent2.png";
import EventFilter from "./EventFilter";
import PaginationControls from "../../../components/common/Pagination.jsx";
import LoadingOverlay from "../../../config/LoadingOverlay.jsx";
import Search from "../../../components/common/Search.jsx";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchFilteredEvents } from "../../../store/user-view/UserEventSlice";
import EventList from "./EventList";

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
     Search callback (from common Search)
  ------------------------------ */
  const handleSearch = (search) => {
    dispatch(
      fetchFilteredEvents({
        filter: activeFilter,
        category,
        isVirtual,
        status,
        search,
        page: 1,
      })
    );
  };

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

      {/* SEARCH (COMMON COMPONENT) */}
      <Search
        placeholder="Search by event title"
        onSearch={handleSearch}
      />

      {/* FILTER + LIST */}
      <div className="max-w-6xl mx-auto px-6 mt-24 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10">
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
