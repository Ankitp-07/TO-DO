/**
 * TodoSkeleton — animated placeholder while loading
 */
function TodoSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-slate-800 rounded-2xl p-4 flex items-start gap-4 border border-slate-100 dark:border-slate-700">
      <div className="mt-1 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4" />
        <div className="h-3 bg-slate-100 dark:bg-slate-600 rounded-full w-1/2" />
        <div className="flex gap-2 mt-2">
          <div className="h-5 w-16 bg-slate-100 dark:bg-slate-600 rounded-full" />
          <div className="h-5 w-20 bg-slate-100 dark:bg-slate-600 rounded-full" />
        </div>
      </div>
      <div className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700" />
    </div>
  );
}

/**
 * SkeletonList — renders N skeleton cards
 */
export default function SkeletonList({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <TodoSkeleton key={i} />
      ))}
    </div>
  );
}
