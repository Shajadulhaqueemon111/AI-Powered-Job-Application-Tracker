export function JobCardSkeleton() {
  return (
    <div className="rounded-3xl border bg-white dark:bg-gray-900 p-6 space-y-4 animate-pulse">
      {/* header */}
      <div className="flex justify-between">
        <div className="space-y-2 w-full">
          <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full" />
      </div>

      {/* skills */}
      <div className="flex gap-2 flex-wrap">
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full" />
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full" />
        <div className="h-6 w-14 bg-gray-200 dark:bg-gray-800 rounded-full" />
      </div>

      {/* info */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>

      {/* buttons */}
      <div className="flex gap-3 pt-2">
        <div className="h-10 flex-1 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="h-10 flex-1 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      </div>
    </div>
  );
}
