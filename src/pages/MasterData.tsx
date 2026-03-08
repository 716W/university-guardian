import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { t, type TranslationKey } from "@/lib/i18n";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

type TabKey = "colleges" | "departments" | "locations" | "categories";

const initialData: Record<TabKey, string[]> = {
  colleges: ["College of Engineering", "College of Medicine", "College of Computer Science & IT", "College of Business Administration", "College of Law", "College of Architecture", "College of Pharmacy", "College of Education"],
  departments: ["Computer Engineering", "Civil Engineering", "Electrical Engineering", "Business Administration", "Accounting", "General Medicine", "Pharmacy", "Architecture & Design"],
  locations: ["Engineering Faculty – Ground Floor", "Main Library", "IT Lab 1", "IT Lab 2", "IT Lab 3", "Cafeteria", "Student Center", "Parking Lot A", "Parking Lot B", "Lecture Hall A1", "Lecture Hall A2", "Admin Building", "Medical Faculty"],
  categories: ["Electronics", "Documents & IDs", "Accessories", "Clothing", "Books & Stationery", "Keys", "Bags & Wallets", "Other"],
};

const tabMeta: Record<TabKey, { labelKey: TranslationKey; singularEN: string; singularAR: string }> = {
  colleges: { labelKey: "colleges", singularEN: "College", singularAR: "كلية" },
  departments: { labelKey: "departments", singularEN: "Department", singularAR: "قسم" },
  locations: { labelKey: "locations", singularEN: "Location", singularAR: "موقع" },
  categories: { labelKey: "categories", singularEN: "Category", singularAR: "فئة" },
};

const MasterData = () => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>("colleges");
  const [data, setData] = useState(initialData);

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(false);

  const meta = tabMeta[activeTab];
  const singular = lang === "AR" ? meta.singularAR : meta.singularEN;
  const items = data[activeTab];

  const openAdd = () => {
    setInputValue("");
    setInputError(false);
    setAddOpen(true);
  };

  const openEdit = (index: number) => {
    setEditIndex(index);
    setInputValue(items[index]);
    setInputError(false);
    setEditOpen(true);
  };

  const openDelete = (index: number) => {
    setDeleteIndex(index);
    setDeleteOpen(true);
  };

  const handleAdd = () => {
    if (!inputValue.trim()) { setInputError(true); return; }
    setData((prev) => ({ ...prev, [activeTab]: [...prev[activeTab], inputValue.trim()] }));
    setAddOpen(false);
    toast({ title: "✅ " + (lang === "AR" ? "تمت الإضافة بنجاح" : "Item Added"), description: `"${inputValue.trim()}" ${lang === "AR" ? "تمت إضافته إلى" : "added to"} ${t(meta.labelKey, lang)}.` });
  };

  const handleEdit = () => {
    if (!inputValue.trim() || editIndex === null) { setInputError(true); return; }
    setData((prev) => {
      const updated = [...prev[activeTab]];
      updated[editIndex] = inputValue.trim();
      return { ...prev, [activeTab]: updated };
    });
    setEditOpen(false);
    toast({ title: "✅ " + (lang === "AR" ? "تم التحديث بنجاح" : "Item Updated"), description: `"${inputValue.trim()}" ${lang === "AR" ? "تم تحديثه بنجاح" : "has been updated successfully."}` });
  };

  const handleDelete = () => {
    if (deleteIndex === null) return;
    const name = items[deleteIndex];
    setData((prev) => ({ ...prev, [activeTab]: prev[activeTab].filter((_, i) => i !== deleteIndex) }));
    setDeleteOpen(false);
    toast({ title: "🗑️ " + (lang === "AR" ? "تم الحذف" : "Item Deleted"), description: `"${name}" ${lang === "AR" ? "تمت إزالته من النظام" : "has been removed from the system."}` });
  };

  return (
    <DashboardLayout title={t("masterData", lang)} subtitle={t("masterDataSubtitle", lang)}>
      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-card p-1 shadow-card">
        {(Object.keys(tabMeta) as TabKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
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
        <div className="divide-y divide-border">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">{index + 1}</span>
                <span className="text-sm text-card-foreground">{item}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(index)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => openDelete(index)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
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
            <div className="flex gap-3">
              <button onClick={() => setAddOpen(false)} className="flex-1 rounded-md border border-input bg-background py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                {t("cancel", lang)}
              </button>
              <button onClick={handleAdd} className="flex-1 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
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
            <div className="flex gap-3">
              <button onClick={() => setEditOpen(false)} className="flex-1 rounded-md border border-input bg-background py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                {t("cancel", lang)}
              </button>
              <button onClick={handleEdit} className="flex-1 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
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
              {deleteIndex !== null && (
                lang === "AR"
                  ? `سيتم حذف "${items[deleteIndex]}" نهائياً. قد يكون مرتبطاً ببلاغات موجودة في النظام.`
                  : `"${items[deleteIndex]}" will be permanently removed. It might be linked to existing reports in the system.`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel", lang)}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t("delete", lang)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default MasterData;
