import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function RouteErrorPage() {
  return (
    <div className="premium-grid flex min-h-screen items-center justify-center bg-background p-4 text-ink">
      <Card className="w-full max-w-xl">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="mx-auto h-6 w-6 text-blaze" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-blaze">One moment</p>
          <h1 className="mt-2 text-2xl font-semibold">This view needs another try</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
            Your creator data is safe. Refresh the page or return to your dashboard.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4" />
              Reload
            </Button>
            <Button asChild variant="ghost">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
