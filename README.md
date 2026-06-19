<div align="center">

# 🏛️ HU Asset Gateway

### Central Lost & Found Management System

*Enterprise-grade asset recovery and secure handover platform for Hadramout University*

---

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com)
[![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Business Value](#-business-value)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Prerequisites](#-prerequisites)
- [Environment Variables](#-environment-variables)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Project Structure](#-project-structure)
- [API Overview](#-api-overview)
- [Role-Based Access](#-role-based-access)

---

## 🌐 Overview

**HU Asset Gateway** is a full-stack, enterprise-grade web platform built specifically for Hadramout University to digitize and streamline the entire lifecycle of lost and found items on campus. The system replaces error-prone manual paper processes with a secure, auditable, and role-aware digital workflow — from the moment an item is reported to the final verified handover to its rightful owner.

The platform serves two principal user roles: a **SuperAdmin** with full system authority and **Admins** who operate day-to-day case management. Every action in the system is immutably recorded in an audit trail, ensuring full institutional accountability.

---

## 💼 Business Value

| Challenge | Solution |
|---|---|
| Paper-based item logs are lost or forged | Centralized digital database with image evidence and timestamps |
| No formal ownership verification process | Structured claim review with approval/rejection workflow |
| Handovers happen without identity proof | Secure handover requires receiver ID type, ID number, digital signature, and photo |
| Admins and SuperAdmins have same system access | Strict RBAC with role-based route and UI element protection |
| No traceability for administrative actions | Immutable, searchable audit log for every state change |
| No feedback channel between users and staff | Built-in feedback module with threaded admin reply system |

---

## ✨ Key Features

### 🔐 Authentication & RBAC
- JWT-based login with automatic token validation on app load
- **SuperAdmin** role: Full system access — Users, Audit Logs, and all operations
- **Admin** role: Operational access — Reports, Claims, Handovers, Feedback, Master Data
- Route-level and UI-level protection; SuperAdmin accounts are immutable

### 📋 Item Reports Management
- Create, view, update, and delete lost/found item reports
- Multi-filter search: by category, location, date range, status, and report type
- Server-side pagination with configurable page sizes
- Status lifecycle management: Active → Under Review → Resolved → Archived
- Detailed report view with item images and reporter information

### 🔍 Ownership Claims & Matching
- Structured claim submission with descriptive proof by the public
- Admin review interface with match score visibility
- Four-state approval workflow: **Pending (1) → Approved (2) → Completed (3) → Rejected (4)**
- Action buttons are strictly context-aware; approve/reject only available on Pending claims

### 🤝 Secure Handovers
- Handover form linked exclusively to **Approved** claims (status = 2)
- Mandatory receiver identification: National ID, Passport, or University ID
- Supports digital signature and photo upload via `multipart/form-data`
- Generates a permanent handover record upon successful submission

### 👥 User Management *(SuperAdmin only)*
- Create, edit, and block Admin accounts
- Role assignment with SuperAdmin role lock (cannot be changed via UI)
- Password reset capability with auto-generated secure passwords
- Search, filter by role, and export to file

### 📊 Dashboard & Analytics
- Real-time KPI cards: total reports, pending claims, completed handovers
- Category distribution and recent activity visualizations via Recharts

### 📝 Audit Logs *(SuperAdmin only)*
- Complete, immutable log of all administrative actions
- Server-side search and paginated browsing
- Export full audit trail to file

### 💬 User Feedback
- View all submitted user feedback with status indicators:
  - 🟡 **Awaiting Reply** — no admin response yet
  - 🟢 **Replied** — admin reply is visible in a threaded display
- Admin reply functionality (reply button hidden once feedback is addressed)

### ⚙️ Master Data Management
- Full CRUD for: **Colleges**, **Departments**, **Locations**, and **Item Categories**
- Tabbed interface for clean navigation between entity types

### 🔔 Notifications
- Real-time notification bell with unread count
- Mark-as-read and delete per notification
- Dedicated notifications page for full history

---

## 🛠️ Tech Stack

### Frontend
```
React 18.3        — UI Component Framework
TypeScript 5.8    — Static Typing
Vite 5.4          — Build Tool & Dev Server
TanStack Query v5 — Server State, Caching & Mutations
React Router v6   — Client-Side Routing
Zustand 5         — Auth State (JWT persistence)
Axios 1.x         — HTTP Client (with interceptors)
Tailwind CSS 3.4  — Utility-First Styling
shadcn/ui         — Accessible Component Primitives (Radix UI)
Recharts          — Data Visualization
jsPDF             — Client-side PDF/export generation
jwt-decode        — JWT claim extraction (role resolution)
Sonner            — Toast notifications
Zod               — Schema validation
React Hook Form   — Form state management
```

### Backend
```
.NET 8 Web API      — REST API Framework
Entity Framework Core — ORM & Migrations
SQL Server          — Relational Database
ASP.NET Identity    — Authentication & User Management
JWT Bearer Tokens   — Stateless API Authentication
Clean Architecture  — Simplified DDD / CQRS pattern
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER (React SPA)                      │
│                                                              │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────────┐  │
│  │   Pages /   │───▶│  TanStack    │───▶│   Axios +      │  │
│  │  Components │    │  Query       │    │   apiClient.ts │  │
│  └─────────────┘    └──────────────┘    └───────┬────────┘  │
│         ▲                  │                     │           │
│         │           Zustand│Auth Store           │ JWT       │
│         └──────────────────┘                     │ Bearer    │
└───────────────────────────────────────────────────┼──────────┘
                                                    │ HTTP
┌───────────────────────────────────────────────────▼──────────┐
│                   .NET 8 Web API                              │
│                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐ │
│  │  Controllers │──▶│   Services   │──▶│  Repositories /  │ │
│  │  (Endpoints) │   │  (Use Cases) │   │  EF Core Context │ │
│  └──────────────┘   └──────────────┘   └────────┬─────────┘ │
│                                                  │           │
└──────────────────────────────────────────────────┼───────────┘
                                                   │
                                    ┌──────────────▼──────────┐
                                    │      SQL Server          │
                                    │   (EF Core Migrations)   │
                                    └─────────────────────────┘
```

---

## 📦 Prerequisites

Ensure the following are installed before you begin:

| Requirement | Minimum Version | Check Command |
|---|---|---|
| Node.js | 18.x LTS | `node --version` |
| npm / bun | Latest | `npm --version` |
| .NET SDK | 8.0 | `dotnet --version` |
| SQL Server | 2019+ | via SSMS or `sqlcmd` |
| Git | 2.x | `git --version` |

---

## 🔑 Environment Variables

### Frontend — `.env`

Create a `.env` file in the **project root** (`/university-guardian/.env`):

```env
# ─── API Configuration ─────────────────────────────────────────────
# Base URL of your running .NET 8 backend API.
# Must include trailing slash.
VITE_API_BASE_URL=http://localhost:8080/
```

> **Note:** All environment variables exposed to the Vite build must be prefixed with `VITE_`. The `apiClient.ts` reads this value at runtime via `import.meta.env.VITE_API_BASE_URL`.

### Backend — `appsettings.json`

Create or update `appsettings.json` in your .NET API project. A full template:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=HUAssetGatewayDb;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "YOUR_SUPER_SECRET_KEY_MINIMUM_32_CHARS",
    "Issuer": "HUAssetGateway",
    "Audience": "HUAssetGatewayClient",
    "ExpiryMinutes": 60,
    "RefreshTokenExpiryDays": 7
  },
  "AllowedOrigins": [
    "http://localhost:5173"
  ],
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

> ⚠️ **Security:** Never commit `appsettings.json` with real secrets to version control. Use `appsettings.Development.json` (excluded via `.gitignore`) or environment-level secrets for production deployments.

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/university-guardian.git
cd university-guardian
```

### 2. Start the Backend API

> *Refer to your backend repository's README for full setup instructions.*

```bash
# Navigate to the API project
cd ../HUAssetGateway.API

# Restore packages
dotnet restore

# Apply database migrations
dotnet ef database update

# Start the development server (default: http://localhost:8080)
dotnet run
```

Verify the API is live by navigating to `http://localhost:8080/swagger` in your browser.

### 3. Start the Frontend

In a new terminal, from the `university-guardian` directory:

```bash
# Install dependencies (using npm)
npm install

# Or using bun (faster)
bun install

# Copy the environment file and configure it
cp .env.example .env
# Edit VITE_API_BASE_URL to point at your running backend

# Start the Vite development server
npm run dev
```

The application will be available at **`http://localhost:5173`**.

### 4. Default Credentials

On a fresh database with seed data applied, use the following to log in as SuperAdmin:

```
Email:    superadmin@hu.edu.ye
Password: [Set by your backend seed configuration]
```

> Contact your system administrator or check the backend seed file for the exact initial password.

### Running Tests

```bash
# Run the full test suite once
npm run test

# Run in watch mode during development
npm run test:watch
```

### Building for Production

```bash
# Create an optimized production bundle in /dist
npm run build

# Preview the production build locally
npm run preview
```

---

## 📚 Documentation

Full technical documentation is available in the `/docs` directory:

| Document | Description |
|---|---|
| [`/docs/backend.md`](./docs/backend.md) | Backend architecture, security model, API endpoints, RBAC matrix, and the Claim → Handover workflow |
| [`/docs/frontend.md`](./docs/frontend.md) | Frontend architecture, folder structure, state management strategy, route protection, and UI patterns |

---

## 📁 Project Structure

```
university-guardian/              # Frontend SPA root
├── public/                       # Static assets
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # shadcn/ui primitives (auto-generated)
│   │   ├── AppSidebar.tsx        # Navigation sidebar with RBAC-aware links
│   │   ├── DashboardLayout.tsx   # Authenticated app shell (sidebar + header)
│   │   ├── ProtectedRoute.tsx    # Route guard component
│   │   ├── ProfileModal.tsx      # User profile editor
│   │   ├── StatusBadge.tsx       # Shared status badge component
│   │   ├── KPICard.tsx           # Dashboard metric card
│   │   └── NotificationsDropdown.tsx
│   ├── hooks/
│   │   ├── queries/              # TanStack Query hooks (one file per domain)
│   │   │   ├── useAuth.ts        # Login, logout, profile
│   │   │   ├── useReports.ts
│   │   │   ├── useClaims.ts
│   │   │   ├── useHandovers.ts
│   │   │   ├── useUsers.ts
│   │   │   ├── useMasterData.ts
│   │   │   ├── useNotifications.ts
│   │   │   ├── useDashboard.ts
│   │   │   └── useProfile.ts
│   │   ├── use-debounce.ts       # 500ms debounce for search inputs
│   │   ├── use-theme.tsx         # Dark/light theme toggle
│   │   └── use-language.tsx      # i18n context
│   ├── lib/
│   │   ├── api/
│   │   │   ├── apiClient.ts      # Configured Axios instance + interceptors
│   │   │   └── endpoints/        # Raw API call functions (one file per domain)
│   │   ├── authUtils.ts          # JWT role extraction helper
│   │   └── i18n.ts               # Internationalization strings
│   ├── pages/                    # Full-page route components
│   │   ├── Login.tsx
│   │   ├── Index.tsx             # Dashboard
│   │   ├── Reports.tsx
│   │   ├── Claims.tsx
│   │   ├── Handover.tsx
│   │   ├── Users.tsx             # SuperAdmin only
│   │   ├── AuditLogs.tsx         # SuperAdmin only
│   │   ├── MasterData.tsx
│   │   ├── Feedback.tsx
│   │   ├── Notifications.tsx
│   │   └── Settings.tsx
│   ├── store/
│   │   └── useAuthStore.ts       # Zustand store (JWT + role, persisted)
│   ├── types/                    # TypeScript interfaces
│   │   ├── api.ts                # ApiResponse<T>, PaginatedApiResponse<T>
│   │   ├── auth.ts
│   │   ├── claim.ts
│   │   ├── handover.ts
│   │   ├── report.ts
│   │   ├── user.ts
│   │   ├── feedback.ts
│   │   ├── auditLog.ts
│   │   ├── dashboard.ts
│   │   ├── masterData.ts
│   │   └── notification.ts
│   ├── App.tsx                   # Router + global providers
│   └── main.tsx                  # React entry point
├── .env                          # Local environment variables (not committed)
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🌐 API Overview

The backend exposes a versioned REST API under `/api/v1/`. All responses follow a consistent envelope:

```json
{
  "succeeded": true,
  "message": "Operation successful",
  "data": { ... },
  "errors": null
}
```

Paginated list endpoints extend this with:

```json
{
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 5,
  "totalRecords": 47,
  "succeeded": true,
  "data": [ ... ]
}
```

Key endpoint groups:

| Group | Base Path | Auth Required |
|---|---|---|
| Authentication | `/api/v1/auth/` | Public |
| Profile | `/api/v1/profile/` | Any authenticated user |
| Reports | `/api/v1/admin/reports/` | Admin + SuperAdmin |
| Claims | `/api/v1/admin/claims/` | Admin + SuperAdmin |
| Handovers | `/api/v1/admin/handovers/` | Admin + SuperAdmin |
| Users | `/api/v1/admin/users/` | **SuperAdmin only** |
| Audit Logs | `/api/v1/admin/audit-logs/` | **SuperAdmin only** |
| Feedback | `/api/v1/admin/feedbacks/` | Admin + SuperAdmin |
| Master Data | `/api/v1/admin/{universities,departments,locations,categories}/` | Admin + SuperAdmin |
| Notifications | `/api/v1/notifications/` | Any authenticated user |
| Dashboard | `/api/v1/admin/dashboard/` | Admin + SuperAdmin |

---

## 🔒 Role-Based Access

| Feature | 🔑 SuperAdmin | 👤 Admin |
|---|:---:|:---:|
| Dashboard | ✅ | ✅ |
| Item Reports | ✅ | ✅ |
| Ownership Claims | ✅ | ✅ |
| Secure Handovers | ✅ | ✅ |
| Feedback Management | ✅ | ✅ |
| Master Data | ✅ | ✅ |
| Notifications | ✅ | ✅ |
| Settings / Profile | ✅ | ✅ |
| **User Management** | ✅ | ❌ |
| **Audit Logs** | ✅ | ❌ |
| **Modify SuperAdmin account** | ❌ | ❌ |

> The SuperAdmin's own account is immutably protected at both the API and UI level. No user — including themselves via the admin panel — can delete, block, or change the role of the SuperAdmin account.

---

<div align="center">

**HU Asset Gateway** — Securing university assets, one verified handover at a time.

*Built for Hadramout University · Powered by .NET 8 & React 18*

</div>
