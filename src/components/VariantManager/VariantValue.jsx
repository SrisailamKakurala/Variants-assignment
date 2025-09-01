// VariantValue.jsx

import React from 'react';
import { Trash2 } from 'lucide-react';
import DragHandle from './DragHandle';
import Input from '../UI/Input';

const VariantValue = ({
  valueObj,
  isEmpty,
  isLastEmpty,
  isDragging,
  isDropTarget,
  onChange,
  onKeyPress,
  onRemove,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  const handleDragStart = (e) => {
    e.stopPropagation();
    if (onDragStart) onDragStart(e);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDragOver) onDragOver(e);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDrop) onDrop(e);
  };

  return (
    <div className="relative">
      {isDropTarget && !isDragging && (
        <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10"></div>
      )}
      <div
        className={`flex items-center transition-all duration-200 ${
          isDragging ? 'opacity-50 scale-95' : ''
        } ${isDropTarget && !isDragging ? 'transform translate-y-1' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <DragHandle 
          onDragStart={handleDragStart} 
          onDragEnd={onDragEnd} 
          draggable={!isEmpty} 
        />
        <div className="flex-1 flex items-center">
          <Input
            value={valueObj.value}
            onChange={onChange}
            placeholder={isLastEmpty ? "Add another value" : "Value"}
            className={`border-gray-300 ${isLastEmpty ? 'bg-gray-50' : 'bg-white'}`}
            onKeyPress={onKeyPress}
            icon={
              !isEmpty && (
                <Trash2
                  size={16}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={onRemove}
                />
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default VariantValue;