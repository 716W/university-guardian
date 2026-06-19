# Frontend Architecture & UI Guide

> **HU Asset Gateway** — React 18 · TypeScript · Vite · TanStack Query

---

## 📋 Table of Contents

- [Folder Structure](#-folder-structure)
- [Dependency Overview](#-dependency-overview)
- [Application Bootstrap](#-application-bootstrap)
- [Authentication & State](#-authentication--state)
- [Route Protection Logic](#-route-protection-logic)
- [API Client Layer](#-api-client-layer)
- [State Management Strategy](#-state-management-strategy)
- [Query Key Conventions](#-query-key-conventions)
- [Optimistic Cache Updates](#-optimistic-cache-updates)
- [Handling Null & Missing Data](#-handling-null--missing-data)
- [Component Architecture](#-component-architecture)
- [TypeScript Type System](#-typescript-type-system)
- [Forms & Validation](#-forms--validation)
- [Internationalization](#-internationalization)
- [Testing](#-testing)

---

## 📁 Folder Structure

```
src/
├── components/                  # Shared, reusable UI components
│   ├── ui/                      # shadcn/ui auto-generated primitives (do not edit)
│   ├── AppSidebar.tsx           # Navigation sidebar (RBAC-aware nav items)
│   ├── DashboardLayout.tsx      # Authenticated app shell (sidebar + header wrapper)
│   ├── KPICard.tsx              # Dashboard metric card (title, value, trend)
│   ├── NavLink.tsx              # Sidebar nav item with active state styling
│   ├── NotificationsDropdown.tsx# Bell icon dropdown with unread count badge
│   ├── ProfileModal.tsx         # Slide-in profile editor with avatar upload
│   ├── ProtectedRoute.tsx       # Route guard — redirects unauthenticated users
│   └── StatusBadge.tsx          # Shared colored badge component
│
├── hooks/
│   ├── queries/                 # TanStack Query hooks — one file per domain
│   │   ├── useAuth.ts           # useLogin, useGetProfile, useLogout
│   │   ├── useClaims.ts         # useGetAdminClaims, useGetClaimDetails,
│   │   │                        # useApproveClaim, useRejectClaim
│   │   ├── useDashboard.ts      # useGetDashboardData
│   │   ├── useHandovers.ts      # useCreateHandover, useGetHandoverDetails,
│   │   │                        # useGetHandoverByClaim
│   │   ├── useMasterData.ts     # useGet/Create/Update/Delete for all 4 entities
│   │   ├── useNotifications.ts  # useGetNotifications, useMarkAsRead, useDeleteNotification
│   │   ├── useProfile.ts        # useUpdateMyProfile
│   │   ├── useReports.ts        # useGetAdminReports, useGetReportDetails,
│   │   │                        # useDeleteReport, useEditReport, useChangeReportStatus
│   │   └── useUsers.ts          # useGetUsers, useAddUser, useUpdateUser,
│   │                            # useChangeRole, useToggleBanUser, useResetPasswordUser
│   ├── use-debounce.ts          # Generic debounce hook (500ms default)
│   ├── use-language.tsx         # i18n context provider + hook
│   ├── use-mobile.tsx           # Viewport breakpoint detection
│   ├── use-theme.tsx            # Dark/light theme toggle (next-themes)
│   ├── use-toast.ts             # Toast utility (shadcn/ui toast)
│   ├── useAuditLogs.ts          # Audit log fetch + export
│   └── useFeedbacks.ts          # Feedback list + reply mutation
│
├── lib/
│   ├── api/
│   │   ├── apiClient.ts         # Configured Axios instance + request/response interceptors
│   │   └── endpoints/           # Raw async functions — one file per domain
│   │       ├── auth.ts          # loginUser, getProfile, logoutUser
│   │       ├── auditLogs.ts     # fetchAuditLogs, exportAuditLogs
│   │       ├── claims.ts        # fetchAdminClaims, fetchClaimById, approveClaim, rejectClaim
│   │       ├── dashboard.ts     # fetchDashboardData
│   │       ├── feedbacks.ts     # fetchFeedbacks, replyToFeedback
│   │       ├── handovers.ts     # createHandover, getHandoverDetails, getHandoverByClaim
│   │       ├── masterData.ts    # Full CRUD for colleges/departments/locations/categories
│   │       ├── notifications.ts # fetchMyNotifications, markAsRead, deleteNotification
│   │       ├── profile.ts       # updateMyProfile (multipart/form-data)
│   │       ├── reports.ts       # fetchAdminReports, fetchReportById, deleteReport,
│   │       │                    # updateReport, changeReportStatus
│   │       └── users.ts         # getUsers, addUser, updateUserProfile, changeUserRole,
│   │                            # toggleBanUser, resetUserPassword, exportUsers
│   ├── authUtils.ts             # extractRolesFromToken (handles .NET JWT claim format)
│   ├── i18n.ts                  # All application strings (AR/EN)
│   └── utils.ts                 # cn() — Tailwind class merging utility
│
├── pages/                       # Full-screen route components (one per route)
│   ├── Login.tsx
│   ├── Index.tsx                # /  → Dashboard
│   ├── Reports.tsx              # /reports
│   ├── Claims.tsx               # /claims
│   ├── Handover.tsx             # /handover
│   ├── Users.tsx                # /users (SuperAdmin only)
│   ├── AuditLogs.tsx            # /audit-logs (SuperAdmin only)
│   ├── MasterData.tsx           # /master-data
│   ├── Feedback.tsx             # /feedback
│   ├── Notifications.tsx        # /notifications
│   ├── Settings.tsx             # /settings
│   └── NotFound.tsx             # * catch-all
│
├── store/
│   └── useAuthStore.ts          # Zustand store — JWT token, role, isAuthenticated (persisted)
│
├── types/                       # TypeScript interfaces mirroring backend contracts
│   ├── api.ts                   # ApiResponse<T>, PaginatedApiResponse<T>
│   ├── auth.ts                  # LoginRequest, LoginResponse, UserProfile, LogoutResponse
│   ├── auditLog.ts              # AuditLog
│   ├── claim.ts                 # ClaimListItem, ClaimDetails
│   ├── dashboard.ts             # DashboardData, DashboardOverview, CategoryReport, etc.
│   ├── feedback.ts              # Feedback
│   ├── handover.ts              # HandoverRequest, HandoverResponse
│   ├── masterData.ts            # College, Department, Location, Category + request shapes
│   ├── notification.ts          # NotificationItem
│   ├── report.ts                # ReportListItem, ReportDetails, ReportImage
│   └── user.ts                  # User, AddUserRequest, UpdateProfileRequest, etc.
│
├── App.tsx                      # Router definition + global providers
├── main.tsx                     # React DOM entry point
├── index.css                    # Tailwind directives + CSS custom properties (theme tokens)
└── vite-env.d.ts                # Vite environment type declarations
```

---

## 📦 Dependency Overview

| Package | Role |
|---|---|
| `react` + `react-dom` | UI rendering |
| `react-router-dom` v6 | Client-side routing |
| `@tanstack/react-query` v5 | Server state, caching, mutations |
| `axios` | HTTP client |
| `zustand` + `persist` middleware | Auth state (JWT stored in `localStorage`) |
| `jwt-decode` | Parse .NET JWT role claims without server round-trip |
| `tailwindcss` + `shadcn/ui` (Radix UI) | Styling + accessible component primitives |
| `lucide-react` | Icon set |
| `recharts` | Dashboard data visualizations |
| `sonner` | Toast notifications for mutation feedback |
| `react-hook-form` + `zod` | Form state and schema validation |
| `jspdf` + `jspdf-autotable` | Client-side PDF/export generation |
| `date-fns` | Date formatting utilities |
| `next-themes` | Dark/light mode toggle |
| `vitest` + `@testing-library/react` | Unit testing |

---

## 🚀 Application Bootstrap

**`src/main.tsx`** mounts the React tree. **`src/App.tsx`** composes all global providers and the route tree in this exact order (outermost → innermost):

```
QueryClientProvider       ← TanStack Query cache
  ThemeProvider           ← next-themes dark/light
    LanguageProvider      ← i18n context
      TooltipProvider     ← Radix tooltip portal
        Toaster           ← shadcn/ui toast
        Sonner            ← sonner toast
        BrowserRouter
          Routes
            /login        → PublicRoute wrapper
            /*            → ProtectedRoute wrapper
              all pages
```

### `PublicRoute` Guard

Wraps `/login`. If the auth store already has a valid token (`isAuthenticated === true`), it immediately redirects to `/` — preventing logged-in users from visiting the login page.

```tsx
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuthStore();
  if (!isInitialized) return <Loader2 className="animate-spin" />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};
```

---

## 🔐 Authentication & State

### Zustand Auth Store (`src/store/useAuthStore.ts`)

The auth store is the **single source of truth** for the current user's authentication state. It is persisted to `localStorage` under the key `"auth-storage"` via Zustand's `persist` middleware.

**State shape:**

```typescript
interface AuthState {
  token: string | null;
  refreshToken: string | null;
  role: Role | null;          // "Super Admin" | "Admin" | null
  isInitialized: boolean;     // true after rehydration check completes
  isAuthenticated: boolean;
}
```

**Initialization flow** (runs once on app load via `onRehydrateStorage`):

1. `persist` middleware rehydrates state from `localStorage`
2. `onRehydrateStorage` callback calls `state.initialize()`
3. `initialize()` decodes the stored JWT with `jwtDecode`, checks `exp` vs current time
4. If valid → `isAuthenticated = true`, `isInitialized = true`
5. If expired/missing → clears all state, `isInitialized = true`

This ensures the app never flashes protected content before the token validity check completes.

### Role Resolution

.NET JWT tokens embed roles under the verbose claim key:
```
http://schemas.microsoft.com/ws/2008/06/identity/claims/role
```

`extractRolesFromToken()` in `src/lib/authUtils.ts` decodes this and normalizes the result to `string[]` (since .NET returns a `string` for one role and `string[]` for multiple). The store then maps this to the highest-privilege role:

```
"Super Admin" | "SuperAdmin" → stored as "Super Admin"
"Admin"                      → stored as "Admin"
```

---

## 🛡️ Route Protection Logic

**`src/components/ProtectedRoute.tsx`** is a layout-route component used to wrap groups of protected routes. It accepts an optional `allowedRoles` prop.

```tsx
export const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { isAuthenticated, isInitialized, role } = useAuthStore();

  // Show spinner during rehydration — prevents flash of redirect
  if (!isInitialized) return <Loader2 className="animate-spin" />;

  // Not logged in → login page
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Logged in but wrong role → dashboard (silent redirect)
  if (allowedRoles && role && !allowedRoles.includes(role))
    return <Navigate to="/" replace />;

  return <Outlet />;
};
```

**Route groups in `App.tsx`:**

```
<Route element={<ProtectedRoute />}>
  /           Dashboard
  /reports    Reports
  /claims     Claims
  /handover   Handover
  /master-data  Master Data
  /feedback   Feedback
  /notifications  Notifications
  /settings   Settings

<Route element={<ProtectedRoute allowedRoles={["Super Admin", "SuperAdmin"]} />}>
  /users      Users (SuperAdmin only)
  /audit-logs Audit Logs (SuperAdmin only)
```

**AppSidebar RBAC:** Navigation items for "Users" and "Audit Logs" are conditionally rendered in the sidebar:

```tsx
const { role } = useAuthStore();
const isSuperAdmin = role === 'Super Admin' || role === 'SuperAdmin';
// Users and Audit Logs nav items only render when isSuperAdmin === true
```

---

## 🌐 API Client Layer

### `src/lib/api/apiClient.ts`

A single configured Axios instance shared across the entire app:

```typescript
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});
```

**Request Interceptor** — Attaches JWT automatically to every outgoing request:
```typescript
apiClient.interceptors.request.use((config) => {
  const { state } = JSON.parse(localStorage.getItem('auth-storage') || '{}');
  if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
  return config;
});
```

**Response Interceptor** — Global status code handling:

| Status | Behavior |
|---|---|
| `401` | Logs "Unauthorized" (future: redirect to login) |
| `403` | Logs "Forbidden — Access denied" |
| Network error | Logs CORS/network error |
| Any error | Normalizes `error.message` from `data.message` → `error.message` → generic fallback |

### Endpoint Files (`src/lib/api/endpoints/`)

Each file exports plain `async` functions — no hooks, no React, just Axios calls and type assertions. This keeps the API layer fully testable outside of React.

**Pattern for a standard call:**
```typescript
export const approveClaim = async (id: number | string): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.put<ApiResponse<null>>(`/api/v1/admin/claims/${id}/approve`, {});
  return data;
};
```

**Pattern for `multipart/form-data`** (Handover, Profile):
```typescript
// Do NOT set Content-Type manually with a boundary — let Axios detect it
// from the FormData instance automatically
const response = await apiClient.post('/api/v1/admin/handovers', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

**Pattern for binary/blob export:**
```typescript
export const exportUsers = async (): Promise<Blob> => {
  const { data } = await apiClient.get<Blob>('/api/v1/admin/users/export', {
    responseType: 'blob',
  });
  return data;
};
```

---

## 🗂️ State Management Strategy

The app uses a **two-store approach** with a clear separation of concerns:

| Layer | Tool | What it manages |
|---|---|---|
| **Auth state** | Zustand (`useAuthStore`) | JWT token, refresh token, role, `isAuthenticated`, `isInitialized`. Persisted to `localStorage`. |
| **Server state** | TanStack Query v5 | All API data — reports, claims, users, etc. Cached, deduplicated, and synchronized with the server. |

### Why Zustand for Auth Only?

Auth state must survive page refreshes (persistence) and be readable synchronously on app load (before any `useEffect` runs). TanStack Query's async nature makes it unsuitable for this bootstrap-time check. Zustand's `persist` middleware handles this cleanly.

### TanStack Query Setup

```typescript
// App.tsx — single QueryClient for the entire app
const queryClient = new QueryClient();

// Wrapped at the root
<QueryClientProvider client={queryClient}>
  ...
</QueryClientProvider>
```

**On logout**, the cache is fully cleared to prevent data leakage between sessions:
```typescript
// useAuth.ts — useLogout mutation
onSuccess: () => {
  logout();           // clears Zustand auth store
  queryClient.clear(); // evicts ALL cached query data
  navigate('/login', { replace: true });
}
```

---

## 🔑 Query Key Conventions

Consistent query keys are critical for targeted cache invalidation and optimistic updates.

| Domain | Key Structure | Example |
|---|---|---|
| Reports list | `['adminReports', filtersObj]` | `['adminReports', { pageNumber: 1, search: 'keys' }]` |
| Report detail | `['reportDetails', id]` | `['reportDetails', 42]` |
| Claims list | `['adminClaims', paramsObj]` | `['adminClaims', { pageNumber: 1 }]` |
| Claim detail | `['claimDetails', id]` | `['claimDetails', '15']` |
| Handover detail | `['handoverDetails', id]` | `['handoverDetails', 7]` |
| Handover by claim | `['handoverByClaim', claimId]` | `['handoverByClaim', '15']` |
| Users list | `['users', 'list', page, size, search, role]` | via `userKeys.list(...)` factory |
| Master data | `['masterData', 'colleges']` | via `masterDataKeys.colleges()` factory |
| Profile | `['profile', 'me']` | |
| Dashboard | `['dashboardData']` | |
| Notifications | `['myNotifications']` | |

**Key factories** are used for structured domains (Users, Master Data):
```typescript
export const userKeys = {
  all: ['users'] as const,
  list: (page, pageSize, search?, role?) =>
    [...userKeys.all, 'list', page, pageSize, search, role] as const,
};
```

---

## ⚡ Optimistic Cache Updates

Mutations avoid unnecessary network re-fetches by directly patching the TanStack Query cache in `onSuccess`. This gives the UI instant feedback.

### Pattern: Approve a Claim

```typescript
// useClaims.ts
export const useApproveClaim = (filtersObj) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => approveClaim(id),
    onSuccess: (_, id) => {
      // 1. Patch the list cache — change status to Approved (2)
      queryClient.setQueryData(['adminClaims', filtersObj],
        (old: PaginatedApiResponse<ClaimListItem[]> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map(item =>
              item.id === id ? { ...item, approvalStatus: 2 } : item
            ),
          };
        }
      );
      // 2. Invalidate the detail query — force fresh fetch on next view
      queryClient.invalidateQueries({ queryKey: ['claimDetails', id] });
    },
  });
};
```

### Pattern: Delete a Report

The total record count is decremented simultaneously with the item removal:

```typescript
queryClient.setQueryData(queryKey, (old) => ({
  ...old,
  totalRecords: old.totalRecords - 1,
  data: old.data.filter(item => item.id !== deletedId),
}));
```

### Pattern: Handover Creation (Cross-Domain Update)

A successful handover must update **both** the Claims and Reports caches:

```typescript
// useHandovers.ts — useCreateHandover onSuccess
queryClient.setQueriesData({ queryKey: ['adminClaims'] }, (old) => ({
  ...old,
  data: old.data.map(item =>
    item.id.toString() === claimId.toString()
      ? { ...item, approvalStatus: 3 }  // Completed
      : item
  ),
}));

queryClient.setQueriesData({ queryKey: ['adminReports'] }, (old) => ({
  ...old,
  data: old.data.map(item =>
    item.id.toString() === reportId.toString()
      ? { ...item, status: 3 }           // Returned
      : item
  ),
}));
```

Note the use of `setQueriesData` (plural) which updates **all matching cache keys** regardless of filter params — ensuring every open paginated view is kept consistent.

---

## 🧩 Handling Null & Missing Data

A core frontend discipline is graceful degradation when API fields are `null` or `undefined`. The system uses several patterns:

### Profile Avatar — Initials Fallback

When a user has no `avatarUrl`, the UI renders a colored div with their initials:

```tsx
{profile?.avatarUrl ? (
  <img src={`${API_BASE_URL}${profile.avatarUrl}`} alt="Avatar" />
) : (
  <div className="avatar-fallback">
    {profile?.name?.charAt(0).toUpperCase() ?? '?'}
  </div>
)}
```

> Image paths returned by the API are **relative** (e.g., `/uploads/avatars/abc.jpg`). The frontend prepends `VITE_API_BASE_URL` to construct the full URL.

### Relative API Image Paths

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
const fullUrl = `${API_BASE_URL}${relativePath}`;
```

### Nullable Fields in Tables

Fields like `locationName`, `categoryName`, `userName`, and `matchScore` are all typed as optional (`?`) or nullable (`| null`). The UI renders a dash `"—"` fallback:

```tsx
<td>{report.locationName ?? '—'}</td>
<td>{claim.matchScore != null ? `${claim.matchScore}%` : '—'}</td>
```

### Empty States

When paginated lists return zero records, each page renders a dedicated empty state UI (icon + message) rather than an empty table.

### Feedback Status — `isReplied` Guard

```tsx
// Status badge
{feedback.isReplied
  ? <Badge className="bg-green-100 text-green-800">Replied</Badge>
  : <Badge className="bg-yellow-100 text-yellow-800">Awaiting Reply</Badge>
}

// Reply button — hidden once replied
{!feedback.isReplied && (
  <Button onClick={() => openReplyModal(feedback)}>Reply</Button>
)}

// Admin reply thread — only shown when present
{feedback.isReplied && feedback.adminReply && (
  <div className="admin-reply-block">
    <p className="label">Admin Reply</p>
    <p>{feedback.adminReply}</p>
  </div>
)}
```

### Handover Claim Dropdown — Empty State

The handover form filters claims to `approvalStatus === 2` only. When none exist:

```tsx
const approvedClaims = claims?.data?.filter(c => c.approvalStatus === 2) ?? [];

<Select disabled={approvedClaims.length === 0}>
  {approvedClaims.length === 0
    ? <SelectItem value="none" disabled>No approved claims available</SelectItem>
    : approvedClaims.map(claim => <SelectItem .../>)
  }
</Select>
```

---

## 🧱 Component Architecture

### Page vs Component Responsibility

| Layer | Responsibility |
|---|---|
| **Pages** (`/pages/*.tsx`) | Owns data fetching hooks, local UI state (selected ID, open modal, filter values), and layout orchestration |
| **Components** (`/components/*.tsx`) | Purely presentational; receive data as props; emit events via callbacks |
| **shadcn/ui** (`/components/ui/`) | Low-level Radix UI wrappers — never modified directly |

### `DashboardLayout.tsx`

The authenticated shell. All protected pages are rendered inside this layout which provides:
- Persistent sidebar (`AppSidebar`)
- Top header with notification bell and profile popover
- Main content area with scroll

### `StatusBadge.tsx`

A shared badge component that maps numeric status values to styled labels:

```tsx
// Used across Reports, Claims, and Handover pages
<StatusBadge status={claim.approvalStatus} type="claim" />
```

### SuperAdmin Account Immutability (UI Layer)

In `Users.tsx`, all destructive actions check the target user's role before rendering:

```tsx
const isSuperAdmin = user.roles?.some(r =>
  r === 'Super Admin' || r === 'SuperAdmin'
);

// Delete and Block buttons are hidden for SuperAdmin
{!isSuperAdmin && <Button onClick={() => handleDelete(user.id)}>Delete</Button>}
{!isSuperAdmin && <Button onClick={() => handleToggleBan(user.id)}>Block</Button>}
```

In `EditUserModal`, the Role dropdown is locked:
```tsx
<Select disabled={isSuperAdmin}>
  ...
</Select>
{isSuperAdmin && (
  <p className="text-xs text-muted-foreground">
    The SuperAdmin role cannot be changed.
  </p>
)}
```

---

## 🏷️ TypeScript Type System

All API shapes are typed via interfaces in `src/types/`. The two generic wrappers in `src/types/api.ts` form the foundation:

```typescript
export interface ApiResponse<T> {
    succeeded: boolean;
    message: string;
    data: T;
    errors: string[] | null;
}

export interface PaginatedApiResponse<T> {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    succeeded: boolean;
    message: string;
    data: T;
}
```

**Type flow example — Claims:**
```
ClaimListItem[]          ← domain type (src/types/claim.ts)
  ↑
PaginatedApiResponse<ClaimListItem[]>   ← wrapped response (src/types/api.ts)
  ↑
fetchAdminClaims()       ← endpoint function return type
  ↑
useGetAdminClaims()      ← TanStack Query's data property type
  ↑
Claims.tsx               ← page consumes typed data
```

---

## 📝 Forms & Validation

The app uses **React Hook Form + Zod** for form management. Validation schemas are co-located with their form components inside the page file.

### Pattern

```typescript
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: { email: '', password: '' },
});
```

### Search with Debounce

All search inputs use `useDebounce` with a `500ms` delay to avoid firing API requests on every keystroke. The page resets to page 1 when the search term changes:

```typescript
// use-debounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Usage in Users.tsx / AuditLogs.tsx
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);
const [page, setPage] = useState(1);

// Reset to page 1 when search changes
useEffect(() => setPage(1), [debouncedSearch]);

const { data } = useGetUsers(page, 10, debouncedSearch, roleFilter);
```

---

## 🌍 Internationalization

The app includes an i18n system via `src/lib/i18n.ts` and a `LanguageProvider` context (`src/hooks/use-language.tsx`). The string catalogue supports Arabic (`ar`) and English (`en`). The language toggle is available in the Settings page and sidebar.

---

## 🧪 Testing

The test setup uses **Vitest** (Jest-compatible) with **@testing-library/react** and **jsdom**.

```bash
npm run test        # Run all tests once
npm run test:watch  # Watch mode during development
```

Test files live in `src/test/`. The `vitest.config.ts` configures jsdom as the test environment.

**Testing priorities:**
1. **Hook logic** — Query key correctness, cache update logic in mutations
2. **Utility functions** — `extractRolesFromToken`, `useDebounce`
3. **Guard logic** — `ProtectedRoute` redirect behavior under different auth states

---

*← [Backend Guide](./backend.md) · [Back to README](../README.md)*
