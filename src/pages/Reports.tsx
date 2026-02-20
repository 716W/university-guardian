import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, Filter, Download, MoreHorizontal, Eye, Edit, RefreshCw, Trash2, Link2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const reportImages: Record<string, string> = {
  Electronics: "📱",
  Documents: "📄",
  Accessories: "👜",
  Clothing: "👕",
};

const reports = [
  { id: "RPT-001", title: "Samsung Galaxy S23", category: "Electronics", location: "Engineering Faculty", date: "2026-02-08", status: "lost" as const, reporter: "Ahmed Ali", hasMatch: true },
  { id: "RPT-002", title: "Student ID Card", category: "Documents", location: "Main Library", date: "2026-02-08", status: "found" as const, reporter: "Sara Mohammed", hasMatch: true },
  { id: "RPT-003", title: "Laptop Charger (Dell)", category: "Electronics", location: "IT Lab 3", date: "2026-02-07", status: "found" as const, reporter: "Omar Hassan", hasMatch: false },
  { id: "RPT-004", title: "Brown Leather Wallet", category: "Accessories", location: "Cafeteria", date: "2026-02-07", status: "lost" as const, reporter: "Khalid Nasser", hasMatch: true },
  { id: "RPT-005", title: "Engineering Textbook", category: "Documents", location: "Lecture Hall A2", date: "2026-02-06", status: "found" as const, reporter: "Fatima Saleh", hasMatch: false },
  { id: "RPT-006", title: "USB Flash Drive 64GB", category: "Electronics", location: "Computer Science Dept", date: "2026-02-06", status: "lost" as const, reporter: "Mona Abdulrahman", hasMatch: false },
  { id: "RPT-007", title: "Car Keys (Toyota)", category: "Accessories", location: "Parking Lot B", date: "2026-02-05", status: "lost" as const, reporter: "Yasser Bin Ali", hasMatch: false },
  { id: "RPT-008", title: "Prescription Glasses", category: "Accessories", location: "Medical Faculty", date: "2026-02-05", status: "found" as const, reporter: "Noura Salem", hasMatch: true },
  { id: "RPT-009", title: "iPad Mini", category: "Electronics", location: "Student Center", date: "2026-02-04", status: "lost" as const, reporter: "Hassan Abdo", hasMatch: false },
  { id: "RPT-010", title: "National ID Card", category: "Documents", location: "Admin Building", date: "2026-02-04", status: "found" as const, reporter: "Amal Khaled", hasMatch: false },
];

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reporter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || r.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === filtered.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filtered.map((r) => r.id)));
    }
  };

  return (
    <DashboardLayout title="Reports" subtitle="Manage lost and found item reports">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-card">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Status</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Documents">Documents</option>
          <option value="Accessories">Accessories</option>
          <option value="Clothing">Clothing</option>
        </select>
        <button className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
          <Filter className="h-4 w-4" /> More Filters
        </button>
        <button className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-input text-primary accent-primary"
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Item</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Location</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Reporter</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((report) => (
                <tr key={report.id} className={`transition-colors hover:bg-muted/30 ${selectedRows.has(report.id) ? "bg-primary/5" : ""}`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(report.id)}
                      onChange={() => toggleRow(report.id)}
                      className="h-4 w-4 rounded border-input text-primary accent-primary"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{report.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
                        {reportImages[report.category] || "📦"}
                      </div>
                      <div>
                        <span className="font-medium text-card-foreground">{report.title}</span>
                        {report.hasMatch && (
                          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            <Link2 className="h-3 w-3" /> High Match
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{report.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{report.location}</td>
                  <td className="px-4 py-3 text-muted-foreground">{report.reporter}</td>
                  <td className="px-4 py-3 text-muted-foreground">{report.date}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative" ref={openMenuId === report.id ? menuRef : null}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === report.id ? null : report.id)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenuId === report.id && (
                        <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-border bg-popover p-1 shadow-lg">
                          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-muted">
                            <Eye className="h-4 w-4" /> View
                          </button>
                          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-muted">
                            <Edit className="h-4 w-4" /> Edit
                          </button>
                          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-muted">
                            <RefreshCw className="h-4 w-4" /> Change Status
                          </button>
                          <div className="my-1 h-px bg-border" />
                          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {reports.length} reports
            {selectedRows.size > 0 && <span className="ml-2 font-medium text-primary">({selectedRows.size} selected)</span>}
          </p>
          <div className="flex gap-1">
            <button className="rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted">Previous</button>
            <button className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">1</button>
            <button className="rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted">2</button>
            <button className="rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-muted">Next</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
