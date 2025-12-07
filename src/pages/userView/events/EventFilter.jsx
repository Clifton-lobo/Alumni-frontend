import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveFilter, fetchFilteredEvents } from "../../../store/user-view/UserEventSlice.js";

const filters = [
  { key: "all", label: "All" },
  { key: "next7", label: "Next 7 Days" },
  { key: "next30", label: "Next 30 Days" },
  { key: "next60", label: "Next 60 Days" },
  { key: "custom", label: "Custom" },
];

const EventFilter = () => {
  const dispatch = useDispatch();
  const active = useSelector((state) => state.events.activeFilter);

  const [dates, setDates] = useState({ start: "", end: "" });

  const applyCustomFilter = () => {
    dispatch(
      fetchFilteredEvents({
        filter: "custom",
        startDate: dates.start,
        endDate: dates.end,
      })
    );
  };
  
  return (
    <div className="sticky">
      <h1 className="font-bold text-2xl mb-3 ">Filter by</h1>
      <h3 className="font-semibold text-xl mb-3 mt-5 ">Date</h3>

      {filters.map((f) => (
        <div key={f.key} className="flex items-center text-lg font-medium mb-2">
          <input
            type="radio"
            id={f.key}
            name="date-filter"
            checked={active === f.key}
            onChange={() => {
              dispatch(setActiveFilter(f.key));

              if (f.key !== "custom") {
                dispatch(fetchFilteredEvents({ filter: f.key }));
              }
            }}
            className="mr-3"
          />
          <label htmlFor={f.key} className="text-gray-800 cursor-pointer">
            {f.label}
          </label>
        </div>
      ))}

      {active === "custom" && (
        <div className="mt-4 space-y-3">
          <input
            type="date"
            className="border px-3 py-2 rounded w-full"
            value={dates.start}
            onChange={(e) => setDates({ ...dates, start: e.target.value })}
          />
          <input
            type="date"
            className="border px-3 py-2 rounded w-full"
            value={dates.end}
            onChange={(e) => setDates({ ...dates, end: e.target.value })}
          />

          <button
            className="px-4 py-2 bg-blue-700 text-white rounded w-full"
            onClick={applyCustomFilter}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default EventFilter;
