import React from 'react';

const Input = ({ 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  onKeyPress, 
  icon, 
  onFocus,
  type = 'text' 
}) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className={`border rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-0 w-full ${className}`}
        onKeyPress={onKeyPress}
        onFocus={onFocus}
      />
      {icon && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {icon}
        </div>
      )}
    </div>
  );
};

export default Input;