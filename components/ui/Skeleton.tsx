
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rectangular', 
  width, 
  height 
}) => {
  const baseClasses = `skeleton-box animate-pulse ${className}`;
  const variantClasses = {
    text: 'rounded-md h-4 my-1',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]}`}
      style={{ width, height }}
    ></div>
  );
};

export default Skeleton;
