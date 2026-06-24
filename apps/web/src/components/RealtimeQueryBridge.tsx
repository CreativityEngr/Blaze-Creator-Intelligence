import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";

const apiOrigin = new URL(import.meta.env.VITE_API_URL ?? "http://localhost:4000/api").origin;

export function RealtimeQueryBridge() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(apiOrigin, { withCredentials: true });
    socket.on("creator:data-changed", () => {
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      void queryClient.invalidateQueries({ queryKey: ["community"] });
      void queryClient.invalidateQueries({ queryKey: ["growth"] });
      void queryClient.invalidateQueries({ queryKey: ["health-score"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });
    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return null;
}
