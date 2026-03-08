import { Bell, ShieldCheck, FileText, Handshake } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const notifications = [
  {
    id: 1,
    icon: ShieldCheck,
    title: "New Claim Submitted",
    desc: "Ahmed Ali submitted a claim for Samsung Galaxy S23",
    time: "5 min ago",
    unread: true,
  },
  {
    id: 2,
    icon: FileText,
    title: "Report Matched",
    desc: "RPT-004 has a potential match with CLM-002",
    time: "32 min ago",
    unread: true,
  },
  {
    id: 3,
    icon: Handshake,
    title: "Handover Completed",
    desc: "Laptop Charger successfully returned to Omar Hassan",
    time: "2 hours ago",
    unread: false,
  },
];

export function NotificationsDropdown() {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <h4 className="text-sm font-bold text-foreground">Notifications</h4>
        </div>
        <div className="divide-y divide-border">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50 cursor-pointer ${n.unread ? "bg-primary/5" : ""}`}
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <n.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.desc}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
              </div>
              {n.unread && <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
            </div>
          ))}
        </div>
        <div className="border-t border-border px-4 py-2.5 text-center">
          <button className="text-xs font-medium text-primary hover:underline">
            View All Notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
