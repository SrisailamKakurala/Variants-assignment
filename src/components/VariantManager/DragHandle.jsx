// DragHandle.jsx

import React from 'react';

const DragHandle = ({ onDragStart, onDragEnd, draggable = true }) => (
  <div
    className={`flex flex-col gap-0.5 mr-3 text-gray-400 hover:text-gray-600 ${
      draggable ? 'cursor-move' : 'cursor-default'
    }`}
    draggable={draggable}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
  >
    <div className="flex gap-0.5">
      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
    </div>
    <div className="flex gap-0.5">
      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
    </div>
    <div className="flex gap-0.5">
      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
    </div>
  </div>
);

export default DragHandle;