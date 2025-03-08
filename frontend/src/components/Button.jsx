import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ onClick, label, color }) => {
  const baseStyles = 'px-4 py-2 rounded-lg border-2 text-white transition-all font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]';
  const colorStyles = {
    gray: 'bg-gray-500 border-black hover:bg-gray-600',
    blue: 'bg-blue-500 border-black hover:bg-blue-600',
    red: 'bg-red-500 border-black hover:bg-red-600',
    green: 'bg-green-500 border-black hover:bg-green-600',
    yellow: 'bg-yellow-500 border-black hover:bg-yellow-600',
    pink: 'bg-pink-500 border-black hover:bg-pink-600',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${colorStyles[color]}`}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['gray', 'blue', 'red', 'green', 'yellow', 'pink']),
};

export default Button;