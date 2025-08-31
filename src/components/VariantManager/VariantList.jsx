import React, { useState } from 'react';
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

  const handleVariantDragStart = (e, index) => {
    setDraggedItem({ type: 'variant', index });
  };

  const handleVariantDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem && draggedItem.type === 'variant' && draggedItem.index !== index) {
      setDraggedOverItem({ type: 'variant', index });
    }
  };

  const handleVariantDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedItem && draggedItem.type === 'variant') {
      reorderVariants(draggedItem.index, targetIndex);
    }
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  const grouped = getGroupedVariants();
  const allExpanded = Object.keys(grouped).length > 0 && Object.keys(grouped).every(g => expandedGroups.has(g));
  const toggleAll = allExpanded ? collapseAll : expandAll;

  const hasValidVariants = variants.some(variant => variant.name.trim() !== '' || variant.values.some(val => val.value.trim() !== ''));

  return (
    <div className="space-y-3">
      {variants.map((variant, variantIndex) => (
        <div key={variant.id} onDragOver={(e) => handleVariantDragOver(e, variantIndex)} onDrop={(e) => handleVariantDrop(e, variantIndex)}>
          {draggedItem?.type === 'variant' && draggedOverItem?.type === 'variant' && draggedOverItem.index === variantIndex && draggedItem.index !== variantIndex && (
            <div className="h-0.5 bg-blue-500 rounded-full mb-2 transition-all duration-200"></div>
          )}
          <VariantOption
            variant={variant}
            onUpdateName={(value) => updateName(variant.id, value)}
            onAddValue={() => addValue(variant.id)}
            onUpdateValue={(valueId, value) => updateValue(variant.id, valueId, value)}
            onRemoveValue={(valueId) => removeValue(variant.id, valueId)}
            onRemove={() => removeVariant(variant.id)}
            onReorderValues={reorderValues}
            onDragEnd={handleDragEnd}
          />
        </div>
      ))}
      {variants.length > 0 && (
        <div className="flex items-center">
          <Button onClick={addVariant} className="mt-1 font-semibold" variant="default">
            <PlusCircle size={16} /> Add another option
          </Button>
        </div>
      )}
      {variants.length > 0 && hasValidVariants && (
        <div>
          <div className="flex justify-between items-center mb-2 border-t-[1px] border-slate-200 py-5">
            <div className="flex items-center">
              <label className="mr-2 text-sm font-medium text-gray-700">Group by</label>
              <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} className="border rounded-md px-2 py-1 text-sm">
                {variants.map(v => (
                  <option key={v.id} value={v.name}>{v.name || 'Variant ' + (variants.indexOf(v) + 1)}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <Search size={16} className="mr-2 text-gray-400" />
              <input type="text" placeholder="Search" className="border rounded-md px-2 py-1 text-sm w-32" />
            </div>
          </div>
          <div className="flex justify-between items-center mb-6 text-sm font-medium text-gray-700 ">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 custom-checkbox"
                checked={selectedVariants.size === (getGroupedVariants()['All'] || []).length}
                onChange={handleSelectAll}
              />
              Variant{selectedVariants.size > 0 ? ` (${selectedVariants.size})` : ''}
            </div>
            <button onClick={toggleAll} className="text-blue-500">
              {allExpanded ? 'Collapse all' : 'Expand all'}
            </button>
            <div>Price</div>
            <div>Available</div>
          </div>
          {Object.entries(grouped).map(([group, subs]) => (
            <div key={group}>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2 custom-checkbox"
                  checked={subs.every(sub => selectedVariants.has(sub.name))}
                  onChange={() => handleGroupSelect(group)}
                />
                <div className="w-8 h-8 hover:border-2 hover:border-dashed cursor-pointer rounded flex items-center justify-center mr-2">
                  <ImagePlus size={16} className="text-blue-500" />
                </div>
                <button onClick={() => toggleGroup(group)} className="flex items-center">
                  {expandedGroups.has(group) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span className="ml-1">{group}</span>
                  <span className="ml-1 text-gray-500">{subs.length} variant{subs.length > 1 ? 's' : ''}</span>
                </button>
              </div>
              {expandedGroups.has(group) && subs.map(sub => (
                <div key={sub.name} className="flex items-center ml-10 mb-2">
                  <input
                    type="checkbox"
                    className="mr-2 custom-checkbox"
                    checked={selectedVariants.has(sub.name)}
                    onChange={() => handleSubSelect(sub.name)}
                  />
                  <div className="w-8 h-8 hover:border-2 hover:border-dashed cursor-pointer rounded flex items-center justify-center mr-2">
                    <ImagePlus size={16} className="text-blue-500" />
                  </div>
                  <span className="flex-1">{sub.name}</span>
                  <input
                    type="text"
                    value={`₹ ${sub.price.toFixed(2)}`}
                    onChange={(e) => updatePrice(sub.name, e.target.value.replace('₹ ', ''))}
                    className="border rounded-md px-2 py-1 text-sm w-24 mr-4"
                    onFocus={(e) => e.target.select()}
                  />
                  <input
                    type="text"
                    value={sub.inventory}
                    onChange={(e) => updateInventory(sub.name, e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm w-20"
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              ))}
            </div>
          ))}
          <p className="text-sm text-center text-gray-500 mt-4">Total inventory at Shop location: {totalInventory} available</p>
        </div>
      )}
    </div>
  );
};

// CSS for black-and-white checkboxes
const styles = `
  .custom-checkbox {
    appearance: none;
    width: 16px;
    height: 16px;
    border: 1px solid #7D7D7D;
    border-radius: 2px;
    background-color: #fff;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .custom-checkbox:checked {
    background-color: #000;
    border-color: #fff;
  }
  .custom-checkbox:checked::after {
    content: '✓';
    color: #fff;
    font-size: 12px;
    font-weight: bold;
  }
`;

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(styles);
document.adoptedStyleSheets = [styleSheet];

export default VariantList;