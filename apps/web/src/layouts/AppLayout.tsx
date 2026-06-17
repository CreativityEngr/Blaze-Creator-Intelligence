import { NavLink, Outlet } from "react-router-dom";
import { Activity, BarChart3, Gauge, LayoutDashboard, Search, Settings, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NavigationItem } from "@/types/navigation";
import { cn } from "@/lib/utils";

const navigation: NavigationItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Community", href: "/community", icon: Users },
  { label: "Growth", href: "/growth", icon: BarChart3 },
  { label: "Health Score", href: "/health", icon: Gauge },
  { label: "Settings", href: "/settings", icon: Settings }
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-line bg-surface/96 px-4 py-5 backdrop-blur xl:block">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-blaze/30 bg-blaze/10 text-sm font-bold text-blaze">
            B
          </div>
          <div>
            <p className="text-sm font-semibold">Blaze Creator OS</p>
            <p className="text-xs text-muted">Creator command center</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex h-11 items-center gap-3 rounded-md px-3 text-sm text-muted transition hover:bg-white/[0.05] hover:text-ink",
                  isActive && "border border-line bg-white/[0.06] text-ink shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-line bg-card p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Activity className="h-4 w-4 text-blaze" />
            Live telemetry
          </div>
          <p className="text-xs leading-5 text-muted">
            Mock Blaze events are wired through the API and ready for the real event stream.
          </p>
        </div>
      </aside>

      <div className="xl:pl-72">
        <header className="sticky top-0 z-20 border-b border-line bg-background/82 backdrop-blur-xl">
          <div className="flex min-h-16 flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:px-8">
            <div className="flex items-center justify-between gap-3 xl:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-blaze/30 bg-blaze/10 text-sm font-bold text-blaze">
                  B
                </div>
                <span className="text-sm font-semibold">Blaze Creator OS</span>
              </div>
            </div>

            <div className="relative flex-1 md:max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input className="pl-9" placeholder="Search audience, activities, streams" />
            </div>

            <div className="flex items-center justify-between gap-3 md:ml-auto">
              <Button size="sm" variant="ghost">
                <Activity className="h-4 w-4" />
                Live
              </Button>
              <div className="flex items-center gap-3 rounded-md border border-line bg-white/[0.04] px-3 py-2">
                <Avatar
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80"
                  alt="Aria Lane"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">Aria Lane</p>
                  <p className="text-xs text-muted">@aria.blaze</p>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto px-4 pb-3 xl:hidden">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex h-9 shrink-0 items-center gap-2 rounded-md border border-transparent px-3 text-xs text-muted",
                    isActive && "border-line bg-white/[0.06] text-ink"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="premium-grid min-h-[calc(100vh-4rem)] px-4 py-6 md:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
