import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import {
  ShieldCheck,
  FileText,
  Handshake,
  AlertTriangle,
  Search,
  Bell,
  Trash2,
  CheckCheck,
  Filter,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useGetNotifications, useMarkNotificationAsRead, useDeleteNotification } from "@/hooks/queries/useNotifications";

type NotifType = "claims" | "system";

interface Notification {
  id: number;
  icon: typeof Bell;
  title: string;
  desc: string;
  time: string;
  date: string;
  unread: boolean;
  type: NotifType;
}

const Notifications = () => {
  const { lang, isRTL } = useLanguage();

  const { data: notificationsData, isLoading } = useGetNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const deleteMutation = useDeleteNotification();

  const [typeFilter, setTypeFilter] = useState<"all" | NotifType>("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = notificationsData || [];

  const formattedNotifications = notifications.map(n => {
    const d = new Date(n.createdAt);
    return {
      ...n,
      date: d.toISOString().split('T')[0],
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: n.type === "system" ? AlertTriangle : (n.type === "claims" ? ShieldCheck : Bell),
      desc: n.message,
      unread: !n.isRead
    };
  });

  const filtered = formattedNotifications.filter((n) => {
    const matchType = typeFilter === "all" || n.type === typeFilter;
    const matchDate = dateFilter === "all" || n.date === dateFilter;
    const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchDate && matchSearch;
  });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((n) => n.id)));
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(Array.from(selectedIds).map(id => deleteMutation.mutateAsync(id)));
      toast({ title: "🗑️ " + (lang === "AR" ? "تم حذف الإشعارات" : "Notifications Deleted"), description: `${selectedIds.size} ${lang === "AR" ? "إشعار تم حذفه" : "notifications removed"}` });
      setSelectedIds(new Set());
    } catch (e) {
      toast({ title: lang === "AR" ? "خطأ" : "Error", description: lang === "AR" ? "فشل حذف الإشعارات" : "Failed to delete notifications", variant: "destructive" });
    }
  };

  const handleMarkSelectedRead = async () => {
    try {
      await Promise.all(Array.from(selectedIds).map(id => markAsReadMutation.mutateAsync(id)));
      toast({ title: "✅ " + (lang === "AR" ? "تم التحديد كمقروء" : "Marked as Read"), description: `${selectedIds.size} ${lang === "AR" ? "إشعار تم تحديده كمقروء" : "notifications marked as read"}` });
      setSelectedIds(new Set());
    } catch (e) {
      toast({ title: lang === "AR" ? "خطأ" : "Error", description: lang === "AR" ? "فشل تحديد الإشعارات كمقروءة" : "Failed to mark notifications as read", variant: "destructive" });
    }
  };

  const uniqueDates = [...new Set(formattedNotifications.map((n) => n.date))];

  return (
    <DashboardLayout title={t("notificationsPage", lang)} subtitle={t("notificationsSubtitle", lang)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-card">
        <div className="relative flex-1 min-w-[200px]">
          <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`} />
          <input
            type="text"
            placeholder={lang === "AR" ? "ابحث في الإشعارات..." : "Search notifications..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-md border border-input bg-background py-2 ${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring`}
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as "all" | NotifType)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">{t("all", lang)}</option>
          <option value="claims">{t("claims", lang)}</option>
          <option value="system">{t("systemAlerts", lang)}</option>
        </select>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">{t("filterByDate", lang)}</option>
          {uniqueDates.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkSelectedRead}
              className="flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <CheckCheck className="h-4 w-4" /> {t("markAsRead", lang)}
            </button>
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-1.5 rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4" /> {t("deleteSelected", lang)}
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card shadow-card">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p className="text-sm font-medium text-muted-foreground">{lang === "AR" ? "جاري التحميل..." : "Loading..."}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Bell className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <p className="mt-4 text-sm font-medium text-muted-foreground">{t("noNotifications", lang)}</p>
            <p className="mt-1 text-xs text-muted-foreground/60">{t("noNotificationsDesc", lang)}</p>
          </div>
        ) : (
          <>
            {/* Select all header */}
            <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-5 py-3">
              <input
                type="checkbox"
                checked={selectedIds.size === filtered.length && filtered.length > 0}
                onChange={toggleAll}
                className="h-4 w-4 rounded border-input text-primary accent-primary"
              />
              <span className="text-xs font-medium text-muted-foreground">
                {selectedIds.size > 0
                  ? `${selectedIds.size} ${t("selected", lang)}`
                  : `${filtered.length} ${lang === "AR" ? "إشعار" : "notifications"}`}
              </span>
            </div>

            <div className="divide-y divide-border">
              {filtered.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/30 ${
                    n.unread ? "bg-primary/5" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(n.id)}
                    onChange={() => toggleSelect(n.id)}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-input text-primary accent-primary"
                  />
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <n.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm ${n.unread ? "font-semibold" : "font-medium"} text-card-foreground`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {n.unread && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap">{n.time}</span>
                      </div>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        n.type === "system"
                          ? "bg-warning/10 text-warning border border-warning/20"
                          : "bg-primary/10 text-primary border border-primary/20"
                      }`}>
                        {n.type === "system" ? t("systemAlerts", lang) : t("claims", lang)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {filtered.length > 0 && (
          <div className="border-t border-border px-5 py-3">
            <p className="text-sm text-muted-foreground">
              {t("showing", lang)} {filtered.length} {t("of", lang)} {notifications.length} {lang === "AR" ? "إشعار" : "notifications"}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
