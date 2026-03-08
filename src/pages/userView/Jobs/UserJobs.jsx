import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchPublicJobs } from "../../../store/user-view/UserJobSlice";

import JobCard from "./JobCard";
import JobFilters from "./JobFilter";
import PostJobForm from "./PostJobForm";
import ApplyJobDialog from "./ApplyJobDialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Search, Plus } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Pagination component
// ─────────────────────────────────────────────
const PaginationControls = ({ currentPage, totalPages, onPageChange, delta = 2 }) => {
  const pages = [];
  const start = Math.max(1, currentPage - delta);
  const end = Math.min(totalPages, currentPage + delta);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex justify-center mt-10">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-blue-400"}
              onClick={() => onPageChange(currentPage - 1)}
            />
          </PaginationItem>

          {pages[0] > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(1)} className="cursor-pointer">1</PaginationLink>
              </PaginationItem>
              {pages[0] > 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
            </>
          )}

          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
                className="cursor-pointer transition-colors duration-200 hover:bg-blue-950 hover:text-white"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {pages[pages.length - 1] < totalPages && (
            <>
              {pages[pages.length - 1] < totalPages - 1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(totalPages)} className="cursor-pointer">
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-blue-400"}
              onClick={() => onPageChange(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
const UserJobs = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    list = [],
    pagination = { page: 1, pages: 1, total: 0 },
    loading = { fetch: false },
    error = null,
  } = useSelector((state) => state.userJobsReducer || {});

  const isLoading = loading.fetch;

  // ── Read URL params ──
  const pageFromUrl             = parseInt(searchParams.get("page")) || 1;
  const searchFromUrl           = searchParams.get("search") || "";
  const employmentTypeFromUrl   = searchParams.get("employmentType") || "";
  const workModeFromUrl         = searchParams.get("workMode") || "";
  const experienceLevelFromUrl  = searchParams.get("experienceLevel") || "";
  const cityFromUrl             = searchParams.get("city") || "";

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [view, setView]               = useState("tile");
  const [applyJob, setApplyJob]       = useState(null);

  // ── Refs ──
  const debounceRef      = useRef(null);
  const userTypingRef    = useRef(false);
  const listContainerRef = useRef(null);   // ← scroll target
  const prevPageRef      = useRef(pageFromUrl); // ← track previous page

  // ── Search input: local state, debounced → URL ──
  const [searchInput, setSearchInput] = useState(searchFromUrl);

  // Sync URL → input when user navigates back/forward (but NOT while typing)
  useEffect(() => {
    if (!userTypingRef.current) {
      setSearchInput(searchFromUrl);
    }
  }, [searchFromUrl]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchInput(value);
    userTypingRef.current = true;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      userTypingRef.current = false;
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (value.trim()) {
          params.set("search", value.trim());
        } else {
          params.delete("search");
        }
        params.set("page", "1");
        return params;
      });
    }, 500);
  }, [setSearchParams]);

  // Cleanup debounce on unmount
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  // ── Fetch on URL change ──
  useEffect(() => {
    dispatch(fetchPublicJobs({
      page: pageFromUrl,
      limit: 18,
      employmentType: employmentTypeFromUrl,
      workMode: workModeFromUrl,
      experienceLevel: experienceLevelFromUrl,
      city: cityFromUrl,
      search: searchFromUrl,
    }));
  }, [dispatch, pageFromUrl, searchFromUrl, employmentTypeFromUrl, workModeFromUrl, experienceLevelFromUrl, cityFromUrl]);

  // ── Smooth scroll to list after page change ──
  useEffect(() => {
    if (isLoading) return;

    if (prevPageRef.current !== pageFromUrl) {
      prevPageRef.current = pageFromUrl;

      setTimeout(() => {
        const element = listContainerRef.current;
        if (!element) return;

        const headerOffset = 120;
        const offsetPosition =
          element.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }, 300);
    }
  }, [isLoading, pageFromUrl]);

  // ── Handlers ──
  const handleFilterChange = useCallback((newFilters) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      params.set("page", "1");
      return params;
    });
  }, [setSearchParams]);

  const handlePageChange = useCallback((page) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", String(page));
      return params;
    });
  }, [setSearchParams]);

  const handleJobCreated = useCallback(() => {
    setIsSheetOpen(false);

    dispatch(fetchPublicJobs({
      page: pageFromUrl, limit: 18,
      employmentType: employmentTypeFromUrl,
      workMode: workModeFromUrl,
      experienceLevel: experienceLevelFromUrl,
      city: cityFromUrl,
      search: searchFromUrl,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [dispatch, pageFromUrl, searchFromUrl, employmentTypeFromUrl, workModeFromUrl, experienceLevelFromUrl, cityFromUrl]);

  const filters = {
    page: pageFromUrl, limit: 18,
    employmentType: employmentTypeFromUrl,
    workMode: workModeFromUrl,
    experienceLevel: experienceLevelFromUrl,
    city: cityFromUrl,
    search: searchFromUrl,
  };

  return (
    <div className="bg-white min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold gal-sans  uppercase tracking-widest text-slate-500">
                Alumni & Partner Companies
              </p>
              <h1 className="mt-6 text-[clamp(3rem,5vw,3.8rem)] font-serif font-extrabold leading-[1.05] text-slate-900">
                Opportunities shared by
                <span className="block">people who once sat beside you.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg text-slate-600">
                Explore career opportunities shared by alumni and trusted partners.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 bg-indigo-200/40 rounded-3xl blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
                alt="Alumni mentoring"
                className="relative rounded-3xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH + CTA */}
      <section>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search jobs, companies, keywords..."
                value={searchInput}
                onChange={handleSearchChange}
                className="pl-12 h-14 text-lg bg-gray-100 border-border rounded-xl"
              />
            </div>
            <Button
              onClick={() => setIsSheetOpen(true)}
              className="h-14 px-15 bg-[#EBAB09] hover:bg-yellow-500 text-white cursor-pointer rounded-xl"
            >
              <Plus className="h-5 w-5 mr-2" />
              Post a Job
            </Button>
          </div>
        </div>
      </section>

      {/* FILTERS + JOBS — ref attached here as scroll target */}
      <section ref={listContainerRef} className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <JobFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            loading={isLoading}
            view={view}
            onViewChange={setView}
          />
        </div>

        {!isLoading && !error && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{pagination.total}</span>{" "}
              job{pagination.total !== 1 && "s"}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent" />
          </div>
        )}

        {!isLoading && error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-xl">
            {typeof error === "string" ? error : error?.message || "Something went wrong"}
          </div>
        )}

        {!isLoading && !error && list.length === 0 && (
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <Briefcase className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-6 text-xl font-semibold text-foreground">No jobs found</h3>
          </div>
        )}

        {!isLoading && !error && list.length > 0 && (
          <>
            <div className={cn("gap-6", view === "tile" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col")}>
              {list.map((job) => (
                <JobCard key={job._id} job={job} onApply={(job) => setApplyJob(job)} view={view} />
              ))}
            </div>

            {pagination.pages > 1 && (
              <PaginationControls
                currentPage={pageFromUrl}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </section>

      <PostJobForm open={isSheetOpen} onOpenChange={setIsSheetOpen} onJobCreated={handleJobCreated} />
      <ApplyJobDialog
        open={!!applyJob}
        onOpenChange={(open) => { if (!open) setApplyJob(null); }}
        job={applyJob}
      />
    </div>
  );
};

export default UserJobs;