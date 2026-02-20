import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { MoreHorizontal, Search, UserPlus, X, Shield, AlertTriangle, KeyRound, Ban, Activity, FileText, ShieldCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const users = [
  { id: "HU-2023-1045", name: "Ahmed Ali", email: "ahmed.ali92@gmail.com", role: "Student", department: "Computer Engineering", status: "active" as const, joined: "2023-09-01", reports: 5, claims: 2 },
  { id: "HU-2022-0892", name: "Khalid Nasser", email: "khalid.nasser@yahoo.com", role: "Student", department: "Business Admin", status: "active" as const, joined: "2022-09-01", reports: 3, claims: 1 },
  { id: "HU-2024-0215", name: "Hassan Abdo", email: "hassan_abdo@gmail.com", role: "Student", department: "Medicine", status: "active" as const, joined: "2024-09-01", reports: 1, claims: 0 },
  { id: "HU-STF-0041", name: "Dr. Nabil Al-Qadhi", email: "nabil.qadhi@gmail.com", role: "Admin", department: "Engineering Faculty", status: "active" as const, joined: "2019-03-15", reports: 0, claims: 0 },
  { id: "HU-2023-0672", name: "Sara Mohammed", email: "sara.mhd99@gmail.com", role: "Student", department: "Architecture", status: "active" as const, joined: "2023-09-01", reports: 7, claims: 3 },
  { id: "HU-2021-0455", name: "Yasser Bin Ali", email: "yasser.ali@yahoo.com", role: "Student", department: "Law", status: "banned" as const, joined: "2021-09-01", reports: 2, claims: 1 },
  { id: "HU-STF-0078", name: "Amina Saleh", email: "amina.saleh@gmail.com", role: "Super Admin", department: "Main Library", status: "active" as const, joined: "2020-08-01", reports: 0, claims: 0 },
  { id: "HU-2024-0389", name: "Fatima Saleh", email: "fatima.s2000@gmail.com", role: "Student", department: "Pharmacy", status: "active" as const, joined: "2024-09-01", reports: 4, claims: 2 },
  { id: "HU-2022-1102", name: "Mona Abdulrahman", email: "mona_abd@yahoo.com", role: "Student", department: "Computer Science", status: "active" as const, joined: "2022-09-01", reports: 6, claims: 1 },
  { id: "HU-SEC-0012", name: "Nabil Security", email: "nabil.sec@gmail.com", role: "Admin", department: "Campus Security", status: "active" as const, joined: "2018-01-10", reports: 0, claims: 0 },
];

const getRoleBadge = (role: string) => {
  if (role === "Super Admin") return "bg-primary/15 text-primary border border-primary/30 font-semibold";
  if (role === "Admin") return "bg-warning/15 text-warning border border-warning/30 font-semibold";
  return "bg-muted text-muted-foreground";
};

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role.toLowerCase().replace(" ", "") === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <DashboardLayout title="Users" subtitle="Manage students and staff accounts">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-card">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Roles</option>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <UserPlus className="h-4 w-4" /> Add User
        </button>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Department</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-muted/30 cursor-pointer" onClick={() => setSelectedUser(user)}>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{user.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-medium text-card-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.department}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.joined}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="relative" ref={openMenuId === user.id ? menuRef : null}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenuId === user.id && (
                        <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-border bg-popover p-1 shadow-lg">
                          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-muted">
                            <Shield className="h-4 w-4" /> Edit
                          </button>
                          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-muted">
                            <KeyRound className="h-4 w-4" /> Change Role
                          </button>
                          <div className="my-1 h-px bg-border" />
                          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
                            <Ban className="h-4 w-4" /> Ban User
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
            Showing {filtered.length} of {users.length} users
          </p>
        </div>
      </div>

      {/* User Profile Slide-over */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <div className="relative w-full max-w-md bg-card border-l border-border shadow-2xl overflow-y-auto animate-slide-in">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
              <h2 className="text-lg font-bold text-card-foreground">User Profile</h2>
              <button onClick={() => setSelectedUser(null)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Avatar & Info */}
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  {selectedUser.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h3 className="mt-3 text-lg font-bold text-card-foreground">{selectedUser.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs ${getRoleBadge(selectedUser.role)}`}>
                  {selectedUser.role}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                  <FileText className="mx-auto h-4 w-4 text-muted-foreground" />
                  <p className="mt-1 text-lg font-bold text-card-foreground">{selectedUser.reports}</p>
                  <p className="text-[10px] text-muted-foreground">Reports</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                  <ShieldCheck className="mx-auto h-4 w-4 text-muted-foreground" />
                  <p className="mt-1 text-lg font-bold text-card-foreground">{selectedUser.claims}</p>
                  <p className="text-[10px] text-muted-foreground">Claims</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                  <Activity className="mx-auto h-4 w-4 text-muted-foreground" />
                  <p className="mt-1 text-lg font-bold text-card-foreground">{selectedUser.status === "active" ? "Online" : "Offline"}</p>
                  <p className="text-[10px] text-muted-foreground">Status</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Department</span>
                  <span className="font-medium text-card-foreground">{selectedUser.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ID</span>
                  <span className="font-mono text-card-foreground">{selectedUser.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="text-card-foreground">{selectedUser.joined}</span>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <h4 className="text-sm font-bold text-destructive">Danger Zone</h4>
                </div>
                <div className="space-y-2">
                  <button className="flex w-full items-center justify-center gap-2 rounded-md border border-destructive/30 bg-card px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                    <KeyRound className="h-4 w-4" /> Reset Password
                  </button>
                  <button className="flex w-full items-center justify-center gap-2 rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors">
                    <Ban className="h-4 w-4" /> Permanently Ban
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setShowAddUser(false)} />
          <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-card-foreground">Add New User</h2>
              <button onClick={() => setShowAddUser(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Full Name</label>
                  <input type="text" placeholder="e.g., Ahmed Ali" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
                  <input type="email" placeholder="e.g., ahmed@gmail.com" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Role</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Student</option>
                    <option>Admin</option>
                    <option>Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Department</label>
                  <input type="text" placeholder="e.g., Computer Science" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Student/Staff ID</label>
                <input type="text" placeholder="e.g., HU-2024-0001" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddUser(false)} className="flex-1 rounded-md border border-input bg-background py-2.5 text-sm font-medium text-foreground hover:bg-muted">
                  Cancel
                </button>
                <button type="button" className="flex-1 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UsersPage;
