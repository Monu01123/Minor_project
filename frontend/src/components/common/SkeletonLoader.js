import React from 'react';

const SkeletonLoader = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );
};

export const PageSkeleton = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header Skeleton */}
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-8 animate-pulse"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card Skeletons */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="border rounded-lg p-4 shadow-sm">
                        <div className="h-48 bg-gray-200 rounded mb-4 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkeletonLoader;
