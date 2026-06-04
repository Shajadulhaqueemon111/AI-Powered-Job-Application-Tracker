import { Skeleton } from "@/components/ui/skeleton";

export function AuditLogTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* header skeleton */}
      <div className="flex justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-[300px]" />
      </div>

      {/* table skeleton */}
      <div className="border rounded-md p-2 space-y-2">
        {/* header row */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>

        {/* rows */}
        {Array.from({ length: 8 }).map((_, row) => (
          <div key={row} className="grid grid-cols-7 gap-2 py-2">
            {Array.from({ length: 7 }).map((_, col) => (
              <Skeleton key={col} className="h-5 w-full" />
            ))}
          </div>
        ))}
      </div>

      {/* pagination skeleton */}
      <div className="flex justify-end gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
}
