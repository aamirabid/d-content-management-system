# Frontend Requirements Compliance

## ✅ 1. Component Composition (Required)

**Status:** COMPLIANT

### Implementation:

- All page files (e.g., `app/admin/users/page.tsx`, `app/admin/blogs/page.tsx`) primarily **compose reusable components** and avoid heavy logic
- Page files only handle:
  - Layout composition
  - Component imports
  - Basic structure

**Example:**

```typescript
// app/admin/users/page.tsx - Clean, composition-focused
export default function UsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1>Users</h1>
          <p>Manage system users and their roles</p>
        </div>
        <UserList />  {/* Component handles all logic */}
      </div>
    </AdminLayout>
  );
}
```

**Location:** `cms-frontend/app/**/*.page.tsx`

---

## ✅ 2. Avoid Prop Drilling Pattern

**Status:** FULLY IMPLEMENTED

### Location: `cms-frontend/src/context/`

Context providers are used to avoid passing props through multiple levels:

**AuthContext** (`src/context/AuthContext.tsx`)

```typescript
- useAuth() hook for authentication state
- Globally available: user, loading, logout
- Used in AdminLayout without prop drilling
```

**PermissionContext** (`src/context/PermissionContext.tsx`)

```typescript
- usePermission() hook for RBAC
- Provides: can(permission) function
- Used throughout components for permission checks
```

**LanguageContext** (`src/context/LanguageContext.tsx`)

```typescript
- useLanguage() hook for localization
- Provides: language, setLanguage, dir (rtl/ltr)
- Persists to localStorage automatically
```

**Usage Pattern:**

```typescript
// NO prop drilling - using Context
function AdminLayout({ children }) {
  const { user } = useAuth();           // Direct from context
  const { can } = usePermission();      // Direct from context
  const { language, setLanguage } = useLanguage(); // Direct from context

  // Pass single 'children' prop instead of multiple props
  return <div>{children}</div>;
}
```

---

## ✅ 3. Reusability - Shared Components

**Status:** FULLY IMPLEMENTED

### Location: `cms-frontend/src/components/`

#### UI Components (Reusable across multiple areas):

**Table Component** (`src/components/ui/Table.tsx`)

- Used by: UserList, RoleList, BlogList, NewsList, PermissionList
- Props: `columns`, `data`
- Renders any data with custom column rendering

**Modal Component** (`src/components/ui/Modal.tsx`)

- Used by: All list components for create/edit
- Props: `open`, `title`, `onClose`, `children`
- Reusable dialog for forms

**Button Component** (`src/components/ui/Button.tsx`)

- Used throughout all components
- Props: `variant`, `size`, `onClick`, `children`
- Supports: primary, secondary, danger, ghost variants

**Form Components**

- `Input` component: Used in all forms
- `Pagination` component: Used in all list views
- `ConfirmDialog` component: Used for delete confirmations

#### Business Logic Components:

**UserList** (`src/components/shared/UserList.client.tsx`)

- Composes: Table, Modal, UserForm, Pagination, ConfirmDialog
- Handles: user CRUD operations, search, pagination

**BlogList** (`src/components/shared/BlogList.client.tsx`)

- Composes: Table, Modal, BlogForm, Pagination, ConfirmDialog
- Handles: blog CRUD operations, search, pagination

**Similar Pattern:** RoleList, NewsList, PermissionList, etc.

---

## ✅ 4. Clear Boundaries - Separation of Concerns

**Status:** FULLY IMPLEMENTED

### Architecture Layers:

```
cms-frontend/
├── app/                          # Page files (composition only)
├── src/
│   ├── components/               # UI Layer
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Table.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── ...
│   │   ├── shared/              # Business logic components
│   │   │   ├── UserList.client.tsx
│   │   │   ├── UserForm.tsx
│   │   │   ├── BlogList.client.tsx
│   │   │   └── ...
│   │   └── layout/
│   │       └── AdminLayout.tsx
│   │
│   ├── lib/                      # Business Logic & Data Fetching
│   │   ├── api/                 # API calls (data fetching)
│   │   │   ├── user.api.ts
│   │   │   ├── blog.ts
│   │   │   ├── role.api.ts
│   │   │   ├── permission.api.ts
│   │   │   └── news.ts
│   │   ├── hooks/               # Custom hooks (logic + data fetching)
│   │   │   ├── useUsers.ts
│   │   │   ├── useBlogs.ts
│   │   │   ├── useRoles.ts
│   │   │   ├── useNews.ts
│   │   │   ├── useBlogForm.ts
│   │   │   └── ...
│   │   └── i18n/                # Localization
│   │       ├── index.ts
│   │       └── dictionaries/
│   │           ├── en.ts
│   │           └── ar.ts
│   │
│   ├── context/                 # Global State (Context API)
│   │   ├── AuthContext.tsx
│   │   ├── PermissionContext.tsx
│   │   └── LanguageContext.tsx
│   │
│   └── types/                   # TypeScript types
│       └── user.ts
```

### Example: Clear Separation in UserList

```typescript
// UI Layer: UserList.client.tsx
export function UserList() {
  // Data Fetching Layer: Custom hook
  const { data, loading } = useUsers(page, limit, search);

  // Business Logic Layer: Permission checking
  const { can } = usePermission();

  // ... render components composed from ui/
}

// Custom Hook: useUsers (Data Fetching)
export function useUsers(page = 1, limit = 10, search = '') {
  const [data, setData] = useState(...);
  useEffect(() => {
    fetchUsers(page, limit, search)  // API call
      .then(res => setData(res));
  }, [page, limit, search]);
  return { data, loading, error };
}

// API Layer: user.api.ts (Pure data fetching)
export async function fetchUsers(page = 1, limit = 10, search = "") {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("search", search);
  const url = `${API_URL}/users?${params}`;
  const res = await authFetch(url);
  return res.json();
}
```

