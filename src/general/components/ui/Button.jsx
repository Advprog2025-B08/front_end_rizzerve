import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false, 
  fullWidth = false,
  ...props 
}) => {
  const variants = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 
      hover:from-blue-700 hover:to-blue-800 
      active:from-blue-800 active:to-blue-900
      text-white shadow-lg shadow-blue-500/25
      hover:shadow-xl hover:shadow-blue-500/30
      border border-blue-500/20
    `,
    secondary: `
      bg-gradient-to-r from-slate-600 to-slate-700 
      hover:from-slate-700 hover:to-slate-800 
      active:from-slate-800 active:to-slate-900
      text-white shadow-lg shadow-slate-500/25
      hover:shadow-xl hover:shadow-slate-500/30
      border border-slate-500/20
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700 
      hover:from-red-700 hover:to-red-800 
      active:from-red-800 active:to-red-900
      text-white shadow-lg shadow-red-500/25
      hover:shadow-xl hover:shadow-red-500/30
      border border-red-500/20
    `,
    success: `
      bg-gradient-to-r from-emerald-600 to-emerald-700 
      hover:from-emerald-700 hover:to-emerald-800 
      active:from-emerald-800 active:to-emerald-900
      text-white shadow-lg shadow-emerald-500/25
      hover:shadow-xl hover:shadow-emerald-500/30
      border border-emerald-500/20
    `,
    outline: `
      bg-transparent hover:bg-blue-50 active:bg-blue-100
      text-blue-600 hover:text-blue-700
      border-2 border-blue-600 hover:border-blue-700
      shadow-sm hover:shadow-md
    `,
    ghost: `
      bg-transparent hover:bg-gray-100 active:bg-gray-200
      text-gray-700 hover:text-gray-900
      border border-transparent
      shadow-none hover:shadow-sm
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-10 py-4 text-xl'
  };

  const LoadingSpinner = () => (
    <div className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  );

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-xl font-semibold
        transition-all duration-200 ease-in-out
        transform hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed 
        disabled:hover:scale-100 disabled:shadow-none
        focus:outline-none focus:ring-4 focus:ring-blue-500/20
        relative overflow-hidden
        group
        inline-flex items-center justify-center
        text-center
      `}
      disabled={loading || props.disabled}
      {...props}
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      {/* Button content */}
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <LoadingSpinner />
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {children}
        </div>
      )}
    </button>
  );
};

export default Button;