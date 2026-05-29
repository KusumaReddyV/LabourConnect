export function PageLoader({ label = 'Loading' }) {
  return (
    <div className="page-loading" role="status">
      {label}
    </div>
  );
}

export function Skeleton({ height = 20, width = '100%', className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ height, width, borderRadius: 6 }}
    />
  );
}

export function CardSkeleton({ lines = 3 }) {
  return (
    <div className="card skeleton-card">
      <Skeleton height={24} width="60%" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={14} width={i === lines - 1 ? '40%' : '90%'} />
      ))}
    </div>
  );
}
