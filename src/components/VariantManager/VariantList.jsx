import React, { useState, useRef } from 'react';
import VariantOption from './VariantOption';
import { ChevronDown, ChevronRight, PlusCircle, Search, ImagePlus } from 'lucide-react';
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
  totalInventory,
  selectedVariants,
  handleSelectAll,
  handleGroupSelect,
  handleSubSelect,
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  const fileInputRef = useRef(null);

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

  return (
    <div className="space-y-3">
      {variants.map((variant, variantIndex) => {
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
        <div>
          <div className="flex justify-between items-center mb-4 border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Group by</label>
              <select 
                value={groupBy} 
                onChange={(e) => setGroupBy(e.target.value)} 
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {variants.filter(v => v.name.trim()).map(v => (
                  <option key={v.id} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="border border-gray-300 rounded-lg pl-9 pr-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48" 
                />
              </div>
              <button 
                onClick={toggleAll}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title={allExpanded ? "Collapse all" : "Expand all"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-black text-white px-2 py-1 rounded text-xs font-medium">
                  {selectedVariants.size} selected
                </div>
                <button 
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {selectedVariants.size > 0 ? 'Deselect all' : 'Select all'}
                </button>
              </div>
              <button className="p-1 hover:bg-gray-200 rounded">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1"/>
                  <circle cx="19" cy="12" r="1"/>
                  <circle cx="5" cy="12" r="1"/>
                </svg>
              </button>
            </div>
            
            {Object.entries(grouped).map(([group, subs]) => (
              <div key={group} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between bg-white rounded-lg p-3 mb-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={subs.length > 0 && subs.every(sub => selectedVariants.has(sub.name))}
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
                  <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
                    <div className="w-24 text-center">Price</div>
                    <div className="w-20 text-center">Available</div>
                  </div>
                </div>
                
                {expandedGroups.has(group) && (
                  <div className="ml-6 space-y-2">
                    {subs.map(sub => (
                      <div key={sub.name} className="flex items-center justify-between bg-white rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="custom-checkbox"
                            checked={selectedVariants.has(sub.name)}
                            onChange={() => handleSubSelect(sub.name)}
                          />
                          <div 
                            className="w-8 h-8 border border-dashed border-gray-300 hover:border-blue-500 cursor-pointer rounded flex items-center justify-center"
                            onClick={() => triggerFileInput(`${group}-${sub.name}`)}
                          >
                            {imageUrls[`${group}-${sub.name}`] ? (
                              <img src={imageUrls[`${group}-${sub.name}`]} alt="Sub-Variant" className="w-full h-full object-cover rounded" />
                            ) : (
                              <ImagePlus size={16} className="text-blue-500" />
                            )}
                          </div>
                          <span className="font-medium">{sub.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={`₹ ${sub.price.toFixed(2)}`}
                            onChange={(e) => updatePrice(sub.name, e.target.value.replace('₹ ', ''))}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-24 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onFocus={(e) => e.target.select()}
                          />
                          <input
                            type="text"
                            value={sub.inventory}
                            onChange={(e) => updateInventory(sub.name, e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onFocus={(e) => e.target.select()}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <p className="text-sm text-center text-gray-500">Total inventory at Shop location: {totalInventory} available</p>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={(e) => handleImageUpload(e, e.target.dataset.variantName)}
          />
        </div>
      )}
    </div>
  );
};

// CSS for black-and-white checkboxes and other styles
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
  .drag-preview {
    transform: rotate(2deg) scale(1.02);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    z-index: 1000;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  if (!document.head.querySelector('style[data-variant-styles]')) {
    styleSheet.setAttribute('data-variant-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default VariantList;