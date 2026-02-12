import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveFilter,
  setCategory,
  setMode,
  setStatus,
  fetchFilteredEvents,
} from "../../../store/user-view/UserEventSlice";
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

const toISOStart = (date) =>
  date ? `${format(date, "yyyy-MM-dd")}T00:00:00` : "";

const toISOEnd = (date) =>
  date ? `${format(date, "yyyy-MM-dd")}T23:59:59` : "";

const toDisplayDate = (iso) =>
  iso ? format(new Date(iso), "dd/MM/yyyy") : "";

/* ------------------ SECTION ------------------ */

const FilterSection = ({ title, isOpen, toggle, children }) => {
  const [maxHeight, setMaxHeight] = useState("0px");
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setMaxHeight(`${contentRef.current?.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, [isOpen, children]);

  return (
    <div className="border-b">
      <button
        type="button"
        onClick={toggle}
        className="w-full flex justify-between items-center py-4 text-left hover:bg-gray-50 transition-colors px-2 rounded"
      >
        <h3 className="font-semibold text-lg">{title}</h3>
        <ChevronRight
          className={`transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </button>

      <div
        style={{
          maxHeight: isOpen ? maxHeight : "0px",
          overflow: "hidden",
          transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div ref={contentRef} className="pb-4 space-y-2 px-2">
          {children}
        </div>
      </div>
    </div>
  );
};

/* ------------------ MAIN ------------------ */

const EventFilter = ({ onFilterChange }) => {
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
  const [startCalendar, setStartCalendar] = useState(null);
  const [endCalendar, setEndCalendar] = useState(null);

  /* -------- CLEAR CUSTOM DATES WHEN NOT CUSTOM -------- */
  useEffect(() => {
    if (activeFilter !== "custom") {
      setDates({ start: "", end: "" });
      setStartCalendar(null);
      setEndCalendar(null);
    }
  }, [activeFilter]);

  /* -------- RESET -------- */
  const handleResetFilters = () => {
    dispatch(setActiveFilter("all"));
    dispatch(setCategory("all"));
    dispatch(setMode("all"));
    dispatch(setStatus("all"));
    setDates({ start: "", end: "" });
    setStartCalendar(null);
    setEndCalendar(null);

    if (onFilterChange) {
      onFilterChange();
    }
  };

  const handleFilterClick = (action) => {
    dispatch(action);
    if (onFilterChange) {
      setTimeout(() => onFilterChange(), 300);
    }
  };

  /* -------- HANDLE CUSTOM DATE APPLY -------- */
  const handleApplyCustomDate = () => {
    if (!dates.start || !dates.end) return;

    let isVirtualParam = undefined;
    if (mode === "virtual") isVirtualParam = true;
    else if (mode === "physical") isVirtualParam = false;

    dispatch(
      fetchFilteredEvents({
        filter: "custom",
        startDate: dates.start,
        endDate: dates.end,
        category: category === "all" ? undefined : category,
        isVirtual: isVirtualParam,
        status: status === "all" ? undefined : status,
        page: 1,
      })
    );

    if (onFilterChange) {
      setTimeout(() => onFilterChange(), 300);
    }
  };

  /* -------- NEW TOGGLE LOGIC (ONLY ADDITION) -------- */
  const toggleSection = (section) => {
    setOpen((prev) => ({
      date: section === "date" ? !prev.date : false,
      category: section === "category" ? !prev.category : false,
      mode: section === "mode" ? !prev.mode : false,
      status: section === "status" ? !prev.status : false,
    }));
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between py-2 px-2">
        <span
          onClick={handleResetFilters}
          className="font-bold text-lg cursor-pointer hover:underline text-blue-950 transition-all"
        >
          Reset filter
        </span>
      </div>

      {/* DATE */}
      <FilterSection
        title="Date"
        isOpen={open.date}
        toggle={() => toggleSection("date")}
      >
        {dateFilters.map((f) => (
          <label
            key={f.key}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p2 rounded transition-colors"
          >
            <input
              type="radio"
              name="date-filter"
              checked={activeFilter === f.key}
              onChange={() => handleFilterClick(setActiveFilter(f.key))}
              className="cursor-pointer w-4 h-4 accent-blue-950"
            />
            <span className="text-sm md:text-base">{f.label}</span>
          </label>
        ))}

        {activeFilter === "custom" && (
          <div className="space-y-3 pt-3 animate-fadeIn">
            <div>
              <span className="text-sm font-medium">Start date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start mt-1">
                    {dates.start
                      ? toDisplayDate(dates.start)
                      : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startCalendar}
                    onSelect={(date) => {
                      setStartCalendar(date);
                      setDates((p) => ({
                        ...p,
                        start: toISOStart(date),
                      }));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <span className="text-sm font-medium">End date</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start mt-1">
                    {dates.end
                      ? toDisplayDate(dates.end)
                      : "Select end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endCalendar}
                    onSelect={(date) => {
                      setEndCalendar(date);
                      setDates((p) => ({
                        ...p,
                        end: toISOEnd(date),
                      }));
                    }}
                    disabled={(date) =>
                      startCalendar && date < startCalendar
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <button
              type="button"
              disabled={!dates.start || !dates.end}
              className="w-full bg-blue-950 text-white py-2 rounded disabled:opacity-50 hover:bg-blue-900 transition-colors"
              onClick={handleApplyCustomDate}
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
        toggle={() => toggleSection("category")}
      >
        {categories.map((c) => (
          <label
            key={c}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 -2 rounded transition-colors"
          >
            <input
              type="radio"
              name="category"
              checked={category === c}
              onChange={() => handleFilterClick(setCategory(c))}
              className="cursor-pointer w-4 h-4 accent-blue-950"
            />
            <span className="text-sm md:text-base">{c}</span>
          </label>
        ))}
      </FilterSection>

      {/* FORMAT */}
      <FilterSection
        title="Format"
        isOpen={open.mode}
        toggle={() => toggleSection("mode")}
      >
        {modes.map((m) => (
          <label
            key={m}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p2 rounded transition-colors"
          >
            <input
              type="radio"
              name="mode"
              checked={mode === m}
              onChange={() => handleFilterClick(setMode(m))}
              className="cursor-pointer w-4 h-4 accent-blue-950"
            />
            <span className="text-sm md:text-base">
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* STATUS */}
      <FilterSection
        title="Status"
        isOpen={open.status}
        toggle={() => toggleSection("status")}
      >
        {statuses.map((s) => (
          <label
            key={s}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p2 rounded transition-colors"
          >
            <input
              type="radio"
              name="status"
              checked={status === s}
              onChange={() => handleFilterClick(setStatus(s))}
              className="cursor-pointer w-4 h-4 accent-blue-950"
            />
            <span className="text-sm md:text-base">{s}</span>
          </label>
        ))}
      </FilterSection>
    </div>
  );
};

export default EventFilter;
