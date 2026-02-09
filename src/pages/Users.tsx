import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { MoreHorizontal, Search, UserPlus } from "lucide-react";
import { useState } from "react";

const users = [
  { id: "HU-2023-1045", name: "Ahmed Ali", email: "ahmed.ali@hu.edu.ye", role: "Student", department: "Computer Engineering", status: "active" as const, joined: "2023-09-01" },
  { id: "HU-2022-0892", name: "Khalid Nasser", email: "khalid.n@hu.edu.ye", role: "Student", department: "Business Administration", status: "active" as const, joined: "2022-09-01" },
  { id: "HU-2024-0215", name: "Hassan Abdo", email: "hassan.a@hu.edu.ye", role: "Student", department: "Medicine", status: "active" as const, joined: "2024-09-01" },
  { id: "HU-STF-0041", name: "Dr. Nabil Al-Qadhi", email: "nabil.q@hu.edu.ye", role: "Staff", department: "Engineering Faculty", status: "active" as const, joined: "2019-03-15" },
  { id: "HU-2023-0672", name: "Sara Mohammed", email: "sara.m@hu.edu.ye", role: "Student", department: "Architecture", status: "active" as const, joined: "2023-09-01" },
  { id: "HU-2021-0455", name: "Yasser Bin Ali", email: "yasser.b@hu.edu.ye", role: "Student", department: "Law", status: "banned" as const, joined: "2021-09-01" },
  { id: "HU-STF-0078", name: "Amina Saleh", email: "amina.s@hu.edu.ye", role: "Staff", department: "Main Library", status: "active" as const, joined: "2020-08-01" },
  { id: "HU-2024-0389", name: "Fatima Saleh", email: "fatima.s@hu.edu.ye", role: "Student", department: "Pharmacy", status: "active" as const, joined: "2024-09-01" },
  { id: "HU-2022-1102", name: "Mona Abdulrahman", email: "mona.a@hu.edu.ye", role: "Student", department: "Computer Science", status: "active" as const, joined: "2022-09-01" },
  { id: "HU-SEC-0012", name: "Nabil Security", email: "nabil.sec@hu.edu.ye", role: "Security", department: "Campus Security", status: "active" as const, joined: "2018-01-10" },
];

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role.toLowerCase() === roleFilter;
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
          <option value="staff">Staff</option>
          <option value="security">Security</option>
        </select>
        <button className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
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
                <tr key={user.id} className="transition-colors hover:bg-muted/30">
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
                  <td className="px-4 py-3 text-muted-foreground">{user.role}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.department}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.joined}</td>
                  <td className="px-4 py-3">
                    <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
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
    </DashboardLayout>
  );
};

export default UsersPage;
