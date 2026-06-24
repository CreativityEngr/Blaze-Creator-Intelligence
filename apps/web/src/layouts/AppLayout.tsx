import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Gauge, LayoutDashboard, LogOut, Moon, Settings, Sun, UserRoundSearch, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { NavigationItem } from "@/types/navigation";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/hooks/useCreatorInsights";
import { useTheme } from "@/hooks/useTheme";
import { NotificationCenter } from "@/components/NotificationCenter";
import { BrandMark } from "@/components/BrandMark";

const navigation: NavigationItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Community", href: "/community", icon: Users },
  { label: "Growth", href: "/growth", icon: BarChart3 },
  { label: "Audience", href: "/audience", icon: UserRoundSearch },
  { label: "Health Score", href: "/health", icon: Gauge },
  { label: "Settings", href: "/settings", icon: Settings }
];

export function AppLayout() {
  const { data, isError: isCreatorError } = useDashboard();
  const { theme, toggleTheme } = useTheme();
  const creator = data?.creator;

  return (
    <div className="min-h-screen bg-background text-ink">
      <aside className="app-sidebar fixed inset-y-0 left-0 z-30 hidden w-72 border-r px-4 py-5 backdrop-blur xl:block">
        <div className="mb-8 flex items-center gap-3 px-2">
          <BrandMark />
          <div>
            <p className="text-sm font-semibold">Blaze Creator Intelligence</p>
            <p className="text-xs text-muted">Creator intelligence platform</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "nav-item flex h-11 items-center gap-2 rounded-md px-2 text-sm text-muted transition hover:text-ink",
                  isActive && "nav-item-active text-ink"
                )
              }
            >
              <span className="nav-icon">
                <item.icon className="h-4 w-4" />
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

      </aside>

      <div className="xl:pl-72">
        <header className="top-shell sticky top-0 z-20 border-b backdrop-blur-xl">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 md:px-8">
            <div className="flex items-center justify-between gap-3 xl:hidden">
              <div className="flex items-center gap-3">
                <BrandMark />
                <span className="text-sm font-semibold">Blaze Creator Intelligence</span>
              </div>
            </div>

            <div className="ml-auto flex min-w-0 items-center justify-end gap-2 sm:gap-3">
              <Button
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                size="icon"
                variant="ghost"
                onClick={toggleTheme}
              >
                {theme === "dark" ? <Sun className="h-4 w-4 text-blaze" /> : <Moon className="h-4 w-4 text-blaze" />}
              </Button>
              <NotificationCenter />
              <div className="profile-cluster flex min-w-0 items-center gap-3 py-1">
                {creator ? (
                  <Avatar src={creator.avatarUrl} alt={creator.displayName} />
                ) : (
                  <div className="h-9 w-9 animate-pulse rounded-full border border-line bg-white/[0.06]" />
                )}
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">
                    {creator?.displayName ?? (isCreatorError ? "Creator unavailable" : "Preparing profile")}
                  </p>
                  <p className="text-xs text-muted">
                    {creator ? `@${creator.blazeId}` : isCreatorError ? "Profile unavailable" : "One moment"}
                  </p>
                </div>
                <Button
                  aria-label="Log out"
                  title="Log out"
                  size="icon"
                  variant="ghost"
                  onClick={() => window.location.assign("/logout")}
                >
                  <LogOut className="h-4 w-4 text-blaze" />
                </Button>
              </div>
            </div>
          </div>

          <nav className="mobile-navigation grid grid-cols-3 gap-2 px-4 pb-3 sm:grid-cols-6 xl:hidden">
            {navigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                cn(
                    "nav-item flex h-10 min-w-0 items-center justify-center gap-2 rounded-md px-2 text-xs text-muted",
                    isActive && "nav-item-active text-ink"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="premium-grid min-h-[calc(100vh-4rem)] min-w-0 px-4 py-6 md:px-8 lg:py-8">
          <div className="mx-auto min-w-0 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
