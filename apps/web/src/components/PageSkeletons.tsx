import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton, SkeletonLines } from "@/components/Skeleton";

export function DashboardSkeleton() {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="skeleton-surface">
          <CardContent className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="w-full max-w-xl">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="mt-5 h-7 w-2/3" />
                <Skeleton className="mt-3 h-3 w-4/5" />
              </div>
              <Skeleton className="h-11 w-11 shrink-0" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="h-20" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="skeleton-surface">
          <CardContent className="flex min-h-64 flex-col justify-between p-5 md:p-6">
            <div>
              <div className="flex justify-between gap-4">
                <Skeleton className="h-10 w-10" />
              </div>
              <Skeleton className="mt-6 h-4 w-40" />
              <Skeleton className="mt-4 h-7 w-3/4" />
              <Skeleton className="mt-4 h-3 w-4/5" />
            </div>
            <Skeleton className="mt-6 h-10 w-full" />
          </CardContent>
        </Card>
      </div>
      <MetricSkeletonGrid count={2} />
    </>
  );
}

export function CommunitySkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <ListSkeleton rows={5} />
      <div className="grid gap-4">
        <ListSkeleton rows={3} />
        <ListSkeleton rows={3} />
      </div>
    </div>
  );
}

export function GrowthSkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {Array.from({ length: 5 }, (_, index) => (
        <ChartSkeleton key={index} />
      ))}
      <Card className="skeleton-surface">
        <CardHeader><Skeleton className="h-4 w-32" /></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-20" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function AudienceSkeleton() {
  return (
    <>
      <MetricSkeletonGrid count={4} className="mt-0 xl:grid-cols-4" />
      <div className="mt-4">
        <ChartSkeleton />
      </div>
    </>
  );
}

export function HealthSkeleton() {
  return (
    <Card className="health-stage skeleton-surface">
      <CardContent className="grid min-h-[610px] gap-8 p-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.55fr)] lg:p-10">
        <div className="flex min-w-0 flex-col items-center justify-center">
          <Skeleton className="mr-auto h-4 w-40" />
          <div className="skeleton-gauge mt-8">
            <div className="skeleton-gauge-inner" />
          </div>
          <div className="mt-7 grid w-full max-w-3xl grid-cols-2 gap-2 md:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-16" />)}
          </div>
        </div>
        <div className="space-y-7 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <Skeleton className="h-40" />
          <SkeletonLines lines={2} />
          {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-20" />)}
        </div>
      </CardContent>
    </Card>
  );
}

export function SettingsSkeleton() {
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Card key={index} className="skeleton-surface">
            <CardContent className="p-5">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="mt-5 h-4 w-32" />
              <div className="mt-4"><SkeletonLines lines={3} /></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="mt-4 h-32" />
    </>
  );
}

export function NotificationSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="rounded-md border border-line p-3">
          <div className="flex gap-3">
            <Skeleton className="mt-1 h-2 w-2 shrink-0 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-3 w-3/5" />
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ListSkeleton({ rows }: { rows: number }) {
  return (
    <Card className="skeleton-surface">
      <CardHeader><Skeleton className="h-4 w-36" /></CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="flex items-center gap-3 rounded-md border border-line p-4">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-3 w-2/5" />
              <Skeleton className="mt-2 h-3 w-3/5" />
            </div>
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <Card className="skeleton-surface">
      <CardHeader><Skeleton className="h-4 w-36" /></CardHeader>
      <CardContent>
        <div className="skeleton-chart">
          {Array.from({ length: 7 }, (_, index) => (
            <span key={index} style={{ height: `${28 + ((index * 17) % 58)}%` }} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MetricSkeletonGrid({ count, className = "" }: { count: number; className?: string }) {
  return (
    <div className={`mt-4 grid gap-4 sm:grid-cols-2 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <Card key={index} className="skeleton-surface">
          <CardContent className="p-5">
            <div className="flex justify-between gap-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-9" />
            </div>
            <Skeleton className="mt-7 h-8 w-20" />
            <Skeleton className="mt-3 h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
