import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { creatorService } from "@/services/creatorService";

export function LogoutPage() {
  const [message, setMessage] = useState("Wrapping up your session safely.");

  useEffect(() => {
    let active = true;

    creatorService.logout()
      .catch(() => {
        if (active) setMessage("Finishing sign out.");
      })
      .finally(() => {
        window.setTimeout(() => window.location.replace("/login"), 700);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="premium-grid flex min-h-screen items-center justify-center bg-background px-5 py-12 text-ink">
      <section className="w-full max-w-md text-center">
        <BrandMark size="xl" className="mx-auto" />
        <LogOut className="information-icon mx-auto mt-8 h-5 w-5" />
        <h1 className="mt-4 text-2xl font-semibold">Signing out</h1>
        <p className="mt-3 text-sm leading-6 text-muted">{message}</p>
      </section>
    </main>
  );
}
