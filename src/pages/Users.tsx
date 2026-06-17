import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { MoreHorizontal, Search, UserPlus, X, Shield, AlertTriangle, KeyRound, Ban, Activity, FileText, ShieldCheck, Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { t } from "@/lib/i18n";
import { useGetUsers, useAddUser, useUpdateUser, useChangeRole, useToggleBanUser, useResetPasswordUser } from "@/hooks/queries/useUsers";
import { USER_ROLES } from "@/types/user";
import type { User } from "@/types/user";

const getRoleBadge = (roles?: string[]) => {
  const primaryRole = roles?.[0] || "User";
  if (primaryRole === "Admin") return "bg-warning/15 text-warning border border-warning/30 font-semibold";
  return "bg-muted text-muted-foreground";
};

const UsersPage = () => {
  const { lang, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [changeRoleUser, setChangeRoleUser] = useState<User | null>(null);
  const [banUser, setBanUser] = useState<User | null>(null);
  const [exporting, setExporting] = useState(false);
  const [newRole, setNewRole] = useState<string>("User");
  const menuRef = useRef<HTMLDivElement>(null);

  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", role: "User" as string });
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1); // reset to page 1 on filter change
  }, [roleFilter]);

  const { data: usersData, isLoading } = useGetUsers(page, pageSize, debouncedSearch, roleFilter);
  const users = usersData?.data || [];
  const totalPages = usersData?.totalPages || 1;
  const totalRecords = usersData?.totalRecords || 0;

  const addUserMutation = useAddUser(page, pageSize, debouncedSearch, roleFilter);
  const updateUserMutation = useUpdateUser(page, pageSize, debouncedSearch, roleFilter);
  const changeRoleMutation = useChangeRole(page, pageSize, debouncedSearch, roleFilter);
  const toggleBanMutation = useToggleBanUser(page, pageSize, debouncedSearch, roleFilter);
  const resetPasswordMutation = useResetPasswordUser();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      const csv = "ID,Name,Email,Role,Status,Joined\n" + users.map(u => `${u.id},${u.name},${u.email},${u.roles?.join(" ")},${u.isActive},${u.created}`).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "users_export.csv"; a.click();
      URL.revokeObjectURL(url);
      toast({ title: "✅ " + t("exportComplete", lang), description: t("usersExported", lang) });
    }, 1500);
  };

  const openEditUser = (user: User) => {
    setEditForm({ name: user.name, email: user.email });
    setEditErrors({});
    setEditUser(user);
    setOpenMenuId(null);
  };

  const handleEditSave = async () => {
    const errs: Record<string, string> = {};
    if (!editForm.name.trim()) errs.name = t("nameRequired", lang);
    if (!editForm.email.trim()) errs.email = t("emailRequired", lang);
    if (Object.keys(errs).length > 0) { setEditErrors(errs); return; }

    try {
      await updateUserMutation.mutateAsync({
        id: editUser!.id,
        payload: {
          name: editForm.name,
          email: editForm.email
        }
      });
      toast({ title: "✅ " + (lang === "AR" ? "تم تحديث المستخدم" : "User Updated"), description: `${editUser?.name} ${lang === "AR" ? "تم تحديث ملفه الشخصي" : "'s profile has been updated."}` });
      setEditUser(null);
    } catch (e: unknown) {
      toast({ variant: "destructive", title: "Error", description: (e as Error).message || "Failed to update user" });
    }
  };

  const handleAddUser = async () => {
    const errs: Record<string, string> = {};
    if (!addForm.name.trim()) errs.name = t("nameRequired", lang);
    if (!addForm.email.trim()) errs.email = t("emailRequired", lang);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addForm.email)) errs.email = t("invalidEmail", lang);
    if (!addForm.password) errs.password = t("passwordRequired", lang) || "Password required";
    if (Object.keys(errs).length > 0) { setAddErrors(errs); return; }

    try {
      await addUserMutation.mutateAsync({
        name: addForm.name,
        email: addForm.email,
        password: addForm.password,
        role: addForm.role
      });
      toast({ title: "✅ " + (lang === "AR" ? "تمت إضافة المستخدم" : "User Added"), description: `${addForm.name} ${lang === "AR" ? "تمت إضافته بنجاح" : "has been added successfully."}` });
      setShowAddUser(false);
      setAddForm({ name: "", email: "", password: "", role: "User" });
    } catch (e: unknown) {
      toast({ variant: "destructive", title: "Error", description: (e as Error).message || "Failed to add user" });
    }
  };

  const handleChangeRole = async () => {
    try {
      await changeRoleMutation.mutateAsync({
        id: changeRoleUser!.id,
        payload: { role: newRole }
      });
      toast({ title: "✅ " + (lang === "AR" ? "تم تحديث الدور" : "Role Updated"), description: `${changeRoleUser?.name} ${lang === "AR" ? "تم تغيير دوره إلى" : "'s role changed to"} ${newRole}.` });
      setChangeRoleUser(null);
    } catch (e: unknown) {
      toast({ variant: "destructive", title: "Error", description: (e as Error).message || "Failed to change role" });
    }
  };

  const handleToggleBan = async () => {
    try {
      await toggleBanMutation.mutateAsync(banUser!.id);
      const isBanned = banUser!.isActive;
      toast({ title: isBanned ? "🚫 " + (lang === "AR" ? "تم حظر المستخدم" : "User Banned") : "✅ " + (lang === "AR" ? "تم رفع الحظر" : "User Unbanned"), description: `${banUser?.name} ${isBanned ? (lang === "AR" ? "تم حظره نهائياً" : "has been permanently banned.") : (lang === "AR" ? "تم رفع الحظر عنه" : "has been unbanned.")}` });
      setBanUser(null);
    } catch (e: unknown) {
      toast({ variant: "destructive", title: "Error", description: (e as Error).message || "Failed to toggle ban status" });
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;
    try {
      const res = await resetPasswordMutation.mutateAsync(selectedUser.id);
      toast({ title: "✅ " + (lang === "AR" ? "تم إعادة تعيين كلمة المرور" : "Password Reset"), description: `${lang === "AR" ? "كلمة المرور الجديدة هي:" : "New password is:"} ${res.data.newPassword}` });
    } catch (e: unknown) {
      toast({ variant: "destructive", title: "Error", description: (e as Error).message || "Failed to reset password" });
    }
  };

  return (
    <DashboardLayout title={t("users", lang)} subtitle={t("usersSubtitle", lang)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-card">
        <div className="relative flex-1 min-w-[200px]">
          <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground`} />
          <input type="text" placeholder={t("searchUsers", lang)} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-md border border-input bg-background py-2 ${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring`} />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">{t("allRoles", lang)}</option>
          {USER_ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <button onClick={handleExport} disabled={exporting}
          className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50">
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} {t("export", lang)}
        </button>
        <button onClick={() => { setShowAddUser(true); setAddForm({ name: "", email: "", password: "", role: "User" }); setAddErrors({}); }}
          className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <UserPlus className="h-4 w-4" /> {t("addUser", lang)}
        </button>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thId", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thName", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thEmail", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thRole", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thStatus", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thJoined", lang)}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t("thActions", lang)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">{lang === "AR" ? "لا يوجد مستخدمين" : "No users found"}</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-muted/30 cursor-pointer" onClick={() => setSelectedUser(user)}>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{user.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{user.name?.split(" ").map(n => n[0]).join("")}</div>
                      <span className="font-medium text-card-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs ${getRoleBadge(user.roles)}`}>{user.roles?.[0] || 'User'}</span></td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.isActive ? (lang === "AR" ? "نشط" : "Active") : (lang === "AR" ? "محظور" : "Banned")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.created}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="relative" ref={openMenuId === user.id ? menuRef : null}>
                      <button onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenuId === user.id && (
                        <div className={`absolute ${isRTL ? "left-0" : "right-0"} top-full z-50 mt-1 w-44 rounded-lg border border-border bg-popover p-1 shadow-lg`}>
                          <button onClick={() => openEditUser(user)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-muted">
                            <Shield className="h-4 w-4" /> {t("editProfile", lang)}
                          </button>
                          <button onClick={() => { setChangeRoleUser(user); setNewRole(user.roles?.[0] || "User"); setOpenMenuId(null); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-muted">
                            <KeyRound className="h-4 w-4" /> {t("changeRole", lang)}
                          </button>
                          <div className="my-1 h-px bg-border" />
                          <button onClick={() => { setBanUser(user); setOpenMenuId(null); }} className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${user.isActive ? 'text-destructive hover:bg-destructive/10' : 'text-green-600 hover:bg-green-50'}`}>
                            <Ban className="h-4 w-4" /> {user.isActive ? t("banUser", lang) : (lang === "AR" ? "رفع الحظر" : "Unban User")}
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
        
        {/* Pagination */}
        {!isLoading && totalPages > 0 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              {t("showing", lang)} {(page - 1) * pageSize + 1} {t("to", lang)} {Math.min(page * pageSize, totalRecords)} {t("of", lang)} {totalRecords} {t("users", lang).toLowerCase()}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1}
                className="rounded-md p-1.5 border border-border hover:bg-muted disabled:opacity-50"
              >
                {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages}
                className="rounded-md p-1.5 border border-border hover:bg-muted disabled:opacity-50"
              >
                {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Profile Slide-over */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <div className={`relative w-full max-w-md bg-card ${isRTL ? "border-e" : "border-s"} border-border shadow-2xl overflow-y-auto animate-slide-in`}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
              <h2 className="text-lg font-bold text-card-foreground">{t("userProfile", lang)}</h2>
              <button onClick={() => setSelectedUser(null)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">{selectedUser.name?.split(" ").map(n => n[0]).join("")}</div>
                <h3 className="mt-3 text-lg font-bold text-card-foreground">{selectedUser.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs ${getRoleBadge(selectedUser.roles)}`}>{selectedUser.roles?.[0] || 'User'}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-border bg-muted/30 p-3 text-center"><FileText className="mx-auto h-4 w-4 text-muted-foreground" /><p className="mt-1 text-lg font-bold text-card-foreground">{selectedUser.reportsCount}</p><p className="text-[10px] text-muted-foreground">{t("reports", lang)}</p></div>
                <div className="rounded-lg border border-border bg-muted/30 p-3 text-center"><ShieldCheck className="mx-auto h-4 w-4 text-muted-foreground" /><p className="mt-1 text-lg font-bold text-card-foreground">{selectedUser.claimsCount}</p><p className="text-[10px] text-muted-foreground">{t("claims", lang)}</p></div>
                <div className="rounded-lg border border-border bg-muted/30 p-3 text-center"><Activity className="mx-auto h-4 w-4 text-muted-foreground" /><p className="mt-1 text-lg font-bold text-card-foreground">{selectedUser.isActive ? (lang === "AR" ? "نشط" : "Active") : (lang === "AR" ? "محظور" : "Banned")}</p><p className="text-[10px] text-muted-foreground">{t("thStatus", lang)}</p></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("thId", lang)}</span><span className="font-mono text-card-foreground">{selectedUser.id}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("thJoined", lang)}</span><span className="text-card-foreground">{selectedUser.created}</span></div>
              </div>
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div className="flex items-center gap-2 mb-3"><AlertTriangle className="h-4 w-4 text-destructive" /><h4 className="text-sm font-bold text-destructive">{t("dangerZone", lang)}</h4></div>
                <div className="space-y-2">
                  <button onClick={handleResetPassword} disabled={resetPasswordMutation.isPending} className="flex w-full items-center justify-center gap-2 rounded-md border border-destructive/30 bg-card px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50">
                    {resetPasswordMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    <KeyRound className="h-4 w-4" /> {t("resetPassword", lang)}
                  </button>
                  <button
                    onClick={() => {
                      const target = selectedUser;
                      setSelectedUser(null);
                      setBanUser(target);
                    }}
                    disabled={toggleBanMutation.isPending}
                    className={`flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${selectedUser.isActive ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'bg-green-600 text-white hover:bg-green-700'}`}
                  >
                    <Ban className="h-4 w-4" /> {selectedUser.isActive ? t("permanentlyBan", lang) : (lang === "AR" ? "رفع الحظر" : "Unban User")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{t("addNewUser", lang)}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("fullName", lang)}</label>
                <input type="text" placeholder={lang === "AR" ? "مثال: أحمد علي" : "e.g., Ahmed Ali"} value={addForm.name} onChange={(e) => { setAddForm(f => ({ ...f, name: e.target.value })); setAddErrors(e => ({ ...e, name: "" })); }}
                  className={`w-full rounded-md border ${addErrors.name ? "border-destructive" : "border-input"} bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring`} />
                {addErrors.name && <p className="mt-1 text-xs text-destructive">{addErrors.name}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("email", lang)}</label>
                <input type="email" placeholder="ahmed@gmail.com" value={addForm.email} onChange={(e) => { setAddForm(f => ({ ...f, email: e.target.value })); setAddErrors(e => ({ ...e, email: "" })); }}
                  className={`w-full rounded-md border ${addErrors.email ? "border-destructive" : "border-input"} bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring`} />
                {addErrors.email && <p className="mt-1 text-xs text-destructive">{addErrors.email}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{lang === "AR" ? "كلمة المرور" : "Password"}</label>
                <input type="password" placeholder="********" value={addForm.password} onChange={(e) => { setAddForm(f => ({ ...f, password: e.target.value })); setAddErrors(e => ({ ...e, password: "" })); }}
                  className={`w-full rounded-md border ${addErrors.password ? "border-destructive" : "border-input"} bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring`} />
                {addErrors.password && <p className="mt-1 text-xs text-destructive">{addErrors.password}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("role", lang)}</label>
                <select value={addForm.role} onChange={(e) => setAddForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  {USER_ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowAddUser(false)} className="flex-1 rounded-md border border-input bg-background py-2.5 text-sm font-medium text-foreground hover:bg-muted">{t("cancel", lang)}</button>
              <button onClick={handleAddUser} disabled={addUserMutation.isPending} className="flex-1 flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {addUserMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("addUser", lang)}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={!!editUser} onOpenChange={(open) => { if (!open) setEditUser(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{t("editProfile", lang)} – {editUser?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("fullName", lang)}</label>
              <input value={editForm.name} onChange={(e) => { setEditForm(f => ({ ...f, name: e.target.value })); setEditErrors(e => ({ ...e, name: "" })); }}
                className={`w-full rounded-md border ${editErrors.name ? "border-destructive" : "border-input"} bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring`} />
              {editErrors.name && <p className="mt-1 text-xs text-destructive">{editErrors.name}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("email", lang)}</label>
              <input value={editForm.email} onChange={(e) => { setEditForm(f => ({ ...f, email: e.target.value })); setEditErrors(e => ({ ...e, email: "" })); }}
                className={`w-full rounded-md border ${editErrors.email ? "border-destructive" : "border-input"} bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring`} />
              {editErrors.email && <p className="mt-1 text-xs text-destructive">{editErrors.email}</p>}
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditUser(null)} className="flex-1 rounded-md border border-input bg-background py-2.5 text-sm font-medium text-foreground hover:bg-muted">{t("cancel", lang)}</button>
              <button onClick={handleEditSave} disabled={updateUserMutation.isPending} className="flex-1 flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {updateUserMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("saveChanges", lang)}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Role Modal */}
      <Dialog open={!!changeRoleUser} onOpenChange={(open) => { if (!open) setChangeRoleUser(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>{t("changeRole", lang)}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">{lang === "AR" ? "تحديث الدور لـ" : "Update role for"} <span className="font-medium text-foreground">{changeRoleUser?.name}</span></p>
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              {USER_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button onClick={() => setChangeRoleUser(null)} className="flex-1 rounded-md border border-input bg-background py-2.5 text-sm font-medium text-foreground hover:bg-muted">{t("cancel", lang)}</button>
              <button onClick={handleChangeRole} disabled={changeRoleMutation.isPending} className="flex-1 flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {changeRoleMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("updateRole", lang)}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ban User Confirmation */}
      <AlertDialog open={!!banUser} onOpenChange={(open) => { if (!open) setBanUser(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("banUser", lang)} {banUser?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {lang === "AR"
                ? "سيتم حظر هذا المستخدم نهائياً من النظام. لن يتمكن من الوصول إلى أي ميزات أو تقديم بلاغات."
                : "This will permanently ban this user from the system. They will no longer be able to access any features or submit reports."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel", lang)}</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleBan} disabled={toggleBanMutation.isPending} className={`${banUser?.isActive ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'bg-green-600 text-white hover:bg-green-700'} flex items-center justify-center gap-2`}>
              {toggleBanMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {banUser?.isActive ? t("banUser", lang) : (lang === "AR" ? "رفع الحظر" : "Unban User")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default UsersPage;
