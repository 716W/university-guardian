import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, Shield, Building2, Clock } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { lang } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{t("myProfile", lang)}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="relative group">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg">
              AM
            </div>
            <button className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="w-full space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground">{t("adminManager", lang)}</h3>
              <p className="text-sm text-muted-foreground">admin@hu.edu.ye</p>
            </div>

            <div className="space-y-3 rounded-xl border border-border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t("department", lang)}</p>
                  <p className="text-sm font-semibold text-foreground">{t("itAdministration", lang)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t("role", lang)}</p>
                  <p className="text-sm font-semibold text-foreground">{t("superAdmin", lang)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t("lastLogin", lang)}</p>
                  <p className="text-sm font-semibold text-foreground">{t("todayAt", lang)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
