import { DashboardLayout } from "@/components/DashboardLayout";
import { Save, Loader2, Upload, User } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import { useState, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { useUpdateMyProfile } from "@/hooks/queries/useProfile";

const Settings = () => {
  const { lang } = useLanguage();
  const updateMyProfileMutation = useUpdateMyProfile();

  // My Profile form state
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleProfileSave = async () => {
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      toast({ variant: "destructive", title: "Error", description: lang === "AR" ? "الاسم والبريد الإلكتروني مطلوبان" : "Name and email are required." });
      return;
    }
    try {
      const result = await updateMyProfileMutation.mutateAsync({
        name: profileForm.name,
        email: profileForm.email,
        profileImage,           // File | null — endpoint handles multipart/form-data
      });
      toast({ title: "✅ " + (lang === "AR" ? "تم تحديث الملف الشخصي" : "Profile Updated"), description: result.data.name });
      // Reflect returned name/email in form
      setProfileForm({ name: result.data.name, email: result.data.email });
      setProfileImage(null);
      setImagePreview(result.data.avatarUrl || null);
    } catch (e: unknown) {
      toast({ variant: "destructive", title: "Error", description: (e as Error).message || "Failed to update profile" });
    }
  };

  return (
    <DashboardLayout title={t("settings", lang)} subtitle={t("settingsSubtitle", lang)}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* ── My Profile ── */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-card lg:col-span-2">
          <h3 className="mb-5 text-sm font-semibold text-primary">
            {lang === "AR" ? "ملفي الشخصي" : "My Profile"}
          </h3>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {/* Avatar preview + file picker */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
                title={lang === "AR" ? "انقر لتغيير الصورة" : "Click to change photo"}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="avatar preview" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
              >
                <Upload className="h-3.5 w-3.5" />
                {lang === "AR" ? "رفع صورة" : "Upload Photo"}
              </button>
              {/* Hidden file input — binary file is appended to FormData in the endpoint */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {profileImage && (
                <p className="max-w-[9rem] truncate text-center text-[10px] text-muted-foreground">{profileImage.name}</p>
              )}
            </div>
            {/* Name / Email fields */}
            <div className="flex flex-1 flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {lang === "AR" ? "الاسم الكامل" : "Full Name"}
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder={lang === "AR" ? "أدخل اسمك" : "Enter your name"}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {lang === "AR" ? "البريد الإلكتروني" : "Email"}
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="admin@example.com"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleProfileSave}
                  disabled={updateMyProfileMutation.isPending}
                  className="flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {updateMyProfileMutation.isPending
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Save className="h-4 w-4" />}
                  {lang === "AR" ? "حفظ الملف الشخصي" : "Save Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── General Settings ── */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-card">
          <h3 className="mb-5 text-sm font-semibold text-primary">{t("generalSettings", lang)}</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("systemName", lang)}</label>
              <input type="text" defaultValue="Hadramout University Lost & Found System" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("adminEmail", lang)}</label>
              <input type="email" defaultValue="admin@hu.edu.ye" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("defaultLanguage", lang)}</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>English</option>
                <option>Arabic (العربية)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("timezone", lang)}</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Asia/Aden (GMT+3)</option>
                <option>Asia/Riyadh (GMT+3)</option>
                <option>UTC</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Notification Settings ── */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-card">
          <h3 className="mb-5 text-sm font-semibold text-primary">{t("notificationSettings", lang)}</h3>
          <div className="space-y-4">
            {[
              { label: lang === "AR" ? "إشعارات البريد للبلاغات الجديدة" : "Email notifications for new reports", defaultChecked: true },
              { label: lang === "AR" ? "إشعارات البريد للمطالبات الجديدة" : "Email notifications for new claims", defaultChecked: true },
              { label: lang === "AR" ? "تنبيهات SMS للعناصر عالية القيمة" : "SMS alerts for high-value items", defaultChecked: false },
              { label: lang === "AR" ? "ملخص يومي" : "Daily summary digest", defaultChecked: true },
              { label: lang === "AR" ? "تقرير تحليلي أسبوعي" : "Weekly analytics report", defaultChecked: false },
            ].map((setting, i) => (
              <label key={i} className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">{setting.label}</span>
                <div className="relative">
                  <input type="checkbox" defaultChecked={setting.defaultChecked} className="peer sr-only" />
                  <div className="h-5 w-9 rounded-full bg-muted transition-colors peer-checked:bg-primary" />
                  <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-card shadow-sm transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* ── Claim Settings ── */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-card">
          <h3 className="mb-5 text-sm font-semibold text-primary">{t("claimSettings", lang)}</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("autoExpire", lang)}</label>
              <input type="number" defaultValue={21} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("minMatchScore", lang)}</label>
              <input type="number" defaultValue={80} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("maxClaimsPerMonth", lang)}</label>
              <input type="number" defaultValue={5} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>

        {/* ── Security ── */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-card">
          <h3 className="mb-5 text-sm font-semibold text-primary">{t("security", lang)}</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("sessionTimeout", lang)}</label>
              <input type="number" defaultValue={30} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("auditRetention", lang)}</label>
              <input type="number" defaultValue={365} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            {[
              { label: lang === "AR" ? "المصادقة الثنائية للمشرفين" : "Two-factor authentication for admins", defaultChecked: true },
              { label: lang === "AR" ? "تطبيق القائمة البيضاء لـ IP" : "IP whitelist enforcement", defaultChecked: false },
            ].map((setting, i) => (
              <label key={i} className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">{setting.label}</span>
                <div className="relative">
                  <input type="checkbox" defaultChecked={setting.defaultChecked} className="peer sr-only" />
                  <div className="h-5 w-9 rounded-full bg-muted transition-colors peer-checked:bg-primary" />
                  <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-card shadow-sm transition-transform peer-checked:translate-x-4" />
                </div>
              </label>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Settings;
