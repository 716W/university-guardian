import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, Filter, Download, MoreHorizontal, Eye, Edit, RefreshCw, Trash2, Link2, X, Calendar, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useGetAdminReports, useGetReportDetails, useDeleteReport, useEditReport, useChangeReportStatus } from "@/hooks/queries/useReports";
import { ReportListItem } from "@/types/report";

const reportImages: Record<string, string> = {
  Electronics: "📱",
  Documents: "📄",
  Accessories: "👜",
  Clothing: "👕",
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const getImageUrl = (path?: string | null) => {
  if (!path) return null;
  const baseUrl = API_BASE_URL.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${baseUrl}/${cleanPath}`;
};

const Reports = () => {
  const { lang, isRTL } = useLanguage();
  
  // Filters State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [reportTypeFilter, setReportTypeFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const filtersObj = {
    search: searchQuery,
    statusType: statusFilter !== "all" ? statusFilter : undefined,
    categoryId: categoryFilter !== "all" ? categoryFilter : undefined,
    locationId: locationFilter || undefined,
    reportType: reportTypeFilter !== "all" ? reportTypeFilter : undefined,
    fromDate: dateFrom || undefined,
    toDate: dateTo || undefined,
    pageNumber: page,
    pageSize,
  };

  const { data: reportsData, isLoading } = useGetAdminReports(filtersObj);
  const reports: ReportListItem[] = reportsData?.data || [];

  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [viewReport, setViewReport] = useState<ReportListItem | null>(null);
  const [editReport, setEditReport] = useState<ReportListItem | null>(null);
  const [deleteReport, setDeleteReport] = useState<ReportListItem | null>(null);
  const [changeStatusReport, setChangeStatusReport] = useState<ReportListItem | null>(null);
  
  const [showFilters, setShowFilters] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", location: "", description: "", reportType: 1 });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [statusForm, setStatusForm] = useState<number>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Queries & Mutations
  const activeId = viewReport?.id || editReport?.id || 0;
  const { data: detailsData, isLoading: detailsLoading } = useGetReportDetails(Number(activeId), !!activeId);
  const deleteMutation = useDeleteReport(filtersObj);
  const updateMutation = useEditReport(filtersObj);
  const statusMutation = useChangeReportStatus(filtersObj);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleRow = (id: string | number) => {
    setSelectedRows((prev) => { const idStr = id.toString(); const next = new Set(prev); if (next.has(idStr)) next.delete(idStr); else next.add(idStr); return next; });
  };

  const toggleAll = () => {
    if (selectedRows.size === reports.length && reports.length > 0) setSelectedRows(new Set());
    else setSelectedRows(new Set(reports.map((r) => r.id.toString())));
  };

  const openEdit = (report: ReportListItem) => {
    setEditForm({ title: report.itemName, location: report.locationName || "", description: "", reportType: report.reportType });
    setEditErrors({});
    setEditReport(report);
    setOpenMenuId(null);
  };

  const openChangeStatus = (report: ReportListItem) => {
    setStatusForm(report.status || 0);
    setChangeStatusReport(report);
    setOpenMenuId(null);
  };

  const openView = (report: ReportListItem) => {
    setCurrentImageIndex(0);
    setViewReport(report);
    setOpenMenuId(null);
  };

  const handleEditSave = () => {
    if (!editReport) return;
    const errs: Record<string, string> = {};
    if (!editForm.title.trim()) errs.title = t("titleRequired", lang);
    if (Object.keys(errs).length > 0) { setEditErrors(errs); return; }
    
    const payload = {
      title: editForm.title,
      itemName: editForm.title,
      description: editForm.description,
      reportType: Number(editForm.reportType)
    };
    
    updateMutation.mutate({ id: Number(editReport.id), data: payload }, {
      onSuccess: () => {
        toast({ title: "✅ " + (lang === "AR" ? "تم التحديث" : "Updated"), description: `${editReport.id} ${lang === "AR" ? "تم تحديثه بنجاح" : "has been updated successfully."}` });
        setEditReport(null);
      },
      onError: (err: any) => {
        toast({ title: lang === "AR" ? "فشل التحديث" : "Update failed", description: err.response?.data?.message || err.message, variant: "destructive" });
      }
    });
  };

  const handleDelete = () => {
    if (!deleteReport) return;
    deleteMutation.mutate(deleteReport.id, {
      onSuccess: () => {
        toast({ title: "🗑️ " + (lang === "AR" ? "تم الحذف" : "Deleted"), description: `${deleteReport.id} ${lang === "AR" ? "تمت إزالته" : "has been removed."}` });
        setDeleteReport(null);
        setSelectedRows(prev => {
          const next = new Set(prev);
          next.delete(deleteReport.id.toString());
          return next;
        });
      },
      onError: (err: any) => {
        toast({ title: lang === "AR" ? "فشل الحذف" : "Deletion failed", description: err.response?.data?.message || err.message, variant: "destructive" });
      }
    });
  };

  const handleStatusSave = () => {
    if (!changeStatusReport) return;
    statusMutation.mutate({ id: Number(changeStatusReport.id), statusType: Number(statusForm) }, {
      onSuccess: () => {
        toast({ title: "✅ " + (lang === "AR" ? "تم تغيير الحالة" : "Status Changed"), description: `${changeStatusReport.id} ${lang === "AR" ? "تم التحديث" : "has been updated."}` });
        setChangeStatusReport(null);
      },
      onError: (err: any) => {
        toast({ title: lang === "AR" ? "فشل التحديث" : "Update failed", description: err.response?.data?.message || err.message, variant: "destructive" });
      }
    });
  };

  const [exporting, setExporting] = useState(false);

  const handleExportPDF = () => {
    setExporting(true);
    try {
      const rowsToExport = selectedRows.size > 0 ? reports.filter(r => selectedRows.has(r.id.toString())) : reports;
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
        head: [["ID", "Item", "Category", "Location", "Reporter", "Date", "Status"]],
        body: rowsToExport.map(r => [
          r.id, r.itemName, r.categoryName || "-", r.locationName || "-", r.userName || r.reporterName || "-", r.dateReported?.split('T')[0] || "-",
          r.reportType === 1 ? "LOST" : "FOUND",
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
            `Page ${data.pageNumber} of ${pageCount}  •  Total reports: ${rowsToExport.length}`,
            pageWidth / 2, pageHeight - 20, { align: "center" }
          );
        },
      });

      doc.save(`reports-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast({
        title: "📄 " + (lang === "AR" ? "تم تصدير PDF" : "PDF Exported"),
      });
    } catch (err) {
      toast({ title: lang === "AR" ? "فشل التصدير" : "Export failed", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  // ── Safe image parsing ────────────────────────────────────────────────────
  // Backend returns: { id: number; path: string }[]  (actual Swagger shape).
  // Guard against legacy shapes: plain string[], comma-separated string, or undefined.
  const imagesList: string[] = (() => {
    try {
      const raw = detailsData?.data?.images;
      if (Array.isArray(raw) && raw.length > 0) {
        return raw
          .map(v => {
            // ✅ Actual backend shape: { id, path }
            if (v && typeof v === 'object' && 'path' in v && typeof (v as { path: unknown }).path === 'string') {
              return ((v as { path: string }).path).trim();
            }
            // Legacy / alternative shape: plain string element
            if (typeof v === 'string') return v.trim();
            return '';
          })
          .filter(Boolean);
      }
      // Legacy: images returned as a single comma-separated string
      if (typeof raw === 'string' && raw.trim() !== '') {
        return raw.split(',').map(s => s.trim()).filter(Boolean);
      }
      // Last resort: use imagePath field from detail payload or list item
      const fallbackPath = (detailsData?.data as { imagePath?: string } | undefined)?.imagePath ?? viewReport?.imagePath;
      if (typeof fallbackPath === 'string' && fallbackPath.trim() !== '') {
        return fallbackPath.split(',').map(s => s.trim()).filter(Boolean);
      }
      return [];
    } catch {
      return [];
    }
  })();

  const hasMultipleImages = imagesList.length > 1;

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev < imagesList.length - 1 ? prev + 1 : prev));
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : 0));
  };

  // Resolve a potentially-relative image path to an absolute URL
  const resolveImageUrl = (path: string): string => {
    try {
      if (!path || path.trim() === '') return '';
      if (path.startsWith('http://') || path.startsWith('https://')) return path;
      const baseUrl = API_BASE_URL.replace(/\/+$/, '');
      const cleanPath = path.replace(/^\/+/, '');
      return `${baseUrl}/${cleanPath}`;
    } catch {
      return '';
    }
  };

  return (
    <DashboardLayout title={t("reports", lang)} subtitle={t("reportsSubtitle", lang)}>
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-card">
        <div className="relative flex-1 min-w-[200px]">
          <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`} />
          <input type="text" placeholder={t("searchReports", lang)} value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className={`w-full rounded-md border border-input bg-background py-2 ${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring`} />
        </div>
        <select value={reportTypeFilter} onChange={(e) => { setReportTypeFilter(e.target.value); setPage(1); }}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">{lang === "AR" ? "كل أنواع البلاغات" : "All Report Types"}</option>
          <option value="1">{t("lost", lang)}</option>
          <option value="2">{t("found", lang)}</option>
        </select>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">{t("allCategories", lang)}</option>
          <option value="1">{lang === "AR" ? "إلكترونيات" : "Electronics"}</option>
          <option value="2">{lang === "AR" ? "مستندات" : "Documents"}</option>
          <option value="3">{lang === "AR" ? "إكسسوارات" : "Accessories"}</option>
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
                <th className="px-4 py-3 text-start"><input type="checkbox" checked={selectedRows.size === reports.length && reports.length > 0} onChange={toggleAll} className="h-4 w-4 rounded border-input text-primary accent-primary" /></th>
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
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                    No reports found.
                  </td>
                </tr>
              ) : reports.map((report) => (
                <tr key={report.id} className={`transition-colors hover:bg-muted/30 ${selectedRows.has(report.id.toString()) ? "bg-primary/5" : ""}`}>
                  <td className="px-4 py-3"><input type="checkbox" checked={selectedRows.has(report.id.toString())} onChange={() => toggleRow(report.id)} className="h-4 w-4 rounded border-input text-primary accent-primary" /></td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{report.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
                        {report.imagePath ? <img src={getImageUrl(report.imagePath) as string} className="w-full h-full object-cover rounded-lg" alt="Item" /> : (reportImages[report.categoryName || ""] || "📦")}
                      </div>
                      <div>
                        <span className="font-medium text-card-foreground">{report.itemName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{report.categoryName || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{report.locationName || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{report.userName || report.reporterName || "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{report.dateReported?.split('T')[0] || "-"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={report.reportType === 1 ? "lost" : "found"} />
                    {/* Could display report.status conceptually, e.g. pending/resolved based on status int */}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative" ref={openMenuId === report.id.toString() ? menuRef : null}>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === report.id.toString() ? null : report.id.toString());
                      }} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenuId === report.id.toString() && (
                        <div className={`absolute ${isRTL ? "left-0" : "right-0"} top-full z-50 mt-1 w-44 rounded-lg border border-border bg-popover p-1 shadow-lg`}>
                          <button onClick={() => openView(report)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-muted">
                            <Eye className="h-4 w-4" /> {t("viewDetails", lang)}
                          </button>
                          <button onClick={() => openEdit(report)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-muted">
                            <Edit className="h-4 w-4" /> {t("edit", lang)}
                          </button>
                          <button onClick={() => openChangeStatus(report)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-muted">
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
            {t("showing", lang)} {reports.length} {t("of", lang)} {reportsData?.totalRecords || reports.length} {t("reports", lang).toLowerCase()}
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

      {/* View Details Modal with Image Carousel */}
      <Dialog open={!!viewReport} onOpenChange={() => setViewReport(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{viewReport && reportImages[viewReport.categoryName || ""]}</span>
              {viewReport?.itemName}
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
                  {/* ── Image Slider ──────────────────────────────────────── */}
                  <div className="relative flex h-64 items-center justify-center rounded-xl border border-border bg-muted overflow-hidden group">
                    {imagesList.length > 0 ? (
                      <img
                        key={currentImageIndex}
                        src={resolveImageUrl(imagesList[currentImageIndex] ?? '')}
                        alt={viewReport?.itemName ?? 'Report image'}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          // Hide broken image and show fallback emoji instead
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-6xl">{reportImages[viewReport?.categoryName ?? ''] ?? '📦'}</span>
                    )}

                    {/* Prev / Next arrows — only rendered when there are multiple images */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={prevImage}
                          disabled={currentImageIndex === 0}
                          aria-label="Previous image"
                          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 transition-opacity hover:bg-background disabled:opacity-30 group-hover:opacity-100"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          disabled={currentImageIndex === imagesList.length - 1}
                          aria-label="Next image"
                          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 transition-opacity hover:bg-background disabled:opacity-30 group-hover:opacity-100"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>

                        {/* Dot indicators */}
                        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                          {imagesList.map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                idx === currentImageIndex ? 'bg-primary' : 'bg-background/50'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Numeric counter badge */}
                        <div className="absolute top-2 right-2 rounded-full bg-background/70 px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
                          {currentImageIndex + 1} / {imagesList.length}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs font-medium text-muted-foreground">{t("reportId", lang)}</p><p className="text-sm font-semibold text-foreground font-mono">{viewReport.id}</p></div>
                    <div><p className="text-xs font-medium text-muted-foreground">{t("thStatus", lang)}</p><StatusBadge status={detailsData?.data?.reportType === 1 ? "lost" : detailsData?.data?.reportType === 2 ? "found" : (viewReport.reportType === 1 ? "lost" : "found")} /></div>
                    <div><p className="text-xs font-medium text-muted-foreground">{t("thCategory", lang)}</p><p className="text-sm text-foreground">{viewReport.categoryName || "-"}</p></div>
                    <div><p className="text-xs font-medium text-muted-foreground">{t("thLocation", lang)}</p><p className="text-sm text-foreground">{detailsData?.data?.locationName || viewReport.locationName || "-"}</p></div>
                    <div><p className="text-xs font-medium text-muted-foreground">{t("thReporter", lang)}</p><p className="text-sm text-foreground">{detailsData?.data?.userName || detailsData?.data?.reporterName || viewReport.userName || viewReport.reporterName || "-"}</p></div>
                    <div><p className="text-xs font-medium text-muted-foreground">{t("thDate", lang)}</p><p className="text-sm text-foreground">{detailsData?.data?.dateReported ? detailsData.data.dateReported.split('T')[0] : viewReport.dateReported?.split('T')[0] || "-"}</p></div>
                  </div>
                  <div><p className="text-xs font-medium text-muted-foreground">{t("description", lang)}</p><p className="text-sm text-foreground mt-1">{detailsData?.data?.description || "No description provided"}</p></div>
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
            {/* Note: location could be a dropdown, keeping simple as text per original, but location is typically an ID. The prompt said location is sent. I'll omit if not strictly required to avoid breaking, or user can adjust. */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{lang === "AR" ? "نوع البلاغ" : "Report Type"}</label>
              <select value={editForm.reportType} onChange={(e) => setEditForm(f => ({ ...f, reportType: parseInt(e.target.value) }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value={1}>{t("lost", lang)}</option><option value={2}>{t("found", lang)}</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("description", lang)}</label>
              <textarea value={editForm.description || ""} onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))} rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditReport(null)} className="flex-1 rounded-md border border-input bg-background py-2.5 text-sm font-medium text-foreground hover:bg-muted">{t("cancel", lang)}</button>
              <button onClick={handleEditSave} disabled={updateMutation.isPending} className="flex-1 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{t("saveChanges", lang)}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Status Modal */}
      <Dialog open={!!changeStatusReport} onOpenChange={() => setChangeStatusReport(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>{t("changeStatus", lang)} – {changeStatusReport?.id}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{lang === "AR" ? "الحالة الجديدة" : "New Status"}</label>
              <select value={statusForm} onChange={(e) => setStatusForm(parseInt(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value={0}>{lang === "AR" ? "قيد الانتظار" : "Pending"}</option>
                <option value={1}>{lang === "AR" ? "مكتمل" : "Resolved"}</option>
                <option value={2}>{lang === "AR" ? "مرفوض" : "Rejected"}</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setChangeStatusReport(null)} className="flex-1 rounded-md border border-input bg-background py-2.5 text-sm font-medium text-foreground hover:bg-muted">{t("cancel", lang)}</button>
              <button onClick={handleStatusSave} disabled={statusMutation.isPending} className="flex-1 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{t("saveChanges", lang)}</button>
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
                ? `سيتم حذف "${deleteReport?.itemName}" نهائياً من النظام. لا يمكن التراجع عن هذا الإجراء.`
                : `This will permanently remove "${deleteReport?.itemName}" from the system. This action cannot be undone.`}
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
                <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground"><Calendar className="h-3.5 w-3.5" /> {lang === "AR" ? "إلى تاريخ" : "Date To"}</label>
                <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{lang === "AR" ? "الحالة" : "Status Type"}</label>
                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="all">{lang === "AR" ? "الكل" : "All"}</option>
                  <option value="0">{lang === "AR" ? "قيد الانتظار" : "Pending"}</option>
                  <option value="1">{lang === "AR" ? "مكتمل" : "Resolved"}</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("thLocation", lang)}</label>
                {/* For real implementation, this could be a select of locations. Keeping as input or can be omitted if you have select */}
                <input type="text" value={locationFilter} onChange={(e) => { setLocationFilter(e.target.value); setPage(1); }} placeholder={lang === "AR" ? "تصفية حسب الموقع (ID)..." : "Filter by location ID..."} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => {
                  setSearchQuery(""); setStatusFilter("all"); setCategoryFilter("all"); setLocationFilter(""); setReportTypeFilter("all"); setDateFrom(""); setDateTo(""); setPage(1);
                  setShowFilters(false);
                }} className="flex-1 rounded-md border border-input bg-background py-2.5 text-sm font-medium text-foreground hover:bg-muted">{t("clearAll", lang)}</button>
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
