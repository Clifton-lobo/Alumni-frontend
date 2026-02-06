import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicJobs } from '../../../store/user-view/UserJobSlice';
import JobPostSheet from './PostJobForm';
import JobCard from './JobCard';
import JobFilters from './JobFilter';
import { Button } from '../../../components/ui/button';
import { Plus, Briefcase } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../../components/ui/pagination';

const UserJobs = () => {
  const dispatch = useDispatch();

  // ✅ FIXED selector path + safe defaults
  const {
    list = [],
    pagination = { page: 1, pages: 1 },
    loading = false,
    error = null,
  } = useSelector((state) => state.userJobsReducer || {});

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    employmentType: '',
    workMode: '',
    experienceLevel: '',
    city: '',
    search: '',
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
  };

  return (
    <div className=" mxauto bg-white ">


      <section className="relative bg-white overflow-hidden">
        {/* Left accent strip */}
        <div className="absolute left-0 top-0 h-full w-2 bg--400" />

        <div className="mx-auto max-w-7xl px-6 pt-10 pb48">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Left content */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Alumni & Partner Companies
              </p>

              <h1 className="mt-6 text-[clamp(3rem,5vw,5.5rem)] font-extrabold leading-[1.05] text-slate-900">
                Opportunities shared by
                <span className="block">
                  people who once sat
                  <span className="relative ml-2">
                    beside you
                    <span className="absolute left-0 bottom-2 h-3 w-full bg-amber-300 -z-10" />
                  </span>
                  .
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-lg text-slate-600">
                Explore career opportunities shared by alumni and trusted partners
                who understand your journey and want to help you grow.
              </p>
            </div>

            {/* Right animated image block */}
            <div className="relative">
              <div className="absolute -inset-6 bg-indigo-200/40 rounded-3xl blur-3xl" />

              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
                alt="Alumni mentoring and career discussion"
                className="relative rounded-3xl object-cover shadow-2xl"
                style={{ animation: "floatSlow 6s ease-in-out infinite" }}
              />
            </div>

          </div>
        </div>
      </section>


      {/* SEARCH BAR */}
      <div className="w-full bg-slate-50  border-slate-200 py-10">
        <div className="w-full px-12 flex items-center gap-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search jobs, companies..."
              value={filters.search}
              onChange={(e) =>
                handleFilterChange({ search: e.target.value })
              }
              className="w-full h-14 rounded-xl border-2 bg-gray-200 border-slate-200 pl-12 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
          </div>

          <button
            className="h-14 px-10 rounded-xl bg-blue-600 text-white text-lg font-medium hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* FILTER + META ROW */}
      <div className="w-full px-12 py8 flex items-center justify-between">
        {/* LEFT: FILTERS */}
        <JobFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
        />

        {/* RIGHT: META */}
        <div className="flex items-center gap-6">
          <span className="text-slate-500 text-sm">
            {pagination?.total || list.length} jobs found
          </span>

          <Button
            onClick={() => setIsSheetOpen(true)}
            className="h-10 px-6 rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
            variant="outline"
          >
            Post a Job
          </Button>
        </div>
      </div>


      {/* JOB LIST */}
      <div className="w-full px-12 pb-24">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && list.length === 0 && (
          <div className="text-center py-20">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No jobs found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting filters or post a new job.
            </p>
          </div>
        )}

        {!loading && !error && list.length > 0 && (
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
                          handlePageChange(Math.max(1, pagination.page - 1))
                        }
                        className={
                          pagination.page === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {[...Array(pagination.pages)].map((_, idx) => {
                      const page = idx + 1;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={pagination.page === page}
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
                            Math.min(pagination.pages, pagination.page + 1)
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


      {/* Job Post Sheet */}
      <JobPostSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
};

export default UserJobs;

// {/*
//       {/* Filters */}
//       <JobFilters
//         filters={filters}
//         onFilterChange={handleFilterChange}
//         loading={loading}
//       />
//        */}