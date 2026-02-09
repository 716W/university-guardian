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
  Search,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Claims", url: "/claims", icon: ShieldCheck },
  { title: "Handover", url: "/handover", icon: Handshake },
  { title: "Users", url: "/users", icon: Users },
  { title: "Master Data", url: "/master-data", icon: Database },
  { title: "Audit Logs", url: "/audit-logs", icon: ScrollText },
  { title: "Feedback", url: "/feedback", icon: MessageSquare },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ${
          collapsed ? "-translate-x-full md:translate-x-0 md:w-16" : "w-64"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent">
            <GraduationCap className="h-5 w-5 text-sidebar-accent-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-semibold text-sidebar-primary">
                Hadramout University
              </span>
              <span className="truncate text-xs text-sidebar-muted">
                Lost & Found System
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto shrink-0 rounded-md p-1 text-sidebar-muted hover:text-sidebar-primary md:block hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="px-3 py-3">
            <div className="flex items-center gap-2 rounded-md bg-sidebar-accent px-3 py-2 text-sm text-sidebar-muted">
              <Search className="h-4 w-4 shrink-0" />
              <span>Search...</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.title}>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="border-t border-sidebar-border p-3">
            <div className="flex items-center gap-3 rounded-md px-3 py-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-xs font-bold text-sidebar-accent-foreground">
                AM
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium text-sidebar-primary">
                  Admin Manager
                </span>
                <span className="truncate text-xs text-sidebar-muted">
                  admin@hu.edu.ye
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export function MobileMenuTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-md p-2 text-foreground md:hidden">
      <Menu className="h-5 w-5" />
    </button>
  );
}
