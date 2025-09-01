import React from 'react';
import { ChevronDown, ChevronRight, ImagePlus } from 'lucide-react';
import { useEffect } from 'react';

const GroupedVariantsSection = ({ 
  filteredGrouped, 
  expandedGroups, 
  toggleGroup, 
  updatePrice, 
  updateInventory, 
  selectedVariants, 
  handleGroupSelect, 
  handleSubSelect, 
  getGroupPriceDisplay, 
  getGroupInventory, 
  isFlat, 
  imageUrls, 
  triggerFileInput,
  searchTerm,
}) => {
  useEffect(() => {
    console.log('searchTerm: ' + searchTerm);
  }, [searchTerm]);
  return (
    <div className="bg-white px-4 py-0 rounded-lg mb-4">
      {Object.entries(filteredGrouped).map(([group, subs]) => (
        <div key={group} className="mb-4 last:mb-0">
          <div className="flex items-center justify-between bg-white rounded-lg p-3 mb-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={subs.length > 0 && subs.every(sub => selectedVariants.has(sub.originalName))}
                onChange={() => handleGroupSelect(group)}
              />
              <div
                className="w-8 h-8 border border-dashed border-gray-300 hover:border-blue-500 cursor-pointer rounded flex items-center justify-center"
                onClick={() => triggerFileInput(group)}
              >
                {imageUrls[group] ? (
                  <img src={imageUrls[group]} alt="Variant" className="w-full h-full object-cover rounded" />
                ) : (
                  <ImagePlus size={16} className="text-blue-500" />
                )}
              </div>
              <button onClick={() => toggleGroup(group)} className="flex items-center gap-2 text-left">
                {expandedGroups.has(group) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span className="font-medium">{group}</span>
                <span className="text-gray-500 text-sm">{subs.length} variant{subs.length > 1 ? 's' : ''}</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              {isFlat ? (
                <input
                  type="text"
                  placeholder="Range"
                  value={`₹${getGroupPriceDisplay(group)}`}
                  readOnly
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-fit text-center bg-gray-100 cursor-not-allowed"
                />
              ) : (
                <input
                  type="text"
                  placeholder="0.00"
                  value={subs.length > 0 ? `₹${getGroupPriceDisplay(group)}` : ''}
                  onChange={(e) => updatePrice(group, e.target.value.replace('₹', ''), true)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-fit text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onFocus={(e) => e.target.select()}
                  readOnly
                />
              )}
              <input
                type="number"
                placeholder="0"
                value={getGroupInventory(group)}
                readOnly
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-20 text-center bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {expandedGroups.has(group) && (
            <div className="ml-6 space-y-2">
              {subs.map(sub => {
                const subVariantKey = `${group}-${sub.name}`;
                const subHasImage = imageUrls[subVariantKey];
                const inheritedImage = !subHasImage && imageUrls[group];

                return (
                  <div key={sub.name} className="flex items-center justify-between bg-white rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={selectedVariants.has(sub.originalName)}
                        onChange={() => handleSubSelect(sub.originalName)}
                      />
                      <div
                        className="w-8 h-8 border border-dashed border-gray-300 hover:border-blue-500 cursor-pointer rounded flex items-center justify-center"
                        onClick={() => triggerFileInput(subVariantKey)}
                      >
                        {subHasImage ? (
                          <img src={imageUrls[subVariantKey]} alt="Sub-Variant" className="w-full h-full object-cover rounded" />
                        ) : inheritedImage ? (
                          <img src={imageUrls[group]} alt="Inherited Variant" className="w-full h-full object-cover rounded" />
                        ) : (
                          <ImagePlus size={16} className="text-blue-500" />
                        )}
                      </div>
                      <span className="font-medium">{sub.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="0.00"
                        value={sub.price || ''}
                        onChange={(e) => updatePrice(sub.originalName, e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-24 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onFocus={(e) => e.target.select()}
                      />
                      <input
                        type="number"
                        placeholder="0"
                        value={sub.inventory || ''}
                        onChange={(e) => updateInventory(sub.originalName, e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onFocus={(e) => e.target.select()}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupedVariantsSection;