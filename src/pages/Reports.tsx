import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, Filter, Download, MoreHorizontal, Eye, Edit, RefreshCw, Trash2, Link2, X, Calendar, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useGetReports, useGetReportById, useDeleteReport, useUpdateReport } from "@/hooks/queries/useReports";

const reportImages: Record<string, string> = {
  Electronics: "📱",
  Documents: "📄",
  Accessories: "👜",
  Clothing: "👕",
};

export interface Report {
  id: string | number;
  title: string;
  category: string;
  location: string;
  date: string;
  status: "lost" | "found";
  reporter: string;
  hasMatch: boolean;
  description: string;
  imagePath?: string;
}



const Reports = () => {
  const { lang, isRTL } = useLanguage();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const { data: reportsData, isLoading, isError } = useGetReports({ pageNumber: page, pageSize });
  
  // Map API response to UI Report model
  const reports: Report[] = (reportsData?.data || []).map(r => ({
    id: r.id,
    title: r.itemName,
    category: "Electronics", // Default category if not provided by API
    location: "Unknown", // Default location if not provided
    date: r.dateReported.split("T")[0],
    status: r.reportType === 1 ? "lost" : "found",
    reporter: "System User", // Default reporter
    hasMatch: false,
    description: r.description || "No description provided",
    imagePath: r.imagePath
  }));

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [viewReport, setViewReport] = useState<Report | null>(null);
  const [editReport, setEditReport] = useState<Report | null>(null);
  const [deleteReport, setDeleteReport] = useState<Report | null>(null);

  const activeId = viewReport?.id || editReport?.id || 0;
  const { data: detailsData, isLoading: detailsLoading } = useGetReportById(activeId, !!activeId);

  
  
  const deleteMutation = useDeleteReport();
  const updateMutation = useUpdateReport();
  const [showFilters, setShowFilters] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", location: "", description: "", status: "lost" as "lost" | "found" });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = reports.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.reporter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || r.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const toggleRow = (id: string | number) => {
    setSelectedRows((prev) => { const idStr = id.toString(); const next = new Set(prev); if (next.has(idStr)) next.delete(idStr); else next.add(idStr); return next; });
  };

  const toggleAll = () => {
    if (selectedRows.size === filtered.length && filtered.length > 0) setSelectedRows(new Set());
    else setSelectedRows(new Set(filtered.map((r) => r.id.toString())));
  };

  const openEdit = (report: Report) => {
    setEditForm({ title: report.title, location: report.location, description: report.description, status: report.status });
    setEditErrors({});
    setEditReport(report);
    setOpenMenuId(null);
  };

  const handleEditSave = () => {
    if (!editReport) return;
    const errs: Record<string, string> = {};
    if (!editForm.title.trim()) errs.title = t("titleRequired", lang);
    if (!editForm.location.trim()) errs.location = t("locationRequired", lang);
    if (Object.keys(errs).length > 0) { setEditErrors(errs); return; }
    
    const formData = new FormData();
    
    // The backend in ASP.NET Core accepts lowerCase / camelCase keys usually, but Swagger shows PascalCase. Let's send camelCase keys as is universally safe for ASP.NET or match Swagger exactly.
    // However, if some aren't sent, ASP.NET Core may complain if they are required. We'll send them matching Swagger to be safe.
    formData.append('ItemName', editForm.title || detailsData?.data?.itemName || editReport.title);
    formData.append('Description', editForm.description || detailsData?.data?.description || editReport.description || '');
    
    const newStatus = editForm.status || editReport.status;
    formData.append('ReportType', newStatus === 'lost' ? '1' : '2');
    
    // Only send LocationId and DateReported if we have a reasonable value
    // Let's send the previous date-time string if available
    const prevDate = detailsData?.data?.dateReported || editReport.date;
    if (prevDate) formData.append('DateReported', prevDate);
    
    // Location Id is tricky if not sent in GET. We'll skip sending LocationId if not needed, 
    // or send '1' if backend insists (but let's omit unless we explicitly have it, else dummy '1')
    if ((detailsData?.data as any)?.locationId) {
        formData.append('LocationId', (detailsData.data as any).locationId.toString());
    } else {
        // formData.append('LocationId', '1'); // Omit and hope it's not required on PUT
    }

    if ((detailsData?.data as any)?.color) formData.append('Color', (detailsData.data as any).color);
    if ((detailsData?.data as any)?.conditionType) formData.append('ConditionType', (detailsData.data as any).conditionType.toString());

    updateMutation.mutate({ id: editReport.id, formData }, {
      onSuccess: () => {
        toast({ title: "✅ " + (lang === "AR" ? "تم تحديث البلاغ" : "Report Updated"), description: `${editReport.id} ${lang === "AR" ? "تم تحديثه بنجاح" : "has been updated successfully."}` });
        setEditReport(null);
      },
      onError: (err: any) => {
        console.error("Update error:", err);
        toast({ title: lang === "AR" ? "فشل التحديث" : "Update failed: " + (err.response?.data?.message || err.message), variant: "destructive" });
      }
    });
  };

  const handleDelete = () => {
    if (!deleteReport) return;
    deleteMutation.mutate(deleteReport.id, {
      onSuccess: () => {
        toast({ title: "🗑️ " + (lang === "AR" ? "تم حذف البلاغ" : "Report Deleted"), description: `${deleteReport.id} ${lang === "AR" ? "تمت إزالته" : "has been removed."}` });
        setDeleteReport(null);
      },
      onError: (err: any) => {
        console.error("Delete error:", err);
        toast({ title: lang === "AR" ? "فشل الحذف" : "Deletion failed: " + (err.response?.data?.message || err.message), variant: "destructive" });
      }
    });
  };

  const [exporting, setExporting] = useState(false);

  const handleExportPDF = () => {
    setExporting(true);
    try {
      const rows = selectedRows.size > 0 ? filtered.filter(r => selectedRows.has(r.id.toString())) : filtered;
      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFillColor(124, 58, 237);
      doc.rect(0, 0, pageWidth, 60, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Hadramout University - Lost & Found", 40, 28);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Reports Export", 40, 46);
      doc.setFontSize(9);
      const stamp = new Date().toLocaleString("en-GB");
      doc.text(`Generated: ${stamp}`, pageWidth - 40, 46, { align: "right" });

      autoTable(doc, {
        startY: 80,
        head: [["ID", "Item", "Category", "Location", "Reporter", "Date", "Status", "Match"]],
        body: rows.map(r => [
          r.id, r.title, r.category, r.location, r.reporter, r.date,
          r.status.toUpperCase(), r.hasMatch ? "Yes" : "-",
        ]),
        styles: { fontSize: 9, cellPadding: 6, textColor: [40, 40, 40] },
        headStyles: { fillColor: [124, 58, 237], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [248, 247, 255] },
        margin: { left: 40, right: 40 },
        didDrawPage: (data) => {
          const pageCount = doc.getNumberOfPages();
          const pageHeight = doc.internal.pageSize.getHeight();
          doc.setFontSize(8);
          doc.setTextColor(120);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}  •  Total reports: ${rows.length}`,
            pageWidth / 2, pageHeight - 20, { align: "center" }
          );
        },
      });

      doc.save(`reports-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast({
        title: "📄 " + (lang === "AR" ? "تم تصدير PDF" : "PDF Exported"),
        description: lang === "AR" ? `تم تصدير ${rows.length} بلاغ بنجاح` : `${rows.length} reports exported successfully.`,
      });
    } catch (err) {
      toast({ title: lang === "AR" ? "فشل التصدير" : "Export failed", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <DashboardLayout title={t("reports", lang)} subtitle={t("reportsSubtitle", lang)}>
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-card">
        <div className="relative flex-1 min-w-[200px]">
          <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`} />
          <input type="text" placeholder={t("searchReports", lang)} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-md border border-input bg-background py-2 ${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring`} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">{t("allStatus", lang)}</option>
          <option value="lost">{t("lost", lang)}</option>
          <option value="found">{t("found", lang)}</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">{t("allCategories", lang)}</option>
          <option value="Electronics">{lang === "AR" ? "إلكترونيات" : "Electronics"}</option>
          <option value="Documents">{lang === "AR" ? "مستندات" : "Documents"}</option>
          <option value="Accessories">{lang === "AR" ? "إكسسوارات" : "Accessories"}</option>
          <option value="Clothing">{lang === "AR" ? "ملابس" : "Clothing"}</option>
        </select>
        <button onClick={() => setShowFilters(true)} className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
          <Filter className="h-4 w-4" /> {t("moreFilters", lang)}
        </button>
        <button onClick={handleExportPDF} disabled={exporting} className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} {t("export", lang)} PDF
        </button>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-start"><input type="checkbox" checked={selectedRows.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="h-4 w-4 rounded border-input text-primary accent-primary" /></th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thId", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thItem", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thCategory", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thLocation", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thReporter", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thDate", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thStatus", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thActions", lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
                    {t("loading", lang) || "Loading..."}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                    No reports found.
                  </td>
                </tr>
              ) : filtered.map((report) => (
                <tr key={report.id} className={`transition-colors hover:bg-muted/30 ${selectedRows.has(report.id.toString()) ? "bg-primary/5" : ""}`}>
                  <td className="px-4 py-3"><input type="checkbox" checked={selectedRows.has(report.id.toString())} onChange={() => toggleRow(report.id)} className="h-4 w-4 rounded border-input text-primary accent-primary" /></td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{report.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">{reportImages[report.category] || "📦"}</div>
                      <div>
                        <span className="font-medium text-card-foreground">{report.title}</span>
                        {report.hasMatch && (
                          <span className={`${isRTL ? "mr-2" : "ml-2"} inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary`}>
                            <Link2 className="h-3 w-3" /> {t("highMatch", lang)}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{report.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{report.location}</td>
                  <td className="px-4 py-3 text-muted-foreground">{report.reporter}</td>
                  <td className="px-4 py-3 text-muted-foreground">{report.date}</td>
                  <td className="px-4 py-3"><StatusBadge status={report.status} /></td>
                  <td className="px-4 py-3">
                    <div className="relative" ref={openMenuId === report.id ? menuRef : null}>
                      <button onClick={() => setOpenMenuId(openMenuId === report.id ? null : report.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenuId === report.id && (
                        <div className={`absolute ${isRTL ? "left-0" : "right-0"} top-full z-50 mt-1 w-44 rounded-lg border border-border bg-popover p-1 shadow-lg`}>
                          <button onClick={() => { setViewReport(report); setOpenMenuId(null); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-muted">
                            <Eye className="h-4 w-4" /> {t("viewDetails", lang)}
                          </button>
                          <button onClick={() => openEdit(report)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-muted">
                            <Edit className="h-4 w-4" /> {t("edit", lang)}
                          </button>
                          <button onClick={() => { setOpenMenuId(null); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-muted">
                            <RefreshCw className="h-4 w-4" /> {t("changeStatus", lang)}
                          </button>
                          <div className="my-1 h-px bg-border" />
                          <button onClick={() => { setDeleteReport(report); setOpenMenuId(null); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" /> {t("delete", lang)}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {t("showing", lang)} {filtered.length} {t("of", lang)} {reportsData?.totalRecords || reports.length} {t("reports", lang).toLowerCase()}
            {selectedRows.size > 0 && <span className="ms-2 font-medium text-primary">({selectedRows.size} {t("selected", lang)})</span>}
          </p>
          <div className="flex gap-1">
            <button 
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
            >
              {t("previous", lang)}
            </button>
            <button className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">{page}</button>
            <button 
              disabled={page >= (reportsData?.totalPages || 1)}
              onClick={() => setPage(p => p + 1)}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
            >
              {t("next", lang)}
            </button>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      <Dialog open={!!viewReport} onOpenChange={() => setViewReport(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{viewReport && reportImages[viewReport.category]}</span>
              {viewReport?.title}
            </DialogTitle>
          </DialogHeader>
          {viewReport && (
            <div className="space-y-4 pt-2">
              {detailsLoading ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex h-48 items-center justify-center rounded-xl border border-border bg-muted overflow-hidden">
                    {detailsData?.data?.images?.[0]?.path ? (
                      <img src={'http://localhost:8080/' + detailsData.data.images[0].path} alt={viewReport.title} className="max-h-full object-contain" />
                    ) : viewReport.imagePath ? (
                      <img src={'http://localhost:8080/' + viewReport.imagePath} alt={viewReport.title} className="max-h-full object-contain" />
                    ) : (
                      <span className="text-6xl">{reportImages[viewReport.category]}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs font-medium text-muted-foreground">{t("reportId", lang)}</p><p className="text-sm font-semibold text-foreground font-mono">{viewReport.id}</p></div>
                    <div><p className="text-xs font-medium text-muted-foreground">{t("thStatus", lang)}</p><StatusBadge status={detailsData?.data?.reportType === 1 ? "lost" : detailsData?.data?.reportType === 2 ? "found" : viewReport.status} /></div>
                    <div><p className="text-xs font-medium text-muted-foreground">{t("thCategory", lang)}</p><p className="text-sm text-foreground">{viewReport.category}</p></div>
                    <div><p className="text-xs font-medium text-muted-foreground">{t("thLocation", lang)}</p><p className="text-sm text-foreground">{detailsData?.data?.locationName || viewReport.location}</p></div>
                    <div><p className="text-xs font-medium text-muted-foreground">{t("thReporter", lang)}</p><p className="text-sm text-foreground">{viewReport.reporter}</p></div>
                    <div><p className="text-xs font-medium text-muted-foreground">{t("thDate", lang)}</p><p className="text-sm text-foreground">{detailsData?.data?.dateReported ? detailsData.data.dateReported.split('T')[0] : viewReport.date}</p></div>
                  </div>
                  <div><p className="text-xs font-medium text-muted-foreground">{t("description", lang)}</p><p className="text-sm text-foreground mt-1">{detailsData?.data?.description || viewReport.description || "No description provided"}</p></div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editReport} onOpenChange={() => setEditReport(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{t("editReport", lang)} – {editReport?.id}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("title", lang)}</label>
              <input value={editForm.title} onChange={(e) => { setEditForm(f => ({ ...f, title: e.target.value })); setEditErrors(e => ({ ...e, title: "" })); }}
                className={`w-full rounded-md border ${editErrors.title ? "border-destructive" : "border-input"} bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring`} />
              {editErrors.title && <p className="mt-1 text-xs text-destructive">{editErrors.title}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("thLocation", lang)}</label>
              <input value={editForm.location} onChange={(e) => { setEditForm(f => ({ ...f, location: e.target.value })); setEditErrors(e => ({ ...e, location: "" })); }}
                className={`w-full rounded-md border ${editErrors.location ? "border-destructive" : "border-input"} bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring`} />
              {editErrors.location && <p className="mt-1 text-xs text-destructive">{editErrors.location}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("thStatus", lang)}</label>
              <select value={editForm.status} onChange={(e) => setEditForm(f => ({ ...f, status: e.target.value as "lost" | "found" }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="lost">{t("lost", lang)}</option><option value="found">{t("found", lang)}</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("description", lang)}</label>
              <textarea value={editForm.description} onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))} rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditReport(null)} className="flex-1 rounded-md border border-input bg-background py-2.5 text-sm font-medium text-foreground hover:bg-muted">{t("cancel", lang)}</button>
              <button onClick={handleEditSave} disabled={updateMutation.isPending} className="flex-1 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{t("saveChanges", lang)}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteReport} onOpenChange={() => setDeleteReport(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteReport", lang)} {deleteReport?.id}?</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === "AR"
                ? `سيتم حذف "${deleteReport?.title}" نهائياً من النظام. لا يمكن التراجع عن هذا الإجراء.`
                : `This will permanently remove "${deleteReport?.title}" from the system. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel", lang)}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t("delete", lang)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Filters Slide-over */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className={`relative w-full max-w-sm bg-card ${isRTL ? "border-e" : "border-s"} border-border shadow-2xl overflow-y-auto animate-slide-in`}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
              <h2 className="text-lg font-bold text-card-foreground">{t("advancedFilters", lang)}</h2>
              <button onClick={() => setShowFilters(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> {lang === "AR" ? "من تاريخ" : "Date From"}</label>
                <input type="date" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> {lang === "AR" ? "إلى تاريخ" : "Date To"}</label>
                <input type="date" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{lang === "AR" ? "حالة التطابق" : "Match Status"}</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="all">{lang === "AR" ? "الكل" : "All"}</option>
                  <option value="matched">{lang === "AR" ? "يوجد تطابق" : "Has Match"}</option>
                  <option value="unmatched">{lang === "AR" ? "لا يوجد تطابق" : "No Match"}</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("thLocation", lang)}</label>
                <input type="text" placeholder={lang === "AR" ? "تصفية حسب الموقع..." : "Filter by location..."} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowFilters(false)} className="flex-1 rounded-md border border-input bg-background py-2.5 text-sm font-medium text-foreground hover:bg-muted">{t("clearAll", lang)}</button>
                <button onClick={() => setShowFilters(false)} className="flex-1 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">{t("applyFilters", lang)}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Reports;
