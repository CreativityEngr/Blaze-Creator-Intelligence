import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { CommunityPage } from "@/features/community/CommunityPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { GrowthPage } from "@/features/growth/GrowthPage";
import { HealthPage } from "@/features/health/HealthPage";
import { SettingsPage } from "@/features/settings/SettingsPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/community", element: <CommunityPage /> },
      { path: "/growth", element: <GrowthPage /> },
      { path: "/health", element: <HealthPage /> },
      { path: "/settings", element: <SettingsPage /> }
    ]
  }
]);
