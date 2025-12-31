import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useHolidayStyles } from '../../hooks/useHolidayStyles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const { primaryButton, isHoliday } = useHolidayStyles();
  const baseStyles = 'font-medium rounded-xl transition-all duration-300 focus-ring-glow relative overflow-hidden ripple group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';
  
  const variants = {
    primary: isHoliday 
      ? `${primaryButton} text-white hover:opacity-90 hover:shadow-glow-lg transform hover:scale-105 active:scale-95 transition-all duration-300`
      : 'bg-gradient-to-r from-red-600 via-red-500 to-red-700 dark:from-red-500 dark:via-red-400 dark:to-red-600 text-white hover:from-red-700 hover:via-red-600 hover:to-red-800 dark:hover:from-red-600 dark:hover:via-red-500 dark:hover:to-red-700 hover:shadow-glow-lg transform hover:scale-105 active:scale-95 transition-all duration-300',
    secondary: 'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-500 text-gray-900 dark:text-white hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-500 dark:hover:to-gray-400 hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300',
    outline: 'border-2 border-red-500 dark:border-red-400 bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gradient-to-r hover:from-red-50 hover:to-red-50 dark:hover:from-red-900/30 dark:hover:to-red-900/30 hover:shadow-glow transform hover:scale-105 active:scale-95 transition-all duration-300',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 text-white hover:from-red-700 hover:to-red-800 dark:hover:from-red-600 dark:hover:to-red-700 hover:shadow-glow-lg transform hover:scale-105 active:scale-95 transition-all duration-300',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </span>
      {/* Shimmer effect on hover */}
      {!disabled && !isLoading && (
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
      )}
    </button>
  );
}

