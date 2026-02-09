import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, Filter, Download, Eye } from "lucide-react";
import { useState } from "react";

const reports = [
  { id: "RPT-001", title: "Samsung Galaxy S23", category: "Electronics", location: "Engineering Faculty", date: "2026-02-08", status: "lost" as const, reporter: "Ahmed Ali" },
  { id: "RPT-002", title: "Student ID Card", category: "Documents", location: "Main Library", date: "2026-02-08", status: "found" as const, reporter: "Sara Mohammed" },
  { id: "RPT-003", title: "Laptop Charger (Dell)", category: "Electronics", location: "IT Lab 3", date: "2026-02-07", status: "found" as const, reporter: "Omar Hassan" },
  { id: "RPT-004", title: "Brown Leather Wallet", category: "Accessories", location: "Cafeteria", date: "2026-02-07", status: "lost" as const, reporter: "Khalid Nasser" },
  { id: "RPT-005", title: "Engineering Textbook", category: "Documents", location: "Lecture Hall A2", date: "2026-02-06", status: "found" as const, reporter: "Fatima Saleh" },
  { id: "RPT-006", title: "USB Flash Drive 64GB", category: "Electronics", location: "Computer Science Dept", date: "2026-02-06", status: "lost" as const, reporter: "Mona Abdulrahman" },
  { id: "RPT-007", title: "Car Keys (Toyota)", category: "Accessories", location: "Parking Lot B", date: "2026-02-05", status: "lost" as const, reporter: "Yasser Bin Ali" },
  { id: "RPT-008", title: "Prescription Glasses", category: "Accessories", location: "Medical Faculty", date: "2026-02-05", status: "found" as const, reporter: "Noura Salem" },
  { id: "RPT-009", title: "iPad Mini", category: "Electronics", location: "Student Center", date: "2026-02-04", status: "lost" as const, reporter: "Hassan Abdo" },
  { id: "RPT-010", title: "National ID Card", category: "Documents", location: "Admin Building", date: "2026-02-04", status: "found" as const, reporter: "Amal Khaled" },
];

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reporter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || r.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

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
                <tr key={report.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{report.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                        IMG
                      </div>
                      <span className="font-medium text-card-foreground">{report.title}</span>
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
                    <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {reports.length} reports
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
