import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicJobs } from "../../../store/user-view/UserJobSlice";

import JobCard from "./JobCard";
import JobFilters from "./JobFilter";
import PostJobForm from "./PostJobForm";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Briefcase,
  Search,
  Plus,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const UserJobs = () => {
  const dispatch = useDispatch();

  const {
    list = [],
    pagination = { page: 1, pages: 1, total: 0 },
    loading = { fetch: false },
    error = null,
  } = useSelector((state) => state.userJobsReducer || {});

  const isLoading = loading.fetch;

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [view, setView] = useState("list");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchInput,
        page: 1,
      }));
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);


  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    employmentType: "",
    workMode: "",
    experienceLevel: "",
    city: "",
    search: "",
  });

  useEffect(() => {
    dispatch(fetchPublicJobs(filters));
  }, [dispatch, filters]);

  /* ================= FILTER HANDLERS ================= */

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleJobCreated = () => {
    setIsSheetOpen(false);
    dispatch(fetchPublicJobs(filters));
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white min-h-screen">
      {/* ================= HERO (FROM CODE 1) ================= */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-6 pt-10 pb-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Alumni & Partner Companies
              </p>

              <h1 className="mt-6 text-[clamp(3rem,5vw,5.5rem)] font-extrabold leading-[1.05] text-slate-900">
                Opportunities shared by
                <span className="block">
                  people who once sat beside you.
                </span>
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

      {/* ================= SEARCH + CTA ================= */}
      <section className=" ">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search jobs, companies, keywords..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-12 h-14 text-lg bg-gray-100 border-border rounded-xl"
              />

            </div>

            <Button
              onClick={() => setIsSheetOpen(true)}
              className="h-14 px-15  bg-[#EBAB09] hover:bg-yellow-500 text-black cursor-pointer rounded-xl"
            >
              <Plus className="h-5 w-5 mr-2" />
              Post a Job
            </Button>
          </div>
        </div>
      </section>

      {/* ================= FILTERS + JOBS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <JobFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            loading={isLoading}
            view={view}
            onViewChange={setView}
          />
        </div>

        {/* RESULTS INFO */}
        {!isLoading && !error && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {pagination.total}
              </span>{" "}
              job{pagination.total !== 1 && "s"}
            </p>
          </div>
        )}

        {/* LOADING */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent" />
          </div>
        )}

        {/* ERROR */}
        {!isLoading && error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && !error && list.length === 0 && (
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <Briefcase className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-6 text-xl font-semibold text-foreground">
              No jobs found
            </h3>
          </div>
        )}

        {/* JOB LIST */}
        {!isLoading && !error && list.length > 0 && (
          <>
            <div
              className={cn(
                "gap-6",
                view === "tile"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col"
              )}
            >
              {list.map((job) => (
                <JobCard key={job._id} job={job} view={view} />
              ))}
            </div>

            {/* PAGINATION */}
            {pagination.pages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          handlePageChange(
                            Math.max(1, pagination.page - 1)
                          )
                        }
                      />
                    </PaginationItem>

                    {[...Array(pagination.pages)].map((_, i) => {
                      const page = i + 1;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={pagination.page === page}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          handlePageChange(
                            Math.min(
                              pagination.pages,
                              pagination.page + 1
                            )
                          )
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </section>

      {/* ================= POST JOB SHEET ================= */}
      <PostJobForm
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
};

export default UserJobs;
