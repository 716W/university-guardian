import re

with open('src/pages/Reports.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove useGetReportById calls and references
text = text.replace('const activeId = viewReport?.id || editReport?.id || 0;', '')
text = text.replace('const { data: detailsData, isLoading: detailsLoading } = useGetReportById(activeId, !!activeId);', '')

# In View Details, restore it to just show viewReport data
view_content_new = '''{viewReport && (
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

# Replace the bulky View Details
text = re.sub(r'\{viewReport && \(\s*<div className="space-y-4 pt-2">.*?</div>\s*\)\}', view_content_new, text, flags=re.DOTALL)

# Now fix the handleEditSave form logic
old_edit_save = '''  const handleEditSave = () => {
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

new_edit_save = '''  const handleEditSave = () => {
    if (!editReport) return;
    const errs: Record<string, string> = {};
    if (!editForm.title.trim()) errs.title = t("titleRequired", lang);
    if (!editForm.location.trim()) errs.location = t("locationRequired", lang);
    if (Object.keys(errs).length > 0) { setEditErrors(errs); return; }
    
    const formData = new FormData();
    
    // Send form values or fallback to previous ones from editReport!
    formData.append('ItemName', editForm.title || editReport.title);
    formData.append('Description', editForm.description || editReport.description);
    
    const newStatus = editForm.status || editReport.status;
    formData.append('ReportType', newStatus === 'lost' ? '1' : '2');
    
    // Required DateReported & LocationId (using default 1 for location if non exist since we don't have it)
    formData.append('DateReported', editReport.date);
    formData.append('LocationId', '1');

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

with open('src/pages/Reports.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