**Benefits:**

- ✅ Easy to test (decoupled layers)
- ✅ Easy to modify (changes in one layer don't affect others)
- ✅ Easy to reuse (API calls, hooks, components all independent)

---

## ✅ 5. RBAC in UI (Role-Based Access Control)

**Status:** FULLY IMPLEMENTED

### Permission Context Integration:

**Location:** `src/context/PermissionContext.tsx`

```typescript
export function usePermission() {
  return { can: (permission: string) => boolean };
}
```

### Usage in Components:

**Example 1: UserList**

```typescript
{can("user.create") && <Button>Create User</Button>}
{can("user.update") && <Button>Edit</Button>}
{can("user.delete") && <Button variant="danger">Delete</Button>}
```

**Example 2: AdminLayout Navigation**

```typescript
{can("user.manage") && <NavLink href="/admin/users" label="Users" />}
{can("role.manage") && <NavLink href="/admin/roles" label="Roles" />}
{can("blog.read") && <NavLink href="/admin/blogs" label="Blogs" />}
{can("news.read") && <NavLink href="/admin/news" label="News" />}
```

**Example 3: PermissionGate Component**

```typescript
<PermissionGate permission="blog.update" hide={false}>
  <Button onClick={() => setModal({ open: true, blog: b })}>Edit</Button>
</PermissionGate>
```

### All Permission-Protected Components:

- ✅ UserList: user.manage, user.create, user.update, user.delete
- ✅ RoleList: role.manage, role.create, role.update, role.delete
- ✅ PermissionList: permission.manage, permission.create, permission.update, permission.delete
- ✅ BlogList: blog.create, blog.update, blog.delete, blog.read
- ✅ NewsList: news.create, news.update, news.delete, news.read

---

## ✅ 6. Localization in UI - Arabic/English Support

**Status:** FULLY IMPLEMENTED FOR CORE ADMIN FLOW

### Localization Infrastructure:

**Location:** `src/lib/i18n/`

**Dictionary Files:**

- `dictionaries/en.ts` - English translations (comprehensive)
- `dictionaries/ar.ts` - Arabic translations (comprehensive)

**Current Translations Included:**

```
✅ Common UI: save, cancel, edit, delete, create, search, loading, etc.
✅ Admin: dashboard, users, roles, permissions, blogs, news, logout
✅ Users Module: email, firstName, lastName, status, password, roles, etc.
✅ Roles Module: name, description, permissions, createRole, editRole, etc.
✅ Permissions Module: key, description, managePermissions, etc.
✅ Blogs Module: title, slug, content, status, publishedAt, expiresAt, etc.
✅ News Module: title, slug, content, status, publishedAt, expiresAt, etc.
```

### Usage Hook:

```typescript
// useTranslation() hook
export function useTranslation() {
  const { language } = useLanguage();
  const t = getDict(language);
  return { t, language };
}
```

### Implementation in Components:

**AdminLayout with Language Switcher:**

```typescript
function AdminLayout() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <>
      <h1>{t.admin.cmsAdmin}</h1>
      <p>{t.admin.contentManagement}</p>

      {/* Language Switcher */}
      <button onClick={() => setLanguage("en")}>English</button>
      <button onClick={() => setLanguage("ar")}>العربية</button>
    </>
  );
}
```

**Settings Persisted:**

- ✅ Language choice saved to `localStorage`
- ✅ Direction (RTL/LTR) automatically updated for Arabic
- ✅ Document lang attribute set for accessibility

### RTL Support:

```typescript
// LanguageContext handles RTL/LTR
useEffect(() => {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  localStorage.setItem("language", language);
}, [language]);
```

**CSS Framework Support:**

- Tailwind CSS automatically handles RTL
- `dir` attribute on document element
- Language-specific text direction applied site-wide

### Admin Core Flow Localized:

- ✅ Dashboard/Layout
- ✅ User Management (list, create, edit, delete)
- ✅ Role Management (list, create, edit, delete)
- ✅ Permission Management (list, create, edit, delete)
- ✅ Blog Management (list, create, edit, delete)
- ✅ News Management (list, create, edit, delete)
- ✅ Login flow
- ✅ Navigation menus
- ✅ Form labels and validations
- ✅ Action buttons

---

## Summary

| Requirement           | Status | Implementation                              |
| --------------------- | ------ | ------------------------------------------- |
| Component Composition | ✅     | Pages compose components, no heavy logic    |
| Avoid Prop Drilling   | ✅     | Context API (Auth, Permission, Language)    |
| Reusability           | ✅     | Shared UI & business components             |
| Clear Boundaries      | ✅     | Separated: UI / Logic / Data Fetching / API |
| RBAC in UI            | ✅     | Permission guards on all actions            |
| Localization (EN/AR)  | ✅     | Full i18n with language switcher & RTL      |

## Frontend Stack

- **Framework:** Next.js 14 (App Router)
- **Component Library:** React 18
- **Form Handling:** react-hook-form + Zod
- **Styling:** Tailwind CSS (with RTL support)
- **State Management:** React Context + Custom Hooks
- **Localization:** Custom i18n system
- **API Client:** native fetch with authFetch wrapper
