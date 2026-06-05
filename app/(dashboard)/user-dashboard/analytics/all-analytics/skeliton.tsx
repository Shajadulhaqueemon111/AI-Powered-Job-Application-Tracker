"use client";

/* ─────────────────────────────────────────────
   MyCareerAnalyticsSkeleton
   Drop-in loading state for MyCareerAnalyticsPage.
   Usage:
     if (isLoading) return <MyCareerAnalyticsSkeleton />;
───────────────────────────────────────────── */

export default function MyCareerAnalyticsSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* ── HEADER ── */}
        <div className="space-y-2">
          <Bone className="h-3 w-28 rounded-full" />
          <Bone className="h-8 w-64 rounded-xl" />
          <Bone className="h-3.5 w-48 rounded-full" />
        </div>

        {/* ── KPI CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 relative overflow-hidden"
            >
              {/* accent strip */}
              <Bone className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" />
              <Bone className="h-5 w-5 rounded-md mb-3" />
              <Bone className="h-2.5 w-20 rounded-full mb-2" />
              <Bone className="h-8 w-14 rounded-lg mb-1.5" />
              <Bone className="h-2.5 w-28 rounded-full" />
            </div>
          ))}
        </div>

        {/* ── CHARTS ROW ── */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Pie card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <SkeletonCardHeader />
            <div className="p-5">
              {/* legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <Bone className="w-2 h-2 rounded-[2px]" />
                    <Bone
                      className="h-2.5 rounded-full"
                      style={{ width: 40 + (i % 3) * 12 }}
                    />
                  </span>
                ))}
              </div>
              {/* donut placeholder */}
              <div className="h-56 flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <Bone className="w-full h-full rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-zinc-50 dark:bg-zinc-950" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bar card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <SkeletonCardHeader />
            <div className="p-5">
              {/* bar chart placeholder */}
              <div className="h-48 flex items-end gap-2 px-2 pb-1">
                {[60, 80, 50, 100, 75, 65].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col justify-end gap-1"
                  >
                    <Bone
                      className="w-full rounded-t-[4px]"
                      style={{ height: `${h}%` }}
                    />
                    <Bone className="h-2 w-4/5 mx-auto rounded-full" />
                  </div>
                ))}
              </div>
              {/* status mini-bars */}
              <div className="mt-4 space-y-2.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Bone
                      className="h-2.5 rounded-full flex-shrink-0"
                      style={{ width: 56 }}
                    />
                    <Bone className="flex-1 h-1.5 rounded-full" />
                    <Bone className="h-2.5 w-4 rounded-full flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FUNNEL ── */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
          <SkeletonCardHeader />
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-100 dark:divide-zinc-800">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-5 space-y-3">
                <Bone className="h-2.5 w-20 rounded-full" />
                <Bone className="h-9 w-12 rounded-lg" />
                <Bone className="h-1 w-full rounded-full" />
                <Bone className="h-2.5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Shimmer bone ─── */
function Bone({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`skeleton-bone ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

/* ─── Card header skeleton ─── */
function SkeletonCardHeader() {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800">
      <Bone className="h-3.5 w-36 rounded-full" />
      <Bone className="h-5 w-14 rounded-full" />
    </div>
  );
}
