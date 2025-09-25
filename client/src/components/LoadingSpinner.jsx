import React from 'react';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full ${sizes[size]} border-t-2 border-b-2 border-blue-500`}></div>
    </div>
  );
};

export const SkeletonLoader = ({ className = '', lines = 3 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 last:mb-0"
          style={{ width: i === lines - 1 ? '80%' : '100%' }}
        ></div>
      ))}
    </div>
  );
};

export const PageLoader = () => (
  <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
    <LoadingSpinner size="xl" />
  </div>
);
