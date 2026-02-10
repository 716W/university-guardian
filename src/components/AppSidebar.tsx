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
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[hsl(224,50%,8%)] border-r border-[hsl(224,30%,15%)] transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[280px]"
      } hidden md:flex`}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 h-16 border-b border-white/[0.06] ${collapsed ? "justify-center" : ""}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-bold text-white">
              Hadramout Univ.
            </span>
            <span className="truncate text-[11px] text-white/40">
              Lost & Found
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
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
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-all duration-200 hover:bg-white/[0.08] hover:text-white/90 ${
                      collapsed ? "justify-center" : ""
                    }`}
                    activeClassName="!bg-white/10 !text-white font-semibold"
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
      <div className="px-3 py-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white/60"
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

      {/* User Profile Section */}
      <div className={`border-t border-white/[0.08] px-3 py-3 ${collapsed ? "flex justify-center" : ""}`}>
        {collapsed ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
            AM
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-white">Admin Manager</p>
              <p className="truncate text-[11px] text-white/40">Super Admin</p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg p-1.5 text-white/30 hover:bg-white/[0.08] hover:text-white/60 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
