import { AppSidebar } from "@/components/AppSidebar";
import { ProfileModal } from "@/components/ProfileModal";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import {
  Search,
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, isRTL } = useLanguage();
  const [profileOpen, setProfileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className={`absolute inset-y-0 ${isRTL ? "right-0" : "left-0"} w-[280px]`}>
            <AppSidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ${isRTL ? "md:mr-[280px]" : "md:ml-[280px]"}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-md px-4 md:px-6">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Global Search */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm text-muted-foreground w-full max-w-md transition-colors focus-within:border-primary/50 focus-within:bg-background">
              <Search className="h-4 w-4 shrink-0" />
              <input
                type="text"
                placeholder={isRTL ? "ابحث في التقارير، المطالبات، المستخدمين..." : "Search reports, claims, users..."}
                className="w-full bg-transparent outline-none placeholder:text-muted-foreground/60 text-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5 text-xs">
              <button
                onClick={() => setLang("EN")}
                className={`px-2 py-1 rounded-sm font-medium transition-colors ${
                  lang === "EN" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("AR")}
                className={`px-2 py-1 rounded-sm font-medium transition-colors ${
                  lang === "AR" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                AR
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <NotificationsDropdown />

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  AM
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-foreground leading-tight">Admin Manager</p>
                  <p className="text-[11px] text-muted-foreground leading-tight">Super Admin</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
              </button>

              {dropdownOpen && (
                <div className={`absolute ${isRTL ? "left-0" : "right-0"} top-full mt-2 w-52 rounded-xl border border-border bg-popover p-1.5 shadow-lg z-50 animate-fade-in`}>
                  <button
                    onClick={() => { setProfileOpen(true); setDropdownOpen(false); }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                  >
                    <User className="h-4 w-4" />
                    {isRTL ? "ملفي الشخصي" : "My Profile"}
                  </button>
                  <button
                    onClick={() => { navigate("/settings"); setDropdownOpen(false); }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    {isRTL ? "الإعدادات" : "Settings"}
                  </button>
                  <div className="my-1 h-px bg-border" />
                  <button
                    onClick={() => { navigate("/login"); setDropdownOpen(false); }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {isRTL ? "تسجيل الخروج" : "Logout"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page title */}
        <div className="px-4 md:px-6 pt-5 pb-2">
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>

        {/* Page content */}
        <main className="flex-1 px-4 md:px-6 pb-6">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>

      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}
