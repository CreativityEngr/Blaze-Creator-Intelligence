import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationActions, useNotifications } from "@/hooks/useCreatorInsights";
import { NotificationSkeleton } from "@/components/PageSkeletons";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const { data, isPending } = useNotifications();
  const { markAllRead, markRead } = useNotificationActions();
  const unread = data?.unreadCount ?? 0;

  return (
    <div className="relative">
      <Button
        aria-label="Open notifications"
        title="Notifications"
        size="icon"
        variant="ghost"
        onClick={() => setOpen((value) => !value)}
      >
        <Bell className="h-4 w-4 text-blaze" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-danger" />
        )}
      </Button>

      {open && (
        <div className="notification-panel fixed inset-x-4 top-20 z-50 rounded-lg border border-line bg-card p-3 shadow-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-96">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Notifications</p>
              <p className="text-xs text-muted">{unread} unread</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              title="Mark all as read"
              aria-label="Mark all notifications as read"
              onClick={() => markAllRead.mutate()}
            >
              <CheckCheck className="h-4 w-4 text-blaze" />
            </Button>
          </div>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {isPending && <NotificationSkeleton />}
            {!isPending && !data?.items.length && <p className="py-8 text-center text-sm text-muted">Nothing needs your attention right now.</p>}
            {data?.items.map((item) => (
              <button
                key={item.id}
                className="w-full rounded-md border border-line p-3 text-left transition hover:border-blaze/40"
                onClick={() => !item.read && markRead.mutate(item.id)}
              >
                <div className="flex items-start gap-2">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.read ? "bg-white/20" : "bg-blaze"}`} />
                  <span>
                    <span className="block text-sm font-semibold text-ink">{item.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-muted">{item.body}</span>
                    <span className="mt-2 block text-[11px] text-muted">
                      {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}
                    </span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
