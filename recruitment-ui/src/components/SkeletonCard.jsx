export function SkeletonCard() {
  return (
    <div className="skeleton-card p-8">
      <div className="shimmer-block w-12 h-12 mb-6" />
      <div className="shimmer-block w-3/4 h-5 mb-3" />
      <div className="shimmer-block w-full h-4 mb-2" />
      <div className="shimmer-block w-2/3 h-4" />
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <div className="flex items-center gap-4 p-5 border-b border-gray-50">
      <div className="shimmer-block w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="shimmer-block w-1/3 h-4" />
        <div className="shimmer-block w-1/4 h-3" />
      </div>
      <div className="shimmer-block w-20 h-6" />
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-cafe-maroon/15" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cafe-maroon animate-spin-slow" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-cafe-orange animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
    </div>
  );
}
