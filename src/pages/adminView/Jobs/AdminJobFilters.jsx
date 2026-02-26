import { Input } from "@/components/ui/input";
import { Search, MapPin, Briefcase, Monitor, TrendingUp, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const DEBOUNCE_DELAY = 500;

const NAVY = "#142A5D";
const GOLD = "#EBAB09";

const filterStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap');
  .filter-wrap * { font-family: 'Outfit', sans-serif; }
  .filter-select { 
    appearance: none; -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    cursor: pointer;
  }
  .filter-select:focus { outline: none; border-color: ${GOLD}; box-shadow: 0 0 0 3px ${GOLD}22; }
  .filter-input:focus { outline: none; border-color: ${GOLD}; box-shadow: 0 0 0 3px ${GOLD}22; }
  .clear-btn:hover { background: #fee2e2; color: #dc2626; }
`;

const baseInputStyle = {
  width: "100%",
  padding: "9px 12px 9px 36px",
  borderRadius: "12px",
  border: "1.5px solid #e5e7eb",
  fontSize: "13px",
  color: "#1f2937",
  background: "#fff",
  fontFamily: "'Outfit', sans-serif",
  transition: "border-color 0.15s, box-shadow 0.15s",
  height: "40px",
};

const selectStyle = {
  ...baseInputStyle,
  padding: "9px 32px 9px 36px",
};

const FilterField = ({ icon: Icon, label, children }) => (
  <div style={{ position: "relative", flex: 1, minWidth: "130px", maxWidth: "200px" }}>
    <Icon style={{
      position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)",
      width: 14, height: 14, color: GOLD, zIndex: 1, pointerEvents: "none",
    }} />
    {children}
    <span style={{
      position: "absolute", top: "-9px", left: "10px",
      fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em",
      textTransform: "uppercase", color: "#9ca3af",
      background: "#fff", padding: "0 4px",
      fontFamily: "'Outfit', sans-serif",
    }}>
      {label}
    </span>
  </div>
);

const AdminJobFilters = ({ filters, onFilterChange, loading }) => {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [cityInput, setCityInput] = useState(filters.city || "");
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const t = setTimeout(() => onFilterChange({ search: searchInput.trim() }), DEBOUNCE_DELAY);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    const t = setTimeout(() => onFilterChange({ city: cityInput.trim() }), DEBOUNCE_DELAY);
    return () => clearTimeout(t);
  }, [cityInput]);

  useEffect(() => {
    if (!filters.search && searchInput) setSearchInput("");
    if (!filters.city && cityInput) setCityInput("");
  }, [filters.search, filters.city]);

  const clearAll = () => {
    setSearchInput(""); setCityInput("");
    onFilterChange({ employmentType: "", workMode: "", experienceLevel: "", city: "", search: "" });
  };

  const hasActive = filters.employmentType || filters.workMode ||
    filters.experienceLevel || searchInput || cityInput;

  return (
    <>
      <style>{filterStyle}</style>
      <div className="filter-wrap" style={{
        background: "#fff",
        borderRadius: "18px",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        padding: "16px 20px",
        marginBottom: "24px",
      }}>

        {/* Label row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "#9ca3af" }}>
            Filter Jobs
          </p>
          {hasActive && (
            <button className="clear-btn" onClick={clearAll} style={{
              display: "flex", alignItems: "center", gap: "4px",
              fontSize: "11px", fontWeight: 600, color: "#9ca3af",
              background: "#f9fafb", border: "none", borderRadius: "8px",
              padding: "4px 10px", cursor: "pointer", transition: "all 0.15s",
            }}>
              <X style={{ width: 11, height: 11 }} /> Clear filters
            </button>
          )}
        </div>

        {/* Filter row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center" }}>

          {/* Search — wider */}
          <div style={{ position: "relative", flex: "2 1 220px", maxWidth: "300px" }}>
            <Search style={{
              position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)",
              width: 14, height: 14, color: GOLD, pointerEvents: "none",
            }} />
            <span style={{
              position: "absolute", top: "-9px", left: "10px",
              fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em",
              textTransform: "uppercase", color: "#9ca3af",
              background: "#fff", padding: "0 4px",
            }}>Search</span>
            <input
              className="filter-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Title, company or user…"
              style={baseInputStyle}
            />
          </div>

          {/* Employment Type */}
          <FilterField icon={Briefcase} label="Type">
            <select
              className="filter-select"
              value={filters.employmentType || "all"}
              onChange={(e) => onFilterChange({ employmentType: e.target.value === "all" ? "" : e.target.value })}
              disabled={loading}
              style={selectStyle}
            >
              <option value="all">All types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
          </FilterField>

          {/* Work Mode */}
          <FilterField icon={Monitor} label="Mode">
            <select
              className="filter-select"
              value={filters.workMode || "all"}
              onChange={(e) => onFilterChange({ workMode: e.target.value === "all" ? "" : e.target.value })}
              disabled={loading}
              style={selectStyle}
            >
              <option value="all">All modes</option>
              <option value="onsite">Onsite</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </FilterField>

          {/* Experience */}
          <FilterField icon={TrendingUp} label="Experience">
            <select
              className="filter-select"
              value={filters.experienceLevel || "all"}
              onChange={(e) => onFilterChange({ experienceLevel: e.target.value === "all" ? "" : e.target.value })}
              disabled={loading}
              style={selectStyle}
            >
              <option value="all">Any level</option>
              <option value="fresher">Fresher</option>
              <option value="0-1">0–1 yrs</option>
              <option value="1-3">1–3 yrs</option>
              <option value="3-5">3–5 yrs</option>
              <option value="5+">5+ yrs</option>
            </select>
          </FilterField>

          {/* City */}
          <FilterField icon={MapPin} label="City">
            <input
              className="filter-input"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="e.g. Mumbai"
              style={baseInputStyle}
            />
          </FilterField>

        </div>

        {/* Active filter pills */}
        {hasActive && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f3f4f6" }}>
            {searchInput && <ActivePill label={`"${searchInput}"`} onRemove={() => setSearchInput("")} />}
            {filters.employmentType && <ActivePill label={filters.employmentType} onRemove={() => onFilterChange({ employmentType: "" })} />}
            {filters.workMode && <ActivePill label={filters.workMode} onRemove={() => onFilterChange({ workMode: "" })} />}
            {filters.experienceLevel && <ActivePill label={`${filters.experienceLevel} yrs`} onRemove={() => onFilterChange({ experienceLevel: "" })} />}
            {cityInput && <ActivePill label={cityInput} onRemove={() => setCityInput("")} />}
          </div>
        )}
      </div>
    </>
  );
};

const ActivePill = ({ label, onRemove }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "3px 10px 3px 10px", borderRadius: "999px",
    background: `${NAVY}10`, color: NAVY,
    fontSize: "11px", fontWeight: 600,
    fontFamily: "'Outfit', sans-serif",
  }}>
    {label}
    <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "inherit", opacity: 0.5 }}>
      <X style={{ width: 10, height: 10 }} />
    </button>
  </span>
);

export default AdminJobFilters;