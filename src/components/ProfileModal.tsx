import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, Shield, Clock } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import { useGetProfile } from "@/hooks/queries/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { lang } = useLanguage();
  const { data: profile } = useGetProfile();
  const role = useAuthStore(state => state.role);
  const token = useAuthStore(state => state.token);

  let loginTimeDisplay = t("todayAt", lang);
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.iat) {
        const date = new Date(decoded.iat * 1000);
        const now = new Date();
        const isToday = date.getDate() === now.getDate() && 
                        date.getMonth() === now.getMonth() && 
                        date.getFullYear() === now.getFullYear();

        if (isToday) {
          const timeString = date.toLocaleTimeString(lang === "AR" ? "ar-EG" : "en-US", {
            hour: '2-digit',
            minute: '2-digit'
          });
          loginTimeDisplay = `${t("today", lang)}, ${timeString}`;
        } else {
          loginTimeDisplay = date.toLocaleString(lang === "AR" ? "ar-EG" : "en-US", {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      }
    } catch (e) {
      console.error("Failed to decode token for login time", e);
    }
  }

  const userInitials = profile?.name 
    ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
    : "U";
  const displayRole = role || "User";

  const getAvatarUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    return `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  };
  const resolvedAvatarUrl = getAvatarUrl(profile?.avatarUrl);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{t("myProfile", lang)}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="relative group">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg overflow-hidden">
              {resolvedAvatarUrl ? (
                <img src={resolvedAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                userInitials
              )}
            </div>
            <button className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="w-full space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground">{profile?.name || "User"}</h3>
              <p className="text-sm text-muted-foreground">{profile?.email || "No Email Provided"}</p>
            </div>

            <div className="space-y-3 rounded-xl border border-border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t("role", lang)}</p>
                  <p className="text-sm font-semibold text-foreground">{displayRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t("lastLogin", lang)}</p>
                  <p className="text-sm font-semibold text-foreground">{loginTimeDisplay}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
