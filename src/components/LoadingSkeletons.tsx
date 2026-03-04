// Loading skeleton components for better UX

export function ProductCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-surface-hover" />
      <div className="p-4">
        <div className="h-4 bg-surface-hover rounded mb-2" />
        <div className="h-4 bg-surface-hover rounded w-2/3 mb-4" />
        <div className="h-6 bg-surface-hover rounded w-1/3" />
      </div>
    </div>
  );
}

export function BreakCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-video bg-surface-hover" />
      <div className="p-4">
        <div className="h-5 bg-surface-hover rounded mb-2" />
        <div className="h-4 bg-surface-hover rounded w-3/4 mb-4" />
        <div className="flex items-center justify-between">
          <div className="h-4 bg-surface-hover rounded w-1/3" />
          <div className="h-8 bg-surface-hover rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-surface-hover rounded w-1/3" />
        <div className="h-8 w-8 bg-surface-hover rounded-full" />
      </div>
      <div className="h-10 bg-surface-hover rounded w-1/2 mb-2" />
      <div className="h-3 bg-surface-hover rounded w-1/4" />
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
        <p className="text-text-secondary">Loading...</p>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-surface-hover rounded" />
        </td>
      ))}
    </tr>
  );
}
