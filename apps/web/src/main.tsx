import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "@/router";
import { ApiClientError } from "@/services/apiClient";
import { RealtimeQueryBridge } from "@/components/RealtimeQueryBridge";
import "@/styles.css";

const storedTheme = localStorage.getItem("blaze-creator-os-theme");
document.documentElement.dataset.theme = storedTheme === "light" ? "light" : "dark";
document.documentElement.style.colorScheme = storedTheme === "light" ? "light" : "dark";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiClientError && !error.retryable) {
          return false;
        }

        return failureCount < 2;
      },
      retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 4_000)
    }
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RealtimeQueryBridge />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
