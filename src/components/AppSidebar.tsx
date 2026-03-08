import { NavLink } from "@/components/NavLink";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  Handshake,
  Users,
  Database,
  ScrollText,
  MessageSquare,
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TranslationKey } from "@/lib/i18n";

const navGroups: { labelKey: TranslationKey; items: { titleKey: TranslationKey; url: string; icon: typeof LayoutDashboard }[] }[] = [
  {
    labelKey: "navMain",
    items: [
      { titleKey: "dashboard", url: "/", icon: LayoutDashboard },
    ],
  },
  {
    labelKey: "navOperations",
    items: [
      { titleKey: "reports", url: "/reports", icon: FileText },
      { titleKey: "claims", url: "/claims", icon: ShieldCheck },
      { titleKey: "handover", url: "/handover", icon: Handshake },
    ],
  },
  {
    labelKey: "navSystem",
    items: [
      { titleKey: "users", url: "/users", icon: Users },
      { titleKey: "masterData", url: "/master-data", icon: Database },
      { titleKey: "auditLogs", url: "/audit-logs", icon: ScrollText },
    ],
  },
  {
    labelKey: "navSupport",
    items: [
      { titleKey: "feedback", url: "/feedback", icon: MessageSquare },
      { titleKey: "notifications", url: "/notifications", icon: Bell },
      { titleKey: "settings", url: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { lang, isRTL } = useLanguage();

  return (
    <aside
      className={`fixed inset-y-0 ${isRTL ? "right-0" : "left-0"} z-40 flex flex-col bg-sidebar border-sidebar-border transition-all duration-300 ${
        isRTL ? "border-s" : "border-e"
      } ${collapsed ? "w-[72px]" : "w-[280px]"} hidden md:flex`}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 h-16 border-b border-white/[0.06] ${collapsed ? "justify-center" : ""}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-bold text-white">
              {t("hadramoutUniv", lang)}
            </span>
            <span className="truncate text-[11px] text-white/40">
              {t("lostAndFound", lang)}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide px-3 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.labelKey}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-bold tracking-widest text-white/30 uppercase">
                {t(group.labelKey, lang)}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.url}>
                  <NavLink
                    to={item.url}
                    end={item.url === "/"}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-all duration-200 hover:bg-white/[0.08] hover:text-white/90 ${
                      collapsed ? "justify-center" : ""
                    }`}
                    activeClassName={`!bg-primary/20 !text-white font-semibold ${isRTL ? "border-e-2" : "border-s-2"} !border-primary`}
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    {!collapsed && <span>{t(item.titleKey, lang)}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white/60"
        >
          {collapsed ? (
            isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              <span>{t("collapse", lang)}</span>
            </>
          )}
        </button>
      </div>

      {/* User Profile Section */}
      <div className={`border-t border-white/[0.08] px-3 py-3 ${collapsed ? "flex justify-center" : ""}`}>
        {collapsed ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-white">
            AM
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-white">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-white">{t("adminManager", lang)}</p>
              <p className="truncate text-[11px] text-white/40">{t("superAdmin", lang)}</p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg p-1.5 text-white/30 hover:bg-white/[0.08] hover:text-white/60 transition-colors"
              title={t("logout", lang)}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
