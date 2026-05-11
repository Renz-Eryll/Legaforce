import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ─── Reusable skeleton building blocks ──────────────────────────────

/** A single KPI stat card skeleton */
export function SkeletonStatCard({ className }: { className?: string }) {
  return (
    <div className={cn("card-premium p-5 space-y-3", className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-3 w-24 rounded" />
      </div>
      <Skeleton className="h-8 w-20 rounded" />
    </div>
  );
}

/** A row of KPI stat cards */
export function SkeletonStatsRow({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>
  );
}

/** A chart placeholder skeleton */
export function SkeletonChart({ height = "h-[300px]", className }: { height?: string; className?: string }) {
  return (
    <div className={cn("card-premium p-6 space-y-4", className)}>
      <div className="space-y-2">
        <Skeleton className="h-5 w-48 rounded" />
        <Skeleton className="h-3 w-64 rounded" />
      </div>
      <Skeleton className={cn("w-full rounded-xl", height)} />
    </div>
  );
}

/** A single table row skeleton */
function SkeletonTableRow({ cols = 5 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 border-b border-border/40">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4 rounded",
            i === 0 ? "w-32" : i === cols - 1 ? "w-8" : "w-24",
          )}
        />
      ))}
    </div>
  );
}

/** A table skeleton with header + rows */
export function SkeletonTable({ rows = 6, cols = 5, className }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={cn("card-premium overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-border bg-muted/30">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className={cn("h-3.5 rounded", i === 0 ? "w-28" : "w-20")} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} cols={cols} />
      ))}
    </div>
  );
}

/** A search/filter bar skeleton */
export function SkeletonFilterBar({ className }: { className?: string }) {
  return (
    <div className={cn("card-premium p-5", className)}>
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-full sm:w-48 rounded-lg" />
      </div>
    </div>
  );
}

/** A single list item / card skeleton */
export function SkeletonListCard({ className }: { className?: string }) {
  return (
    <div className={cn("card-premium p-4 space-y-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/5 rounded" />
            <div className="flex gap-3">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
        </div>
        <Skeleton className="h-8 w-20 rounded-lg shrink-0" />
      </div>
    </div>
  );
}

/** A detail page skeleton (for entity detail views) */
export function SkeletonDetailSection({ className }: { className?: string }) {
  return (
    <div className={cn("card-premium p-6 space-y-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-2/5 rounded" />
          <Skeleton className="h-3 w-3/5 rounded" />
        </div>
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-5 w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** A form section skeleton */
export function SkeletonFormSection({ fields = 4, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn("card-premium p-6 space-y-6", className)}>
      <div className="space-y-2">
        <Skeleton className="h-5 w-40 rounded" />
        <Skeleton className="h-3 w-64 rounded" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}

/** A sidebar widget skeleton */
export function SkeletonSidebarWidget({ items = 3, className }: { items?: number; className?: string }) {
  return (
    <div className={cn("card-premium p-5 space-y-3", className)}>
      <Skeleton className="h-4 w-32 rounded" />
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/30">
          <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-3 w-3/4 rounded" />
            <Skeleton className="h-2.5 w-1/2 rounded" />
          </div>
        </div>
      ))}
      <Skeleton className="h-8 w-full rounded-lg" />
    </div>
  );
}

// ─── Composed page-level skeletons ──────────────────────────────────

/** Dashboard skeleton (dashboards with KPI cards, charts, lists) */
export function DashboardPageSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72 rounded" />
          <Skeleton className="h-4 w-48 rounded" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
      </div>

      {/* KPI Row */}
      <SkeletonStatsRow />

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <SkeletonChart className="lg:col-span-2" />
        <SkeletonChart height="h-[250px]" />
      </div>

      {/* Secondary Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonListCard key={i} />
          ))}
        </div>
        <div className="space-y-4">
          <SkeletonSidebarWidget />
          <SkeletonSidebarWidget items={4} />
        </div>
      </div>
    </div>
  );
}

/** List/Table page skeleton (pages with search, filters, and a data table) */
export function ListPageSkeleton({ statCount = 3, tableCols = 5 }: { statCount?: number; tableCols?: number }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded" />
          <Skeleton className="h-4 w-48 rounded" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      {/* Stats */}
      <div className={cn("grid gap-4", `grid-cols-${Math.min(statCount, 4)}`)}>
        {Array.from({ length: statCount }).map((_, i) => (
          <div key={i} className="card-premium p-4 space-y-2">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-7 w-16 rounded" />
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <SkeletonFilterBar />

      {/* Table */}
      <SkeletonTable cols={tableCols} />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48 rounded" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/** Detail page skeleton (entity detail views with info sections) */
export function DetailPageSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back button + Title */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-7 w-72 rounded" />
          <Skeleton className="h-4 w-48 rounded" />
        </div>
      </div>

      {/* Main info section */}
      <SkeletonDetailSection />

      {/* Secondary sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        <SkeletonDetailSection />
        <SkeletonDetailSection />
      </div>

      {/* Activity / Timeline */}
      <div className="card-premium p-6 space-y-4">
        <Skeleton className="h-5 w-32 rounded" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 py-3 border-b border-border/30 last:border-0">
            <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-3/5 rounded" />
              <Skeleton className="h-3 w-1/3 rounded" />
            </div>
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Settings page skeleton */
export function SettingsPageSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="h-4 w-72 rounded" />
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 border-b border-border pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-lg" />
        ))}
      </div>

      {/* Form sections */}
      <SkeletonFormSection fields={4} />
      <SkeletonFormSection fields={2} />
    </div>
  );
}

/** Card grid skeleton (for job cards, candidate cards, etc.) */
export function CardGridSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-premium p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/5 rounded" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-40 rounded" />
                <Skeleton className="h-3 w-32 rounded" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          </div>
          <div className="grid sm:grid-cols-4 gap-4 pt-4 border-t border-border/40">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="space-y-1">
                <Skeleton className="h-2.5 w-16 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-6 w-16 rounded-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Profile page skeleton */
export function ProfilePageSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Profile header */}
      <div className="card-premium p-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <Skeleton className="h-24 w-24 rounded-2xl shrink-0" />
          <div className="space-y-3 flex-1">
            <Skeleton className="h-7 w-56 rounded" />
            <Skeleton className="h-4 w-40 rounded" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      {/* Info sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        <SkeletonFormSection fields={4} />
        <SkeletonFormSection fields={4} />
      </div>
    </div>
  );
}

/** Lazy-load Suspense fallback — skeleton-based (replaces the old spinner) */
export function PageContentSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header shimmer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded" />
          <Skeleton className="h-4 w-48 rounded" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Content shimmer */}
      <SkeletonStatsRow />
      <SkeletonFilterBar />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonListCard key={i} />
        ))}
      </div>
    </div>
  );
}
