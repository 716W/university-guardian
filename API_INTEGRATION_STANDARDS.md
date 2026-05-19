# API Integration Standards & SOP

**Document Version:** 1.0  
**Target Audience:** Frontend (React/TypeScript) and Backend (.NET API) Engineering Teams  
**Role:** Senior Technical Lead  

This document sets forth the official methodologies, architectural standards, and standard operating procedures (SOP) for integrating the React Frontend with the .NET Web API backend. Adherence to these guidelines ensures a scalable, maintainable, and type-safe ecosystem.

---

## 1. Project Overview

**[PLACEHOLDER: Project Idea]**  
*The core business value of the system will be described here. This section outlines the primary objectives, deliverables, and domain context of the project to ensure alignment across both frontend and backend teams.*

---

## 2. Technology Stack

Our application ecosystem utilizes a modern, typed, and performant stack:

### Frontend

* **Core:** React, TypeScript, Vite
* **Styling:** Tailwind CSS (via components and utility classes)
* **Networking / HTTP Client:** Axios
* **Server State / Data Fetching:** TanStack Query (React Query)
* **Client State Handling:** Zustand and React `useState` / `useReducer`

### Backend

* **Core:** .NET Web API (C#)

---

## 3. Architecture & Folder Structure

We strictly follow **Clean Architecture** principles on the frontend, enforcing a clear separation of concerns. UI components must be completely decoupled from data-fetching logic and HTTP configuration.

The frontend folder hierarchy for API interactions is structured as follows:

* **`src/lib/api/`**  
    Contains the core Axios instance configuration, base URL setup, and interceptors (Request/Response).
* **`src/lib/api/endpoints/`**  
    Houses purely functional API calls organized by domain/feature (e.g., `users.ts`, `auth.ts`). These functions accept arguments and return typed Promises using the Axios instance object. They map 1:1 with .NET Controllers.
* **`src/hooks/queries/`**  
    Contains custom custom React hooks using TanStack Query (`useQuery`, `useMutation`). These hooks import functions from `endpoints` to manage caching, refetching, and hydration.
* **`src/components/` & `src/pages/`**  
    Pure presentation and UI layers. They solely consume data and loading states provided by the `queries` hooks. **No Axios calls or raw `fetch` commands are permitted here.**

---

## 4. Standard Integration Workflow (Step-by-Step)

To integrate a new endpoint from the .NET backend to the React frontend, developers must follow this strict 4-step workflow:

### Step 1: Define the TypeScript Interface / DTO

The Frontend TypeScript Interface must mirror the Backend C# DTO exactly.

**Backend (C# .NET)**

```csharp
public class UserDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
```

**Frontend (TypeScript)**
Create the type in a shared interfaces file (e.g., `src/types/user.ts`):

```typescript
export interface User {
  id: string; // Guid maps to string in TS
  fullName: string;
  email: string;
  isActive: boolean;
}
```

### Step 2: Create the API call function in `endpoints`

Create a pure function mapping to the controller in `src/lib/api/endpoints/users.ts`.

```typescript
import { apiClient } from '../apiClient'; // Our standard Axios instance
import { User } from '@/types/user';

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>('/api/users');
  return data;
};
```

### Step 3: Create the React Query Hook

Wrap the endpoint function with TanStack Query in `src/hooks/queries/useUsers.ts`.

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/lib/api/endpoints/users';
import { User } from '@/types/user';

export const useGetUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};
```

### Step 4: Consume the Hook inside the React Component

Finally, import the hook in your UI component (`src/pages/Users.tsx`).

```tsx
import { useGetUsers } from '@/hooks/queries/useUsers';
import { Skeleton } from '@/components/ui/skeleton';

export default function Users() {
  const { data: users, isLoading, isError, error } = useGetUsers();

  if (isLoading) return <Skeleton className="h-20 w-full" />;
  if (isError) return <div>Error loading users: {error.message}</div>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.fullName}</li>
      ))}
    </ul>
  );
}
```

---

## 5. State Management Standard

We maintain a strict boundary between UI/Client State and Server State to prevent bloated contexts and outdated data.

* **Server State (Dynamic backend data):** Strictly managed by **TanStack Query**. It provides built-in caching, background fetching, and deduplication.
* **Client State (Local UI toggles, temporary forms, themes):** Managed by **React `useState` / `useReducer`** for component-level scope, or **Zustand** for global scope.

---

## 6. Error Handling & Authentication

All API calls must funnel through our central Axios instance. We utilize Axios interceptors to globally handle the authentication token and standard HTTP errors.

**Authentication Pipeline Requirements:**

1. **Request Interceptor:** Automatically injects the JWT Bearer token from local storage/cookies into the `Authorization` header on every request.
2. **Response Interceptor:** Detects global API failures.
    * **401 Unauthorized:** Triggers a global logout / redirect to the Login page. (Alternatively, implements token refresh logic).
    * **403 Forbidden:** Redirects to an "Access Denied" view or displays a global Toast notification.

```typescript
// Example Implementation in src/lib/api/apiClient.ts
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic to clear tokens & redirect to /login
    }
    if (error.response?.status === 403) {
      // Global toast notification for restricted access
    }
    return Promise.reject(error);
  }
);
```

---

## 7. Naming Conventions

Consistency across codebases speeds up development and debugging.

### API Functions (`src/lib/api/endpoints/`)

* `fetch[Entity]` - For GET requests (e.g., `fetchUsers`, `fetchUserProfile`)
* `create[Entity]` - For POST requests (e.g., `createUser`)
* `update[Entity]` - For PUT/PATCH requests (e.g., `updateUser`)
* `delete[Entity]` - For DELETE requests (e.g., `deleteUser`)

### TanStack Query Hooks (`src/hooks/queries/`)

* `useGet[Entity]` - Wrapper for `useQuery` (e.g., `useGetUsers`)
* `useCreate[Entity]` - Wrapper for `useMutation` (e.g., `useCreateUser`)
* `useUpdate[Entity]` - Wrapper for `useMutation` (e.g., `useUpdateUser`)
* `useDelete[Entity]` - Wrapper for `useMutation` (e.g., `useDeleteUser`)

Adhering to these conventions will ensure the codebase remains readable, intuitive, and seamlessly integrated with our C# API.

---
*End of Document*
