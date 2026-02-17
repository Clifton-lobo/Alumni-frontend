import { useEffect, useState, useCallback } from "react";
import { Search as SearchIcon } from "lucide-react";

const DEBOUNCE_DELAY = 500;
const MIN_SEARCH_LENGTH = 2;

const Search = ({ placeholder = "Search", onSearch }) => {
  const [value, setValue] = useState("");

  const normalizeAndSearch = useCallback(
    (inputValue) => {
      const trimmed = inputValue.trim();

      if (trimmed !== "" && trimmed.length < MIN_SEARCH_LENGTH) return;

      onSearch(trimmed || undefined);
    },
    [onSearch]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      normalizeAndSearch(value);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [value, normalizeAndSearch]);

  const handleImmediateSearch = () => {
    normalizeAndSearch(value);
  };

  return (
    <div className="w-full">
      <div className="relative flex items-center">
        {/* Icon */}
        <SearchIcon
          className="absolute left-4 h-5 w-5 text-gray-400 pointer-events-none"
        />

        {/* Input */}
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label="Search"
          className="w-full pl-12 pr-20 py-3 rounded-xl border border-gray-300 bg-white text-gray-900
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     transition"
        />

        {/* Button
        <button
          type="button"
          onClick={handleImmediateSearch}
          className="absolute right-2 px-4 py-2 rounded-lg text-sm font-medium
                     bg-gray-900 text-white hover:bg-gray-800
                     transition"
          aria-label="Search"
        >
          Search
        </button> */}
      </div>
    </div>
  );
};

export default Search;
