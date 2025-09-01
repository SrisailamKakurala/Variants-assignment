import React from 'react';
import VariantOption from '../VariantOption';
import { PlusCircle } from 'lucide-react';

const VariantOptions = ({ 
  variants, 
  addVariant, 
  updateName, 
  addValue, 
  updateValue, 
  removeValue, 
  removeVariant, 
  reorderVariants, 
  reorderValues, 
  draggedItem, 
  setDraggedItem, 
  draggedOverItem, 
  setDraggedOverItem, 
  handleDragEnd 
}) => {
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

  return (
    <>
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
              onDragStart={(e) => handleVariantDragStart(e, variant.id)}
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
          <button onClick={addVariant} className="add-option-btn">
            <PlusCircle size={16} /> Add another option
          </button>
        </div>
      )}
    </>
  );
};

export default VariantOptions;