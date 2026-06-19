import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useLanguage } from "@/hooks/use-language";
import { t, type TranslationKey } from "@/lib/i18n";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  useGetColleges, useCreateCollege, useUpdateCollege, useDeleteCollege,
  useGetDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment,
  useGetLocations, useCreateLocation, useUpdateLocation, useDeleteLocation,
  useGetCategories, useCreateCategory, useUpdateCategory, useDeleteCategory
} from "@/hooks/queries/useMasterData";
import type { College, Department, Location, Category } from "@/types/masterData";

type TabKey = "colleges" | "departments" | "locations" | "categories";

const tabMeta: Record<TabKey, { labelKey: TranslationKey; singularEN: string; singularAR: string }> = {
  colleges: { labelKey: "colleges", singularEN: "College", singularAR: "كلية" },
  departments: { labelKey: "departments", singularEN: "Department", singularAR: "قسم" },
  locations: { labelKey: "locations", singularEN: "Location", singularAR: "موقع" },
  categories: { labelKey: "categories", singularEN: "Category", singularAR: "فئة" },
};

const MasterData = () => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>("colleges");

  // Queries
  const { data: collegesRes, isLoading: isLoadingColleges } = useGetColleges();
  const { data: departmentsRes, isLoading: isLoadingDepartments } = useGetDepartments();
  const { data: locationsRes, isLoading: isLoadingLocations } = useGetLocations();
  const { data: categoriesRes, isLoading: isLoadingCategories } = useGetCategories();

  // Mutations
  const createCollege = useCreateCollege();
  const updateCollege = useUpdateCollege();
  const deleteCollege = useDeleteCollege();

  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

  const createLocation = useCreateLocation();
  const updateLocation = useUpdateLocation();
  const deleteLocation = useDeleteLocation();

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  
  // Selected Item for edit/delete
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form state
  const [inputValue, setInputValue] = useState("");
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [inputError, setInputError] = useState(false);
  const [relationError, setRelationError] = useState(false);

  const meta = tabMeta[activeTab];
  const singular = lang === "AR" ? meta.singularAR : meta.singularEN;

  const items = useMemo(() => {
    switch (activeTab) {
      case "colleges": return collegesRes?.data || [];
      case "departments": return departmentsRes?.data || [];
      case "locations": return locationsRes?.data || [];
      case "categories": return categoriesRes?.data || [];
      default: return [];
    }
  }, [activeTab, collegesRes, departmentsRes, locationsRes, categoriesRes]);

  const isLoading = isLoadingColleges || isLoadingDepartments || isLoadingLocations || isLoadingCategories;

  const openAdd = () => {
    setInputValue("");
    setSelectedCollegeId("");
    setSelectedDepartmentId("");
    setInputError(false);
    setRelationError(false);
    setAddOpen(true);
  };

  const openEdit = (item: any) => {
    setSelectedItem(item);
    setInputValue(item.name || "");
    const cId = item.universityId || item.collegeId || item.college?.id;
    const dId = item.departmentId || item.department?.id;
    setSelectedCollegeId(cId ? cId.toString() : "");
    setSelectedDepartmentId(dId ? dId.toString() : "");
    setInputError(false);
    setRelationError(false);
    setEditOpen(true);
  };

  const openDelete = (item: any) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleAdd = async () => {
    if (!inputValue.trim()) { setInputError(true); return; }
    
    try {
      if (activeTab === "colleges") {
        await createCollege.mutateAsync({ name: inputValue.trim() });
      } else if (activeTab === "departments") {
        if (!selectedCollegeId) { setRelationError(true); return; }
        await createDepartment.mutateAsync({ name: inputValue.trim(), universityId: Number(selectedCollegeId) });
      } else if (activeTab === "locations") {
        if (!selectedDepartmentId) { setRelationError(true); return; }
        await createLocation.mutateAsync({ name: inputValue.trim(), locationType: 1, departmentId: Number(selectedDepartmentId) });
      } else if (activeTab === "categories") {
        await createCategory.mutateAsync({ name: inputValue.trim() });
      }
      
      setAddOpen(false);
      toast({ title: "✅ " + (lang === "AR" ? "تمت الإضافة بنجاح" : "Item Added"), description: `"${inputValue.trim()}" ${lang === "AR" ? "تمت إضافته بنجاح" : "added successfully"}.` });
    } catch (e: any) {
      console.error(e);
      toast({ 
        title: lang === "AR" ? "خطأ" : "Error", 
        description: e.response?.data?.message || e.message || "Operation failed", 
        variant: "destructive" 
      });
    }
  };

  const handleEdit = async () => {
    if (!inputValue.trim() || !selectedItem?.id) { setInputError(true); return; }
    
    try {
      if (activeTab === "colleges") {
        await updateCollege.mutateAsync({ id: selectedItem.id, payload: { name: inputValue.trim() } });
      } else if (activeTab === "departments") {
        if (!selectedCollegeId) { setRelationError(true); return; }
        await updateDepartment.mutateAsync({ id: selectedItem.id, payload: { name: inputValue.trim(), universityId: Number(selectedCollegeId) } });
      } else if (activeTab === "locations") {
        if (!selectedDepartmentId) { setRelationError(true); return; }
        await updateLocation.mutateAsync({ id: selectedItem.id, payload: { name: inputValue.trim(), locationType: 1, departmentId: Number(selectedDepartmentId) } });
      } else if (activeTab === "categories") {
        await updateCategory.mutateAsync({ id: selectedItem.id, payload: { name: inputValue.trim() } });
      }
      
      setEditOpen(false);
      toast({ title: "✅ " + (lang === "AR" ? "تم التحديث بنجاح" : "Item Updated"), description: `"${inputValue.trim()}" ${lang === "AR" ? "تم تحديثه بنجاح" : "has been updated successfully."}` });
    } catch (e: any) {
      console.error(e);
      toast({ 
        title: lang === "AR" ? "خطأ" : "Error", 
        description: e.response?.data?.message || e.message || "Operation failed", 
        variant: "destructive" 
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedItem?.id) return;
    
    try {
      if (activeTab === "colleges") {
        await deleteCollege.mutateAsync(selectedItem.id);
      } else if (activeTab === "departments") {
        await deleteDepartment.mutateAsync(selectedItem.id);
      } else if (activeTab === "locations") {
        await deleteLocation.mutateAsync(selectedItem.id);
      } else if (activeTab === "categories") {
        await deleteCategory.mutateAsync(selectedItem.id);
      }

      setDeleteOpen(false);
      toast({ title: "🗑️ " + (lang === "AR" ? "تم الحذف" : "Item Deleted"), description: `"${selectedItem.name}" ${lang === "AR" ? "تمت إزالته من النظام" : "has been removed from the system."}` });
    } catch (e: any) {
      console.error(e);
      toast({ 
        title: lang === "AR" ? "خطأ" : "Error", 
        description: e.response?.data?.message || e.message || "Operation failed", 
        variant: "destructive" 
      });
    }
  };

  const renderRelationInput = () => {
    if (activeTab === "departments") {
      return (
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {lang === "AR" ? "الكلية" : "College"}
          </label>
          <Select value={selectedCollegeId} onValueChange={(val) => { setSelectedCollegeId(val); setRelationError(false); }}>
            <SelectTrigger className={`w-full ${relationError ? "border-destructive" : ""}`}>
              <SelectValue placeholder={lang === "AR" ? "اختر الكلية..." : "Select College..."} />
            </SelectTrigger>
            <SelectContent>
              {collegesRes?.data?.map((college) => (
                <SelectItem key={college.id} value={college.id.toString()}>
                  {college.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {relationError && <p className="mt-1 text-xs text-destructive">{lang === "AR" ? "هذا الحقل مطلوب" : "This field is required"}</p>}
        </div>
      );
    }
    if (activeTab === "locations") {
      return (
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            {lang === "AR" ? "القسم" : "Department"}
          </label>
          <Select value={selectedDepartmentId} onValueChange={(val) => { setSelectedDepartmentId(val); setRelationError(false); }}>
            <SelectTrigger className={`w-full ${relationError ? "border-destructive" : ""}`}>
              <SelectValue placeholder={lang === "AR" ? "اختر القسم..." : "Select Department..."} />
            </SelectTrigger>
            <SelectContent>
              {departmentsRes?.data?.map((dept) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {relationError && <p className="mt-1 text-xs text-destructive">{lang === "AR" ? "هذا الحقل مطلوب" : "This field is required"}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout title={t("masterData", lang)} subtitle={t("masterDataSubtitle", lang)}>
      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-card p-1 shadow-card overflow-x-auto whitespace-nowrap">
        {(Object.keys(tabMeta) as TabKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 min-w-[120px] rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {t(tabMeta[key].labelKey, lang)}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-4 rounded-lg border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-card-foreground">
            {t(meta.labelKey, lang)} ({items.length})
          </h3>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> {t("addNew", lang)}
          </button>
        </div>
        <div className="divide-y divide-border min-h-[200px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
               <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <p>{lang === "AR" ? "لا توجد بيانات" : "No data available"}</p>
             </div>
          ) : (
            items.map((item: any, index: number) => (
              <div key={item.id || index} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">{index + 1}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-card-foreground">{item.name}</span>
                    {activeTab === "departments" && (item.universityId || item.collegeId || item.college?.id) && (
                       <span className="text-xs text-muted-foreground">
                          {lang === "AR" ? "الكلية" : "College"}: {item.universityName || item.college?.name || collegesRes?.data?.find(c => c.id.toString() === (item.universityId || item.collegeId || item.college?.id)?.toString())?.name || (item.universityId || item.collegeId || item.college?.id)}
                       </span>
                    )}
                    {activeTab === "locations" && (item.departmentId || item.department?.id) && (
                       <span className="text-xs text-muted-foreground">
                          {lang === "AR" ? "القسم" : "Department"}: {item.departmentName || item.department?.name || departmentsRes?.data?.find(d => d.id.toString() === (item.departmentId || item.department?.id)?.toString())?.name || (item.departmentId || item.department?.id)}
                       </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(item)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => openDelete(item)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {lang === "AR" ? `إضافة ${singular} جديد` : `Add New ${singular}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {lang === "AR" ? `اسم ${singular}` : `${singular} Name`}
              </label>
              <input
                autoFocus
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); setInputError(false); }}
                placeholder={lang === "AR" ? `أدخل اسم ${singular}...` : `Enter ${singular.toLowerCase()} name...`}
                className={`w-full rounded-md border ${inputError ? "border-destructive" : "border-input"} bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring`}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              {inputError && <p className="mt-1 text-xs text-destructive">{lang === "AR" ? "هذا الحقل مطلوب" : "This field is required"}</p>}
            </div>
            {renderRelationInput()}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setAddOpen(false)} className="flex-1 rounded-md border border-input bg-background py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                {t("cancel", lang)}
              </button>
              <button 
                onClick={handleAdd} 
                disabled={createCollege.isPending || createDepartment.isPending || createLocation.isPending || createCategory.isPending}
                className="flex-1 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {t("save", lang)}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {lang === "AR" ? `تعديل ${singular}` : `Edit ${singular}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                {lang === "AR" ? `اسم ${singular}` : `${singular} Name`}
              </label>
              <input
                autoFocus
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); setInputError(false); }}
                className={`w-full rounded-md border ${inputError ? "border-destructive" : "border-input"} bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring`}
                onKeyDown={(e) => e.key === "Enter" && handleEdit()}
              />
              {inputError && <p className="mt-1 text-xs text-destructive">{lang === "AR" ? "هذا الحقل مطلوب" : "This field is required"}</p>}
            </div>
            {renderRelationInput()}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditOpen(false)} className="flex-1 rounded-md border border-input bg-background py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                {t("cancel", lang)}
              </button>
              <button 
                onClick={handleEdit} 
                disabled={updateCollege.isPending || updateDepartment.isPending || updateLocation.isPending || updateCategory.isPending}
                className="flex-1 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {t("saveChanges", lang)}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {lang === "AR" ? `حذف هذا ${singular}؟` : `Delete this ${singular}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedItem && (
                lang === "AR"
                  ? `سيتم حذف "${selectedItem.name}" نهائياً. قد يكون مرتبطاً ببيانات أخرى في النظام.`
                  : `"${selectedItem.name}" will be permanently removed. It might be linked to other data in the system.`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel", lang)}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={deleteCollege.isPending || deleteDepartment.isPending || deleteLocation.isPending || deleteCategory.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
            >
              {t("delete", lang)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default MasterData;
