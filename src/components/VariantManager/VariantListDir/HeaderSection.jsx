import React from 'react';
import { LucideMoreHorizontal } from 'lucide-react';

const HeaderSection = ({ 
  selectedVariants, 
  variants, 
  handleSelectAllToggle, 
  toggleAll, 
  allExpanded,
  handleUnSelectAll,
  expandAll,
  collapseAll
}) => {
  return (
    <div className="flex justify-between items-center mb-4 border-y-1 border-gray-200 py-3 px-2 bg-gray-100">
      <div className="flex items-center gap-2">
        {selectedVariants.size > 0 ? (
          <>
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={true}
              onChange={() => {
                handleUnSelectAll();
              }}
            />
            <span className="text-sm text-gray-600 font-semibold">{selectedVariants.size} items selected</span>
            <style>
              {`
                .custom-checkbox:checked::after {
                  content: '-';
                  color: #fff;
                  font-size: 10px;
                  font-weight: 800;
                  line-height: 0;
                }
              `}
            </style>
          </>
        ) : (
          <>
            <input
              type="checkbox"
              className="custom-checkbox"
              checked={selectedVariants.size === variants.length}
              onChange={handleSelectAllToggle}
            />
            <span className="text-sm text-gray-700">Variant</span>
            <button
              onClick={toggleAll}
              className="text-sm text-blue-600 hover:text-blue-700 ml-2 cursor-pointer"
            >
              {allExpanded ? "Collapse all" : "Expand all"}
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
        {selectedVariants.size > 0 ? (
          <div className="flex items-center justify-center hover:bg-slate-100 py-1 px-2 rounded cursor-pointer shadow duration-75">
            <LucideMoreHorizontal size={20} />
          </div>
        ) : (
          <>
            <div className="w-24 text-center">Price</div>
            <div className="w-20 text-center">Available</div>
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderSection;