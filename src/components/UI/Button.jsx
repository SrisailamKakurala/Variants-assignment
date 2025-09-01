// Button.jsx

import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = "default", 
  disabled = false 
}) => {
  const base =
    "flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-sm transition ease-in-out duration-300 text-gray-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default: "bg-gray-100 hover:bg-gray-200",
    primary: "bg-black text-white hover:bg-gray-800",
    danger: "bg-red-100 text-red-600 hover:bg-red-200",
    ghost: "bg-transparent hover:bg-gray-100",
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;