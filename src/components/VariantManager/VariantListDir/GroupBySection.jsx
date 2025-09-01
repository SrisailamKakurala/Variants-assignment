import React from 'react';
import { ChevronDown, Search, ListFilter } from 'lucide-react';

const GroupBySection = ({ groupBy, uniqueVariantNames, toggleDropdown, activeDropdown, handleGroupByChange, showSearch, setShowSearch, setSearchTerm, searchTerm }) => {
  return (
    <div className="flex justify-between items-center mb-4 border-t border-gray-200 pt-6">
      <div className="relative">
        <div className="flex gap-2 items-center">
          <span className="font-semibold">Group By</span>
          <button
            onClick={() => toggleDropdown('groupBy')}
            className="flex items-center justify-center bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-fit"
          >
            <span>{groupBy || 'Group by'}</span>
            <ChevronDown size={16} className="ml-2" />
          </button>
        </div>
        {activeDropdown === 'groupBy' && (
          <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="p-2 max-h-40 overflow-auto">
              {uniqueVariantNames.map(name => (
                <label key={name} className="block px-2 py-1 hover:bg-gray-100 cursor-pointer">
                  <input
                    type="radio"
                    name="groupBy"
                    value={name}
                    checked={groupBy === name}
                    onChange={() => handleGroupByChange(name)}
                    className="mr-2"
                  />
                  {name}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {showSearch && (
          <button
            onClick={() => {
              setSearchTerm('');
              setShowSearch(false);
            }}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 cursor-pointer text-red-400"
          >
            Cancel
          </button>
        )}
        {!showSearch && (
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 hover:bg-gray-100 cursor-pointer border border-gray-300 rounded-lg"
          >
            <div className="flex gap-2">
              <Search size={16} />
              <ListFilter size={16} />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupBySection;