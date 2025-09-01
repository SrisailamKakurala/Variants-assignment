import React from 'react';
import { X, ChevronDown } from 'lucide-react';

const SearchFiltersSection = ({ 
  showSearch, 
  setShowSearch, 
  searchTerm, 
  setSearchTerm, 
  filters, 
  setFilters, 
  uniqueVariantNames, 
  toggleDropdown, 
  activeDropdown, 
  handleFilterChange, 
  handleClearFilter, 
  handleClearAllFilters,
  variants
}) => {
  return (
    <>
      {showSearch && (
        <div className="space-y-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                console.log(e.target.value);
                setSearchTerm(e.target.value);
              }}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-full pr-10"
              autoFocus
            />
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
          {Object.keys(filters).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {Object.entries(filters).map(([variantName, value]) => (
                <div key={`${variantName}-${value}`} className="relative">
                  <button
                    className="flex items-center justify-center bg-white border border-gray-100 shadow rounded-full px-2 py-1 text-sm"
                  >
                    <span>{`${variantName} ${value}`}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearFilter(variantName);
                      }}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X size={12} />
                    </button>
                  </button>
                </div>
              ))}
              <button
                onClick={handleClearAllFilters}
                className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
          <div className="flex gap-2">
            {uniqueVariantNames.map(variantName => (
              <div key={variantName} className="relative">
                <button
                  onClick={() => toggleDropdown(variantName)}
                  className="flex items-center justify-center bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-32"
                >
                  <span>{filters[variantName] || `All ${variantName}`}</span>
                  <ChevronDown size={16} className="ml-2" />
                </button>
                {activeDropdown === variantName && (
                  <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="p-2 max-h-40 overflow-auto">
                      <label className="block px-2 py-1 hover:bg-gray-100 cursor-pointer">
                        <input
                          type="radio"
                          name={`filter-${variantName}`}
                          value=""
                          checked={!filters[variantName]}
                          onChange={() => handleFilterChange(variantName, '')}
                          className="mr-2"
                        />
                        All {variantName}
                      </label>
                      {[...new Set(variants
                        .filter(v => v.name === variantName)
                        .flatMap(v => v.values.map(val => val.value))
                        .filter(val => val.trim() !== ''))]
                        .map(value => (
                          <label key={value} className="block px-2 py-1 hover:bg-gray-100 cursor-pointer">
                            <input
                              type="radio"
                              name={`filter-${variantName}`}
                              value={value}
                              checked={filters[variantName] === value}
                              onChange={() => handleFilterChange(variantName, value)}
                              className="mr-2"
                            />
                            {value}
                          </label>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchFiltersSection;