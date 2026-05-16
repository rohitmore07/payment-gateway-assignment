export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 ${className}`}
      style={{ animation: 'shimmer 1.5s ease-in-out infinite' }}
      aria-hidden
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <Skeleton className="h-3 w-1/4" />
      <Skeleton className="h-10 w-1/2" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="panel-glow space-y-3 !p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl" />
      ))}
    </div>
  );
}
