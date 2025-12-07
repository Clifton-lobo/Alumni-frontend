import eventPageAlumniEvent from "../../../assets/evenPageAlumniEvent2.png";
import EventFilter from './EventFilter';

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchFilteredEvents } from "../../../store/user-view/UserEventSlice";
import EventList from "./EventList.jsx";
import EventSearchBar from './EventSearchBar.jsx';
import { Search } from "lucide-react";

const UserEvents = () => {
  const dispatch = useDispatch();
  const { eventList, loading } = useSelector((state) => state.events);
  const [searchText, setSearchText] = useState("");
  const activeFilter = useSelector((state) => state.events.activeFilter);

  // useEffect(() => {
  //   dispatch(fetchFilteredEvents({ filter: "all" }));
  // }, [dispatch]);

  useEffect(() => {
    dispatch(fetchFilteredEvents({ filter: activeFilter }));
  }, [activeFilter, dispatch]);

  const handleSearch = () => {
    dispatch(
      fetchFilteredEvents({
        filter: activeFilter,
        search: searchText.trim(),
      })
    );
  };

  // 🔹 Search when pressing Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-white">
      <div className="relative bg-white  w-full h-[280px] md:h-[380px] lg:h-[420px] overflow-hidden rounded-xl shadow-lg">
        {/* Background Image */}
        <img
          src={eventPageAlumniEvent}
          alt="Events Banner"
          className="w-full h-full object-cover"
        />

        {/* Soft Overlay */}
        <div className="absolute inset-0 bg-black/40 b" />

        {/* Title + Subtitle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-xl">
            <span className="bg-gradient-to-r from-pink-300 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-shine">
              Alumni Events
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 mt-3 max-w-2xl font-light leading-relaxed">
            Explore the latest updates, celebrations, reunions, and special
            moments from our vibrant alumni community 💫
          </p>
        </div>
      </div>

      {/* SEARCH SECTION */}
      <div className="max-w-6xl mx-auto px-6 mt-10 flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by event title"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 border-b-2 border-neutral-300 focus:border-red-600 transition-all duration-300 outline-none"
        />

        <button
          onClick={handleSearch}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-md transition flex items-center justify-center"
        >
          <Search size={22} />
        </button>
      </div>

      {/* FILTER + EVENTS WRAPPER */}
      <div className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10">
        <div className="md:sticky md:top-28 h-fit">
          <EventFilter />
        </div>

        <div className="min-h-[200px]">
          {loading ? (
            <p className="text-neutral-500">Loading events…</p>
          ) : (
            <div key={eventList.length} className="fade-in">
              <EventList events={eventList} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 


export default UserEvents