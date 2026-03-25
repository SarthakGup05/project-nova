import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="w-full h-full p-4 sm:p-6 pb-24 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
          <div className="h-4 w-32 bg-neutral-100 dark:bg-neutral-900 rounded-md animate-pulse" />
        </div>
        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse" />
      </div>

      {/* Main Content Skeleton - Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div 
            key={i} 
            className="w-full h-32 md:h-40 bg-card border border-border/50 rounded-3xl p-5 relative overflow-hidden"
          >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent" />
            
            <div className="flex items-start gap-4 h-full">
              <div className="w-10 h-10 rounded-xl bg-muted animate-pulse shrink-0" />
              <div className="space-y-3 w-full flex-1">
                <div className="h-5 w-3/4 bg-muted animate-pulse rounded-md" />
                <div className="h-4 w-1/2 bg-muted/60 animate-pulse rounded-md" />
                <div className="pt-2 flex items-center gap-2">
                  <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
                  <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
