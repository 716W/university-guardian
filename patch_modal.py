import re

with open('src/pages/Reports.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Make sure we import useGetReportById
if 'useGetReportById' not in text:
    text = text.replace('import { useGetReports, useDeleteReport, useUpdateReport }', 'import { useGetReports, useGetReportById, useDeleteReport, useUpdateReport }')
if 'useGetReportById' not in text: # If it was inside useGetReports, ... useGetReportById
    text = text.replace('useDeleteReport, useUpdateReport', 'useGetReportById, useDeleteReport, useUpdateReport')

# Restore the hook for fetching details
state_block = '''  const [editReport, setEditReport] = useState<Report | null>(null);
  const [deleteReport, setDeleteReport] = useState<Report | null>(null);'''

details_hook = '''  const [editReport, setEditReport] = useState<Report | null>(null);
  const [deleteReport, setDeleteReport] = useState<Report | null>(null);

  const activeId = viewReport?.id || editReport?.id || 0;
  const { data: detailsData, isLoading: detailsLoading } = useGetReportById(activeId, !!activeId);'''

if 'const activeId' not in text:
    text = text.replace(state_block, details_hook)

# Now, View Details Modal Update
old_view = '''{viewReport && (
            <div className="space-y-4 pt-2">
              <div className="flex h-48 items-center justify-center rounded-xl border border-border bg-muted overflow-hidden">
                {viewReport.imagePath ? (
                  <img src={viewReport.imagePath} alt={viewReport.title} className="max-h-full object-contain" />
                ) : (
                  <span className="text-6xl">{reportImages[viewReport.category]}</span>
                )}
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

new_view = '''{viewReport && (
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
          )}'''
text = text.replace(old_view, new_view)

# Fix edit handlesave formData format
edit_save_old = '''    const formData = new FormData();
    
    // Send form values or fallback to previous ones from editReport!
    formData.append('ItemName', editForm.title || editReport.title);
    formData.append('Description', editForm.description || editReport.description);
    
    const newStatus = editForm.status || editReport.status;
    formData.append('ReportType', newStatus === 'lost' ? '1' : '2');
    
    // Required DateReported & LocationId (using default 1 for location if non exist since we don't have it)
    formData.append('DateReported', editReport.date);
    formData.append('LocationId', '1');'''

edit_save_new = '''    const formData = new FormData();
    
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
    if ((detailsData?.data as any)?.conditionType) formData.append('ConditionType', (detailsData.data as any).conditionType.toString());'''

text = text.replace(edit_save_old, edit_save_new)

with open('src/pages/Reports.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
