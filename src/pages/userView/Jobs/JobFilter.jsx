import React from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Search, X } from 'lucide-react';

const JobFilters = ({ filters, onFilterChange, loading }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleFilterSelect = (field, value) => {
    onFilterChange({ [field]: value === 'all' ? '' : value });
  };

  const handleClearFilters = () => {
    onFilterChange({
      employmentType: '',
      workMode: '',
      experienceLevel: '',
      city: '',
      search: '',
    });
  };

  const hasActiveFilters =
    filters.employmentType ||
    filters.workMode ||
    filters.experienceLevel ||
    filters.city ||
    filters.search;

  return (
    <div className="bg-white rounded-lg  p6 spacey4">
      {/* Search Bar */}
      {/* <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by job title or company..."
          value={filters.search}
          onChange={handleSearchChange}
          className="pl-10"
          disabled={loading}
        />
      </div> */}

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap4">
        {/* Employment Type */}
        <Select
          value={filters.employmentType || 'all'}
          onValueChange={(value) => handleFilterSelect('employmentType', value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Employment Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full Time</SelectItem>
            <SelectItem value="part-time">Part Time</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
          </SelectContent>
        </Select>

        {/* Work Mode */}
        <Select
          value={filters.workMode || 'all'}
          onValueChange={(value) => handleFilterSelect('workMode', value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Work Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="onsite">Onsite</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>

        {/* Experience Level */}
        <Select
          value={filters.experienceLevel || 'all'}
          onValueChange={(value) => handleFilterSelect('experienceLevel', value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="fresher">Fresher</SelectItem>
            <SelectItem value="0-1">0-1 years</SelectItem>
            <SelectItem value="1-3">1-3 years</SelectItem>
            <SelectItem value="3-5">3-5 years</SelectItem>
            <SelectItem value="5+">5+ years</SelectItem>
          </SelectContent>
        </Select>

        {/* City */}
        <div className="relative">
          <Input
            type="text"
            placeholder="City (e.g., Mumbai)"
            value={filters.city}
            onChange={(e) => onFilterChange({ city: e.target.value })}
            disabled={loading}
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            disabled={loading}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm text-gray-500">Active filters:</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
              Search: {filters.search}
            </span>
          )}
          {filters.employmentType && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
              {filters.employmentType.replace('-', ' ')}
            </span>
          )}
          {filters.workMode && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
              {filters.workMode}
            </span>
          )}
          {filters.experienceLevel && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
              {filters.experienceLevel === 'fresher'
                ? 'Fresher'
                : `${filters.experienceLevel} years`}
            </span>
          )}
          {filters.city && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
              {filters.city}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default JobFilters;