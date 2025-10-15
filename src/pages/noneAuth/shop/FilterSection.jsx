import React from "react";
import { Filter, Search } from "lucide-react";

const FilterSection = ({
  searchName,
  setSearchName,
  selectedYear,
  setSelectedYear,
  selectedKit,
  setSelectedKit,
  availableYears,
  handleClearFilters,
  sortOption,
  setSortOption,
}) => (
  <div className="max-w-4xl mx-auto mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
      <Filter size={20} className="text-blue-500" />
      Filters
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
      {/* 🔍 Search */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          Search by Name
        </label>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Enter product name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            aria-label="Search products by name"
          />
        </div>
      </div>

      {/* 📅 Year */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          Filter by Year
        </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          aria-label="Filter by year"
        >
          <option value="">All Years</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* 🧤 Kit Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          Filter by Kit Type
        </label>
        <select
          value={selectedKit}
          onChange={(e) => setSelectedKit(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          aria-label="Filter by kit type"
        >
          <option value="">All Kits</option>
          <option value="Home">Home</option>
          <option value="Away">Away</option>
          <option value="Third">Third</option>
        </select>
      </div>

      {/* 🔽 Sort */}
      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          Sort By
        </label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          aria-label="Sort products"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="year-desc">Year (Newest)</option>
          <option value="year-asc">Year (Oldest)</option>
        </select>
      </div>

      {/* 🧹 Clear Filters */}
      <div className="flex items-end">
        <button
          onClick={handleClearFilters}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
          aria-label="Clear all filters and sort"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
);

export default FilterSection;
