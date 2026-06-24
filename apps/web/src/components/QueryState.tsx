import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type QueryErrorStateProps = {
  error: Error;
  onRetry: () => void;
};

export function QueryErrorState({ onRetry }: QueryErrorStateProps) {
  return (
    <Card>
      <CardContent className="flex min-h-56 items-center justify-center">
        <div className="max-w-md text-center">
          <AlertTriangle className="mx-auto h-5 w-5 text-blaze" />
          <p className="mt-3 text-sm font-medium text-ink">Your latest channel view is unavailable</p>
          <p className="mt-2 text-sm leading-6 text-muted">Give it another moment, then try again.</p>
          <Button className="mt-5" onClick={onRetry}>
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed border-line bg-white/[0.02] p-5 text-center">
      <div className="max-w-sm">
        <Inbox className="information-icon mx-auto h-5 w-5" />
        <p className="mt-3 text-sm font-medium text-ink">{title}</p>
        <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
      </div>
    </div>
  );
}
