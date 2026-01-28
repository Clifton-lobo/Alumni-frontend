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
import { Calendar } from "../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

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

/* ------------------ HELPERS ------------------ */

// API-safe date
const toISODate = (date) => (date ? format(date, "yyyy-MM-dd") : "");

// UI-only date
const toDisplayDate = (iso) =>
  iso ? format(new Date(iso), "dd/MM/yyyy") : "";

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

    <div
      className={`overflow-hidden transition-all duration-300 ${
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

  // temp UI dates (ISO)
  const [dates, setDates] = useState({ start: "", end: "" });

  // applied dates (used for API)
  const [appliedDates, setAppliedDates] = useState({
    start: "",
    end: "",
  });

  const [startCalendar, setStartCalendar] = useState(null);
  const [endCalendar, setEndCalendar] = useState(null);

  /* -------- FETCH (ONLY WHEN VALID) -------- */
  useEffect(() => {
    if (
      activeFilter === "custom" &&
      (!appliedDates.start || !appliedDates.end)
    ) {
      return;
    }

    dispatch(
      fetchFilteredEvents({
        filter: activeFilter,
        startDate:
          activeFilter === "custom" ? appliedDates.start : undefined,
        endDate:
          activeFilter === "custom" ? appliedDates.end : undefined,
        category,
        isVirtual: mode,
        status,
        page: 1,
      })
    );
  }, [activeFilter, category, mode, status, appliedDates, dispatch]);

  /* -------- RESET -------- */
  const handleResetFilters = () => {
    dispatch(setActiveFilter("all"));
    dispatch(setCategory("all"));
    dispatch(setMode("all"));
    dispatch(setStatus("all"));
    setDates({ start: "", end: "" });
    setAppliedDates({ start: "", end: "" });
    setStartCalendar(null);
    setEndCalendar(null);
  };

  return (
    <div className="space-y-2 overflow-anchor-none">
      <div className="flex justify-between py-2">
        <span
          onClick={handleResetFilters}
          className="font-bold text-lg cursor-pointer hover:underline"
        >
          Reset filter
        </span>
      </div>

      {/* -------- DATE -------- */}
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
              onChange={() => dispatch(setActiveFilter(f.key))}
            />
            {f.label}
          </label>
        ))}

        {activeFilter === "custom" && (
          <div className="space-y-3 pt-3">
            {/* START DATE */}
            <div>
              <span className="text-sm font-medium">Start date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {dates.start
                      ? toDisplayDate(dates.start)
                      : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startCalendar}
                    captionLayout="dropdown"
                    fromYear={2000}
                    toYear={2035}
                    onSelect={(date) => {
                      setStartCalendar(date);
                      setDates((p) => ({
                        ...p,
                        start: toISODate(date),
                      }));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* END DATE */}
            <div>
              <span className="text-sm font-medium">End date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {dates.end
                      ? toDisplayDate(dates.end)
                      : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endCalendar}
                    captionLayout="dropdown"
                    fromYear={2000}
                    toYear={2035}
                    onSelect={(date) => {
                      setEndCalendar(date);
                      setDates((p) => ({
                        ...p,
                        end: toISODate(date),
                      }));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <button
              type="button"
              disabled={!dates.start || !dates.end}
              className="w-full bg-black text-white py-2 rounded mt-2 disabled:opacity-50"
              onClick={() => {
                setAppliedDates(dates);
                dispatch(setActiveFilter("custom"));
              }}
            >
              Apply
            </button>
          </div>
        )}
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
