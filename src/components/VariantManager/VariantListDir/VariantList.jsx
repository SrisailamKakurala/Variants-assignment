import React, { useState, useRef, useEffect } from 'react';
import './VariantList.css';
import VariantOptions from './VariantOptions';
import GroupBySection from './GroupBySection';
import SearchFiltersSection from './SearchFiltersSection';
import HeaderSection from './HeaderSection';
import GroupedVariantsSection from './GroupedVariantsSection';

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
  getGroupedVariants, // Keep this as a prop if provided by parent
  groupBy, 
  setGroupBy, 
  toggleGroup,
  updatePrice, 
  updateInventory, 
  selectedVariants, 
  handleSelectAll, 
  handleUnSelectAll, 
  handleGroupSelect, 
  handleSubSelect, 
  getGroupPriceDisplay, 
  getGroupInventory, 
  totalInventory,
  draggedItem,
  setDraggedItem, 
  draggedOverItem,
  setDraggedOverItem,
  handleDragEnd,
}) => {
  const [imageUrls, setImageUrls] = useState({});
  const fileInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filters, setFilters] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(new Set()); // Local state for expanded groups

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

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(prev => (prev === dropdownName ? null : dropdownName));
  };

  // Local implementations of expandAll and collapseAll
  const expandAll = () => {
    const grouped = getGroupedVariants();
    const allGroups = Object.keys(grouped);
    setExpandedGroups(new Set(allGroups)); // Expand all groups
  };

  const collapseAll = () => {
    setExpandedGroups(new Set()); // Collapse all groups
  };

  const handleToggleAll = () => {
    if (allExpanded) {
      collapseAll(); // Collapse all groups
    } else {
      expandAll(); // Expand all groups
    }
  };

  const grouped = getGroupedVariants();
  const allExpanded = Object.keys(grouped).length > 0 && Object.keys(grouped).every(g => expandedGroups.has(g));

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

  const isFlat = Object.keys(grouped).length === 1 && grouped['All'];

  const hasValidVariants = variants.some(variant =>
    variant.name.trim() !== '' && variant.values.some(val => val.value.trim() !== '')
  );

  return (
    <div className="variant-list space-y-3">
      <VariantOptions
        variants={variants}
        addVariant={addVariant}
        updateName={updateName}
        addValue={addValue}
        updateValue={updateValue}
        removeValue={removeValue}
        removeVariant={removeVariant}
        reorderVariants={reorderVariants}
        reorderValues={reorderValues}
        draggedItem={draggedItem}
        setDraggedItem={setDraggedItem}
        draggedOverItem={draggedOverItem}
        setDraggedOverItem={setDraggedOverItem}
        handleDragEnd={handleDragEnd}
      />
      {hasValidVariants && (
        <>
          <GroupBySection
            groupBy={groupBy}
            uniqueVariantNames={uniqueVariantNames}
            toggleDropdown={toggleDropdown}
            activeDropdown={activeDropdown}
            handleGroupByChange={handleGroupByChange}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <SearchFiltersSection
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
            uniqueVariantNames={uniqueVariantNames}
            toggleDropdown={toggleDropdown}
            activeDropdown={activeDropdown}
            handleFilterChange={handleFilterChange}
            handleClearFilter={handleClearFilter}
            handleClearAllFilters={handleClearAllFilters}
            variants={variants}
          />
          <HeaderSection
            selectedVariants={selectedVariants}
            variants={variants}
            handleSelectAllToggle={handleSelectAllToggle}
            toggleAll={handleToggleAll}
            allExpanded={allExpanded}
            handleUnSelectAll={handleUnSelectAll}
            expandAll={expandAll} // Pass for completeness
            collapseAll={collapseAll} // Pass for completeness
          />
          <GroupedVariantsSection
            filteredGrouped={filteredGrouped}
            expandedGroups={expandedGroups}
            toggleGroup={toggleGroup}
            updatePrice={updatePrice}
            updateInventory={updateInventory}
            selectedVariants={selectedVariants}
            handleGroupSelect={handleGroupSelect}
            handleSubSelect={handleSubSelect}
            getGroupPriceDisplay={getGroupPriceDisplay}
            getGroupInventory={getGroupInventory}
            isFlat={isFlat}
            imageUrls={imageUrls}
            triggerFileInput={triggerFileInput}
            fileInputRef={fileInputRef}
            handleImageUpload={handleImageUpload}
            searchTerm={searchTerm}
          />
          <div className="h-5 text-center border-t-1 border-gray-200 py-3">
            Total inventory at Shop location: {totalInventory} available
          </div>
        </>
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={(e) => handleImageUpload(e, e.target.dataset.variantName)}
      />
    </div>
  );
};

export default VariantList;