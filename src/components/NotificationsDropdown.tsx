import { Bell, ShieldCheck, FileText, Handshake, AlertTriangle, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type NotifTab = "all" | "claims" | "system";

export function NotificationsDropdown() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<NotifTab>("all");
  const [allRead, setAllRead] = useState(false);

  const notifications = [
    {
      id: 1,
      icon: ShieldCheck,
      title: t("notifNewClaim", lang),
      desc: lang === "AR" ? "أحمد علي قدم مطالبة لـ Samsung Galaxy S23" : "Ahmed Ali submitted a claim for Samsung Galaxy S23",
      time: lang === "AR" ? "منذ 2 دقيقة" : "2m ago",
      unread: !allRead,
      type: "claims" as const,
    },
    {
      id: 2,
      icon: Search,
      title: t("notifReportMatched", lang),
      desc: lang === "AR" ? "RPT-004 لديه تطابق محتمل مع CLM-002" : "RPT-004 has a potential match with CLM-002",
      time: lang === "AR" ? "منذ 32 دقيقة" : "32m ago",
      unread: !allRead,
      type: "claims" as const,
    },
    {
      id: 3,
      icon: Handshake,
      title: t("notifHandoverCompleted", lang),
      desc: lang === "AR" ? "تم إرجاع شاحن لابتوب بنجاح إلى عمر حسن" : "Laptop Charger successfully returned to Omar Hassan",
      time: lang === "AR" ? "منذ ساعتين" : "2h ago",
      unread: false,
      type: "claims" as const,
    },
    {
      id: 4,
      icon: AlertTriangle,
      title: t("notifSystemBackup", lang),
      desc: lang === "AR" ? "تمت النسخة الاحتياطية اليومية بنجاح – 142MB" : "Daily backup completed successfully – 142MB",
      time: lang === "AR" ? "منذ 3 ساعات" : "3h ago",
      unread: !allRead,
      type: "system" as const,
    },
    {
      id: 5,
      icon: FileText,
      title: t("notifNewReport", lang),
      desc: lang === "AR" ? "فاطمة صالح قدمت بلاغ عثور جديد" : "Fatima Saleh filed a new found report",
      time: lang === "AR" ? "منذ 5 ساعات" : "5h ago",
      unread: false,
      type: "claims" as const,
    },
  ];

  const filtered = activeTab === "all" ? notifications : notifications.filter((n) => n.type === activeTab);
  const unreadCount = allRead ? 0 : notifications.filter((n) => n.unread).length;

  const tabs: { key: NotifTab; label: string }[] = [
    { key: "all", label: t("all", lang) },
    { key: "claims", label: t("claims", lang) },
    { key: "system", label: t("systemAlerts", lang) },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute end-1 top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h4 className="text-sm font-bold text-foreground">{t("notifications", lang)}</h4>
          <button
            onClick={() => setAllRead(true)}
            className="text-[11px] font-medium text-primary hover:underline"
          >
            {t("markAllAsRead", lang)}
          </button>
        </div>

        {/* Mini Tabs */}
        <div className="flex gap-1 border-b border-border px-3 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification Items */}
        <div className="max-h-80 divide-y divide-border overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">{t("noNotifications", lang)}</p>
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50 cursor-pointer ${
                  n.unread ? "bg-primary/5" : ""
                }`}
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
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2.5 text-center">
          <button
            onClick={() => navigate("/notifications")}
            className="text-xs font-medium text-primary hover:underline"
          >
            {t("viewAllNotifications", lang)}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
