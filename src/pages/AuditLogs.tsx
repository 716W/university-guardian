import { DashboardLayout } from "@/components/DashboardLayout";
import { Search, Download, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import { useGetAuditLogs } from "@/hooks/useAuditLogs";
import { auditLogsApi } from "@/lib/api/endpoints/auditLogs";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "@/hooks/use-toast";

const AuditLogs = () => {
  const { lang, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [exporting, setExporting] = useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  const { data, isLoading, isError } = useGetAuditLogs(page, pageSize, debouncedSearchQuery);

  const logs = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalRecords = data?.totalRecords || 0;

  const handleExport = async () => {
    setExporting(true);
    try {
      // Option A: Backend Export
      const blob = await auditLogsApi.exportAuditLogs();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "audit_logs.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "✅ " + t("exportComplete", lang), description: "Audit logs exported." });
    } catch (error) {
      // Option B: Client-side CSV Fallback
      console.warn("Backend export failed, falling back to client-side CSV", error);
      const csv = "Timestamp,Admin,Action,Target,IP Address\n" + logs.map(l => `"${l.timestamp}","${l.adminName}","${l.action}","${l.target}","${l.ipAddress}"`).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "audit_logs_fallback.csv"; a.click();
      URL.revokeObjectURL(url);
      toast({ title: "✅ " + t("exportComplete", lang), description: "Audit logs exported." });
    } finally {
      setExporting(false);
    }
  };

  return (
    <DashboardLayout title={t("auditLogs", lang)} subtitle={t("auditLogsSubtitle", lang)}>
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-card">
        <div className="relative flex-1 min-w-[200px]">
          <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`} />
          <input type="text" placeholder={t("searchLogs", lang)} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-md border border-input bg-background py-2 ${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring`} />
        </div>
        <button 
          onClick={handleExport} 
          disabled={exporting}
          className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
        >
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} {t("exportLogs", lang)}
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
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-destructive">
                    Failed to load audit logs.
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="transition-colors hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{log.timestamp}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-card-foreground">{log.adminName}</td>
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
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{log.ipAddress}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {t("showing", lang)} {logs.length} {t("of", lang)} {totalRecords} {t("logEntries", lang)}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="p-1 rounded border border-border disabled:opacity-50 hover:bg-muted"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0 || isLoading}
              className="p-1 rounded border border-border disabled:opacity-50 hover:bg-muted"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AuditLogs;
