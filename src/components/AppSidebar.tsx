import { NavLink } from "@/components/NavLink";
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
} from "lucide-react";
import { useState } from "react";

const navGroups = [
  {
    label: "MAIN",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { title: "Reports", url: "/reports", icon: FileText },
      { title: "Claims", url: "/claims", icon: ShieldCheck },
      { title: "Handover", url: "/handover", icon: Handshake },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { title: "Users", url: "/users", icon: Users },
      { title: "Master Data", url: "/master-data", icon: Database },
      { title: "Audit Logs", url: "/audit-logs", icon: ScrollText },
    ],
  },
  {
    label: "SUPPORT",
    items: [
      { title: "Feedback", url: "/feedback", icon: MessageSquare },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-30 bg-foreground/20 md:hidden hidden"
        onClick={() => setCollapsed(true)}
      />

      <aside
        className={`fixed left-3 top-3 bottom-3 z-40 flex flex-col rounded-2xl bg-gradient-to-b from-slate-900 to-blue-900 text-white/90 shadow-2xl shadow-blue-900/20 transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[260px]"
        } hidden md:flex`}
      >
        {/* Header */}
        <div className={`flex items-center gap-3 px-4 pt-5 pb-4 ${collapsed ? "justify-center" : ""}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-bold text-white">
                Hadramout Univ.
              </span>
              <span className="truncate text-[11px] text-white/50">
                Lost & Found
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold tracking-widest text-white/30 uppercase">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white ${
                        collapsed ? "justify-center" : ""
                      }`}
                      activeClassName="!bg-white/15 !text-white border-l-[3px] border-sky-400 shadow-lg shadow-sky-400/10 backdrop-blur-sm"
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 text-xs font-medium text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
