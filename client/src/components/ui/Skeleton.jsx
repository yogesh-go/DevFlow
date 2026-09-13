import clsx from "clsx";

export function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-md bg-[#EAE7DF]",
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-7 w-48" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export default Skeleton;
