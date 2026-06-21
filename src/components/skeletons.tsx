import { Skeleton } from "@/components/ui/skeleton";

export function GridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 justify-items-center">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="w-[150px] sm:w-[180px] md:w-[200px] aspect-[2/3] rounded-xl" />
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="pt-6 px-4 sm:px-6 lg:px-10 space-y-3">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-4 w-80" />
    </div>
  );
}

export function CategoryPageSkeleton() {
  return (
    <>
      <PageHeaderSkeleton />
      <GridSkeleton />
    </>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="-mt-16">
      <Skeleton className="h-[60vh] min-h-[420px] sm:h-[75vh] w-full rounded-none" />
      <div className="relative -mt-48 sm:-mt-64 px-4 sm:px-6 lg:px-10 z-10 max-w-6xl mx-auto">
        <div className="grid gap-8 sm:grid-cols-[200px_1fr] md:grid-cols-[260px_1fr]">
          <Skeleton className="aspect-[2/3] w-full max-w-[200px] sm:max-w-none rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
