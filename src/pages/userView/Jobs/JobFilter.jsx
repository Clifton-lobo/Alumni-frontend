import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

const selectItemClass =
  "cursor-pointer focus:bg-blue-950 focus:text-white data-[state=checked]:bg-blue-950 data-[state=checked]:text-white";

const JobFilters = ({
  filters,
  onFilterChange,
  loading = false,
  view,
  onViewChange,
}) => {
  // Local state ONLY for city input (controlled component)
  const [localCity, setLocalCity] = useState("");

  // Debounced effect for city search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ city: localCity });
    }, 500);

    return () => clearTimeout(timer);
  }, [localCity]);

  // Handle dropdown filter changes (instant, no debounce)
  const handleDropdownChange = (field, value) => {
    const filterValue = value === "all" ? "" : value;
    onFilterChange({ [field]: filterValue });
  };

  // Clear ALL filters
  const clearAllFilters = () => {
    setLocalCity("");
    onFilterChange({
      employmentType: "",
      workMode: "",
      experienceLevel: "",
      city: "",
    });
  };

  // Clear individual filter (for pills)
  const clearSingleFilter = (field) => {
    if (field === "city") {
      setLocalCity("");
    }
    onFilterChange({ [field]: "" });
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.employmentType ||
    filters.workMode ||
    filters.experienceLevel ||
    filters.city;

    return (
  <div className="space-y-4">
    <div className="flex flex-wrap items-center gap-4">
      {/* Employment Type */}
      <Select
        value={filters.employmentType || "all"}
        onValueChange={(val) =>
          handleDropdownChange("employmentType", val)
        }
        disabled={loading}
      >
        <SelectTrigger className="w-[160px] bg-white rounded-sm border-border focus:ring-2 focus:ring-blue-950 data-[state=open]:border-blue-950">
          <SelectValue placeholder="Employment Type" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem
            value="all"
            className="cursor-pointer focus:bg-muted focus:text-foreground"
          >
            All Types
          </SelectItem>
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

      {/* Work Mode */}
      <Select
        value={filters.workMode || "all"}
        onValueChange={(val) =>
          handleDropdownChange("workMode", val)
        }
        disabled={loading}
        className=""
      >
        <SelectTrigger className="w-[140px] bg-white rounded-sm focus:ring-2 focus:ring-blue-950 data-[state=open]:border-blue-950">
          <SelectValue placeholder="Work Mode" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem
            value="all"
            className="cursor-pointer  focus:bg-muted focus:text-foreground"
          >
            All Modes
          </SelectItem>
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

      {/* Experience Level */}
      <Select
        value={filters.experienceLevel || "all"}
        onValueChange={(val) =>
          handleDropdownChange("experienceLevel", val)
        }
        disabled={loading}
      >
        <SelectTrigger className="w-[140px] bg-white rounded-sm border-border focus:ring-2 focus:ring-blue-950 data-[state=open]:border-blue-950">
          <SelectValue placeholder="Experience" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem
            value="all"
            className="cursor-pointer focus:bg-muted focus:text-foreground"
          >
            All Levels
          </SelectItem>
          <SelectItem value="fresher" className={selectItemClass}>
            Fresher
          </SelectItem>
          <SelectItem value="0-1" className={selectItemClass}>
            0–1 years
          </SelectItem>
          <SelectItem value="1-3" className={selectItemClass}>
            1–3 years
          </SelectItem>
          <SelectItem value="3-5" className={selectItemClass}>
            3–5 years
          </SelectItem>
          <SelectItem value="5+" className={selectItemClass}>
            5+ years
          </SelectItem>
        </SelectContent>
      </Select>

      {/* City */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="City (e.g., Mumbai)"
          value={localCity}
          onChange={(e) => setLocalCity(e.target.value)}
          className="pl-10  w-[180px] bg-white outline-none  border-border focus:ring-2 focus:ring-blue-950"
        />
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          disabled={loading}
          className="text-muted-foreground hover:bg-blue-950 hover:text-white transition-colors"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}

      <div className="flex-1" />

      {/* View Toggle */}
      <div className="hidden md:flex items-center cursor-pointer gap-1 bg-gray-200 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange("list")}
          className={cn(
            "px-3 h-8 rounded-md transition-all",
            view === "list"
              ? "bg-white shadow-sm  cursor-pointer hover:text-white hover:bg-blue-950"
              : "hover:bg-blue-950  cursor-pointer hover:text-white"
          )}
        >
          <List className="h-4 w-4 mr-2" />
          List
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange("tile")}
          className={cn(
            "px-3 h-8 rounded-md transition-all",
            view === "tile"
              ? "bg-white shadow-sm hover:text-white  cursor-pointer hover:bg-blue-950"
              : "hover:bg-blue-950  cursor-pointer hover:text-white"
          )}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          Grid
        </Button>
      </div>
    </div>

    {/* Pills */}
    {/* {hasActiveFilters && (
      <div className="flex flex-wrap gap-2">
        {filters.employmentType && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
            {filters.employmentType.replace("-", " ")}
            <button onClick={() => clearSingleFilter("employmentType")}>
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {filters.workMode && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
            {filters.workMode}
            <button onClick={() => clearSingleFilter("workMode")}>
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {filters.experienceLevel && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
            {filters.experienceLevel}
            <button onClick={() => clearSingleFilter("experienceLevel")}>
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {filters.city && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
            {filters.city}
            <button onClick={() => clearSingleFilter("city")}>
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
      </div>
    )} */}
  </div>
);

};

export default JobFilters;
