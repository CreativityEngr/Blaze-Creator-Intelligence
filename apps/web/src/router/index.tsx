import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { CommunityPage } from "@/features/community/CommunityPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { GrowthPage } from "@/features/growth/GrowthPage";
import { HealthPage } from "@/features/health/HealthPage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import { AudiencePage } from "@/features/audience/AudiencePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { RouteErrorPage } from "@/pages/RouteErrorPage";
import { LoginPage } from "@/pages/LoginPage";
import { LogoutPage } from "@/pages/LogoutPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage />, errorElement: <RouteErrorPage /> },
  { path: "/logout", element: <LogoutPage />, errorElement: <RouteErrorPage /> },
  {
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/community", element: <CommunityPage /> },
      { path: "/growth", element: <GrowthPage /> },
      { path: "/audience", element: <AudiencePage /> },
      { path: "/health", element: <HealthPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "*", element: <NotFoundPage /> }
    ]
  }
]);
