import { DashboardLayout } from "@/components/DashboardLayout";
import { Save } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";

const Settings = () => {
  const { lang } = useLanguage();

  return (
    <DashboardLayout title={t("settings", lang)} subtitle={t("settingsSubtitle", lang)}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

      <div className="mt-6 flex justify-end">
        <button className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Save className="h-4 w-4" /> {t("saveSettings", lang)}
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
