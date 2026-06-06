export function HrApplicantsSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 space-y-2"
          >
            <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-5 w-10 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
        <div className="flex gap-3">
          <div className="h-10 flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-10 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        </div>

        <div className="h-3 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-3 border-b border-zinc-100 dark:border-zinc-800"
            >
              {/* avatar */}
              <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />

              {/* name */}
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-2 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>

              {/* contact */}
              <div className="hidden md:block space-y-2">
                <div className="h-3 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-2 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>

              {/* status */}
              <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />

              {/* action */}
              <div className="flex gap-2">
                <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-8 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-8 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  );
}
