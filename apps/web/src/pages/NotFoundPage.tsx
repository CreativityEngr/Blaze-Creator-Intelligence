import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-xl">
        <CardContent className="p-8 text-center">
          <SearchX className="mx-auto h-6 w-6 text-blaze" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-blaze">404</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">This intelligence view does not exist</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
            Return to the dashboard to continue reviewing your channel.
          </p>
          <Button asChild className="mt-6">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
