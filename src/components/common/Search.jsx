import { useEffect, useRef, useState } from "react";
import { Search as SearchIcon } from "lucide-react";

const DEBOUNCE_DELAY = 500;
const MIN_SEARCH_LENGTH = 2;

const Search = ({ placeholder = "Search", onSearch }) => {
  const [value, setValue] = useState("");
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const trimmed = value.trim();

    if (trimmed !== "" && trimmed.length < MIN_SEARCH_LENGTH) return;

    const timer = setTimeout(() => {
      onSearch(trimmed || undefined);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className="max-w-6xl mx-auto px-6 mt-10 flex gap-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border-b-2 border-neutral-300 outline-none"
      />
      <button
        type="button"
        className="bg-yellow-500 text-white p-4 rounded-full"
        aria-label="Search"
      >
        <SearchIcon size={22} />
      </button>
    </div>
  );
};

export default Search;
