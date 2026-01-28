import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveFilter,
  setCategory,
  setMode,
  setStatus,
} from "../../../store/user-view/UserEventSlice";
import { fetchFilteredEvents } from "../../../store/user-view/UserEventSlice";
import { ChevronRight } from "lucide-react";

/* ------------------ DATA ------------------ */

const dateFilters = [
  { key: "all", label: "All" },
  { key: "next7", label: "Next 7 Days" },
  { key: "next30", label: "Next 30 Days" },
  { key: "next60", label: "Next 60 Days" },
  { key: "custom", label: "Custom" },
];

const categories = ["all", "Networking", "Reunion", "Career"];
const statuses = ["all", "Upcoming", "Ongoing", "Completed", "Cancelled"];
const modes = ["all", "virtual", "physical"];

/* ------------------ SECTION ------------------ */

const FilterSection = ({ title, isOpen, toggle, children }) => (
  <div className="border-b overflow-anchor-none">
    <button
      type="button"
      onClick={toggle}
      className="w-full flex justify-between items-center py-4 text-left"
    >
      <h3 className="font-semibold text-lg">{title}</h3>
      <ChevronRight
        className={`transition-transform duration-200 ${
          isOpen ? "rotate-90" : ""
        }`}
      />
    </button>

    {/* KEEP MOUNTED → NO SCROLL JUMP */}
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="pb-4 space-y-2">{children}</div>
    </div>
  </div>
);

/* ------------------ MAIN ------------------ */

const EventFilter = () => {
  const dispatch = useDispatch();
  const { activeFilter, category, mode, status } = useSelector(
    (state) => state.events
  );

  const [open, setOpen] = useState({
    date: true,
    category: false,
    mode: false,
    status: false,
  });

  const [dates, setDates] = useState({ start: "", end: "" });

  useEffect(() => {
    dispatch(
      fetchFilteredEvents({
        filter: activeFilter,
        startDate: activeFilter === "custom" ? dates.start : undefined,
        endDate: activeFilter === "custom" ? dates.end : undefined,
        category,
        isVirtual: mode,
        status,
        page: 1,
      })
    );
  }, [activeFilter, category, mode, status, dates.start, dates.end, dispatch]);

  const handleResetFilters = () => {
    dispatch(setActiveFilter("all"));
    dispatch(setCategory("all"));
    dispatch(setMode("all"));
    dispatch(setStatus("all"));
    setDates({ start: "", end: "" });
  };

  return (
    <div className="space-y-2 overflow-anchor-none">
      <div className="flex justify-between text-sm font-medium py-2">
        <span
          onClick={handleResetFilters}
          className="font-bold text-lg cursor-pointer hover:underline"
        >
          Reset filter
        </span>
      </div>

      {/* DATE */}
      <FilterSection
        title="Date"
        isOpen={open.date}
        toggle={() => setOpen((p) => ({ ...p, date: !p.date }))}
      >
        {dateFilters.map((f) => (
          <label key={f.key} className="flex items-center gap-2">
            <input
              type="radio"
              checked={activeFilter === f.key}
              onMouseDown={(e) => e.preventDefault()}
              onChange={() => dispatch(setActiveFilter(f.key))}
            />
            {f.label}
          </label>
        ))}
      </FilterSection>

      {/* CATEGORY */}
      <FilterSection
        title="Category"
        isOpen={open.category}
        toggle={() => setOpen((p) => ({ ...p, category: !p.category }))}
      >
        {categories.map((c) => (
          <label key={c} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={category === c}
              onMouseDown={(e) => e.preventDefault()}
              onChange={() => dispatch(setCategory(c))}
            />
            {c}
          </label>
        ))}
      </FilterSection>

      {/* FORMAT */}
      <FilterSection
        title="Format"
        isOpen={open.mode}
        toggle={() => setOpen((p) => ({ ...p, mode: !p.mode }))}
      >
        {modes.map((m) => (
          <label key={m} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={mode === m}
              onMouseDown={(e) => e.preventDefault()}
              onChange={() => dispatch(setMode(m))}
            />
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </label>
        ))}
      </FilterSection>

      {/* STATUS */}
      <FilterSection
        title="Status"
        isOpen={open.status}
        toggle={() => setOpen((p) => ({ ...p, status: !p.status }))}
      >
        {statuses.map((s) => (
          <label key={s} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={status === s}
              onMouseDown={(e) => e.preventDefault()}
              onChange={() => dispatch(setStatus(s))}
            />
            {s}
          </label>
        ))}
      </FilterSection>
    </div>
  );
};

export default EventFilter;
