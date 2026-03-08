import { DashboardLayout } from "@/components/DashboardLayout";
import { Search, Download } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";

const logs = [
  { id: 1, admin: "Admin Manager", action: "Approved claim CLM-001", target: "Ahmed Ali – Samsung Galaxy S23", timestamp: "2026-02-09 10:32:15", ip: "192.168.1.45" },
  { id: 2, admin: "Admin Manager", action: "Deleted report RPT-011", target: "Unknown – Broken Umbrella", timestamp: "2026-02-09 09:18:42", ip: "192.168.1.45" },
  { id: 3, admin: "Dr. Nabil Al-Qadhi", action: "Banned user HU-2021-0455", target: "Yasser Bin Ali – Repeated false claims", timestamp: "2026-02-08 16:05:33", ip: "10.0.0.22" },
  { id: 4, admin: "Admin Manager", action: "Created new location", target: "Lecture Hall B3", timestamp: "2026-02-08 14:22:10", ip: "192.168.1.45" },
  { id: 5, admin: "Admin Manager", action: "Completed handover", target: "RPT-003 – Laptop Charger to Omar Hassan", timestamp: "2026-02-08 11:50:08", ip: "192.168.1.45" },
  { id: 6, admin: "Amina Saleh", action: "Updated report status", target: "RPT-005 – Engineering Textbook → Claimed", timestamp: "2026-02-07 15:30:22", ip: "10.0.0.55" },
  { id: 7, admin: "Admin Manager", action: "Exported user data", target: "CSV export – 2847 records", timestamp: "2026-02-07 13:45:18", ip: "192.168.1.45" },
  { id: 8, admin: "Admin Manager", action: "Modified system settings", target: "Claim auto-expiry changed from 14 to 21 days", timestamp: "2026-02-07 10:12:55", ip: "192.168.1.45" },
  { id: 9, admin: "Dr. Nabil Al-Qadhi", action: "Rejected claim CLM-004", target: "Insufficient proof – Calculator", timestamp: "2026-02-06 17:20:44", ip: "10.0.0.22" },
  { id: 10, admin: "Admin Manager", action: "Added new category", target: "Bags & Wallets", timestamp: "2026-02-06 09:08:30", ip: "192.168.1.45" },
  { id: 11, admin: "System", action: "Automated backup completed", target: "Database snapshot – 142MB", timestamp: "2026-02-06 03:00:00", ip: "127.0.0.1" },
  { id: 12, admin: "Admin Manager", action: "Created admin account", target: "Amina Saleh – Library Staff", timestamp: "2026-02-05 11:30:15", ip: "192.168.1.45" },
];

const AuditLogs = () => {
  const { lang, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = logs.filter(
    (l) =>
      l.admin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.target.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title={t("auditLogs", lang)} subtitle={t("auditLogsSubtitle", lang)}>
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-card">
        <div className="relative flex-1 min-w-[200px]">
          <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`} />
          <input type="text" placeholder={t("searchLogs", lang)} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-md border border-input bg-background py-2 ${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring`} />
        </div>
        <button className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
          <Download className="h-4 w-4" /> {t("exportLogs", lang)}
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-border bg-foreground/5">
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("thTimestamp", lang)}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("thAdmin", lang)}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("thAction", lang)}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("thTarget", lang)}</th>
                <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("thIpAddress", lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((log) => (
                <tr key={log.id} className="transition-colors hover:bg-muted/30">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{log.timestamp}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-card-foreground">{log.admin}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className={`${
                      log.action.includes("Deleted") || log.action.includes("Banned")
                        ? "text-destructive"
                        : log.action.includes("Approved") || log.action.includes("Completed")
                        ? "text-success"
                        : "text-card-foreground"
                    }`}>{log.action}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">{log.target}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {t("showing", lang)} {filtered.length} {t("of", lang)} {logs.length} {t("logEntries", lang)}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AuditLogs;
