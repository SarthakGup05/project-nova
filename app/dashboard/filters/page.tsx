'use client';

import { FiltersAndLabels } from '@/components/dashboard/FiltersAndLabels';

export default function FiltersPage() {
  return (
    <div className="w-full max-w-4xl px-4 py-8">
      <div className="mb-8 space-y-1">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Filters & Labels
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          Organize and find your tasks with precision.
        </p>
      </div>

      <FiltersAndLabels />
    </div>
  );
}
