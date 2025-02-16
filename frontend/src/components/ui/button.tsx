import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-6 py-3 text-lg font-semibold rounded-lg transition-all';
  const variantStyles =
    variant === 'primary'
      ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
      : 'border border-gray-300 text-gray-800 hover:bg-gray-200 shadow-md';

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {props.children}
    </button>
  );
};

export default Button;


