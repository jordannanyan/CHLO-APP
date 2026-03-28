import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const PackageCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
    <div className="flex justify-between items-start">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-8 w-1/2" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);
