import {
  ArrowRight,
  BarChart3,
  Gauge,
  LockKeyhole,
  Moon,
  Radio,
  ShieldCheck,
  Sun,
  UserRoundSearch
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { apiOrigin } from "@/services/apiClient";

const intelligenceModules: Array<{
  title: string;
  icon: LucideIcon;
}> = [
  { title: "Live Signals", icon: Radio },
  { title: "Audience", icon: UserRoundSearch },
  { title: "Growth", icon: BarChart3 },
  { title: "Health Score", icon: Gauge }
];

export function LoginPage() {
  const [params] = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const requested = params.get("returnTo");
  const returnTo = requested?.startsWith("/") && !requested.startsWith("//") ? requested : "/";
  const loginUrl = `${apiOrigin}/auth/login?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <main className="login-shell min-h-screen overflow-x-hidden bg-background px-4 py-4 text-ink sm:px-6 sm:py-6">
      <Button
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        size="icon"
        variant="ghost"
        className="login-theme-toggle"
        onClick={toggleTheme}
      >
        {theme === "dark" ? <Sun className="h-4 w-4 text-blaze" /> : <Moon className="h-4 w-4 text-blaze" />}
      </Button>

      <section className="login-stage mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col items-center justify-center gap-6 py-8 sm:min-h-[calc(100vh-3rem)]">
        <div className="login-auth-card relative w-full max-w-[43rem] overflow-hidden rounded-2xl border px-5 py-10 text-center sm:px-10 sm:py-14">
          <div className="login-card-glow" aria-hidden="true" />
          <div className="relative z-10">
            <div className="login-logo-stage mx-auto">
              <div className="login-logo-fire" aria-hidden="true" />
              <BrandMark size="xl" className="relative z-10 mx-auto h-20 w-20 sm:h-24 sm:w-24" />
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-normal sm:text-5xl">
              Blaze Creator
              <span className="login-title-accent block">Intelligence</span>
            </h1>
            <p className="login-kicker mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.42em] text-muted">
              Creator Intelligence Platform
            </p>

            <div className="login-rule mx-auto mt-5 h-px w-20" />

            <div className="login-module-row mx-auto mt-8 grid max-w-[30rem] grid-cols-4 gap-2 sm:gap-6">
              {intelligenceModules.map(({ title, icon: Icon }) => (
                <div key={title} className="login-module-mini min-w-0">
                  <div className="login-module-icon mx-auto flex h-12 w-12 items-center justify-center rounded-lg border sm:h-14 sm:w-14">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <p className="mt-3 truncate text-[0.68rem] font-medium text-muted sm:text-sm">{title}</p>
                </div>
              ))}
            </div>

            <Button className="login-oauth-button mx-auto mt-9 h-14 w-full max-w-[26.75rem] justify-between px-6 text-base font-semibold sm:text-lg" onClick={() => window.location.assign(loginUrl)}>
              <span className="truncate">Continue with Blaze</span>
              <ArrowRight className="h-5 w-5 shrink-0" />
            </Button>

            <div className="mt-7 flex items-center justify-center gap-2 text-sm text-muted">
              <LockKeyhole className="h-4 w-4" />
              <span>Secure OAuth connection</span>
            </div>
          </div>
        </div>

        <p className="login-trust-line flex items-center justify-center gap-3 px-3 text-center text-sm text-muted sm:text-base">
          <ShieldCheck className="h-5 w-5 shrink-0" />
          <span>Your data is encrypted. Your channel stays yours.</span>
        </p>
      </section>
    </main>
  );
}
