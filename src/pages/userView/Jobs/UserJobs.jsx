import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicJobs } from "../../../store/user-view/UserJobSlice";
import JobPostSheet from "./PostJobForm";
import JobCard from "./JobCard";
import JobFilters from "./JobFilter";
import { Button } from "../../../components/ui/button";
import { Briefcase } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";

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

  return (
    <div className="bg-white">

       {/* HERO */}
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

      {/* SEARCH */}
      <div className="bg-slate-50 bordery py-8 px-12 flex gap-6">
        <input
          type="text"
          placeholder="Search jobs, companies..."
          value={filters.search}
          onChange={(e) =>
            handleFilterChange({ search: e.target.value })
          }
          className="flex-1 h-14 rounded-xl border bg-gray-200 px-6 text-lg"
        />

        <Button onClick={() => dispatch(fetchPublicJobs(filters))}>
          Search
        </Button>
      </div>

      {/* FILTERS */}
      <div className="px-12 py-6 flex justify-between items-center">
        <JobFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={isLoading}
        />

        <Button variant="outline" onClick={() => setIsSheetOpen(true)}>
          Post a Job
        </Button>
      </div>

      {/* JOB LIST */}
      <div className="px-12 pb-24">
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        {!isLoading && !error && list.length === 0 && (
          <div className="text-center py-20">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No jobs found
            </h3>
          </div>
        )}

        {!isLoading && !error && list.length > 0 && (
          <>
            <div className="grid gap-6">
              {list.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

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
      </div>

      <JobPostSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
};

export default UserJobs;
