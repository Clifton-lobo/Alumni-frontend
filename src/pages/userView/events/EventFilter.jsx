import { useState, useEffect, useCallback } from "react";
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

/* ---------------- CONSTANTS ---------------- */

const DATE_FILTERS = [
  { key: "all", label: "All" },
  { key: "next7", label: "Next 7 Days" },
  { key: "next30", label: "Next 30 Days" },
  { key: "next60", label: "Next 60 Days" },
  { key: "custom", label: "Custom" },
];

const CATEGORIES = ["all", "Networking", "Reunion", "Career"];
const STATUSES = ["all", "Upcoming", "Ongoing", "Completed", "Cancelled"];
const MODES = ["all", "virtual", "physical"];

/* ---------------- HELPERS ---------------- */

const toISOStart = (date) =>
  date ? `${format(date, "yyyy-MM-dd")}T00:00:00` : "";

const toISOEnd = (date) =>
  date ? `${format(date, "yyyy-MM-dd")}T23:59:59` : "";

const toDisplayDate = (iso) =>
  iso ? format(new Date(iso), "dd/MM/yyyy") : "";

/* ---------------- COLLAPSIBLE SECTION ---------------- */

const FilterSection = ({ title, isOpen, onToggle, children }) => (
  <div className="border-b border-gray-200">
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 px-2 text-left hover:bg-gray-50 rounded transition-colors"
    >
      <h3 className="font-semibold text-lg text-gray-900">{title}</h3>

      <ChevronRight
        className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isOpen ? "rotate-90" : ""
          }`}
      />
    </button>

    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
    >
      <div className="pb-4 px-2 space-y-2">{children}</div>
    </div>
  </div>
);

/* ---------------- MAIN COMPONENT ---------------- */

const EventFilter = () => {
  const dispatch = useDispatch();

  const { activeFilter, category, mode, status } = useSelector(
    (state) => state.events
  );

  const [openSections, setOpenSections] = useState({
    date: true,
    category: false,
    mode: false,
    status: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const [customDates, setCustomDates] = useState({
    start: "",
    end: "",
  });

  const [calendarDates, setCalendarDates] = useState({
    start: null,
    end: null,
  });

  /* Reset custom dates if filter changes */
  useEffect(() => {
    if (activeFilter !== "custom") {
      setCustomDates({ start: "", end: "" });
      setCalendarDates({ start: null, end: null });
    }
  }, [activeFilter]);

  const handleReset = useCallback(() => {
    dispatch(setActiveFilter("all"));
    dispatch(setCategory("all"));
    dispatch(setMode("all"));
    dispatch(setStatus("all"));

    setCustomDates({ start: "", end: "" });
    setCalendarDates({ start: null, end: null });
  }, [dispatch]);

  const handleApplyCustomDate = () => {
    if (!customDates.start || !customDates.end) return;

    const isVirtual =
      mode === "virtual"
        ? true
        : mode === "physical"
          ? false
          : undefined;

    dispatch(
      fetchFilteredEvents({
        filter: "custom",
        startDate: customDates.start,
        endDate: customDates.end,
        category: category === "all" ? undefined : category,
        isVirtual,
        status: status === "all" ? undefined : status,
        page: 1,
      })
    );
  };

  return (
    <div className="space-y-2">

      {/* Reset */}
      <div className="flex justify-between items-center py-2 px-2">
        <button
          onClick={handleReset}
          className="font-bold text-lg text-blue-950 hover:underline transition"
        >
          Reset Filters
        </button>
      </div>

      {/* Date */}
      <FilterSection
        title="Date"
        isOpen={openSections.date}
        onToggle={() => toggleSection("date")}
      >
        {DATE_FILTERS.map((f) => (
          <label
            key={f.key}
            className="flex items-center gap-2  rounded cursor-pointer hover:bg-gray-50 transition"
          >
            <input
              type="radio"
              name="date-filter"
              checked={activeFilter === f.key}
              onChange={() => dispatch(setActiveFilter(f.key))}
              className="w-4 h-4 cursor-pointer accent-blue-950"
            />
            <span className="text-sm md:text-base text-gray-700">
              {f.label}
            </span>
          </label>
        ))}

        {activeFilter === "custom" && (
          <div className="space-y-3 pt-3">

            {/* Start */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Start date
              </label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start mt-1"
                  >
                    {customDates.start
                      ? toDisplayDate(customDates.start)
                      : "Select start date"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={calendarDates.start}
                    onSelect={(date) => {
                      setCalendarDates((prev) => ({
                        ...prev,
                        start: date,
                      }));
                      setCustomDates((prev) => ({
                        ...prev,
                        start: toISOStart(date),
                      }));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                End date
              </label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start mt-1"
                  >
                    {customDates.end
                      ? toDisplayDate(customDates.end)
                      : "Select end date"}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={calendarDates.end}
                    onSelect={(date) => {
                      setCalendarDates((prev) => ({
                        ...prev,
                        end: date,
                      }));
                      setCustomDates((prev) => ({
                        ...prev,
                        end: toISOEnd(date),
                      }));
                    }}
                    disabled={(date) =>
                      calendarDates.start &&
                      date < calendarDates.start
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <button
              type="button"
              disabled={!customDates.start || !customDates.end}
              onClick={handleApplyCustomDate}
              className="w-full bg-blue-950 text-white py-2 rounded hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Apply
            </button>
          </div>
        )}
      </FilterSection>

      {/* Category */}
      <FilterSection
        title="Category"
        isOpen={openSections.category}
        onToggle={() => toggleSection("category")}
      >
        {CATEGORIES.map((c) => (
          <label
            key={c}
            className="flex items-center gap-2  rounded cursor-pointer hover:bg-gray-50 transition"
          >
            <input
              type="radio"
              name="category"
              checked={category === c}
              onChange={() => dispatch(setCategory(c))}
              className="w-4 h-4 cursor-pointer accent-blue-950"
            />
            <span className="text-sm md:text-base text-gray-700">
              {c}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Mode */}
      <FilterSection
        title="Format"
        isOpen={openSections.mode}
        onToggle={() => toggleSection("mode")}
      >
        {MODES.map((m) => (
          <label
            key={m}
            className="flex items-center gap-2  rounded cursor-pointer hover:bg-gray-50 transition"
          >
            <input
              type="radio"
              name="mode"
              checked={mode === m}
              onChange={() => dispatch(setMode(m))}
              className="w-4 h-4 cursor-pointer accent-blue-950"
            />
            <span className="text-sm md:text-base text-gray-700 capitalize">
              {m}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Status */}
      <FilterSection
        title="Status"
        isOpen={openSections.status}
        onToggle={() => toggleSection("status")}
      >
        {STATUSES.map((s) => (
          <label
            key={s}
            className="flex items-center gap-2  rounded cursor-pointer hover:bg-gray-50 transition"
          >
            <input
              type="radio"
              name="status"
              checked={status === s}
              onChange={() => dispatch(setStatus(s))}
              className="w-4 h-4 cursor-pointer accent-blue-950"
            />
            <span className="text-sm md:text-base text-gray-700">
              {s}
            </span>
          </label>
        ))}
      </FilterSection>
      
    </div>
  );
};

export default EventFilter;
