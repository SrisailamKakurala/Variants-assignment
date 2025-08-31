import React, { useState } from 'react';
import VariantValue from './VariantValue';
import Input from '../UI/Input';
import DragHandle from './DragHandle';

const VariantOption = ({ 
  variant, 
  onUpdateName, 
  onAddValue, 
  onUpdateValue, 
  onRemoveValue, 
  onRemove, 
  onReorderValues, 
  onDragEnd,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);
  const [isEditing, setIsEditing] = useState(true);

  const handleValueDragStart = (e, valueIndex) => {
    setDraggedItem({ type: 'value', index: valueIndex });
  };

  const handleValueDragOver = (e, valueIndex) => {
    e.preventDefault();
    if (draggedItem && draggedItem.type === 'value' && draggedItem.index !== valueIndex) {
      setDraggedOverItem({ type: 'value', index: valueIndex });
    }
  };

  const handleValueDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedItem && draggedItem.type === 'value') {
      onReorderValues(variant.id, draggedItem.index, targetIndex);
    }
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  const handleDragEndLocal = () => {
    setDraggedItem(null);
    setDraggedOverItem(null);
    onDragEnd();
  };

  const handleNameChange = (e) => {
    const value = e?.target?.value || '';
    onUpdateName(value);
  };

  const handleDone = () => {
    setIsEditing(false);
  };

  // Compact display view when not editing
  if (!isEditing) {
    return (
      <div 
        className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors duration-200"
        draggable
        onDragStart={(e) => onDragStart(e, variant.id)}
        onDragEnd={handleDragEndLocal}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DragHandle onDragStart={(e) => onDragStart(e, variant.id)} onDragEnd={handleDragEndLocal} />
            <div>
              <div className="text-sm font-medium text-gray-800 mb-1">
                {variant.name || 'Unnamed'}
              </div>
              <div className="flex flex-wrap gap-1">
                {variant.values
                  .filter(valueObj => valueObj.value.trim())
                  .map((valueObj, index) => (
                    <span
                      key={valueObj.id}
                      className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded border-gray-300"
                    >
                      {valueObj.value}
                    </span>
                  ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
            title="Edit option"
          >
            <svg className='cursor-pointer' width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Full editing view when editing
  return (
    <div 
      className="border border-gray-300 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors duration-200"
      draggable
      onDragStart={(e) => onDragStart(e, variant.id)}
      onDragEnd={handleDragEndLocal}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Option name</label>
        <div className="flex items-center gap-2">
          <DragHandle onDragStart={(e) => onDragStart(e, variant.id)} onDragEnd={handleDragEndLocal} />
          <Input
            value={variant.name}
            onChange={handleNameChange}
            placeholder="Option name"
            className="focus:border-blue-500 border-2 border-gray-300 w-full"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 my-2">Option values</label>
        <div className="ml-6 space-y-2">
          {variant.values.map((valueObj, valueIndex) => {
            const isEmpty = !valueObj.value.trim();
            const isLastEmpty = valueIndex === variant.values.length - 1 && isEmpty && variant.values.length > 1;
            const isDragging = draggedItem?.type === 'value' && draggedItem.index === valueIndex;
            const isDropTarget = draggedOverItem?.type === 'value' && draggedOverItem.index === valueIndex;

            return (
              <VariantValue
                key={valueObj.id}
                valueObj={valueObj}
                isEmpty={isEmpty}
                isLastEmpty={isLastEmpty}
                isDragging={isDragging}
                isDropTarget={isDropTarget}
                onChange={(e) => onUpdateValue(valueObj.id, e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && valueObj.value.trim()) {
                    onAddValue();
                  }
                }}
                onRemove={() => onRemoveValue(valueObj.id)}
                onDragStart={(e) => handleValueDragStart(e, valueIndex)}
                onDragEnd={handleDragEndLocal}
                onDragOver={(e) => handleValueDragOver(e, valueIndex)}
                onDrop={(e) => handleValueDrop(e, valueIndex)}
              />
            );
          })}
        </div>
      </div>
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={onRemove}
          className="bg-white hover:bg-gray-50 text-red-500 text-sm font-medium border border-slate-200 shadow-sm px-4 py-2 rounded-md cursor-pointer hover:text-red-600"
        >
          Delete
        </button>
        <button
          onClick={handleDone}
          className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm cursor-pointer hover:bg-gray-700"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default VariantOption;