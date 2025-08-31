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
  return (
    <div>
      {isDropTarget && !isDragging && (
        <div className="h-0.5 bg-blue-500 rounded-full mb-2 ml-6 transition-all duration-200"></div>
      )}
      <div
        className={`flex items-center transition-all duration-200 ${
          isDragging ? 'opacity-50 scale-95 rotate-1' : ''
        } ${isDropTarget && !isDragging ? 'transform translate-y-1' : ''}`}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <DragHandle 
          onDragStart={onDragStart} 
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