import React, { useState, useRef, useEffect } from 'react';
import VariantOption from './VariantOption';
import { ChevronDown, ChevronRight, PlusCircle, ImagePlus, X, Search, ListFilter, LucideMoreHorizontal } from 'lucide-react';
import Button from '../UI/Button';

const VariantList = ({
  variants,
  addVariant,
  updateName,
  addValue,
  updateValue,
  removeValue,
  removeVariant,
  reorderVariants,
  reorderValues,
  getGroupedVariants,
  groupBy,
  setGroupBy,
  expandedGroups,
  toggleGroup,
  expandAll,
  collapseAll,
  updatePrice,
  updateInventory,
  selectedVariants,
  handleSelectAll,
  handleUnSelectAll,
  handleGroupSelect,
  handleSubSelect,
  getGroupPriceDisplay,
  getGroupInventory,
  totalInventory
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filters, setFilters] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleVariantDragStart = (e, variantId) => {
    const variantIndex = variants.findIndex(v => v.id === variantId);
    setDraggedItem({ type: 'variant', id: variantId, index: variantIndex });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', variantId.toString());
  };

  const handleVariantDragOver = (e, variantId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedItem && draggedItem.type === 'variant' && draggedItem.id !== variantId) {
      const targetIndex = variants.findIndex(v => v.id === variantId);
      setDraggedOverItem({ type: 'variant', id: variantId, index: targetIndex });
    }
  };

  const handleVariantDrop = (e, targetId) => {
    e.preventDefault();

    if (draggedItem && draggedItem.type === 'variant' && draggedItem.id !== targetId) {
      const sourceIndex = draggedItem.index;
      const targetIndex = variants.findIndex(v => v.id === targetId);

      if (sourceIndex !== -1 && targetIndex !== -1) {
        reorderVariants(sourceIndex, targetIndex);
      }
    }

    handleDragEnd();
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  const grouped = getGroupedVariants();
  const allExpanded = Object.keys(grouped).length > 0 && Object.keys(grouped).every(g => expandedGroups.has(g));
  const toggleAll = allExpanded ? collapseAll : expandAll;

  const hasValidVariants = variants.some(variant =>
    variant.name.trim() !== '' && variant.values.some(val => val.value.trim() !== '')
  );

  const handleImageUpload = (e, variantName) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrls(prev => ({ ...prev, [variantName]: url }));
    }
  };

  const triggerFileInput = (variantName) => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.dataset.variantName = variantName;
      fileInputRef.current.click();
    }
  };

  const uniqueVariantNames = [...new Set(variants.map(v => v.name).filter(name => name.trim() !== ''))];
  useEffect(() => {
    if (!uniqueVariantNames.includes(groupBy) && uniqueVariantNames.length > 0) {
      setGroupBy(uniqueVariantNames[0]);
    }
  }, [variants, groupBy, setGroupBy, uniqueVariantNames]);

  const handleSelectAllToggle = () => {
    if (selectedVariants.size === variants.length) {
      handleUnSelectAll(true);
    } else {
      handleSelectAll(true);
    }
  };

  const handleFilterChange = (variantName, value) => {
    setFilters(prev => ({
      ...prev,
      [variantName]: value,
    }));
    setActiveDropdown(null);
  };

  const handleClearFilter = (variantName) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[variantName];
      return newFilters;
    });
    setActiveDropdown(null);
  };

  const handleClearAllFilters = () => {
    setFilters({});
    setSearchTerm('');
    setActiveDropdown(null);
  };

  const handleGroupByChange = (value) => {
    setGroupBy(value);
    setActiveDropdown(null);
  };

  const filteredGrouped = Object.fromEntries(
    Object.entries(grouped).map(([group, subs]) => {
      const matchesFilters = Object.entries(filters).every(([filterName, filterValue]) => {
        if (!filterValue) return true;
        const groupMatches = group.toLowerCase().includes(filterValue.toLowerCase());
        const subMatches = subs.some(sub => sub.name.toLowerCase().includes(filterValue.toLowerCase()));
        return groupMatches || subMatches;
      });
      return matchesFilters ? [group, subs] : null;
    }).filter(Boolean)
  );

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(prev => (prev === dropdownName ? null : dropdownName));
  };

  const isFlat = Object.keys(grouped).length === 1 && grouped['All'];

  return (
    <div className="space-y-3">
      {variants.map((variant) => {
        const isDragging = draggedItem?.type === 'variant' && draggedItem.id === variant.id;
        const isDropTarget = draggedOverItem?.type === 'variant' && draggedOverItem.id === variant.id;

        return (
          <div key={variant.id} className="relative">
            {isDropTarget && draggedItem?.id !== variant.id && (
              <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10"></div>
            )}
            <VariantOption
              variant={variant}
              onUpdateName={(value) => updateName(variant.id, value)}
              onAddValue={() => addValue(variant.id)}
              onUpdateValue={(valueId, value) => updateValue(variant.id, valueId, value)}
              onRemoveValue={(valueId) => removeValue(variant.id, valueId)}
              onRemove={() => removeVariant(variant.id)}
              onReorderValues={reorderValues}
              onDragStart={handleVariantDragStart}
              onDragOver={(e) => handleVariantDragOver(e, variant.id)}
              onDrop={(e) => handleVariantDrop(e, variant.id)}
              onDragEnd={handleDragEnd}
              isDragging={isDragging}
              isDropTarget={isDropTarget}
            />
          </div>
        );
      })}

      {variants.length > 0 && (
        <div className="flex items-center">
          <Button onClick={addVariant} className="mt-1 font-semibold" variant="default">
            <PlusCircle size={16} /> Add another option
          </Button>
        </div>
      )}

      {hasValidVariants && (
        <div className="space-y-4">
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

          {showSearch && (
            <div className="space-y-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

          <div className="flex justify-between items-center mb-4 border-y-1 border-gray-200 py-3 px-2 bg-gray-50">
            <div className="flex items-center gap-2">
              {selectedVariants.size > 0 ? (
                <>
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={true}
                    onChange={() => {
                      handleUnSelectAll();
                      // Revert to original headers
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

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={(e) => handleImageUpload(e, e.target.dataset.variantName)}
          />

          <div className="h-5 text-center">
            Total inventory at Shop location: {totalInventory} available
          </div>
        </div>
      )}
    </div>
  );
};

// CSS for custom checkboxes
const styles = `
  .custom-checkbox {
    appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid #d1d5db;
    border-radius: 3px;
    background-color: #fff;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }
  .custom-checkbox:hover {
    border-color: #9ca3af;
  }
  .custom-checkbox:checked {
    background-color: #000;
    border-color: #000;
  }
  .custom-checkbox:checked::after {
    content: '✓';
    color: #fff;
    font-size: 10px;
    font-weight: bold;
    line-height: 1;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  if (!document.head.querySelector('style[data-variant-styles]')) {
    styleSheet.setAttribute('data-variant-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default VariantList;