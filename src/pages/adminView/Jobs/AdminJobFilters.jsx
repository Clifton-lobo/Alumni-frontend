import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const selectItemClass =
  "cursor-pointer focus:bg-blue-950 focus:text-white data-[state=checked]:bg-blue-950 data-[state=checked]:text-white";

const DEBOUNCE_DELAY = 500;

const AdminJobFilters = ({
  filters,
  onFilterChange,
  loading,
}) => {
  // Local state for inputs that need debouncing
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [cityInput, setCityInput] = useState(filters.city || "");
  
  const isFirstRender = useRef(true);

  /* ================= DEBOUNCED SEARCH ================= */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onFilterChange({ search: searchInput.trim() });
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchInput]);

  /* ================= DEBOUNCED CITY ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ city: cityInput.trim() });
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [cityInput]);

  /* ================= SYNC WITH EXTERNAL FILTERS ================= */
  // If filters are cleared externally, update local state
  useEffect(() => {
    if (!filters.search && searchInput) {
      setSearchInput("");
    }
    if (!filters.city && cityInput) {
      setCityInput("");
    }
  }, [filters.search, filters.city]);

  /* ================= CLEAR ALL ================= */
  const clearAll = () => {
    setSearchInput("");
    setCityInput("");
    onFilterChange({
      employmentType: "",
      workMode: "",
      experienceLevel: "",
      city: "",
      search: "",
    });
  };

  const hasActive =
    filters.employmentType ||
    filters.workMode ||
    filters.experienceLevel ||
    searchInput ||
    cityInput;

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* SEARCH */}
      <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search title / company / user"
        className="w-[240px]"
        disabled={loading}
      />

      {/* EMPLOYMENT TYPE */}
      <Select
        value={filters.employmentType || "all"}
        onValueChange={(v) =>
          onFilterChange({ employmentType: v === "all" ? "" : v })
        }
        disabled={loading}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Employment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="full-time" className={selectItemClass}>
            Full Time
          </SelectItem>
          <SelectItem value="part-time" className={selectItemClass}>
            Part Time
          </SelectItem>
          <SelectItem value="internship" className={selectItemClass}>
            Internship
          </SelectItem>
          <SelectItem value="contract" className={selectItemClass}>
            Contract
          </SelectItem>
        </SelectContent>
      </Select>

      {/* WORK MODE */}
      <Select
        value={filters.workMode || "all"}
        onValueChange={(v) =>
          onFilterChange({ workMode: v === "all" ? "" : v })
        }
        disabled={loading}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Work Mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="onsite" className={selectItemClass}>
            Onsite
          </SelectItem>
          <SelectItem value="remote" className={selectItemClass}>
            Remote
          </SelectItem>
          <SelectItem value="hybrid" className={selectItemClass}>
            Hybrid
          </SelectItem>
        </SelectContent>
      </Select>

      {/* EXPERIENCE */}
      <Select
        value={filters.experienceLevel || "all"}
        onValueChange={(v) =>
          onFilterChange({ experienceLevel: v === "all" ? "" : v })
        }
        disabled={loading}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Experience" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="fresher" className={selectItemClass}>
            Fresher
          </SelectItem>
          <SelectItem value="0-1" className={selectItemClass}>
            0–1
          </SelectItem>
          <SelectItem value="1-3" className={selectItemClass}>
            1–3
          </SelectItem>
          <SelectItem value="3-5" className={selectItemClass}>
            3–5
          </SelectItem>
          <SelectItem value="5+" className={selectItemClass}>
            5+
          </SelectItem>
        </SelectContent>
      </Select>

      {/* CITY */}
      <Input
        value={cityInput}
        onChange={(e) => setCityInput(e.target.value)}
        placeholder="City"
        className="w-[160px]"
        disabled={loading}
      />

      {hasActive && (
        <Button variant="ghost" size="sm" onClick={clearAll}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default AdminJobFilters;