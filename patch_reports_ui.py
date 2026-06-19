import re

with open('src/pages/Reports.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add imports for new hooks
text = text.replace('import { useGetReports } from "@/hooks/queries/useReports";', 
'''import { useGetReports, useGetReportById, useDeleteReport, useUpdateReport } from "@/hooks/queries/useReports";''')

# Update component state
old_state = '''  const [viewReport, setViewReport] = useState<Report | null>(null);
  const [editReport, setEditReport] = useState<Report | null>(null);
  const [deleteReport, setDeleteReport] = useState<Report | null>(null);'''

new_state = '''  const [viewReport, setViewReport] = useState<Report | null>(null);
  const [editReport, setEditReport] = useState<Report | null>(null);
  const [deleteReport, setDeleteReport] = useState<Report | null>(null);

  const activeId = viewReport?.id || editReport?.id || 0;
  const { data: detailsData, isLoading: detailsLoading } = useGetReportById(activeId, !!activeId);
  const deleteMutation = useDeleteReport();
  const updateMutation = useUpdateReport();'''

text = text.replace(old_state, new_state)

# Replace handleDelete
old_delete = '''  const handleDelete = () => {
    toast({ title: "🗑️ " + (lang === "AR" ? "تم حذف البلاغ" : "Report Deleted"), description: `${deleteReport?.id} ${lang === "AR" ? "تمت إزالته" : "has been removed."}` });
    setDeleteReport(null);
  };'''

new_delete = '''  const handleDelete = () => {
    if (!deleteReport) return;
    deleteMutation.mutate(deleteReport.id, {
      onSuccess: () => {
        toast({ title: "🗑️ " + (lang === "AR" ? "تم حذف البلاغ" : "Report Deleted"), description: `${deleteReport.id} ${lang === "AR" ? "تمت إزالته" : "has been removed."}` });
        setDeleteReport(null);
      },
      onError: () => {
        toast({ title: lang === "AR" ? "فشل الحذف" : "Deletion failed", variant: "destructive" });
      }
    });
  };'''
text = text.replace(old_delete, new_delete)

# Update handleEditSave
old_edit_save = '''  const handleEditSave = () => {
    const errs: Record<string, string> = {};
    if (!editForm.title.trim()) errs.title = t("titleRequired", lang);
    if (!editForm.location.trim()) errs.location = t("locationRequired", lang);
    if (Object.keys(errs).length > 0) { setEditErrors(errs); return; }
    toast({ title: "✅ " + (lang === "AR" ? "تم تحديث البلاغ" : "Report Updated"), description: `${editReport?.id} ${lang === "AR" ? "تم تحديثه بنجاح" : "has been updated successfully."}` });
    setEditReport(null);
  };'''

new_edit_save = '''  const handleEditSave = () => {
    if (!editReport) return;
    const errs: Record<string, string> = {};
    if (!editForm.title.trim()) errs.title = t("titleRequired", lang);
    if (!editForm.location.trim()) errs.location = t("locationRequired", lang);
    if (Object.keys(errs).length > 0) { setEditErrors(errs); return; }
    
    // We send FormData based on what we have, using detailsData to fallback if needed
    const formData = new FormData();
    formData.append('ItemName', editForm.title);
    formData.append('Description', editForm.description || detailsData?.data?.description || editReport.description || '');
    formData.append('ReportType', editForm.status === 'lost' ? '1' : '2');
    
    // Fallback values since UI does not have these fields
    // Assuming ConditionType, LocationId, etc. come from detailsData or are just kept the same
    
    // As per user specification, "if it not enter any value u send the previous value"
    if (detailsData?.data) {
        if ((detailsData.data as any).color) formData.append('Color', (detailsData.data as any).color);
        if ((detailsData.data as any).conditionType) formData.append('ConditionType', (detailsData.data as any).conditionType.toString());
        formData.append('LocationId', (detailsData.data as any).locationId || '1');
        formData.append('DateReported', (detailsData.data as any).dateReported || editReport.date);
    } else {
        formData.append('LocationId', '1'); // Dummy or default ID
        formData.append('DateReported', new Date().toISOString());
    }

    updateMutation.mutate({ id: editReport.id, formData }, {
      onSuccess: () => {
        toast({ title: "✅ " + (lang === "AR" ? "تم تحديث البلاغ" : "Report Updated"), description: `${editReport.id} ${lang === "AR" ? "تم تحديثه بنجاح" : "has been updated successfully."}` });
        setEditReport(null);
      },
      onError: () => {
        toast({ title: lang === "AR" ? "فشل التحديث" : "Update failed", variant: "destructive" });
      }
    });
  };'''
text = text.replace(old_edit_save, new_edit_save)

# Update View Details Modal UI to use detailsData where appropriate
# Replacing inside DialogContent for View Details
old_view_content = '''{viewReport && (
            <div className="space-y-4 pt-2">
              <div className="flex h-48 items-center justify-center rounded-xl border border-border bg-muted">
                <span className="text-6xl">{reportImages[viewReport.category]}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs font-medium text-muted-foreground">{t("reportId", lang)}</p><p className="text-sm font-semibold text-foreground font-mono">{viewReport.id}</p></div>
                <div><p className="text-xs font-medium text-muted-foreground">{t("thStatus", lang)}</p><StatusBadge status={viewReport.status} /></div>
                <div><p className="text-xs font-medium text-muted-foreground">{t("thCategory", lang)}</p><p className="text-sm text-foreground">{viewReport.category}</p></div>
                <div><p className="text-xs font-medium text-muted-foreground">{t("thLocation", lang)}</p><p className="text-sm text-foreground">{viewReport.location}</p></div>
                <div><p className="text-xs font-medium text-muted-foreground">{t("thReporter", lang)}</p><p className="text-sm text-foreground">{viewReport.reporter}</p></div>
                <div><p className="text-xs font-medium text-muted-foreground">{t("thDate", lang)}</p><p className="text-sm text-foreground">{viewReport.date}</p></div>
              </div>
              <div><p className="text-xs font-medium text-muted-foreground">{t("description", lang)}</p><p className="text-sm text-foreground mt-1">{viewReport.description}</p></div>
              {viewReport.hasMatch && (
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary">
                  <Link2 className="h-4 w-4" /> {t("potentialMatch", lang)}
                </div>
              )}
            </div>
          )}'''

new_view_content = '''{viewReport && (
            <div className="space-y-4 pt-2">
              {detailsLoading ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex h-48 items-center justify-center rounded-xl border border-border bg-muted overflow-hidden">
                    {detailsData?.data?.images?.[0]?.path ? (
                      <img src={detailsData.data.images[0].path} alt={viewReport.title} className="max-h-full object-contain" />
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
                    <div><p className="text-xs font-medium text-muted-foreground">{t("thDate", lang)}</p><p className="text-sm text-foreground">{detailsData?.data?.dateReported ? new Date(detailsData.data.dateReported).toLocaleDateString() : viewReport.date}</p></div>
                  </div>
                  <div><p className="text-xs font-medium text-muted-foreground">{t("description", lang)}</p><p className="text-sm text-foreground mt-1">{detailsData?.data?.description || viewReport.description}</p></div>
                  {viewReport.hasMatch && (
                    <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary">
                      <Link2 className="h-4 w-4" /> {t("potentialMatch", lang)}
                    </div>
                  )}
                </>
              )}
            </div>
          )}'''
text = text.replace(old_view_content, new_view_content)

# Disable Save button while mutating
text = text.replace('onClick={handleEditSave} className="flex-1 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"',
'onClick={handleEditSave} disabled={updateMutation.isPending} className="flex-1 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"')

text = text.replace('<AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">',
'<AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">')

with open('src/pages/Reports.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
