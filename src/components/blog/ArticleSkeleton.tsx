
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ArticleSkeleton = () => {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-3/4 mx-auto" />
      <Skeleton className="h-6 w-2/3 mx-auto" />
      <div className="flex justify-center gap-6 my-8">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="w-full h-96 rounded-xl" />
      <div className="space-y-4 mt-8">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    </div>
  );
};

export default ArticleSkeleton;
